// extend the express Response class
declare namespace Express {
  // first, declare that we are adding a method to `Response` (the interface)
  export interface Response {
    message: string | object
    customResponse: (data?: object | null) => this
    setMessage: (message: string | object) => this
  }
}
