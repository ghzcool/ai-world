import {Express, Request, Response} from 'express';

type ExpressHandler = (req: Request, res: Response) => void;

let expressApp: Express = null;
let expressPrefix: string = '';

export const registerExpressApp = (app: Express, prefix: string = '') => {
  expressApp = app;
  expressPrefix = prefix;
};

export const ExpressMapping: any = function (path: string, method: 'get' | 'post' | 'put' | 'delete' | 'use'): any {
  return function (targetInstance: any, methodName: string, context: any = {}): ExpressHandler {
    function replaceMethod(req: Request, res: Response) {
      try {
        context.value.call(targetInstance, req, res);
      } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500);
        res.send(error);
      }
    }

    if (path && expressApp) {
      expressApp[method](expressPrefix + path, replaceMethod);
    }
    return replaceMethod;
  };
};

export const GetMapping: any = function (path: string): any {
  return ExpressMapping(path, 'get');
};

export const PostMapping: any = function (path: string): any {
  return ExpressMapping(path, 'post');
};

export const PutMapping: any = function (path: string): any {
  return ExpressMapping(path, 'put');
};

export const DeleteMapping: any = function (path: string): any {
  return ExpressMapping(path, 'delete');
};

export const UseMapping: any = function (path: string): any {
  return ExpressMapping(path, 'use');
};

export const ExpressController = (targetClass: any) => {
  registerExpressController(targetClass.name, targetClass);
};

const controllersMap: { [key: string]: any } = {};

export const registerExpressController = (controllerName: string, controller: any) =>
  controllersMap[controllerName] = new controller();

export const getExpressControllers = () => Object.keys(controllersMap);

export const AutowireComponent = (targetClass: any) => {
  registerAutowireInstance(targetClass.name, targetClass);
};

const instancesMap: { [key: string]: any } = {};

export const registerAutowireInstance = (className: string, classItself: any) =>
  instancesMap[className] = new classItself();


export const getAutowireInstances = () => Object.keys(instancesMap);

export const getAutowireInstance = (className: string) => instancesMap[className];

export const Autowire = (className: string) => {
  return (target: any, fieldName: string, context: any = {}): any => {
    target[fieldName] = getAutowireInstance(className) ?? context.value;
  };
};
