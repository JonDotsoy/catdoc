import * as toc from "@catdoc/looktoc/schema"
import { Common } from "./Common"
import util from "util"
import path from "path"

export class Item implements Common<toc.Item> {
  readonly type = this._item.type
  readonly title = this._item.title

  constructor(
    readonly keyToc: string,
    readonly _item: toc.Item,
    readonly uri: string,
    readonly contentType: string,
    readonly charset: BufferEncoding,
    readonly bytes: number
  ) {}

  toJSON(): any {
    return {
      type: this.type,
      title: this.title,
    }
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
