import * as toc from "looktoc/schema"
import { Common } from "./Common"

export class Item implements Common<toc.Item> {
  _item!: toc.Item
  keyToc!: string

  toJSON(): any {
    return new (class Item {})()
  }
}
