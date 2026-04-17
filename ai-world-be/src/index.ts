import {Request, Response} from "express";
import app from './app/expressApp';
import registerAutowireComponents from './app//registerAutowireComponents';
import registeredControllers from './app/registerControllers';

console.log('Starting...');
console.log("Registered autowire components:", registerAutowireComponents.join(", "));
console.log("Registered express controllers:", registeredControllers.join(", "));

app.get('/*', (req: Request, res: Response) => {
  res.send('App is up!')
});

const port = process.env.API_PORT || 3001;

app.listen(port, () => {
  console.log(`Listening at ${port}`);
});
