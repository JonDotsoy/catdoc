import path from "path"
import util from "util"
import { Item } from "./Item"
import fs from "fs/promises"
import marked, { Token, TokensList } from "marked"

export type DocumentationToken = Token & { tokens?: DocumentationToken[] }

function walkTokens(
  tokens: DocumentationToken[],
  fn: (this: DocumentationToken, token: DocumentationToken) => void
) {
  if (Array.isArray(tokens)) {
    tokens.forEach((token) => {
      fn.apply(token, [token])
      if ("tokens" in token && token.tokens) walkTokens(token.tokens, fn)
      if ("items" in token && token.items) walkTokens(token.items, fn)
    })
  }
}

function resolveHref(from: string, to: string) {
  if (/^(https?\:\/\/|\#)/i.test(to)) return to
  const dotHref = to.startsWith("../") || to.startsWith("./") ? to : `./${to}`
  return path.join(from, dotHref)
}

const isToken = (v: any): v is DocumentationToken =>
  typeof v === "object" &&
  typeof v.type === "string" &&
  typeof v.raw === "string"

function linkToMd(key: string, linkBody: any): any {
  return `[${key}]: ${
    linkBody.title ? `${linkBody.href} "${linkBody.title}"` : linkBody.href
  }\n`
}

function tokenToMd(token: any): any {
  if (isToken(token)) {
    const tokensMd = (bodyDefault?: string) =>
      token.tokens?.map(tokenToMd).join("") ?? bodyDefault ?? ""
    const endLine = () => /(\n+)$/.exec(token.raw)?.[1] ?? "\n"
    const captureSymbol = () =>
      /^(\~{1,2}|\_{1,2}|\*{1,2})/.exec(token.raw)?.[1] ?? "_"

    switch (token.type) {
      case "heading":
        return `${"#".repeat(token.depth)} ${tokensMd(token.text)}${endLine()}`
      case "link":
        return `[${tokensMd(token.text)}](${
          token.title ? `${token.href} "${token.title}"` : token.href
        })`
      case "image":
        return `![${tokensMd(token.text)}](${
          token.title ? `${token.href} "${token.title}"` : token.href
        })`
      case "paragraph":
        return tokensMd()
      case "list":
        return token.items.map(tokenToMd).join("")
      case "list_item":
        return `- ${tokensMd()}${endLine()}`
      case "em":
      case "del":
      case "strong":
        return `${captureSymbol()}${tokensMd()}${captureSymbol()}`
      case "blockquote":
        return token.tokens
          ?.map(
            (token) => `> ${token.tokens?.map(tokenToMd).join("") ?? ""} end\n`
          )
          .join("")

      case "text":
      case "space":
      case "codespan":
      case "code":
      case "hr":
        return token.raw
    }
  }

  return ""
}

export class Documentation extends Item {
  tokens?: DocumentationToken[]
  html?: string
  links?: TokensList["links"]

  async readPayloadMd() {
    return await fs.readFile(this.uri, this.charset)
  }

  async prepare() {
    const payloadMd = await this.readPayloadMd()
    const tokens = marked.lexer(payloadMd)

    walkTokens(tokens, (token) => {
      if ("href" in token) {
        const href = token.href
        const fullHref = resolveHref(path.dirname(this.uri), href)

        token.href = fullHref
      }
    })

    this.tokens = tokens
    this.links = tokens.links

    return this
  }

  toJSON(): any {
    return {
      type: this.type,
      title: this.title,
      typeItem: "documentation",
      tokens: this.tokens,
      links: this.links,
    }
  }

  [util.inspect.custom]: util.CustomInspectFunction = (depth, options) => {
    return `Documentation ${util.formatWithOptions(options, {
      keyToc: this.keyToc,
      uri: path.relative(process.cwd(), this.uri),
      contentType: this.contentType,
      charset: this.charset,
      bytes: this.bytes,
      tokens: this.tokens,
      links: this.links,
    })}`
  }
}

export class DocumentationInline extends Documentation {
  private payloadInline?: string

  writePayloadMd(data: string) {
    this.payloadInline = data
  }

  async readPayloadMd() {
    // console.log(this.payloadInline)
    if (this.payloadInline === undefined)
      throw new Error(`Require call DocumentationInline.writePayloadMd(data)`)
    return this.payloadInline
  }
}
