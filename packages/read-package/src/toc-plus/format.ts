import util from "util"

export function format(format?: any, ...param: any[]) {
  return util.formatWithOptions(
    { depth: Infinity, maxArrayLength: Infinity },
    format,
    ...param
  )
}
