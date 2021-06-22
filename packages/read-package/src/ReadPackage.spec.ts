import { ReadPackage } from "./ReadPackage"
import util from "util"
import path from "path"
import * as TocPlus from "./toc-plus"
import * as Item from "./toc-plus/Item"
import YAML from "yaml"
import { writeFileSync } from "fs"

const format = (format?: any, ...param: any[]) =>
  util.formatWithOptions(
    { depth: Infinity, maxArrayLength: Infinity },
    format,
    ...param
  )

const pathDemoRepo = `${__dirname}/../../../demo`

describe("ReadPackage", () => {
  describe("", () => {
    it("should create a read package instance", async () => {
      await ReadPackage.readPackage(pathDemoRepo).prepare()
    })

    it("should return the item with the method `findItemByKeyToc`", async () => {
      const readPackage = await ReadPackage.readPackage(pathDemoRepo).prepare()

      const itemFound = readPackage.findItemByKeyToc("$.1.1")

      expect(itemFound).toBeInstanceOf(Item.Item)
    })

    it("should return an undefined if not found item", async () => {
      const readPackage = await ReadPackage.readPackage(pathDemoRepo).prepare()

      const itemFound = readPackage.findItemByKeyToc("this not exists")

      expect(itemFound).toBeUndefined()
    })

    it("should print a detail read package", async () => {
      const readPackage = await ReadPackage.readPackage(pathDemoRepo).prepare()

      expect(format(readPackage)).toMatchSnapshot()
      expect(readPackage).toMatchSnapshot()
      expect(YAML.stringify(readPackage)).toMatchSnapshot()
    })

    it("should export catdoc file", async () => {
      const readPackage = await ReadPackage.readPackage(pathDemoRepo).prepare()

      writeFileSync(
        `${__dirname}/__snapshots__/${path.basename(__filename)}.out.yaml`,
        YAML.stringify(readPackage)
      )
    })

    it("should parse references", async () => {
      const readPackage = await ReadPackage.readPackage(pathDemoRepo).prepare()

      const item = readPackage.findItemByKeyToc("$.3")

      expect(item).toBeDefined()
    })
  })
})
