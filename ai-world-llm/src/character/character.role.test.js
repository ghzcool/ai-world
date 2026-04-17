import {Character} from './character.role.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const descriptionPath = path.join(__dirname, 'character.description.test.txt');

const description = fs.readFileSync(descriptionPath, 'utf8');

const elsaCharacter = new Character('Elsa', description);

// на тебя смотрит улыбающийся продавец. на столе разложена провизия для путешествий: хлеб, сушёное мясо, бурдюки для воды, ножи, верёвки, палатки, спальники...
// Продавец показывает монетку и спрашивает: ты знаешь что это такое?
// ты чувствуешь лёгкое прикосновение на уровне правого кармана, где лежат деньги.
const narratorMessage = `
Ты стоишь перед лавкой с припасами для путешествий. Продавец, крепкий мужчина с обветренным лицом по имени Джимм, жестом приглашает тебя подойти ближе. В этот момент ты ощущаешь легкое прикосновение к правому карману, где лежат твои звёздные жетоны.
`;

const action = await elsaCharacter.getAction(narratorMessage);

console.log('action', action?.data);
