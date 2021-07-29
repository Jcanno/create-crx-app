import packageJson from '../package.json'
import Semver from 'semver'
import Commander from 'commander'
import chalk from 'chalk'
import prompts from 'prompts'
import path from 'path'
import { validateNpmName } from './uitl/validate-pkg'

const currentNodeVersion = process.versions.node
const requeireVersion = packageJson.engines.node

if (!Semver.satisfies(currentNodeVersion, requeireVersion)) {
  console.error(
    'You are running Node ' +
      currentNodeVersion +
      '.\n' +
      'Create Crx App requires Node 12 or higher for Node LTS Versions \n' +
      'Please update your version of Node.',
  )
  process.exit(1)
}

let projectPath = ''

const program = new Commander.Command(packageJson.name)
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
  to generator Crx App
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
      message: 'Input your project name?',
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
}

run()
