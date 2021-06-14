import { ReadPackage } from "./ReadPackage"
import util from "util"
import * as TocPlus from "./toc-plus"
import * as Item from "./toc-plus/Item"

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
      expect(JSON.stringify(readPackage)).toMatchSnapshot()
    })

    it("should parse references", async () => {
      const readPackage = await ReadPackage.readPackage(pathDemoRepo).prepare()

      const item = readPackage.findItemByKeyToc("$.3")

      expect(item).toBeDefined()
      // expect(item!.stringifyYaml()).toMatchSnapshot()
      // expect(item!.stringifyJson()).toMatchSnapshot()
    })
  })
})
