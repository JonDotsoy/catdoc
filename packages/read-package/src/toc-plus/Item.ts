import * as toc from "@catdoc/looktoc/schema"
import { Common } from "./Common"
import util from "util"
import path from "path"

export class Item implements Common<toc.Item> {
  constructor(
    readonly keyToc: string,
    readonly _item: toc.Item,
    readonly uri: string,
    readonly contentType: string,
    readonly charset: BufferEncoding,
    readonly bytes: number
  ) {}

  toJSON(): any {
    return new (class Item {})()
  }

  [util.inspect.custom]: util.CustomInspectFunction = (depth, options) => {
    return `Item ${util.formatWithOptions(options, {
      keyToc: this.keyToc,
      uri: path.relative(process.cwd(), this.uri),
      contentType: this.contentType,
      charset: this.charset,
      bytes: this.bytes,
    })}`
  }
}
