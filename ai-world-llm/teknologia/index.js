#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const {globby} = require('globby');
const crypto = require('crypto');

const projectMergedPath = 'ollama-code-analyzer-join.txt';

function createSHA256Hash(inputString) {
    const hash = crypto.createHash('sha256');
    hash.update(inputString);
    return hash.digest('hex');
}

// get variables from arguments with flags --model, --host, --port, --ignore, --extensions
const args = process.argv.slice(2);
const modelArg = args.find(arg => arg.startsWith('--model='));
const hostArg = args.find(arg => arg.startsWith('--host='));
const portArg = args.find(arg => arg.startsWith('--port='));
const ignoreArg = args.find(arg => arg.startsWith('--ignore='));
const extensionsArg = args.find(arg => arg.startsWith('--extensions='));
const model = modelArg ? modelArg.split('=')[1] : 'phi4-ctx';
const host = hostArg ? hostArg.split('=')[1] : 'http://localhost';
const port = portArg ? portArg.split('=')[1] : '11434';
const ignore = ignoreArg ? ignoreArg.split('=')[1].split(',') : ['node_modules/**'];
const extensions = extensionsArg ? extensionsArg.split('=')[1].split(',') : ['js', 'ts', 'jsx', 'tsx', 'css', 'scss', 'html'];
          
// const MODEL = 'phi4-reasoning'; // 'phi4-ctx:latest'; // 'qwen3:14b'; // or 'llama3' if you're using codellama phi4-ctx:latest

const ollamaApi = async (prompt, context = null, returnResponse = false) => {
  try {
    const response = await axios.post(host + ':' + port + '/api/generate', {
      model: model,
      prompt,
      context,
      stream: false
    });
    if (returnResponse) {
      return response;
    }
    return response.data.response.trim();
  } catch(error) {
	  console.error(`⛔️ Error: can't call ollama`, error);
  }
};

const getFolderPath = (filePath) => {
  const folderPath = path.dirname(filePath);
  return folderPath === '.' ? process.cwd() : folderPath;
};

const getAnayzeFilePath = (filePath) => {
  const folderPath = getFolderPath(filePath);
  const fileName = path.basename(filePath);
  return path.join(folderPath, '.analyze', fileName);
}

const isProcessed = (filePath, hash) => {
  const processedPath = getAnayzeFilePath(`${filePath}.processed`);
  if (!fs.existsSync(processedPath)) {
    return false;
  }
  const content = fs.readFileSync(processedPath, 'utf8');
  return content === hash;
};

const markProcessed = (filePath, hash) => {
  const analyzeFolderPath = getFolderPath(filePath) + '/.analyze';
  if (!fs.existsSync(analyzeFolderPath)) {
    fs.mkdirSync(analyzeFolderPath);
  }
  fs.writeFile(getAnayzeFilePath(`${filePath}.processed`), hash, 'utf8');
}

const validatePrompt = (code, filePath) => `
You are a professional full stack developer. Analyze the following file (${filePath}) for any serious issues or obvious bugs.
Return a list of issues or write "no problems found" if the code is correct.
Use exactly that phrase, it is important for further processing.
Do not nitpick about style or minor formatting and code style issues, only report serious problems that will cause incorrect behavior.
If you’re not sure the issue is critical in this case, do not mention it.
For each issue found, specify the line number, category and a brief description of the problem.
Use next template for each problem "{lineNumber}: {shortIssueCategory} - {problemDescription}. {codeSnippet}".
I will spend my work time analyzing your response for large amount of files, so please be concise and clear.
If you cannot find any critical issues, simply write "no problems found".

\`\`\`
${code}
\`\`\`
`;

(async () => {
  let context;
  try {
    if (fs.existsSync(projectMergedPath)) {
      const projectMerged = await fs.readFile(projectMergedPath, 'utf8');
      console.log('Getting context...');
      const answer = await ollamaApi(projectMerged, null, true);
      context = answer.data.context;
      console.log(context);
    } else {
      console.log(`Can't read ${projectMergedPath}. Run npx ollama-code-analyzer-join first.`);
    }
  } catch(error) {
    console.log(`⛔️ Error: getting context.`);
  }

  const files = await globby(extensions.map(extension => '**/*.' + extension), {
    gitignore: true,
    ignore: ignore
  });

  for (const filePath of files) {
    const code = await fs.readFile(filePath, 'utf8');
    const hash = createSHA256Hash(code);

    if (isProcessed(filePath, hash)) {
      console.log(`✔️ Skipped (already processed): ${filePath}`);
      continue;
    }

    console.log(`🔍 Analyzing: ${filePath}`);
    const resultPath = `${filePath}.review.md`;
    if (fs.existsSync(resultPath)) {
      fs.rmSync(resultPath);
    }

    const validation = (await ollamaApi(validatePrompt(code, filePath), context)).split('</think>').pop();

    if (/no problems found/i.test(validation)) {
      console.log(`✅ No problems found in ${filePath}`);
    } else {
      await fs.writeFile(resultPath, validation, 'utf8');
      console.log(`⚠️ Issues found: saved to ${resultPath}`);
    }

    markProcessed(filePath, hash);
  }

  console.log('🎉 Analysis complete.');
})();
