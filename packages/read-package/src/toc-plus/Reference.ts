import path from "path"
import util from "util"
import { ItemReader } from "./ItemReader"
import { Item } from "./Item"
import { OpenAPISpecification } from "../dto/openapi-specification"
import { dereference } from "@apidevtools/json-schema-ref-parser"

export class Reference extends Item {
  api?: OpenAPISpecification

  async prepare() {
    this.api = (await dereference(this.uri)) as OpenAPISpecification
    return this
  }

  toJSON(): any {
    return new (class Reference {})()
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
