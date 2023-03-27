import { HttpRequest, HttpResponse } from './http/http'

export interface Controller {
  handle: (httpRequest: HttpRequest) => HttpResponse
}
