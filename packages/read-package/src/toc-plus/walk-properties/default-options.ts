export interface walkPropertiesOptions<T = any> {
  propagation?: "capturing" | "bubbling"
  cacheWork?: Set<T>
  path?: string[]
}

export function defaultOptions<T = any>(options?: walkPropertiesOptions<T>) {
  return {
    ...options,
    propagation: options?.propagation ?? "bubbling",
    cacheWork: options?.cacheWork ?? new Set<T>(),
    path: options?.path ?? [],
  }
}
