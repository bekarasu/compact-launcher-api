import { Request, Response } from 'express'
import { IAdminMenu } from '../../../../../../@types/common/admin_menu'
import AdminMenuRepository from '../../../../database/repositories/AdminMenuRepository'
import { treeAdminMenu } from '../../../../helpers/treeAdminMenu'
import '../../../../libraries/ApiResponse'
import { AdminMenu } from './../../../../models/admin_menu.model'

class AdminMenuController {
  async getList(req: Request, res: Response) {
    const service = new AdminMenuRepository(AdminMenu)
    let sidebarItems: Array<IAdminMenu> = await service.findAll().lean()
    sidebarItems = treeAdminMenu(sidebarItems)
    res.setMessage('').customResponse(sidebarItems)
  }
}
export default new AdminMenuController()
