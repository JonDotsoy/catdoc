import * as toc from "looktoc/schema"
import util from "util"
import { Common } from "./Common"
import { Element } from "."

export class Group implements Common<toc.Group> {
  readonly type = "group"
  readonly title: string

  constructor(
    readonly keyToc: string,
    readonly _item: toc.Group,
    readonly items: Element[]
  ) {
    this.title = _item.title
  }

  toJSON(): any {
    return new (class Group {})()
  }

  [util.inspect.custom]: util.CustomInspectFunction = (depth, options) => {
    return `Group ${util.formatWithOptions(options, {
      keyToc: this.keyToc,
      title: this.title,
      items: this.items,
    })}`
  }
}
