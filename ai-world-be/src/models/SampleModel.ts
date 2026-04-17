export class SampleModel {
  name: string;
  description?: string;

  constructor(values?: SampleModel) {
    this.name = values?.name;
    this.description = values?.description;
  }
}
