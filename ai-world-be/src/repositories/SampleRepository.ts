import {AutowireComponent} from "../app/expressDecorator";
import {SampleModel} from "../models/SampleModel";

export interface SampleRepositoryInterface {
  getSampleData: () => SampleModel;
}

@AutowireComponent
export class SampleRepository {
  getSampleData(): SampleModel {
    return new SampleModel({name: "Sample name", description: "Sample description"});
  }
}
