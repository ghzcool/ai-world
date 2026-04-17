import {Autowire, AutowireComponent} from "../app/expressDecorator";
import {SampleRepositoryInterface} from "../repositories";
import {SampleModel} from "../models/SampleModel";

export interface SampleServiceInterface {
  sampleMethod: () => SampleModel;
}

@AutowireComponent
export class SampleService implements SampleServiceInterface {

  @Autowire("SampleRepository")
  private sampleRepository: SampleRepositoryInterface;

  sampleMethod() {
    return this.sampleRepository.getSampleData();
  }
}
