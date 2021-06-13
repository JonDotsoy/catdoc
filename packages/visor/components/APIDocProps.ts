import { TOC } from "sculltoc/schema"
import { Types } from "apidocsparser"

export interface APIDocProps {
  toc: TOC
  uris: string[]
  items: Types.TocPlus[]
  mapItems: Types.MapItems
}
