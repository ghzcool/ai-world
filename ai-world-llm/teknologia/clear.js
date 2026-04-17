#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const {globby} = require('globby');

(async () => {
  const files = await globby(['**/*.review.md']);

  for (const filePath of files) {
	 console.log('Delete ', filePath);
	 fs.unlinkSync(filePath);
  }
  
  const analyzeDirs = await globby(['**/.analyze'], { onlyDirectories: true });

  for (const dirPath of analyzeDirs) {
    console.log('Delete dir ', dirPath);
    fs.removeSync(dirPath);
  }

  console.log('🎉 Clear complete.');
})();

