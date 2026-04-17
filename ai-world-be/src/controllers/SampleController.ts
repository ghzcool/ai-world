import {Request, Response} from "express";
import {Autowire, ExpressController, GetMapping} from "../app/expressDecorator";
import {SampleServiceInterface} from "../services";

@ExpressController
export class SampleController {

  @Autowire("SampleService")
  sampleService: SampleServiceInterface;

  @GetMapping('/api/sample')
  sampleGet(req: Request, res: Response) {
    res.setHeader('Content-Type', 'application/json');
    res.send("value1");
  }

  @GetMapping('/api/sampleValue')
  sample2Get(req: Request, res: Response) {
    res.setHeader('Content-Type', 'application/json');
    res.send({value: this.sampleService.sampleMethod()});
  }

}
