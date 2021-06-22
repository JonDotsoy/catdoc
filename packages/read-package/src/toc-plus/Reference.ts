import path from "path"
import querystring from "querystring"
import util from "util"
import { Item } from "./Item"
import { OpenAPISpecification } from "../dto/openapi-specification"
import { dereference } from "@apidevtools/json-schema-ref-parser"
import { walkProperties } from "./walk-properties/walk-properties"
import { DocumentationInline } from "./Documentation"
import { MapKeyArr } from "./MapKeyArr"

export class Reference extends Item {
  api?: OpenAPISpecification
  mapPaths = new MapKeyArr<{ path: string[]; value: unknown }>()
  mapRefs = new Map<string, unknown>()

  async prepare() {
    this.api = (await dereference(this.uri)) as OpenAPISpecification

    await walkProperties(
      this.api,
      async (key, value, path) => {
        const ref = `#/${path.map((p) => querystring.escape(p)).join("/")}`
        this.mapRefs.set(ref, value)
        this.mapPaths.set(path, { path, value })

        try {
          if (
            typeof value === "object" &&
            "description" in value &&
            typeof value.description === "string"
          ) {
            const documentationInline = new DocumentationInline(
              this.keyToc,
              this._item,
              this.uri,
              this.contentType,
              this.charset,
              this.bytes
            )
            documentationInline.writePayloadMd(value["description"])
            await documentationInline.prepare()
            value.description = documentationInline
          }
          // console.log({ description: value['description'] })
        } catch (err) {
          if (err instanceof Error) {
            Object.assign(err, { value: value })
            Error.captureStackTrace(err, Reference.prototype.prepare)
          }
          throw err
        }
      },
      {
        propagation: "bubbling",
      }
    )

    return this
  }

  toJSON(): any {
    return {
      type: this.type,
      title: this.title,
      typeItem: "reference",
      api: this.api,
    }
  }

  [util.inspect.custom]: util.CustomInspectFunction = (depth, options) => {
    return `Reference ${util.formatWithOptions(options, {
      keyToc: this.keyToc,
      uri: path.relative(process.cwd(), this.uri),
      contentType: this.contentType,
      charset: this.charset,
      bytes: this.bytes,
      api: this.api,
    })}`
  }
}
