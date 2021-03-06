import { isWriteable } from './util/is-writeable'
import path from 'path'
import { makeDir } from './util/make-dir'
import { isFolderEmpty } from './util/is-empty-folder'
import { getOnline } from './util/is-online'
import { install } from './util/install'
import { shouldUseYarn } from './util/should-use-yarn'
import { rewriteFile } from './util/rewrite-file'
import { downloadAndExtractExample } from './util/download'
import chalk from 'chalk'

interface CreateApp {
  root: string
  appName: string
  useNpm: boolean
  useTypescript: boolean
  useFramework: string
}

export async function createApp({
  root,
  appName,
  useNpm,
  useTypescript,
  useFramework,
}: CreateApp): Promise<void> {
  const templateName = `${useFramework}-${useTypescript ? 'ts' : 'js'}-mv2`.toLowerCase()

  if (!(await isWriteable(path.dirname(root)))) {
    console.error(
      'The application path is not writable, please check folder permissions and try again.',
    )
    console.error('It is likely you do not have write permissions for this folder.')
    process.exit(1)
  }

  const useYarn = useNpm ? false : shouldUseYarn()
  const isOnline = !useYarn || (await getOnline())
  const originalDirectory = process.cwd()
  const displayedCommand = useYarn ? 'yarn' : 'npm'

  await makeDir(root)
  if (!isFolderEmpty(root, appName)) {
    process.exit(1)
  }

  process.chdir(root)

  console.log()
  console.log(`Downloading ${chalk.cyan(templateName)} template`)
  try {
    await downloadAndExtractExample(root, templateName)
  } catch (error) {
    console.log(error)
    console.log(`some wrong with download ${chalk.cyan(templateName)} template`)
    process.exit(1)
  }
  console.log()

  console.log(chalk.bold(`Using ${displayedCommand}.`))

  rewriteFile('package.json', {
    name: appName,
  })
  rewriteFile('src/manifest.json', {
    name: appName,
    browser_action: {
      default_title: appName,
    },
  })
  rewriteFile('README.md', appName, templateName)
  const installFlags = { useYarn, isOnline }

  console.log()
  console.log('Installing dependencies:')
  console.log()

  await install(root, null, installFlags)

  let cdpath
  if (originalDirectory && path.join(originalDirectory, appName) === root) {
    cdpath = appName
  } else {
    cdpath = root
  }

  const startServeCommand = useFramework === 'react' ? 'dev' : 'serve'

  console.log(`${chalk.green('Success!')} Created ${appName} at ${root}`)
  console.log('Inside that directory, you can run several commands:')
  console.log()
  console.log(chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}${startServeCommand}`))
  console.log('    Starts the development server.')
  console.log()
  console.log(chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`))
  console.log('    Builds the extension app for production.')
  console.log()
  console.log('We suggest that you begin by typing:')
  console.log()
  console.log(chalk.cyan('  cd'), cdpath)
  console.log(`  ${chalk.cyan(`${displayedCommand} ${useYarn ? '' : 'run '}${startServeCommand}`)}`)
  console.log()
}
