import { response } from 'express'

// app specified response
response.customResponse = function (data: object | null = {}) {
  if (this.message == null) {
    this.message = ''
  }
  this.json({ message: this.message, data: data })
  return this
}

// app specified message
response.setMessage = function (message: object | string) {
  this.message = message
  return this
}
