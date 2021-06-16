import * as toc from "@catdoc/looktoc/schema"
import { Documentation } from "./Documentation"
import { ItemReader } from "./ItemReader"
import { Reference } from "./Reference"
import mimeTypes from "mime-types"
import fsSync from "fs"
import { Item } from "./Item"

const toMimeType = (v: any): string => {
  const mimeType = mimeTypes.lookup(v)

  if (!mimeType) throw new Error(`Cannon detect mime type of ${v}`)

  return mimeType
}

const toEncoding = (v: any): BufferEncoding => {
  if (Buffer.isEncoding(v)) return v
  return "utf-8"
}

export const createItem = async (
  keyToc: string,
  _item: toc.Item,
  uri: string
): Promise<Item> => {
  if (!fsSync.existsSync(uri)) throw new Error(`Cannot found file ${uri}`)
  const contentType = toMimeType(uri)
  const charset = toEncoding(contentType)
  const bytes = fsSync.statSync(uri).size

  switch (contentType) {
    case "text/markdown":
      return new Documentation(
        keyToc,
        _item,
        uri,
        contentType,
        charset,
        bytes
      ).prepare()
    case "application/json":
    case "text/yaml":
      return new Reference(
        keyToc,
        _item,
        uri,
        contentType,
        charset,
        bytes
      ).prepare()
    default:
      return new Item(keyToc, _item, uri, contentType, charset, bytes)
  }
}
