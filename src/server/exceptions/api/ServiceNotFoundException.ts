export default class ServiceNotFoundException extends Error {
  constructor(serviceEndpoint: string) {
    super('Service Not Found: ' + serviceEndpoint)
  }
}
