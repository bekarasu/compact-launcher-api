import { ILog } from '../../../@types/common/log'
import { Log } from '../models/logs.model'
import LogRepository from './../database/repositories/LogRepository'

export const sysLog = (log: ILog) => {
  const logService = new LogRepository(Log)
  logService.insert(log)
}
