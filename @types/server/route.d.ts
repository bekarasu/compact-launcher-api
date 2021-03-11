import 'react-router-config'
// extend the express Response class
declare module 'react-router-config' {
  // first, declare that we are adding a method to `Response` (the interface)
  export interface RouteConfig {
    loadData?: (store: any, match: any) => Promise<any>
  }
}
