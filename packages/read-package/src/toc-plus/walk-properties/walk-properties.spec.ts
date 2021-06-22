import { promisify } from "util"
import { walkProperties } from "./walk-properties"
import { walkPropertiesSync } from "./walk-properties-sync"

describe("walkProperties", () => {
  it("should walk for all properties", () => {
    const obj = {
      a: {
        b: [
          "c",
          {
            d: {
              e: true,
            },
          },
        ],
      },
    }
    const cb = jest.fn()

    walkPropertiesSync(obj, cb)

    expect(cb.mock.calls).toMatchSnapshot()
  })

  it("should walk object with circular references", () => {
    const obj = {
      a: [],
    }

    // @ts-ignore
    obj.a.push(obj)

    const cb = jest.fn()

    walkPropertiesSync(obj, cb)

    expect(cb.mock.calls).toMatchSnapshot()
  })

  it("should walk object with propagation capturing", () => {
    const obj = {
      a: {
        b: "c",
      },
    }
    const cb = jest.fn()
    walkPropertiesSync(obj, cb, { propagation: "capturing" })
    expect(cb.mock.calls[0][0]).toEqual("a")
    expect(cb.mock.calls[1][0]).toEqual("b")
  })

  it("should walk object with propagation bubbling", () => {
    const obj = {
      a: {
        b: "c",
      },
    }
    const cb = jest.fn()
    walkPropertiesSync(obj, cb, { propagation: "bubbling" })
    expect(cb.mock.calls[0][0]).toEqual("b")
    expect(cb.mock.calls[1][0]).toEqual("a")
  })

  it("should walk object with default propagation bubbling", () => {
    const obj = {
      a: {
        b: "c",
      },
    }
    const cb = jest.fn()
    walkPropertiesSync(obj, cb)
    expect(cb.mock.calls[0][0]).toEqual("b")
    expect(cb.mock.calls[1][0]).toEqual("a")
  })

  it("should walk with async callback", async () => {
    const fn = jest.fn()
    const obj = {
      a: {
        b: "c",
      },
    }
    const walking = walkProperties(obj, async (key) => {
      if (key === "b") {
        await promisify(setTimeout)(30)
      }
      fn(key)
    })

    expect(fn).toBeCalledTimes(0)
    await walking
    expect(fn).toBeCalledTimes(2)
  })
})

describe("walk properties", () => {
  it("should generate path parameter on sync", () => {
    const fn = jest.fn()

    const obj = {
      a: {
        b: {
          c: "d",
        },
      },
      e: "f",
      g: [{ h: "i" }],
    }

    walkPropertiesSync(obj, (key, val, parent) => {
      fn(parent)
    })

    expect(fn.mock.calls[0][0]).toEqual(["a", "b", "c"])
    expect(fn.mock.calls[1][0]).toEqual(["a", "b"])
    expect(fn.mock.calls[2][0]).toEqual(["a"])
    expect(fn.mock.calls[3][0]).toEqual(["e"])
    expect(fn.mock.calls[4][0]).toEqual(["g", "0", "h"])
    expect(fn.mock.calls[5][0]).toEqual(["g", "0"])
    expect(fn.mock.calls[6][0]).toEqual(["g"])
  })

  it("should generate path parameter on async ", async () => {
    const fn = jest.fn()

    const obj = {
      a: {
        b: {
          c: "d",
        },
      },
      e: "f",
      g: [{ h: "i" }],
    }

    await walkProperties(obj, async (key, val, parent) => {
      await promisify(setTimeout)(10)
      fn(parent)
    })

    expect(fn.mock.calls[0][0]).toEqual(["a", "b", "c"])
    expect(fn.mock.calls[1][0]).toEqual(["a", "b"])
    expect(fn.mock.calls[2][0]).toEqual(["a"])
    expect(fn.mock.calls[3][0]).toEqual(["e"])
    expect(fn.mock.calls[4][0]).toEqual(["g", "0", "h"])
    expect(fn.mock.calls[5][0]).toEqual(["g", "0"])
    expect(fn.mock.calls[6][0]).toEqual(["g"])
  })
})
