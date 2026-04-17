AI World Backend

Express based app for interactive story telling together with AI.

Backend API's.

GET /world/:id/state/latest - called on fe open.
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

GET /world/:id - get the world info - loaded on fe open
    returns the world
    {id: number, name: string, description: string}

POST /world - create new world - start new game
    receives
    {id: number, name: string, description: string}
    returns new world

GET /image?prompt=sometext
    returns generated image using cli
    sd-cli --diffusion-model ../models/z_image_turbo-Q4_K_S.gguf --llm ../models/Qwen3-4B-Instruct-2507-Q4_K_S.gguf --vae ../models/ae.safetensors --prompt "cat" --sampling-method res_multistep --scheduler simple --steps 9 --cfg-scale 1.0 --width 640 --height 480 -o ../output.png --rng cuda --sampler-rng cuda

GET /voice?text=sometext&voice=voicename
    returns generated audio using cli
    generate_audio --model-dir models/customvoice-0.6b --text "Hello!" --speaker "vivian" --output output.wav
