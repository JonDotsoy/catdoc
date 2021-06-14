import * as toc from "looktoc/schema"
import { MapItems } from "../MapItems"
import * as TocPlus from "../toc-plus"
import * as Divider from "../toc-plus/Divider"
import * as Group from "../toc-plus/Group"
import * as Item from "../toc-plus/Item"
import * as createItem from "../toc-plus/createItem"
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
  #toc: toc.Looktoc
  mapItems?: MapItems
  #options: Options

  constructor(toc: toc.Looktoc, options: Options) {
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
    items: toc.Looktoc["items"],
    mapItems = new MapItems(),
    parentKey: string = "$"
  ): AsyncGenerator<TocPlus.Element, { mapItems: MapItems }> {
    let n = 0
    for (const item of items) {
      n += 1
      const keyToc = `${parentKey}.${n}`
      if (item.type === "item") {
        const nextItem = await this.transformItem(keyToc, item)
        if (nextItem) {
          mapItems.addItem(nextItem)
          yield nextItem
        }
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
  ): Promise<TocPlus.Item | null> {
    const uri = path.resolve(this.#options.baseDirectory, item.uri)

    return await createItem.createItem(keyToc, item, uri)
  }

  private async transformGroup(
    keyToc: string,
    item: toc.Group,
    mapItems: MapItems
  ): Promise<TocPlus.Group> {
    const resultAsyncGenerator = await asyncGeneratorToArray(
      this.iterUris(item.items, mapItems, keyToc)
    )

    return new Group.Group(keyToc, item, resultAsyncGenerator.yieldsResult)
  }

  private async transformDivider(
    keyToc: string,
    item: toc.Divider
  ): Promise<TocPlus.Divider> {
    return new Divider.Divider(keyToc, item)
  }

  [util.inspect.custom]: util.CustomInspectFunction = (depth, options) => {
    return `ReadToc ${util.formatWithOptions(options, {
      items: this.items,
    })}`
  }

  static loadToc(toc: toc.Looktoc, options: Options) {
    return new ReadToc(toc, options)
  }
}
