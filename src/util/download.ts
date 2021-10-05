import got from 'got'
import tar from 'tar'
import { Stream } from 'stream'
import { promisify } from 'util'

const pipeline = promisify(Stream.pipeline)

export function downloadAndExtractExample(root: string, name: string): Promise<unknown> {
  return pipeline(
    got.stream('https://codeload.github.com/Jcanno/create-crx-app/tar.gz/main'),
    tar.extract({ cwd: root, strip: 3 }, [`create-crx-app-main/templates/${name}`]),
  )
}
