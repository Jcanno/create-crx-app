#!/usr/bin/env node
import { extLanguages, frameworks } from './src/util/prompts-opts'
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
let useFramework = ''
let useTypescript = false

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
    '--ts, --typescript',
    `

  Explicitly tell the CLI to generate project with TypeScript.
`,
  )
  .option(
    '--framework [name]',
    `

  Explicitly Tell the CLI to generate project with Vue or React framework.
`,
  )
  .allowUnknownOption()
  .showHelpAfterError(
    `
  Please specify the project directory:
      ${chalk.cyan(packageName)} ${chalk.green('<project-directory>')}

  For example:
      ${chalk.cyan(packageName)} ${chalk.green('my-crx-app')}

  Run ${chalk.cyan(`${packageName} --help`)} to see all options.
`,
  )
  .parse(process.argv)

async function run(): Promise<void> {
  if (typeof projectPath === 'string') {
    projectPath = projectPath.trim()
  }

  const options = program.opts()

  useFramework = options.framework

  if (!frameworks.find((item) => item.title.toLowerCase() === useFramework?.toLowerCase())) {
    const res = await prompts(
      {
        type: 'select',
        name: 'framework',
        message: 'Select your project framework',
        choices: frameworks,
      },
      { onCancel: onPromptCancel },
    )

    useFramework = res.framework
  }

  useTypescript = options.typescript

  if (!options.typescript) {
    const res = await prompts(
      {
        type: 'select',
        name: 'language',
        message: 'Select your project language',
        choices: extLanguages,
      },
      { onCancel: onPromptCancel },
    )

    useTypescript = res.language === 'ts'
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
    await createApp({ root, appName, useNpm: !!options.useNpm, useFramework, useTypescript })
  } catch (reason) {
    process.exit(1)
  }
}

function onPromptCancel() {
  process.exit(1)
}

run()
