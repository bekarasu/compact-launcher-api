export default class ServiceException extends Error {
  constructor(m: string) {
    super(m)
  }
}
