import * as toc from "looktoc/schema"
import { Documentation } from "./Documentation"
import { ItemReader } from "./ItemReader"
import { Reference } from "./Reference"

export const createItem = async (
  keyToc: string,
  _item: toc.Item,
  uri: string
) => {
  const itemReader = new ItemReader(keyToc, _item, uri)
  await itemReader.prepare()

  switch (itemReader["content-type"]) {
    case "text/markdown":
      return new Documentation(itemReader)
    case "application/json":
    case "text/yaml":
      return new Reference(itemReader)
    default:
      return null
  }
}
