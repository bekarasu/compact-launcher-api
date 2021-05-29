import { IProgram, IProgramImage, ISearchIndex } from '../../../@types/common/program'
import { IRequestQueryParams } from '../../../@types/server/IRequestQueryParams'
import { IProgramService } from '../../../@types/server/services/IProgramService'
import ProgramImageRepository from '../database/repositories/ProgramImageRepository'
import ProgramRepository from '../database/repositories/ProgramRepository'
import SearchIndexRepository from '../database/repositories/SearchIndexRepository'
import ServiceException from '../exceptions/ServiceException'
import { compareFromNow } from '../helpers/date'
import { toURLConverter } from '../helpers/routeServer'
import { Program, ProgramDocument, ProgramImage, ProgramImageDocument } from '../models/program.model'
import { SearchIndex, SearchIndexDocument } from '../models/search_index.model'
import BaseService from './BaseService'
import ImageFetcherFromServices from './externals/ImageRepoService/ImageFromServices'
import WallpaperAccess from './externals/ImageRepoService/Repos/WallpaperAccess'

export class ProgramService extends BaseService<ProgramDocument> implements IProgramService {
  protected repository: ProgramRepository = new ProgramRepository(Program)

  delete(queryParams: IRequestQueryParams): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  create(document: ProgramDocument): Promise<ProgramDocument> {
    throw new Error('Method not implemented.')
  }
  update(document: ProgramDocument): Promise<ProgramDocument> {
    throw new Error('Method not implemented.')
  }

  async show(queryParams: IRequestQueryParams, urlParams: IRequestQueryParams): Promise<ProgramDocument | null> {
    if (urlParams.slug == null) {
      // slug is required
      throw new ServiceException('Slug is not set')
    }
    const slug = toURLConverter(urlParams.slug) // it must be url compatible
    console.log(slug)

    const searchRepository = new SearchIndexRepository(SearchIndex)
    let searchIndex = await searchRepository.find({ slugKey: slug })
    let firstSearch = false // we bypass the program is null check for first search
    if (searchIndex == null) {
      firstSearch = true
      // create new search index
      let newSearchIndex: ISearchIndex = {
        slugKey: slug,
        usedTime: 1,
      }
      searchIndex = await searchRepository.insert(newSearchIndex)
    }
    if (searchIndex.programs.length !== 0) {
      searchIndex = await searchIndex
        .populate({
          path: 'programs',
          options: { limit: 1 },
        })
        .execPopulate()
      if (searchIndex.programs[0] != null && !searchIndex.programs[0].status) throw new ServiceException('Forbidden Program')
    } else {
      if (!firstSearch) return null // TODO add last search time and add to this condition
    }

    let program = searchIndex.programs[0]
    // check the cache is valid first
    if (program == null || program.lastFetchTime == null || compareFromNow(program.lastFetchTime, 7)) {
      let services: ImageFetcherFromServices = new ImageFetcherFromServices([new WallpaperAccess()]) // set the external image fetchers
      await services.fetchAllImages(slug) // fetch images
      const imagesFromService = services.getImages() // get the fetched images from services
      if (imagesFromService.length !== 0) {
        if (program == null) {
          const newProgram: IProgram = {
            content: '',
            status: true,
          }
          const savedProgram = await this.repository.insert(newProgram)
          program = savedProgram
          searchIndex.programs.push(savedProgram)
          searchIndex.save()
        }
        if (queryParams.refSlug != null) {
          // TODO
          const refSlug = toURLConverter(queryParams.refSlug)
          let refSearchIndex: SearchIndexDocument | null = await searchRepository.find({ slugKey: refSlug })

          if (refSearchIndex != null) {
            refSearchIndex.programs.push(program)
            refSearchIndex.save()
          }
        }
        const programImageRepository = new ProgramImageRepository(ProgramImage)
        for (let image of imagesFromService) {
          const programImage: IProgramImage = {
            resolation: image.resolation,
            path: image.path,
          }
          const programImageModel = await programImageRepository.insert(programImage)
          if (programImageModel != null) {
            program.images.push(programImageModel) // bind the images to program
          }
        }
        // be sure searchIndex.program populated as ProgramDocument, otherwise it will throw error in below code
        program.lastFetchTime = new Date() // set the cache time
        program.save()
      } else {
        return null
      }
    }

    let populateWhere = {}
    if (queryParams.resolation != null) {
      const resolation = queryParams.resolation
      let resolations: string[] | null = null
      if (resolation != null) {
        resolations = resolation.split('x') // ex: 1920x1080
      }
      if (resolations != null && resolations.length == 2) {
        populateWhere['resolation'] = {
          width: resolations[0] != null ? Number.parseInt(resolations[0]) : null,
          height: resolations[1] != null ? Number.parseInt(resolations[1]) : null,
        }
      }
    }
    return await program
      .populate({
        path: 'images',
        match: populateWhere,
        select: 'resolation path chosenTime',
      })
      .execPopulate()
  }

  selectProgram = async (queryParams: IRequestQueryParams): Promise<ProgramImageDocument> => {
    const programImageRepository = new ProgramImageRepository(ProgramImage)
    let image = await programImageRepository.find({ _id: queryParams.imageID })
    if (image == null) {
      throw new ServiceException('Image Not Found')
    }
    // TODO add image status and dont show the false ones if isLocal
    if (typeof image.chosenTime !== 'undefined') {
      image.chosenTime++
    }
    image.save()
    // image = await programImageRepository.transferToLocal(image)
    return image
  }

  list = async (queryParams: IRequestQueryParams): Promise<ProgramDocument[] | Array<null>> => {
    const params = this.prepareRequestParams(queryParams)
    const where = {
      status: params.status,
    }
    return await this.repository.findAll(where, {}, params.limit, params.start).exec()
  }
}
