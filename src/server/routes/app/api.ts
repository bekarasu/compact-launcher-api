import bodyParser from "body-parser";
import cors from 'cors';
import * as dotenv from "dotenv";
import express from "express";
import helmet from 'helmet';
import { errorHandler } from '../../http/middlewares/api/error.middleware';
import { notFoundHandler } from '../../http/middlewares/api/notFound.middleware';
import "../../libraries/ApiResponse";
import { Restful } from '../../http/middlewares/api/restful.middleware';
import ProgramController from "../../http/controllers/admin/api/ProgramController";
dotenv.config();



/**
 * Router Definition
 */
export const appApiRouter = express.Router();


/**
 * Before Middleware
 */
appApiRouter.use(Restful);
appApiRouter.use(helmet());
appApiRouter.use(cors());
appApiRouter.use(bodyParser.json());

/**
 * Routes
 */
appApiRouter.get('/programs', ProgramController.list);
appApiRouter.get('/programs/:slug', ProgramController.show);

/**
 * After Middleware
 */
appApiRouter.use(errorHandler);
appApiRouter.use(notFoundHandler);

