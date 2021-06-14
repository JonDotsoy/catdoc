import fs from "fs"
import yaml from "yaml"
import once from "lodash/once"
import { ReadToc } from "./lib/iterUris"
import path from "path"
import { TOCFormats } from "./dto/TOCFormats"
import * as TocPlus from "./toc-plus"
import * as Item from "./toc-plus/Item"
import util from "util"

export class ReadPackage {
  pathLike: string
  toc: ReadToc | undefined

  private constructor(pathLike: string) {
    this.pathLike = path.resolve(pathLike)
    const isFolder =
      fs.existsSync(pathLike) && fs.statSync(pathLike).isDirectory()

    if (!isFolder) {
      const err = new TypeError(`Path ${pathLike} is not a directory`)
      Error.captureStackTrace(err, ReadPackage.readPackage)
      throw err
    }
  }

  async prepareLoadToc() {
    const tocFileReaded = this.readTocFile()

    if (!tocFileReaded) return null

    return {
      toc: await ReadToc.loadToc(tocFileReaded.body, {
        baseDirectory: this.pathLike,
      }).prepare(),
    }
  }

  prepare = once(async () => {
    const tocLoaded = await this.prepareLoadToc()

    this.toc = tocLoaded?.toc

    return this
  })

  static readPackage = (k: string) => new ReadPackage(k)

  private readTocFile() {
    const tocFileDetected = this.detectTocFile()

    if (tocFileDetected?.format === TOCFormats.JSON)
      return {
        ...tocFileDetected,
        body: JSON.parse(fs.readFileSync(tocFileDetected.path, "utf-8")),
      }
    if (tocFileDetected?.format === TOCFormats.YAML)
      return {
        ...tocFileDetected,
        body: yaml.parse(fs.readFileSync(tocFileDetected.path, "utf-8")),
      }

    return null
  }

  private detectTocFile() {
    const pathLikeTocJson = `${this.pathLike}/toc.json`
    const pathLikeTocYaml = `${this.pathLike}/toc.yaml`
    const pathLikeTocYml = `${this.pathLike}/toc.yml`

    if (fs.existsSync(pathLikeTocJson))
      return { format: TOCFormats.JSON, path: pathLikeTocJson }
    if (fs.existsSync(pathLikeTocYaml))
      return { format: TOCFormats.YAML, path: pathLikeTocYaml }
    if (fs.existsSync(pathLikeTocYml))
      return { format: TOCFormats.YAML, path: pathLikeTocYml }

    return null
  }

  findByKeyToc(keyToc: string) {
    return this.toc?.findItemByKeyToc(keyToc)
  }

  findItemByKeyToc(keyToc: string) {
    const item = this.toc?.findItemByKeyToc(keyToc)
    if (item instanceof Item.Item) return item
  }

  toJSON(): any {
    return new (class ReadPackage {})()
  }

  [util.inspect.custom]: util.CustomInspectFunction = (depth, options) => {
    return `ReadPackage ${util.formatWithOptions(options, {
      path: path.relative(process.cwd(), this.pathLike),
      toc: this.toc,
    })}`
  }
}
