export interface Language {
  forms: {
    login: string
    logout: string
    username: string
    password: string
  }
  sidebar: {
    greetings: string
  }
  general: {
    notFound: string
    failed: string
  }
  resource: {
    management: string
    add: string
    list: string
    edit: string
    update: string
    show: string
    delete: string
    filter: string
    dataNotFound: string
    recordDeleted: string
    countRecordsFound: string
    actions: string
    fetching: string
  }
  db: {
    // db columns
    name: string
    price: string
    sku: string
    createdAt: string
    updatedAt: string
    images: string
    status: string
  }
  models?: {
    program: string
    logs: string
    app: string
  }
}

export type LanguageGroup = {
  [key: string]: Language
}

export type TranslateParams = {
  [key: string]: string
}
