import fs from 'fs'
import os from 'os'
import { extname } from 'path'

function shallowCopy(source: Record<string, any>, copy: Record<string, any>) {
  const result = {} as Record<string, any>
  Object.keys(source).forEach((key) => {
    const copyValue = copy[key]
    if (typeof copyValue === 'object' && typeof source[key] === 'object') {
      result[key] = shallowCopy(source[key], copyValue)
    } else {
      result[key] = copyValue ? copyValue : source[key]
    }
  })

  return result
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function rewriteFile(filePath: string, replacer: string | object, source?: string) {
  const fileBuffer = fs.readFileSync(filePath)
  const targetContent = fileBuffer.toString()
  const isJson = extname(filePath) === '.json'

  if (isJson) {
    const targetJson = JSON.parse(targetContent)
    // eslint-disable-next-line @typescript-eslint/ban-types
    const modifiedContent = shallowCopy(targetJson, replacer as object)
    fs.writeFileSync(filePath, JSON.stringify(modifiedContent, null, 2) + os.EOL)
  } else {
    const modifiedContent = targetContent.replace(source || '', replacer as string)

    fs.writeFileSync(filePath, modifiedContent + os.EOL)
  }
}
