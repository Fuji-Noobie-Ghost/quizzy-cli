import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { start } from './src/quiz.js'
import { displayList, loadQuiz } from './src/utils.js'
import color from 'ansi-color'
import { createReadStream } from 'fs'
import inquirer from 'inquirer'

const yargsContext = yargs(hideBin(process.argv))
const quiz = await loadQuiz('./data/quiz.json')

// CLI configuration
yargsContext.usage('Usage :\n  node quizzy <options>')
yargsContext.alias('h', 'help')
yargsContext.alias('v', 'version')
yargsContext.option('endless', {
    alias: 'e',
    type: 'boolean',
    description: 'Endless quiz mode',
})
yargsContext.option('list', {
    alias: 'l',
    type: 'boolean',
    description: 'List of question avaible',
})

const argvKeys = Object.keys(yargsContext.argv)

if (yargsContext.argv._.length > 0) {
    let cmd = `"${yargsContext.argv._[0]}"`

    for (let i = 1; i < yargsContext.argv._.length; i++)
    cmd += `, ${yargsContext.argv._[i]}`
    console.log(color.set(`Unknown command(s) ${cmd}\n`, 'red+bold'))
    yargsContext.showHelp()
}

else if (argvKeys.length <= 2) await start(quiz)

else argvKeys.forEach(async key => {
    if (key !== '$0' && key !== '_' && key !== 'e' && key !== 'l') {
        switch (key) {
            case 'endless':
                return await start(quiz, true)
            case 'list':
                return displayList(quiz)
            default:
                console.log(color.set(`Unknown options "${key}"\n`, 'red+bold'))
                yargsContext.showHelp()
                return
        }
    }
})

