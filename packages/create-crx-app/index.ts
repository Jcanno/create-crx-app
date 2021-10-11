#!/usr/bin/env node
import { templates } from './src/util/template'
import packageJson from './package.json'
import semver from 'semver'
import Commander from 'commander'
import chalk from 'chalk'
import prompts from 'prompts'
import path from 'path'
import { validateNpmName } from './src/util/validate-pkg'
import { createApp } from './src/create-app'

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

const packageName = packageJson.name
let projectPath = ''
let templateName = ''

const program = new Commander.Command(packageName)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action((name) => {
    projectPath = name
  })
  .option(
    '--use-npm',
    `

  Explicitly tell the CLI to bootstrap the app using npm
`,
  )
  .option(
    '-t, --template [name]',
    `

  Tell the CLI to generate project with a template.
  Must be one of
    react-ts-v2
  Of course, you can choose template by running CLI, it's optional
`,
  )
  .allowUnknownOption()
  .showHelpAfterError(
    `
  Please specify the project directory:
      ${chalk.cyan(packageName)} ${chalk.green('<project-directory>')}

  For example:
      ${chalk.cyan(packageName)} ${chalk.green('my-next-app')}

  Run ${chalk.cyan(`${packageName} --help`)} to see all options.
`,
  )
  .parse(process.argv)

async function run(): Promise<void> {
  if (typeof projectPath === 'string') {
    projectPath = projectPath.trim()
  }

  const options = program.opts()

  if (options.template) {
    templateName = options.template
  }

  if (!templates.find((item) => item.title === templateName)) {
    if (templateName) {
      console.log()
      console.log(`Template: ${chalk.cyan(templateName)} is invalid`)
      console.log(`Please choose a template for your project`)
      console.log()
    }

    const res = await prompts({
      type: 'select',
      name: 'templateName',
      message: 'Choose your project template',
      choices: templates,
    })

    if (typeof res.templateName === 'string') {
      templateName = res.templateName
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
    await createApp({ root, appName, useNpm: !!options.useNpm, templateName })
  } catch (reason) {
    process.exit(1)
  }
}

run()
