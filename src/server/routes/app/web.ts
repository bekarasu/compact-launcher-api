import { store } from '../../../client/app/store'
import cors from 'cors'
import express, { Request, Response } from 'express'
import helmet from 'helmet'
import { matchRoutes } from 'react-router-config'
import Routes from '../../../common/resources/routes'
import renderer from '../../helpers/renderer'
export const appWebRouter = express.Router()

/**
 * Middleware Setups
 */
appWebRouter.use(helmet({ contentSecurityPolicy: false })) // TODO check this why we set this false
appWebRouter.use(cors())

// all pages redirects to react
appWebRouter.get('*', async (req: Request, res: Response) => {
  const promises = matchRoutes(Routes, req.originalUrl).map(({ route, match }) => {
    return route.loadData ? route.loadData(store, match.params) : null // get the component's load data function and execute it
  })
  Promise.all(promises).then(() => {
    res.send(renderer(req.originalUrl, store)) // originalUrl can get the path, req.path doesnt work for inner routes.
  })
})
