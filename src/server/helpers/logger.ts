import { ILog } from '../../../@types/common/log'
import { Log } from '../models/logs.model'
import ModelService from '../services/ModelService.service'

export const sysLog = (log: ILog) => {
  const logService = new ModelService(Log)
  logService.insert(log)
}
