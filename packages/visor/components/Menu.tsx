import { FC, useContext } from "react";
import { APIDocContext } from "./APIDocContext";
import { Menu, Divider } from 'antd';
import { TOC } from "sculltoc/schema";
import { APIDocProps } from "./APIDocProps";
import Link from 'next/link';
import { useRouter } from 'next/router';

export const ListItems: FC<{ items: APIDocProps['items'] }> = ({ items }) => {
    return <>
        {items.map((item, key) => {
            if (item.type === 'item')
                return <Menu.Item key={item.keyToc}><Link href={`/r/[keyToc]`} as={`/r/${item.uriCode}`}><a>{item.title}</a></Link></Menu.Item>;

            if (item.type === 'divider')
                return <Menu.Item key={item.keyToc}><Divider orientation="left">{item.title}</Divider></Menu.Item>

            if (item.type === 'group')
                return <Menu.SubMenu key={item.keyToc} title={item.title}><ListItems items={item.itemsPlus}></ListItems></Menu.SubMenu>
        })}
    </>
}

export const MenuElm: FC = () => {
    const toStr = (v) => typeof v === 'string' ? v : undefined
    const keyToc = toStr(useRouter().query.keyToc);
    const { items } = useContext(APIDocContext);

    console.log(keyToc ? [keyToc]: undefined)
    
    return <Menu selectedKeys={keyToc ? [keyToc]: undefined}>
        <ListItems items={items}></ListItems>
    </Menu>
}