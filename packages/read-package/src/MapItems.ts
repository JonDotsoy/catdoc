import * as TocPlus from "./toc-plus"

export class MapItems {
  #items = new Set<TocPlus.Element>()
  #keyTocIndex = new Map<TocPlus.Element["keyToc"], TocPlus.Element>()

  addItem(item: TocPlus.Element) {
    this.#items.add(item)
    this.#keyTocIndex.set(item.keyToc, item)
  }

  findByKeyToc(keyToc: TocPlus.Element["keyToc"]) {
    return this.#keyTocIndex.get(keyToc)
  }
}
