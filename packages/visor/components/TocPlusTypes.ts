import { Group as TocGroup, Item as TocItem, Divider as TocDivider } from 'sculltoc/schema';


export type TocPlusCommon = { keyToc: string; };
export type TocPlusItem = TocItem & TocPlusCommon & { uriCode: string };
export type TocPlusDivider = TocDivider & TocPlusCommon;
export type TocPlusGroup = TocGroup & TocPlusCommon & { itemsPlus: TocPlus[]; };
export type TocPlus = TocPlusGroup | TocPlusItem | TocPlusDivider;
export type TocPlusItems = TocPlus[];

export type MapItems = {
    listItems: TocPlus[],
    mapKeys: { [k: string]: TocPlus }
    mapUris: { [k: string]: TocPlus }
    uris: string[],
    keysToc: string[],
}
