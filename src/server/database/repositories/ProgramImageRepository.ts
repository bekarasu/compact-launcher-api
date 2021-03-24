import axios, { AxiosResponse } from 'axios'
import { ProgramImageDocument } from '../../models/program.model'
import AbstractRepository from './AbstractRepository'
import fs from 'fs'
import path from 'path'
import { fileSystem } from '../../config/filesystem'
export default class ProgramImageRepository extends AbstractRepository<ProgramImageDocument> {
  downloadFromSource = async (programImage: ProgramImageDocument): Promise<ProgramImageDocument> => {
    if (programImage.isLocal) {
      return programImage
    }
    let axiosRes: AxiosResponse
    try {
      axiosRes = await axios.get(programImage.path, {
        responseType: 'stream', // download the file
      })
    } catch (e) {
      return programImage
    }
    let extension: string = axiosRes.headers['Content-Type'] ?? axiosRes.headers['content-type'] // TODO think about there, we need better detection
    const splittedExtension: string[] = extension.split('/')
    extension = splittedExtension[splittedExtension.length - 1]
    let filePath = path.join(fileSystem.imagesPath, programImage._id.toHexString()) + `.${extension}`
    const writer = fs.createWriteStream(filePath)
    await axiosRes.data.pipe(writer)
    programImage.path = filePath.replace(fileSystem.imagesPath, fileSystem.assetUrl).replace('\\', '/') // make url compability
    programImage.isLocal = true
    programImage.save()
    return programImage
  }
}
