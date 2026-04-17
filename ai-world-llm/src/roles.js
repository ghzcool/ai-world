// roles.js
// Реализация базовых ролей: Бог, Рассказчик, Персонаж

const {
  generate,
  readLog,
  writeLog,
  appendLog,
  getCharacterLog,
  WORLD_LOG,
  GOD_LOG
} = require('./ollama');
const fs = require('fs');
const path = require('path');

class God {
  constructor() {
    this.logPath = GOD_LOG;
  }

  readLog() {
    return readLog(this.logPath);
  }

  addWorldEvent(event) {
    appendLog(WORLD_LOG, event);
    appendLog(this.logPath, event);
  }

  addCharacterEvent(character, event) {
    appendLog(getCharacterLog(character), event);
  }

  async getNeuralEvents(prompt, context) {
    // prompt: что ожидаем от нейросети
    // context: лог событий
    const response = await generate(prompt, context);
    try {
      return JSON.parse(response);
    } catch {
      return [];
    }
  }
}

class Narrator {
  async describe(character, newEvents) {
    // newEvents: массив новых записей лога персонажа
    const prompt = `Опиши для персонажа ${character} события: ${JSON.stringify(newEvents)}. Верни литературное повествование.`;
    const response = await generate(prompt);
    return response;
  }
}

class Character {
  constructor(name) {
    this.name = name;
    this.logPath = getCharacterLog(name);
    this.dataPath = path.join(path.dirname(this.logPath), `${name}.json`);
  }

  readLog() {
    return readLog(this.logPath);
  }

  writeLog(entries) {
    writeLog(this.logPath, entries);
  }

  appendLog(entry) {
    appendLog(this.logPath, entry);
  }

  readData() {
    if (!fs.existsSync(this.dataPath)) return {};
    return JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
  }

  writeData(data) {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2), 'utf8');
  }

  async getAction(log, description, narratorMsg, prompt) {
    // log: лог персонажа
    // description: описание персонажа
    // narratorMsg: сообщение от рассказчика
    // prompt: что ожидаем от нейросети
    const context = { log, description, narratorMsg };
    const response = await generate(prompt, context);
    return response;
  }
}


// --- Синхронизация событий между персонажами ---
function syncEventToCharacters(characters, event) {
  // event: {date, log, location}
  // characters: массив Character или строк-имен
  const location = event.location;
  characters.forEach(char => {
    let charObj = typeof char === 'string' ? new Character(char) : char;
    const log = charObj.readLog();
    // Проверяем, находится ли персонаж в нужном месте
    // Предполагаем, что последняя запись лога содержит location
    const lastEntry = log.length ? log[log.length - 1] : null;
    if (lastEntry && lastEntry.location === location) {
      charObj.appendLog(event);
    }
  });
}

module.exports = { God, Narrator, Character, syncEventToCharacters };
