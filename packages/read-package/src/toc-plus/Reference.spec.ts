import { format } from "./format"
import { Reference } from "./Reference"
import YAML from "yaml"
import fs from "fs"
import path from "path"

describe("Reference", () => {
  it("", async () => {
    const { reference } = await readReference()

    expect(format(reference.mapPaths)).toMatchSnapshot()
  })

  it("Read Reference", async () => {
    const { reference } = await readReference()

    expect(format(reference)).toMatchSnapshot()
  })

  it("shoud make export", async () => {
    const { reference } = await readReference()

    expect(JSON.stringify(reference, null, 2)).toMatchSnapshot()
    expect(YAML.stringify(reference)).toMatchSnapshot()
    fs.writeFileSync(
      `${__dirname}/__snapshots__/${path.basename(__filename)}.demo.yaml`,
      YAML.stringify(reference)
    )
  })
})

async function readReference() {
  const p = `${__dirname}/../../../../demo/reference/hola2.yaml`

  const reference = new Reference(
    "$.1",
    { title: "Hola", type: "item", uri: "reference/hola2.yaml" },
    p,
    "application/json",
    "utf-8",
    3000
  )

  await reference.prepare()

  return {
    reference,
  }
}
