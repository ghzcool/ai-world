import {SampleServiceInterface} from "../services";
import {SampleModel} from "../models/SampleModel";
import {AutowireComponent} from "../app/expressDecorator";

@AutowireComponent
class SampleService implements SampleServiceInterface {
  sampleMethod() {
    return new SampleModel({name: "Test", description: "test"});
  }
}

const {SampleController} = require("../controllers");

describe('SampleController', () => {
  test('sample get', () => {
    const sampleController = new SampleController();
    const header = {};
    let response;
    sampleController.sampleGet(null, {setHeader: (key, value) => header[key] = value, send: value => response = value});
    expect(response).toEqual("value1");
    expect(header['Content-Type']).toEqual('application/json');
  });

  test('sample2 get', () => {
    const sampleController = new SampleController();
    const header = {};
    let response;
    sampleController.sample2Get(null, {
      setHeader: (key, value) => header[key] = value,
      send: value => response = value
    });
    expect(response.value.name).toEqual("Test");
  });

});
