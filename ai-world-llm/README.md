#Концепция и основные идеи

бог:
. читает лог бога- хронологический  перечень событий с указанием даты и места (путь в мире)
. добавляет записи в лог мира
. добавляет записи в логи персонажей
. создаёт и редактирует файлы персонажей

в свой ход в нейронку отправляет лог событий и промпт, о том что мы ожидаем от нейронки, а ожидаем мы массив записей в лог.
[{date: '', log: 'Bob walk from Pae to Punane', location: 'Estonia.Tallinn.Pae'}]
после чего в лог вносятся новые записи. 

бог ещё получает сообщения о событиях от персонажей в их ход.

новые записи дублируются в логи тех персонажей, которые находятся в том же месте, где произошло событие.

рассказчик:
. читает новые записи лога персонажа, как то, что нужно описать персонажу.
. отправляет в нейронку записи и примпт с указанием.
. отправляет ответ от нейронки персонажу. ответ ожидается литературное повествование о том, что персонаж видит, слышит, чувствует , чтоб персонаж решал, что дальше делать.

персонаж:
. читает файл своего персонажа
. пишет в своего персонажа
. читает свой лог
. сообщает богу о событии

в свой ход отправляет запрос в нейронку со своим логом, описанием своего персонажа, сообщением от расказчика и промптом, для получения от нейронки (или игрока) своих действий.
ожидает ответ в стиле "walk from Pae to Punane".
этот ответ записывается в лог персонажа и в лог бога, но с припиской, кто это сделал.

в общих данных записывается чей сейчас ход, кто на какой строчке своего лога остановился.

Пример кода для общения с нейронной сетью в папке "teknologia".


1. app start. 
2. god role prompt with task to generate world description is sent to llm. world description is saved and context for god is saved.
3. narrator role prompt combined with world description is sent to llm. starting world story is told to user and context for narrator is saved.
4. god asked to create main character description
5. character creator role prompt combined with world description and character description is sent to llm.
6. character is created (player).
7. god asked to make list of events to start a story for character.
8. events are stored in god log
9. some events are stored to character log (that character knows about)
10. narrator is asked to narrate last changes in log to character. he get's context, character log, character description.
11. pointer for last changes is moved