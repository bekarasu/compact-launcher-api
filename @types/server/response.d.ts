// extend the express Response class
declare namespace Express {
  // first, declare that we are adding a method to `Response` (the interface)
  export interface Response {
    message: string | object
    data: object | null
    customResponse: (data?: object | null) => this
    setRedirect: (redirectUrl: string) => this
    setMessage: (message: string | object) => this
  }
}
