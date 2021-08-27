import chalk from 'chalk'
import spawn from 'cross-spawn'

interface InstallArgs {
  useYarn: boolean
  isOnline: boolean
  devDependencies?: boolean
}

export function install(
  root: string,
  dependencies: string[] | null,
  { useYarn, isOnline, devDependencies }: InstallArgs,
): Promise<void> {
  const npmFlags: string[] = []
  const yarnFlags: string[] = []

  return new Promise((resolve, reject) => {
    let args: string[]
    const command = useYarn ? 'yarnpkg' : 'npm'

    if (dependencies && dependencies.length) {
      if (useYarn) {
        args = ['add', '--exact']
        if (!isOnline) args.push('--offline')
        args.push('--cwd', root)
        if (devDependencies) args.push('--dev')
        args.push(...dependencies)
      } else {
        args = ['install', '--save-exact']
        args.push(devDependencies ? '--save-dev' : '--save')
        args.push(...dependencies)
      }
    } else {
      args = ['install']
      if (useYarn) {
        if (!isOnline) {
          console.log(chalk.yellow('You appear to be offline.'))
          console.log(chalk.yellow('Falling back to the local Yarn cache.'))
          console.log()
          args.push('--offline')
        }
      } else {
        if (!isOnline) {
          console.log(chalk.yellow('You appear to be offline.'))
          console.log()
        }
      }
    }

    if (useYarn) {
      args.push(...yarnFlags)
    } else {
      args.push(...npmFlags)
    }

    const child = spawn(command, args, {
      stdio: 'inherit',
      env: { ...process.env, ADBLOCK: '1', DISABLE_OPENCOLLECTIVE: '1' },
    })
    child.on('close', (code) => {
      if (code !== 0) {
        reject({ command: `${command} ${args.join(' ')}` })
        return
      }
      resolve()
    })
  })
}
