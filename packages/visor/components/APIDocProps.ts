import { TOC } from "sculltoc/schema";
import { MapItems, TocPlus } from "./TocPlusTypes";

export interface APIDocProps {
    toc: TOC;
    uris: string[];
    items: TocPlus[];
    mapItems: MapItems;
}
