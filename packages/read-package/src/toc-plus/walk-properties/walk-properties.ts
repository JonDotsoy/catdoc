import { defaultOptions, walkPropertiesOptions } from "./default-options"

export async function walkProperties<T = any>(
  obj: any,
  fn: (key: string, value: T, path: string[]) => Promise<void>,
  options?: walkPropertiesOptions<T>
): Promise<void> {
  const opts = defaultOptions<T>(options)

  const callFn = async (key: string, value: T) => {
    if (opts.cacheWork.has(value)) return
    opts.cacheWork.add(value)

    const nextOpts = {
      ...opts,
      path: [...opts.path, key],
    }

    if (opts.propagation === "bubbling") {
      await walkProperties(value, fn, nextOpts)
      await fn(key, value, nextOpts.path)
    } else {
      await fn(key, value, nextOpts.path)
      await walkProperties(value, fn, nextOpts)
    }
  }

  if (Array.isArray(obj)) {
    for (const key in obj) {
      const value = obj[key]
      await callFn(key, value)
    }
    return
  }

  if (typeof obj === "object") {
    for (const key of Object.getOwnPropertyNames(obj)) {
      const value = obj[key]
      await callFn(key, value)
    }
    return
  }
}
