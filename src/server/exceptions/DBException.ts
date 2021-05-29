export default class DBException extends Error {
  data: Array<any>
  constructor(m: string, data: Array<any>) {
    super(m)
    this.data = data
  }
}
