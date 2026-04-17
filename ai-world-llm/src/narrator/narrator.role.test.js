import { Character } from '../character/character.role.js';
import {NarratorRole} from './narrator.role.js';

const character = new Character('Elsa');
const narratorRole = new NarratorRole();

const lastEvents = [
    {"date":"2025-11-13T16:44:10","log": "Продавец Jimm жестом показывает Эльзе приблизиться","location":"Сария, Люменград, Центральняя площадь","witnesses":["character:Elsa", "seller:Jimm"]},
    {"date":"2025-11-13T16:44:05","log":"Прохожий пытается обчистить карманы Эльзы, но она чувствует прикосновение в области кармана","location":"Сария, Люменград, Центральняя площадь, Лавка","witnesses":["character:Elsa", "thief:Sedrik"]}
];

const text = await narratorRole.narrate(character, lastEvents);

console.log('narrator text', text);