import path from "path"
import util from "util"
import { ItemReader } from "./ItemReader"
import { Item } from "./Item"
import { Openapi } from "../dto/openapi"

export class Reference extends Item {
  readonly keyToc = this.itemReader.keyToc
  readonly _item = this.itemReader._item
  readonly charset = this.itemReader.charset;
  readonly ["content-type"] = this.itemReader["content-type"]
  readonly bytes = this.itemReader.bytes
  readonly uri = this.itemReader.uri
  openapiVersion?: string
  info: { title?: string; description?: string; version?: string }
  paths: {
    title: string
    description?: string
    path: string
    method: string
  }[]
  schemas: {
    title: string
  }[]
  body: Openapi

  constructor(private itemReader: ItemReader) {
    super()

    const body =
      typeof this.itemReader.body === "object" &&
      !(this.itemReader.body instanceof Buffer)
        ? (this.itemReader.body as Openapi)
        : null
    if (!body) throw new Error("cannot found parse")
    this.body = body
    this.openapiVersion = body.openapi
    this.info = body.info
    const paths: Reference["paths"] = []
    const schemas: Reference["schemas"] = []

    Object.entries<{ [method: string]: any }>(body.paths ?? {}).forEach(
      ([path, methods]) => {
        return Object.entries<{ summary?: string; description?: string }>(
          methods
        ).forEach(([method, obj]) => {
          if (method !== "parameters") {
            paths.push({
              path,
              method,
              title: obj.summary ?? path,
              description: obj.description,
            })
          }
        })
      }
    )

    Object.entries<{ title?: string }>(body.components?.schemas ?? {}).forEach(
      ([schemaName, obj]) => {
        schemas.push({
          title: obj.title ?? schemaName,
        })
      }
    )

    this.paths = paths
    this.schemas = schemas
  }

  [util.inspect.custom]: util.CustomInspectFunction = (depth, options) => {
    return `Reference ${util.formatWithOptions(options, {
      keyToc: this.keyToc,
      uri: path.relative(process.cwd(), this.uri),
      "content-type": this["content-type"],
      charset: this.charset,
      bytes: this.bytes,
      openapiVersion: this.openapiVersion,
      info: this.info,
      paths: this.paths,
      schemas: this.schemas,
    })}`
  }
}
