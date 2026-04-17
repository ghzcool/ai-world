import express, {Express} from "express";
import {registerExpressApp} from "./expressDecorator";
import cors from "cors";
import bodyParser from "body-parser";

const app: Express = express();

registerExpressApp(app);

app.use(cors());
app.use(bodyParser.urlencoded({extended: false, limit: '1mb'}));
app.use(bodyParser.json({type: 'application/json', limit: '1mb'}));
app.use(bodyParser.text({type: 'text/html', limit: '1mb'}));

export default app;
