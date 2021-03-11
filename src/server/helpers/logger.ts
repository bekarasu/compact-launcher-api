import { ILog } from "../../../@types/common/log";
import { Log } from "../models/logs.model";
import ModelService from "../services/ModelService.service";

export const sysLog = (log: ILog) => {
    const logService = new ModelService(Log);
    const logModel: ILog = {
        endpoint: log.endpoint,
        type: log.type,
        message: log.message,
        log: log.log,
        status: log.status,
        statusCode: log.statusCode
    };
    logService.insert(logModel);
} 