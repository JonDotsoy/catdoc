import * as toc from "sculltoc/schema"
import { MapItems } from "../MapItems"
import { TocPlus } from "../TocPlusTypes"
import path from "path"
import util from "util"

type Options = {
  baseDirectory: string
}

const asyncGeneratorToArray = async <
  T = unknown,
  TReturn = any,
  TNext = unknown
>(
  asyncGenerator: AsyncGenerator<T, TReturn, TNext>
) => {
  const yieldsResult: T[] = []
  let result: TReturn

  while (true) {
    const iteratorResult = await asyncGenerator.next()
    if (iteratorResult.done) {
      result = iteratorResult.value
      break
    }
    yieldsResult.push(iteratorResult.value)
  }

  return {
    yieldsResult,
    result,
  }
}

export class ReadToc {
  items?: TocPlus.Elements
  #toc: toc.TOC
  mapItems?: MapItems
  #options: Options

  constructor(toc: toc.TOC, options: Options) {
    this.#options = options
    this.#toc = toc
  }

  async prepare() {
    const resultTocPlusItems = await asyncGeneratorToArray(
      this.iterUris(this.#toc.items)
    )

    this.mapItems = resultTocPlusItems.result.mapItems
    this.items = resultTocPlusItems.yieldsResult

    return this
  }

  findItemByKeyToc(keyToc: string) {
    return this.mapItems?.findByKeyToc(keyToc)
  }

  async *iterUris(
    items: toc.TOC["items"],
    mapItems = new MapItems(),
    parentKey: string = "$"
  ): AsyncGenerator<TocPlus.Element, { mapItems: MapItems }> {
    let n = 0
    for (const item of items) {
      n += 1
      const keyToc = `${parentKey}.${n}`
      if (item.type === "item") {
        const nextItem: TocPlus.Item = await this.transformItem(keyToc, item)
        mapItems.addItem(nextItem)
        yield nextItem
      }
      if (item.type === "divider") {
        const nextItem: TocPlus.Divider = await this.transformDivider(
          keyToc,
          item
        )
        mapItems.addItem(nextItem)
        yield nextItem
      }
      if (item.type === "group") {
        const nextItem: TocPlus.Group = await this.transformGroup(
          keyToc,
          item,
          mapItems
        )
        mapItems.addItem(nextItem)
        yield nextItem
      }
    }

    return {
      mapItems,
    }
  }

  private async transformItem(
    keyToc: string,
    item: toc.Item
  ): Promise<TocPlus.Item> {
    const uri = path.resolve(this.#options.baseDirectory, item.uri)

    const newItem = new TocPlus.Item(keyToc, item, uri)
    return await newItem.prepare()
  }

  private async transformGroup(
    keyToc: string,
    item: toc.Group,
    mapItems: MapItems
  ): Promise<TocPlus.Group> {
    const resultAsyncGenerator = await asyncGeneratorToArray(
      this.iterUris(item.items, mapItems, keyToc)
    )

    return new TocPlus.Group(keyToc, item, resultAsyncGenerator.yieldsResult)
  }

  private async transformDivider(
    keyToc: string,
    item: toc.Divider
  ): Promise<TocPlus.Divider> {
    return new TocPlus.Divider(keyToc, item)
  }

  [util.inspect.custom]: util.CustomInspectFunction = (depth, options) => {
    return `ReadToc ${util.formatWithOptions(options, {
      items: this.items,
    })}`
  }

  static loadToc(toc: toc.TOC, options: Options) {
    return new ReadToc(toc, options)
  }
}
