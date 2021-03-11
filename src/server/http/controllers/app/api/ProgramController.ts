import { NextFunction, Request, Response } from "express";
import HttpException from "../../../../exceptions/api/http-exception";
import "../../../../libraries/ApiResponse";
import ModelService from "../../../../services/ModelService.service";
import { Program } from './../../../../models/program.model';

class ProgramController {
  private service: ModelService;
  constructor() {
    this.service = new ModelService(Program);
  }
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let limitParam: string = typeof req.query.limit != "undefined" ? req.query.limit.toString() : "";
      let offsetParam: string = typeof req.query.start != "undefined" ? req.query.start.toString() : "";
      let limit: number | null = Number.parseInt(limitParam);
      let offset: number | null = Number.parseInt(offsetParam);
      const where = {
        status: true
      };
      const data = await this.service.findAll(where, {}, limit, offset);
      res.setMessage("Program Fetched").customResponse(data);
    } catch (e) {
      next(e);
    }
  };
  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const where = {
        status: true,
        slug: req.params.slug
      };

      const program = await this.service.find(where);
      if (program === null) {
        throw new HttpException(400, "Program Not Found");
      }

      res.setMessage("Product Fetched").customResponse(program);
    } catch (e) {
      next(e);
    }
  };
}
export default new ProgramController();
