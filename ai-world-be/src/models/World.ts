export class World {
  id: number;
  name: string;
  description: string;

  constructor(values?: Partial<World>) {
    this.id = values?.id || 0;
    this.name = values?.name || '';
    this.description = values?.description || '';
  }
}