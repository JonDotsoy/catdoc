jest.mock("fs/promises")
jest.mock("path")

import { Documentation } from "./Documentation"
import path from "path"
import util from "util"
import fs from "fs/promises"
import { format } from "./format"

describe("Documentation", () => {
  it("snapshot format", async () => {
    const { doc } = await createDoc()

    expect(format(doc)).toMatchSnapshot()
  })

  it("format to md", async () => {
    const { doc } = await createDoc()

    expect(JSON.stringify(doc, null, 2)).toMatchSnapshot()
  })
})

async function createDoc() {
  const fullPath = jest
    .requireActual("path")
    .resolve(`${__dirname}/../../../../demo/docs/demo-md.md`)
  const payload = await jest
    .requireActual("fs/promises")
    .readFile(fullPath, "utf-8")

  // @ts-ignore
  fs.readFile.mockResolvedValue(payload)
  // @ts-ignore
  path.relative.mockImplementation((...paths: any[]) => {
    const customInspect: util.CustomInspectFunction = () =>
      `path.relative(${paths.map((o) => typeof o).join(", ")})`

    return { [util.inspect.custom]: customInspect }
  })

  const doc = new Documentation(
    "$.0",
    { title: "a", type: "item", uri: "demo/docs/demo-md.md" },
    "/a/b/c/demo/docs/demo-md.md",
    "text/markdown",
    "utf-8",
    3000
  )

  await doc.prepare()

  return { doc, payload }
}
