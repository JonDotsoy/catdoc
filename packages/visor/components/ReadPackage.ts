import getConfig from 'next/config';
import fs from 'fs';
import { TOC } from 'sculltoc/schema';
import YAML from 'yaml';
import { TocPlus, TocPlusItem, TocPlusDivider, TocPlusGroup, MapItems } from './TocPlusTypes';
import once from 'lodash/once';

export class ReadPackage {
    toc: TOC;
    uris: string[];
    items: TocPlus[];
    mapItems: MapItems;

    private constructor(private pathLike: string) { }

    readTocFile() {
        const pathLikeTocJson = `${this.pathLike}/toc.json`;
        const pathLikeTocYaml = `${this.pathLike}/toc.yaml`;
        const pathLikeTocYml = `${this.pathLike}/toc.yml`;
        const tocFile = fs.existsSync(pathLikeTocJson)
            ? { format: 'json', pathLike: pathLikeTocJson }
            : fs.existsSync(pathLikeTocYaml)
                ? { format: 'yaml', pathLike: pathLikeTocYaml }
                : fs.existsSync(pathLikeTocYml)
                    ? { format: 'yaml', pathLike: pathLikeTocYml }
                    : null;

        if (!tocFile) return null;

        const bf = fs.readFileSync(tocFile.pathLike, 'utf-8');

        const body: TOC | null = tocFile.format === 'json' ? JSON.parse(bf) : tocFile.format === 'yaml' ? YAML.parse(bf) : null;

        if (!body) return null;


        const iterUris = function* (items: TOC['items'], mapItems: MapItems, parentKey: string): Generator<TocPlus> {
            let n = 0;
            for (const item of items) {
                n += 1;
                const keyToc = `${parentKey}.${n}`;
                if (item.type === 'item') {
                    const newItem: TocPlusItem = {
                        ...item,
                        keyToc,
                        uriCode: keyToc,
                    }
                    mapItems.uris.push(newItem.uri);
                    mapItems.listItems.push(newItem);
                    mapItems.mapKeys[keyToc] = newItem;
                    mapItems.mapUris[newItem.uri] = newItem;
                    mapItems.keysToc.push(keyToc);
                    yield newItem;
                }
                if (item.type === 'divider') {
                    const newItem: TocPlusDivider = {
                        ...item,
                        keyToc,
                    }
                    mapItems.listItems.push(newItem);
                    yield newItem;
                }
                if (item.type === 'group') {
                    const newItem: TocPlusGroup = {
                        ...item,
                        keyToc,
                        itemsPlus: [...iterUris(item.items, mapItems, keyToc)],
                    }
                    mapItems.listItems.push(newItem);
                    yield newItem;
                }
            }
        }

        const mapItems: MapItems = { listItems: [], uris: [], mapKeys: {}, mapUris: {}, keysToc: [] };
        const nextItems = [...iterUris(body.items, mapItems, '$')];

        return {
            mapItems,
            items: nextItems,
            uris: [],
            body,
            meta: {
                ...tocFile,
            }
        }
    }

    prepareToc = once(async () => {
        const tocFile = this.readTocFile();
        this.mapItems = tocFile.mapItems;
        this.items = tocFile.items;
        this.uris = tocFile.uris;
        this.toc = tocFile.body;
    })

    static readPackage = (k: string) => new ReadPackage(k)
}

export const generalReadPackage = ReadPackage.readPackage(getConfig().serverRuntimeConfig.pathRepo);
