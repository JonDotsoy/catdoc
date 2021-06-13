import { ReadPackage } from "apidocsparser"
import getConfig from "next/config"

export const generalReadPackage = ReadPackage.readPackage(
  getConfig().serverRuntimeConfig.pathRepo
)
