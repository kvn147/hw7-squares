import express, { Express } from "express";
import { dummy, getNames, save, load } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/dummy", dummy);
app.listen(port, () => console.log(`Server listening on ${port}`));

app.get("/api/names", getNames);
app.post("/api/save", save);
app.get("/api/load", load);

