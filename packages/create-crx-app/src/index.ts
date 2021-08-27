import packageJson from '../package.json'
import semver from 'semver'
import Commander from 'commander'
import chalk from 'chalk'
import prompts from 'prompts'
import path from 'path'
import { validateNpmName } from './util/validate-pkg'
import { createApp } from './create-app'

const currentNodeVersion = process.versions.node
const requireVersion = packageJson.engines.node

if (!semver.satisfies(currentNodeVersion, requireVersion)) {
  console.error(
    'You are running Node ' +
      currentNodeVersion +
      '.\n' +
      'Create Crx App requires Node 12 or higher for Node LTS Versions reason \n' +
      'Please update your version of Node.',
  )
  process.exit(1)
}

let projectPath = ''

const program: any = new Commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action((name) => {
    projectPath = name
  })
  .option(
    '--ts, --typescript',
    `

  Initialize as a TypeScript project.
`,
  )
  .option(
    '--use-npm',
    `

  Explicitly tell the CLI to bootstrap the app using npm
`,
  )
  .option(
    '-t, --template [name]',
    `

  An template to bootstrap the app with. You can use a template name
  to generator Chrome Extension App
`,
  )
  .allowUnknownOption()
  .parse(process.argv)

async function run(): Promise<void> {
  if (typeof projectPath === 'string') {
    projectPath = projectPath.trim()
  }

  if (!projectPath) {
    const res = await prompts({
      type: 'text',
      name: 'path',
      message: 'Input your project name',
      initial: 'my-app',
      validate: (name) => {
        const validation = validateNpmName(path.basename(path.resolve(name)))
        if (validation.valid) {
          return true
        }
        return 'Invalid project name: ' + validation.problems![0]
      },
    })

    if (typeof res.path === 'string') {
      projectPath = res.path.trim()
    }
  }

  if (!projectPath) {
    console.log()
    console.log('Please specify the project directory:')
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`)
    console.log()
    console.log('For example:')
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-crx-app')}`)
    console.log()
    console.log(`Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`)
    process.exit(1)
  }

  const root = path.resolve(projectPath)
  const appName = path.basename(root)

  const { valid, problems } = validateNpmName(appName)
  if (!valid) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${appName}"`,
      )} because of npm naming restrictions:`,
    )

    problems!.forEach((p) => console.error(`    ${chalk.red.bold('*')} ${p}`))
    process.exit(1)
  }

  try {
    await createApp({ root, appName, useNpm: !!program.useNpm })
  } catch (reason) {
    process.exit(1)
  }
}

run()
