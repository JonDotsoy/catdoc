import * as toc from "@catdoc/looktoc/schema"
import fsSync from "fs"
import fs from "fs/promises"
import mimeTypes from "mime-types"
import YAML from "yaml"
import $RefParser, { dereference } from "json-schema-ref-parser"
import path from "path"
import util from "util"
import { Item } from "./Item"
import { union } from "lodash"

const toEncoding = (v: any): BufferEncoding => {
  if (Buffer.isEncoding(v)) return v
  return "utf-8"
}

export class ItemReader extends Item {
  // constructor(
  //   readonly keyToc: string,
  //   readonly _item: toc.Item,
  //   readonly uri: string,
  //   readonly contentType: string,
  //   readonly charset: BufferEncoding,
  //   readonly bytes: string,
  //   readonly payload: any,
  // ) {
  //   super()
  //   //   // this[""] = mimeTypes.lookup(uri) || undefined
  //   //   // this.charset = toEncoding(this["contentType"]
  //   //   ? mimeTypes.charset(this["contentType"]) || undefined
  //   //   : undefined)
  //   // if (!fsSync.existsSync(uri)) throw new Error(`Cannot found file ${uri}`)
  //   // this.payload = fs.readFile(uri, this.charset)
  // }

  // private async readBuffer() {
  //   // this.buffer = await fs.readFile(this.uri)
  //   // this.bytes = this.buffer.length
  // }

  // private updateRefProp(body: any) {
  //   const intent = (
  //     obj: any,
  //     prop?: string,
  //     descriptor?: TypedPropertyDescriptor<any> & PropertyDescriptor,
  //     updateValue?: (newVal: any) => void
  //   ) => {
  //     if (typeof obj === "object" && !(obj instanceof Buffer)) {
  //       const entries = Object.entries(Object.getOwnPropertyDescriptors(obj))

  //       entries.forEach(([key, descriptor]) => {
  //         intent(descriptor.value, key, descriptor, (newVal) => {
  //           obj[key] = newVal
  //         })
  //       })

  //       return
  //     }
  //     if (prop === "$ref" && typeof obj === "string" && updateValue) {
  //       const parsed = path.parse(obj)
  //       if (!parsed.dir.startsWith("#")) {
  //         updateValue(path.join(`${path.dirname(this.uri)}`, `${obj}`))
  //       }
  //     }
  //   }
  //   intent(body)
  //   return body
  // }

  // private parseBody(buffer: Buffer) {
  //   const getEncoding = () => {
  //     if (this.charset && Buffer.isEncoding(this.charset)) {
  //       return this.charset
  //     }
  //     return "utf8"
  //   }
  //   if (this["contentType"] === "application/json")
  //     return JSON.parse(buffer.toString(getEncoding()))
  //   if (this["contentType"] === "text/yaml")
  //     return YAML.parse(buffer.toString(getEncoding()))
  //   return buffer
  // }

  // private async resolveRefs(body: any) {
  //   if (body instanceof Buffer) return body

  //   const res = await dereference(body)

  //   return res
  // }

  [util.inspect.custom]: util.CustomInspectFunction = (depth, options) => {
    return `ItemReader ${util.formatWithOptions(options, {
      keyToc: this.keyToc,
      uri: path.relative(process.cwd(), this.uri),
      "content-type": this["contentType"],
      charset: this.charset,
      bytes: this.bytes,
    })}`
  }
}
