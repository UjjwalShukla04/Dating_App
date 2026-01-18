import express from "express";
import cors from "cors";

import { routes } from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./common/error.handler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
