export interface Item {
  type: "item"
  title: string
  uri: string
}

export interface Group {
  type: "group"
  title: string
  items: (Item | Group | Divider)[]
}

export interface Divider {
  type: "divider"
  title: string
}

export interface Looktoc {
  $schema?: string
  items: (Item | Group | Divider)[]
}
