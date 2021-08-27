import { isWriteable } from './util/is-writeable'
import path from 'path'
import fs from 'fs'
import os from 'os'
import { makeDir } from './util/make-dir'
import { isFolderEmpty } from './util/is-empty-folder'
import { getOnline } from './util/is-online'
import { install } from './util/install'
import { shouldUseYarn } from './util/should-use-yarn'
import chalk from 'chalk'

interface CreateApp {
  root: string
  appName: string
  useNpm: boolean
}

export async function createApp({ root, appName, useNpm }: CreateApp): Promise<void> {
  if (!(await isWriteable(path.dirname(root)))) {
    console.error(
      'The application path is not writable, please check folder permissions and try again.',
    )
    console.error('It is likely you do not have write permissions for this folder.')
    process.exit(1)
  }

  await makeDir(root)
  if (!isFolderEmpty(root, appName)) {
    process.exit(1)
  }

  const useYarn = useNpm ? false : shouldUseYarn()
  const isOnline = !useYarn || (await getOnline())
  const originalDirectory = process.cwd()
  const displayedCommand = useYarn ? 'yarn' : 'npm'

  console.log(chalk.bold(`Using ${displayedCommand}.`))

  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'crx-scripts dev',
      build: 'crx-scripts build',
      'build:crx': 'crx-scripts build:crx',
    },
  }

  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL,
  )

  const installFlags = { useYarn, isOnline }
  const dependencies = ['react', 'react-dom']
  const devDependencies = ['eslint', 'eslint-config-next']

  if (dependencies.length) {
    console.log()
    console.log('Installing dependencies:')
    for (const dependency of dependencies) {
      console.log(`- ${chalk.cyan(dependency)}`)
    }
    console.log()

    await install(root, dependencies, installFlags)
  }
}
