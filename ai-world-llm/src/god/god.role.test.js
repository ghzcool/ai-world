import {GodRole} from './god.role.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const god = new GodRole();

const lastEvents = `
{"source": "thief:Sedrik", "action": "steal", "target": "character:Elsa", "content": "деньги из кармана"}
`;

const action = await god.actionResult(lastEvents);

console.log('action', action?.data);
