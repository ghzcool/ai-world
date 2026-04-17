// decide what happens on character actions
// write to logs world and character
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

export class GodRole {
  constructor() {
    
  }

  readWorldLog() {
    return readLog(WORLD_LOG);
  }

  writeWorldLog(entries) {
    writeLog(WORLD_LOG, entries);
  }

  async actionResult(lastEvents) {
      const context = await getWorldContext();
    
        const prompt = `
        Ты бог вымышленного мира.
        Тебе предстоит принимать решения о результатах действий персонажей.
        Ответ от тебя ожидается в строго определённом формате, без лишних пояснений.
        Твой ответ будет парсится как json и лишний текст сломает парсинг.

        Структура твоего json ответа:
        {
            "date": string; // дата и время события в формате ISO 8601 без тайм зоны
            "log": string; // текст описывающий событие. пример: "Elsa подходит к лавке с припасами для путешествий"
            "location": string; // разделённая запятыми строка описывающая место события. пример: "Сария, Люменград, Центральняя площадь, Лавка"
            "witnesses": string[] // массив имён персонажей, которые были свидетелями события. пример: ["character:Elsa", "seller:Jimm", "others:Случайные прохожие Люменграда"]
        }
    
        Примеры ответа:
        {
            "date":"2025-11-13T16:44:05",
            "log":"character:Elsa подходит к лавке с припасами для путешествий",
            "location":"Сария, Люменград, Центральняя площадь, Лавка",
            "witnesses":[
                "character:Elsa", 
                "seller:Jimm", 
                "others:Случайные прохожие Люменграда"
            ]
        }
        {
            "date":"2025-11-13T16:44:10",
            "log":"seller:Jimm жестом показывает Эльзе приблизиться",
            "location":"Сария, Люменград, Центральняя площадь, Лавка",
            "witnesses":[
                "character:Elsa", 
                "seller:Jimm", 
                "others:Случайные прохожие Люменграда"
            ]
        }


        Лог предыдущих событий:
        ${JSON.stringify(this.readWorldLog(), null, 2)}
    
    
        Действия персонажей:
        ${JSON.stringify(lastEvents, null, 2)}
    
    
        Напиши результат действия персонажа с учётом предыдущих событий. 
        Действие персонажа продолжительностью примерно в 5 секунд.
        Если долше 5 секунд, то это не законченое действие, а начало продолжительного действия.
        Ещё раз напоминаю придерживаться формата ответа:
        {"date": string, "log": string, "location": string, "witnesses": string[]}
        без лишних оббёрток, скобочек и пояснений. не используй md разметку. оно должно парсится как json.
        `;
    
        const response = await generate(prompt, context);
        return response;
  }
}
