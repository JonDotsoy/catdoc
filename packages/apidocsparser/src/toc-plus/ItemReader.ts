import * as toc from "looktoc/schema"
import fs from "fs/promises"
import mimeTypes from "mime-types"
import YAML from "yaml"
import $RefParser, { dereference } from "json-schema-ref-parser"
import path from "path"
import util from "util"
import { Item } from "./Item"

export class ItemReader extends Item {
  ["content-type"]?: string
  charset?: string
  bytes?: number
  #body?: Buffer | $RefParser.JSONSchema

  constructor(
    readonly keyToc: string,
    readonly _item: toc.Item,
    readonly uri: string
  ) {
    super()
    this["content-type"] = mimeTypes.lookup(uri) || undefined
    this["charset"] = this["content-type"]
      ? mimeTypes.charset(this["content-type"]) || undefined
      : undefined
  }

  async prepare() {
    await this.readBuffer()
    return this
  }

  get body() {
    return this.#body
  }

  toJSON() {
    return this.body
  }

  stringifyJson(
    replacer?: ((this: any, key: string, value: any) => any) | undefined,
    space?: string | number | undefined
  ) {
    return JSON.stringify(this.toJSON(), replacer, space ?? 2)
  }

  stringifyYaml(options?: YAML.Options | undefined) {
    return YAML.stringify(this.toJSON(), options)
  }

  async readBuffer() {
    const buffer = await fs.readFile(this.uri)
    this.bytes = buffer.length

    this.#body = await this.resolveRefs(
      this.updateRefProp(this.parseBody(buffer))
    )
  }

  private updateRefProp(body: any) {
    const intent = (
      obj: any,
      prop?: string,
      descriptor?: TypedPropertyDescriptor<any> & PropertyDescriptor,
      updateValue?: (newVal: any) => void
    ) => {
      if (typeof obj === "object" && !(obj instanceof Buffer)) {
        const entries = Object.entries(Object.getOwnPropertyDescriptors(obj))

        entries.forEach(([key, descriptor]) => {
          intent(descriptor.value, key, descriptor, (newVal) => {
            obj[key] = newVal
          })
        })

        return
      }
      if (prop === "$ref" && typeof obj === "string" && updateValue) {
        const parsed = path.parse(obj)
        if (!parsed.dir.startsWith("#")) {
          updateValue(path.join(`${path.dirname(this.uri)}`, `${obj}`))
        }
      }
    }
    intent(body)
    return body
  }

  private parseBody(buffer: Buffer) {
    const getEncoding = () => {
      if (this.charset && Buffer.isEncoding(this.charset)) {
        return this.charset
      }
      return "utf8"
    }
    if (this["content-type"] === "application/json")
      return JSON.parse(buffer.toString(getEncoding()))
    if (this["content-type"] === "text/yaml")
      return YAML.parse(buffer.toString(getEncoding()))
    return buffer
  }

  private async resolveRefs(body: any) {
    if (body instanceof Buffer) return body

    const res = await dereference(body)

    return res
  }

  [util.inspect.custom]: util.CustomInspectFunction = (depth, options) => {
    return `ItemReader ${util.formatWithOptions(options, {
      keyToc: this.keyToc,
      uri: path.relative(process.cwd(), this.uri),
      "content-type": this["content-type"],
      charset: this.charset,
      bytes: this.bytes,
    })}`
  }
}
