import { MapKeyArr } from "./MapKeyArr"

describe("", () => {
  it("should compare keys", () => {
    const m = new MapKeyArr()

    expect(m.toKey(["hola", true, true, 1, false])).toStrictEqual(
      m.toKey(["hola", true, true, 1, false])
    )
  })
})
