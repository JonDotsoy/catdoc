import * as toc from "@catdoc/looktoc/schema"
import util from "util"
import { Common } from "./Common"

export class Divider implements Common<toc.Divider> {
  readonly type = "divider"
  readonly title: string

  constructor(readonly keyToc: string, readonly _item: toc.Divider) {
    this.title = _item.title
  }

  toJSON(): any {
    return {
      type: this.type,
      title: this.title,
    }
  }

  [util.inspect.custom]: util.CustomInspectFunction = (depth, options) => {
    return `Group ${util.formatWithOptions(options, {
      keyToc: this.keyToc,
      title: this.title,
    })}`
  }
}
