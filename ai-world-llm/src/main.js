// main.js
// Пример игрового цикла: Бог, Рассказчик, Персонажи

const { God, Narrator, Character, syncEventToCharacters } = require('./roles');
const fs = require('fs');
const path = require('path');

// --- Инициализация персонажей ---
const characterNames = ['Bob', 'Alice'];
const characters = characterNames.map(name => new Character(name));

// --- Инициализация ролей ---
const god = new God();
const narrator = new Narrator();



// --- Вспомогательная функция для строгого парсинга JSON-массива ---
function extractJsonArray(text) {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      return [];
    }
  }
  return [];
}

// --- Улучшенный игровой цикл ---
async function gameLoop() {
  let step = 1;
  while (true) {
    console.log(`\n--- Game step ${step} ---`);
    // 1. Бог читает свой лог и лог мира
    const godLog = god.readLog();
    const worldLog = god.readLog();

    // 2. Бог отправляет лог и промпт в нейросеть, получает новые события
    const prompt = `Ты бог мира. Вот хронологический перечень событий:\n${JSON.stringify(godLog)}\nСгенерируй массив новых событий для мира в формате JSON: [{date: '', log: '', location: ''}]. Верни только JSON-массив, без пояснений, без текста до и после.`;
    let response = await god.getNeuralEvents(prompt, godLog);
    let newEvents = [];
    if (Array.isArray(response)) {
      newEvents = response;
    } else if (typeof response === 'string') {
      newEvents = extractJsonArray(response);
    }
    // Fallback: если событий нет, добавим дефолтные
    if (!newEvents || !newEvents.length) {
      newEvents = [
        { date: new Date().toISOString(), log: 'Bob walk from Pae to Punane', location: 'Estonia.Tallinn.Pae' },
        { date: new Date().toISOString(), log: 'Alice found a mysterious key', location: 'Estonia.Tallinn.Pae' }
      ];
      console.log('No events from neural net, using default events.');
    }

    // 3. Бог добавляет новые события в лог мира и свой лог
    newEvents.forEach(event => god.addWorldEvent(event));

    // 4. Синхронизируем события для персонажей, находящихся в том же месте
    newEvents.forEach(event => syncEventToCharacters(characters, event));

    // 5. Каждый персонаж читает новые записи своего лога
    for (const character of characters) {
      const log = character.readLog();
      // Найти только новые события из newEvents
      const newLogEntries = log.filter(entry => newEvents.some(ev => ev.date === entry.date && ev.location === entry.location && ev.log === entry.log));

      // 6. Рассказчик описывает только новые события для персонажа
      const narrationPrompt = `Ты рассказчик. Вот новые события для персонажа ${character.name}: ${JSON.stringify(newLogEntries)}. Опиши их литературно. Верни только текст повествования, без пояснений.`;
      const narration = await narrator.describe(character.name, newLogEntries);
      console.log(`Narrator for ${character.name}:`, narration);

      // 7. Персонаж решает, что делать дальше (отправляет запрос в нейросеть)
      const description = character.readData();
      const actionPrompt = `Ты персонаж ${character.name}. Вот твой лог: ${JSON.stringify(log)}. Вот описание персонажа: ${JSON.stringify(description)}. Вот сообщение от рассказчика: ${narration}. Что ты будешь делать дальше? Верни только действие в стиле 'walk from Pae to Punane', без пояснений.`;
      let action = await character.getAction(log, description, narration, actionPrompt);
      // Если Ollama вернул ошибку или пусто, используем дефолтное действие
      if (!action || typeof action !== 'string' || action.toLowerCase().includes('ошибка')) {
        action = 'wait';
      }
      console.log(`${character.name} action:`, action);

      // 8. Записываем действие персонажа в его лог и лог бога
      const actionEvent = {
        date: new Date().toISOString(),
        log: `${character.name} ${action}`,
        location: newLogEntries.length ? newLogEntries[newLogEntries.length - 1].location : 'unknown',
        actor: character.name
      };
      character.appendLog(actionEvent);
      god.addCharacterEvent(character.name, actionEvent);
    }

    step++;
    await new Promise(res => setTimeout(res, 2000)); // задержка между шагами
  }
}

// --- Запуск игрового цикла ---
(async () => {
  await gameLoop();
})();
