import {
  generate,
  readLog,
  readFile,
  writeLog,
  appendLog,
  getCharacterPath,
  getWorldContext,
  WORLD_LOG,
  GOD_LOG
} from '../ollama.js';

export class Character {
    name = '';
    description = '';

  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.characterPath = getCharacterPath(name);
  }

  readLog() {
    console.log('readLog', this.characterPath + '/history.log');
    return readLog(this.characterPath + '/history.log');
  }

  writeLog(entries) {
    writeLog(this.characterPath + '/history.log', entries);
  }

  readCharacter() {
    console.log('readCharacter', this.characterPath + '/character.txt');
    return readFile(this.characterPath + '/character.txt');
  }

  writeCharacter(description) {
    return writeFile(this.characterPath + '/character.txt', description);
  }

  appendLog(entry) {
    appendLog(this.characterPath + '/history.log', entry);
  }

  async getAction(narratorMsg) {
    const context = await getWorldContext();

    const prompt = `
    Ты персонаж в вымышленном мире.
    Тебе предстоит принять решение от имени твоего персонажа.
    Ответ от тебя ожидается в строго определённом формате, без лишних пояснений.
    Твой ответ будет парсится как json и лишний текст сломает парсинг.

    Структура твоего json ответа:
    {
        "action": string; // тип действия. примеры: walk, say, ask, attack, run, jump, swim, smile, ...
        "target": string; // к кому/чему применено действие. примеры: character:Tiina, стражник:Bob, прохожий, берег моря, деревянная дверь, книга ...
        "content": string; // содержимое или описание действия. пример: "идти в сторону берега"
    }

    Примеры ответа:
    {"action": "walk", "target": "outside", "content": "выйти из здания"}
    {"action": "say", "target": "stranger", "content": "Привет! Ты кто?"}
    {"action": "kick", "target": "wooden door", "content": "Пнуть деревянную дверь."}
    {"action": "ask", "target": "character:Dwayne", "content": "Мы ничего не забыли?"}

    Описание твоего персонажа:
    ${this.description}


    Лог предыдущих событий:
    ${JSON.stringify(this.readLog(), null, 2)}


    Текущая ситуация:
    ${narratorMsg}


    Внимательно ознакомься с текущей ситуацией, что твой персонаж будет делать?
    Напиши действие твоего персонажа в текущей ситуации с учётом предыдущих событий. 
    Действие продолжительностью примерно в 5 секунд.
    Если долше 5 секунд, то это не законченое действие, а начало продолжительного действия.
    Ещё раз напоминаю придерживаться формата ответа:
    {"action": "string", "target": "string", "content": "string"}
    без лишних оббёрток, скобочек и пояснений. не используй md разметку. оно должно парсится как json.
    `;

    const response = await generate(prompt, context);
    return response;
  }
}
