import { ProgramImageDocument } from '../../../src/server/models/program.model'
import { IRequestQueryParams } from '../IRequestQueryParams'

export interface IProgramService {
  selectProgram(queryParams: IRequestQueryParams): Promise<ProgramImageDocument>
}
