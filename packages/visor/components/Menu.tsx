import { FC, useContext } from "react"
import { APIDocContext } from "./APIDocContext"
import { Menu, Divider } from "antd"
import { TOC } from "sculltoc/schema"
import { APIDocProps } from "./APIDocProps"
import Link from "next/link"
import { useRouter } from "next/router"

export const listItems = ({ items }: { items: APIDocProps["items"] }) =>
  items.map((item, key) => {
    if (item.type === "item")
      return (
        <Menu.Item key={item.keyToc}>
          <Link href={`/r/[keyToc]`} as={`/r/${item.uriCode}`}>
            <a>{item.title}</a>
          </Link>
        </Menu.Item>
      )

    if (item.type === "divider")
      return (
        <Menu.ItemGroup key={item.keyToc} title={item.title}></Menu.ItemGroup>
      )

    if (item.type === "group")
      return (
        <Menu.SubMenu key={item.keyToc} title={item.title}>
          {listItems({ items: item.itemsPlus })}
        </Menu.SubMenu>
      )
  })

export const MenuElm: FC = () => {
  const toStr = (v) => (typeof v === "string" ? v : undefined)
  const keyToc = toStr(useRouter().query.keyToc)
  const { items } = useContext(APIDocContext)

  return (
    <Menu
      mode="inline"
      selectedKeys={keyToc ? [keyToc] : undefined}
      defaultSelectedKeys={keyToc ? [keyToc] : undefined}
      inlineCollapsed
    >
      {listItems({ items })}
    </Menu>
  )
}
