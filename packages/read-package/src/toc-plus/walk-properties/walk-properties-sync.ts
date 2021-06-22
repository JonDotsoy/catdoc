import { defaultOptions, walkPropertiesOptions } from "./default-options"

export function walkPropertiesSync<T = any>(
  obj: any,
  fn: (key: string, value: T, path: string[]) => void,
  options?: walkPropertiesOptions<T>
): void {
  const opts = defaultOptions<T>(options)

  const callFn = (key: string, value: T) => {
    if (opts.cacheWork.has(value)) return
    opts.cacheWork.add(value)

    const nextOpts = {
      ...opts,
      path: [...opts.path, key],
    }

    if (opts.propagation === "bubbling") {
      walkPropertiesSync(value, fn, nextOpts)
      fn(key, value, nextOpts.path)
    } else {
      fn(key, value, nextOpts.path)
      walkPropertiesSync(value, fn, nextOpts)
    }
  }

  if (Array.isArray(obj)) {
    for (const key in obj) {
      const value = obj[key]
      callFn(key, value)
    }
    return
  }

  if (typeof obj === "object") {
    for (const key of Object.getOwnPropertyNames(obj)) {
      const value = obj[key]
      callFn(key, value)
    }
    return
  }
}
