# Decorators for Express

This library provides a set of **TypeScript** decorators to simplify route handling and dependency injection in Express applications. It includes route decorators like **GetMapping**, **PostMapping**, and **ExpressController** to streamline route registration, as well as **Autowire** and **AutowireComponent** for managing components and automatic dependency injection, enabling a clean, modular, and declarative approach to building Express-based applications.

## ExpressMapping
The main decorator that handles binding a route to a controller method. It takes a path and an HTTP method (GET, POST, PUT, DELETE, USE) and registers the corresponding route in the Express application.

**GetMapping**, **PostMapping**, **PutMapping**, **DeleteMapping**, **UseMapping**
Specialized decorators that call ExpressMapping with a specific HTTP method.

## Decorators for Managing Controllers and Components

ExpressController: A decorator that registers a controller class to be used in your Express application.

AutowireComponent: A decorator for registering a class as a component that can be automatically injected into other parts of the application.

Autowire: A decorator for automatically injecting dependencies into the fields of other classes.

## @ExpressController
Class decorator for express controllers

```ts
@ExpressController
export class SampleController {}
```

on import automatically creates instance and registers it.

### @ExpressMapping
Creates method decorator that registers method in express app.

```ts
@ExpressMapping('/api/sample', 'get')
emptyObjectGet(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  res.send({});
}
```

### @GetMapping
Uses ExpressMapping with predefined request method "get"

```ts
@GetMapping('/api/sample')
emptyObjectGet(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  res.send({});
}
```

### @PostMapping
Uses ExpressMapping with predefined request method "post"

### @PutMapping
Uses ExpressMapping with predefined request method "put"

### @DeleteMapping
Uses ExpressMapping with predefined request method "delete"

### @UseMapping
Uses ExpressMapping with predefined request method "use"
 
## @AutowireComponent
Class decorator for autowire components

```ts
@AutowireComponent
export class SampleService implements SampleServiceInterface {}
```

on import automatically creates instance and registers it.

### @Autowire
Field decorator that set's instance of registered AutowireComponent

```ts
@Autowire("SampleService")
sampleService: SampleServiceInterface;
```

## Usage

First create and register Express app so decorators can work with it.

```ts
const app: Express = express();
registerExpressApp(app);
```

then import **AutowireComponent**'s

then import **ExpressController**'s

**It's important to keep order of imports.**

Import **AutowireComponent** first and then import component that uses it with **Autowire** decorator.
