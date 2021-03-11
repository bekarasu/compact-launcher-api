
export interface ILog {
  type: 'rest' | 'cli'
  endpoint: string
  log: object
  message: string
  status: "error" | "warning" | "success"
  statusCode?: number
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}