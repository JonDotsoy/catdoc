/**
 * Validation schema for OpenAPI Specification 3.0.X.
 */
export interface OpenAPISpecification {
  components?: Components
  externalDocs?: OpenAPISpecificationExternalDocs
  info: Info
  jsonSchemaDialect?: string
  openapi: string
  paths?: { [key: string]: any }
  security?: { [key: string]: string[] }[]
  servers?: ServerElement[]
  tags?: TagElement[]
  webhooks?: { [key: string]: any }
}

export interface Components {
  callbacks?: { [key: string]: any }
  examples?: { [key: string]: any }
  headers?: { [key: string]: any }
  links?: { [key: string]: any }
  parameters?: { [key: string]: any }
  pathItems?: { [key: string]: any }
  requestBodies?: { [key: string]: any }
  responses?: { [key: string]: any }
  schemas?: { [key: string]: any }
  securitySchemes?: { [key: string]: any }
}

export interface OpenAPISpecificationExternalDocs {
  description?: string
  url: string
}

export interface Info {
  contact?: Contact
  description?: string
  license?: License
  summary?: string
  termsOfService?: string
  title: string
  version: string
}

export interface Contact {
  email?: string
  name?: string
  url?: string
}

export interface License {
  identifier?: string
  name: string
  url?: string
}

export interface ServerElement {
  description?: string
  url: string
  variables?: { [key: string]: VariableValue }
}

export interface VariableValue {
  default: string
  descriptions?: string
  enum?: string[]
}

export interface TagElement {
  description?: string
  externalDocs?: TagExternalDocs
  name: string
}

export interface TagExternalDocs {
  description?: string
  url: string
}
