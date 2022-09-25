import { createReadStream } from 'fs'
import figlet from 'figlet'
import color from 'ansi-color'
import center from 'center-align'

async function loadQuiz(quizPath) {
    return new Promise((resolve, reject) => {
        const quiz = createReadStream(quizPath, { encoding: 'utf-8', autoClose: true })
        quiz.on('data', chunck => resolve(JSON.parse(chunck)))
            .on('error', reject)
    })
}

function randomGenerator(min, max) {
    return min + parseInt(Math.random() * (max + 1))
}

function displayTitle(title) {
    figlet.text(title, {
        font: 'ANSI Shadow'
    }, (err, data) => {
        if (err) process.exit(1)
        else console.log(color.set(center(data, process.stdout.columns), 'yellow+bold'), '\n\n')
    })
}

function displayQR(qr) {
    qr.forEach(value => {
        console.log(color.set('Question: ', 'green'), value.question)
        console.log(color.set('Response: ', 'green'), value.response, '\n')
    })
}

function displayQMC(qmc) {
    qmc.forEach(value => {
        console.log(color.set('Question: ', 'green'), value.question)
        let responses = value.responses[0]
        for (let i = 1; i < value.responses; i++)
            responses += ', ' + value.responses[i]
        console.log(color.set('Responses: ', 'green'), responses, '\n')
    })
}

function displayList(data) {
    console.clear()
    console.log('\n')
    displayTitle('Quizzy List')
    setTimeout(() => {
        console.log(center(color.set('Unique Choice', 'cyan+bold'), process.stdout.columns), '\n')
        displayQR(data.QUC)
        console.log(center(color.set('Multiple Choice', 'cyan+bold'), process.stdout.columns), '\n')
        displayQMC(data.QMC)
        console.log(center(color.set('Number Input', 'cyan+bold'), process.stdout.columns), '\n')
        displayQR(data.number)
        console.log(center(color.set('Word Input', 'cyan+bold'), process.stdout.columns), '\n')
        displayQR(data.string)
    }, 1000)
}

export { loadQuiz, randomGenerator, displayTitle, displayList }