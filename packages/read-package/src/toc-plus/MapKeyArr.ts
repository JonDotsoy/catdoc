import YAML from "yaml"
import querystring from "querystring"
const isSymbolObject = (v: any): v is Symbol => typeof v === "symbol"

export const keySymbol = Symbol("KEY")
export type pathKeysMap = Map<any, pathKeysMap | Symbol>

export class MapKeyArr<T = any> {
  private pathKeys: any = new Map<any, any>()
  private map = new Map<Symbol, T>()

  private findPathKeys(path: any[]) {
    let currentPathKeys: pathKeysMap = this.pathKeys

    for (const p of path) {
      const found = currentPathKeys.get(p)
      if (found instanceof Map) {
        currentPathKeys = found
      } else {
        const newPathKeys: pathKeysMap = new Map()
        currentPathKeys.set(p, newPathKeys)
        currentPathKeys = newPathKeys
      }
    }

    const keyFound = currentPathKeys.get(keySymbol)

    if (isSymbolObject(keyFound)) return keyFound

    const newKeyFound: Symbol = Symbol(
      path
        .map((e) => (typeof e === "string" ? e : JSON.stringify(e)))
        .map((e) => querystring.escape(e))
        .join("/")
    )

    currentPathKeys.set(keySymbol, newKeyFound)

    return newKeyFound
  }

  toKey(path: any[]) {
    return this.findPathKeys(path)
  }

  set(k: any[], value: T) {
    this.map.set(this.toKey(k), value)
    return this
  }

  get(k: any[]) {
    return this.map.get(this.toKey(k))
  }
}
