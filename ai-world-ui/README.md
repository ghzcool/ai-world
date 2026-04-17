AI World UI

React based app for interactive story telling together with AI.
UI contains: generated image for current situation, section with blocks with text from AI narrator and AI characters, text input for player actions.

Interface concept is in concept.svg design need to be improved but layout is fine.

This app will call backend API's using axios.

GET /world/:id/state/latest - called on open page. use id from local storage
    returns latest state
    {stateIndex: number, imagePrompt: string, texts: [{who: string, to: string, action: string, content: string}], turn: string}

GET /world/:id/state/:index - used to load previous states
    returns state for index

GET /world/:id/state/list - used to load history of states
    returns array of states with paging ordered by stateIndex desc
    {items: [], total: number}

POST /world/:id/action - called on user input
    receives
    {stateIndex: number, to: string, action: string, content: string, duration: number}
    returns new latest state

GET /world/:id - get the world info - loaded on page open
    returns the world
    {id: number, name: string, description: string}

POST /world - create new world - start new game
    receives
    {id: number, name: string, description: string}
    returns new world

GET /image?prompt=sometext
    returns generated image

GET /voice?text=sometext&voice=voicename
    returns generated audio
