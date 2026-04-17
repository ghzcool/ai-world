
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default to the user's preferred model (phi4-ctx) but allow env override
// const MODEL = process.env.MODEL || 'microsoft/phi-4'; // don't change
const MODEL = process.env.MODEL || 'gemma3n:latest'; // don't change
const HOST = process.env.HOST || 'http://127.0.0.1';
// const PORT = process.env.PORT || '11434';
const PORT = process.env.PORT || '1234';

// --- LOG STRUCTURE ---
export const LOGS_DIR = path.join(__dirname, '../logs');
export const WORLD_LOG = path.join(LOGS_DIR, 'world.log');
export const GOD_LOG = path.join(LOGS_DIR, 'god.log');
export const BACKSTORY_LOG = path.join(LOGS_DIR, 'backstory.txt');

export let worldContext = null;

export function getCharacterPath(name) {
  return path.join(LOGS_DIR, `character/${name}`);
}

export function readLog(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const data = readFile(filePath);
  console.log('character log', {data});
  return data.trim() ? data.trim().split('\n').map(line => {
    try { return JSON.parse(line); } catch { return null; }
  }).filter(Boolean) : [];
}

export function readFile(filePath) {
  if (!fs.existsSync(filePath)) return '';
  const data = fs.readFileSync(filePath, 'utf8');
  return data;
}

export function writeLog(filePath, entries) {
  const lines = entries.map(e => JSON.stringify(e));
  fs.writeFileSync(filePath, lines.join('\n') + '\n', 'utf8');
}

export function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

export function appendLog(filePath, entry) {
  fs.appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf8');
}

// --- NEURAL NETWORK ---
export async function generate(prompt, context = null) {
  console.log('LLM', prompt); // don't delete
  try {
    // const url = `${HOST}:${PORT}/api/generate`;
    const url = `${HOST}:${PORT}/v1/responses`;
    //const body = { model: MODEL, prompt, context, stream: false };
    const body = {
    "model": MODEL,
    "input": prompt,
    "temperature": 0.7,
    "max_tokens": -1,
    "stream": false,
    "previous_response_id": context || undefined
  };
    const res = await axios.post(url, body, {headers: {'Content-Type': 'application/json'}});
    //return {data: res?.data?.response, context: res?.data?.context};
    return {data: res?.data?.output?.[0]?.content?.[0].text, context: res?.data?.id};
  } catch (err) {
    console.error('⛔️ LLM request failed:', err.message || err);
    return null;
  }
}

export const getWorldContext = async () => {
  const backstory = readFile(BACKSTORY_LOG);

  // TODO: generate backstory if not found

  // generate context if not found
  if (!worldContext) {
    /* const contextCache = readFile(path.join(__dirname, 'context.cache'));
    console.log({contextCache});
    if(contextCache) {
      try {
        worldContext = JSON.parse(contextCache);
      } catch(error) {
        console.error(error);
      }
    } */
    if (!worldContext) {
      const response = await generate(`
        Этот запрос нужен, чтоб познакомить тебя с миром, в котором происходят события.
        Мне не нужен ответ, мне нужен контекст. Просто ответь "Понял" и всё.

        История:
        ${backstory}
        
        Напоминаю, просто ответь "Понял" и всё.
      `);
      console.log({response});
      worldContext = response?.context;
      // writeFile(path.join(__dirname, 'context.cache'), JSON.stringify(worldContext));
    }
  }
  
  return worldContext;
};
