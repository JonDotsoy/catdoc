export interface Item {
  type: "item"
  title: string
  uri: string
}

export interface Group {
  type: "group"
  title: string
  items: TOC["items"]
}

export interface Divider {
  type: "divider"
  title: string
}

export interface TOC {
  items: (Item | Group | Divider)[]
}
