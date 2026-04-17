export interface TextItem {
  who: string;
  to: string;
  action: string;
  content: string;
}

export class State {
  worldId: number;
  stateIndex: number;
  imagePrompt: string;
  texts: TextItem[];
  turn: string;

  constructor(values?: Partial<State>) {
    this.worldId = values?.worldId || 0;
    this.stateIndex = values?.stateIndex || 0;
    this.imagePrompt = values?.imagePrompt || '';
    this.texts = values?.texts || [];
    this.turn = values?.turn || '';
  }
}