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

export { loadQuiz, randomGenerator, displayTitle }