import path from "path"
import util from "util"
import { Item } from "./Item"
import fs from "fs/promises"
import marked, { Token, TokensList } from "marked"
import { values } from "lodash"
import { link } from "fs"

function walkTokens(tokens: Token[], fn: (this: Token, token: Token) => void) {
  tokens.forEach((token) => {
    fn.apply(token, [token])
    if ("tokens" in token && token.tokens) walkTokens(token.tokens, fn)
    if ("items" in token && token.items) walkTokens(token.items, fn)
  })
}

function resolveHref(from: string, to: string) {
  if (/https?\:\/\//i.test(to)) return to
  const dotHref = to.startsWith("../") || to.startsWith("./") ? to : `./${to}`
  return path.join(from, dotHref)
}

export class Documentation extends Item {
  tokens?: Token[]
  html?: string

  async prepare() {
    const payloadMd = await fs.readFile(this.uri, this.charset)
    const tokens = marked.lexer(payloadMd)

    walkTokens(tokens, (token) => {
      if ("href" in token) {
        const href = token.href
        const fullHref = resolveHref(path.dirname(this.uri), href)

        token.href = fullHref
      }
    })

    this.tokens = tokens

    this.html = marked.parser(tokens, {
      headerIds: true,
      baseUrl: "local",
    })

    return this
  }

  toMarkdown() {
    return this.tokens?.map((token) => token.raw).join("")
  }

  toJSON(): any {
    return new (class Documentation {})()
  }

  [util.inspect.custom]: util.CustomInspectFunction = (depth, options) => {
    return `Documentation ${util.formatWithOptions(options, {
      keyToc: this.keyToc,
      uri: path.relative(process.cwd(), this.uri),
      contentType: this.contentType,
      charset: this.charset,
      bytes: this.bytes,
      tokens: this.tokens,
      html: this.html,
    })}`
  }
}
