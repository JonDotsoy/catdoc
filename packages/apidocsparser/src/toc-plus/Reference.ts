import path from "path"
import util from "util"
import { ItemReader } from "./ItemReader"
import { Item } from "./Item"

export class Reference extends Item {
  readonly keyToc = this.itemReader.keyToc
  readonly _item = this.itemReader._item
  readonly charset = this.itemReader.charset;
  readonly ["content-type"] = this.itemReader["content-type"]
  readonly bytes = this.itemReader.bytes
  readonly uri = this.itemReader.uri

  constructor(private itemReader: ItemReader) {
    super()
  }

  [util.inspect.custom]: util.CustomInspectFunction = (depth, options) => {
    return `Reference ${util.formatWithOptions(options, {
      keyToc: this.keyToc,
      uri: path.relative(process.cwd(), this.uri),
      "content-type": this["content-type"],
      charset: this.charset,
      bytes: this.bytes,
    })}`
  }
}
