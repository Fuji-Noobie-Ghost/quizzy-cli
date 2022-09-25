import cowsay from 'cowsay'
import color from 'ansi-color'
import inquirer from 'inquirer'
import { verify } from './verification.js'
import { displayTitle, randomGenerator } from './utils.js'
import readline from 'readline'

readline.emitKeypressEvents(process.stdin)

// Main functionnality
async function quiz (context, type) {
    return new Promise((resolve) => {
        inquirer.prompt([
            {
                name: 'quiz', type,
                message: context.question,
                choices: context.suggestions,
                validate: (input) => {
                    if (type === 'number') {
                        if (parseInt(input) == NaN || /\./.test(input))
                            return 'Please enter a valid number '

                        if (input === '' || input < 0)
                            return 'Please provide a value (greater than 0)'
                    }
                    else if (type === 'input' && (input === '' || input.trim() === ''))
                        return 'Please provide a value'

                    return true
                },
                filter: (input) => {
                    if (type === 'number')
                        return Number.isNaN(input) || Number(input) <= 0 ? '' : Number(input)
                    return input
                }
            }
        ]).then(answers => {
            if (verify(answers.quiz, { ...context, type })) {
                console.log('\n', cowsay.say({
                    text: color.set('Niiice !!', 'green+bold'),
                    e: '^^',
                    T: 'U'
                }))
                resolve(true)
            }
            else {
                console.log('\n', cowsay.think({ text: context.errorMessage, t: true }))
                resolve(false)
            }

            console.log('\n')
        })
    })
}

async function runGame(data, accHelper) {
    for (const quizzy in data) {
        accHelper.quizCount++
        const context = data[quizzy]
        const q = randomGenerator(0, 9)

        let type = ''
        switch (quizzy) {
            case 'QUC':
                type = context[q % 2].type
                break
            case 'QMC':
                type = 'checkbox'
                break
            case 'number':
                type = 'number'
                break
            default:
                type = 'input'
                break
        }

        if (await quiz(context[q % 2], type)) accHelper.score++
    }
}

function displayAccuracy({ score, quizCount }) {
    const accuracy = (score * 100) / quizCount
    console.log(color.set(`\n\nAccuracy : ${accuracy}%\n`, 'green'))
}

// Start the game
async function start (data, endlessMode=false) {
    console.clear()
    console.log('\n\n')

    // Title
    displayTitle('Quizzy')
    
    if (endlessMode) {
        console.log('\n')
        displayTitle('Endless')
    }
    

    setTimeout(async () => {
        // Username
        const { name } = await inquirer.prompt([
            {
                name: 'name',
                message: 'What is your name ?',
                type: 'input'
            }
        ])
        console.log(cowsay.say({
            text: color.set(`Hello ${name}\nWelcome to my\nQUIZ GAME\nLet's get started`, 'cyan+bold')
        }), '\n')
        console.log(color.set('\nPress ESC to quit the game during a party\n', 'green'))

        let playing = true
        let accHelper = {
            quizCount: 0,
            score: 0
        }

        process.stdin.on('keypress', (_, key) => {
            if (key.name === 'escape' || key.name === 'c' | 'C' && key.ctrl) {
                displayAccuracy(accHelper)
                process.emit('exit', 0)
            }
        })

        if (endlessMode)
            while (playing) await runGame(data, accHelper)
        else await runGame(data, accHelper)

        process.on('exit', () => displayAccuracy(accHelper))

    }, 2000)
}

export { start }