import packageJson from '../package.json'
import Semver from 'semver'
import Commander from 'commander'
import chalk from 'chalk'
import prompts from 'prompts'

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
