function verifyQMC(answers, context) {
    answers.sort()
    for (let i = 0; i < answers.length; i++)
        if (answers[i] !== context.responses[i])
            return false

    return true
}

// Answers verification
function verify(answer, context) {
    switch (context.type) {
        case 'input':
            return answer.toLowerCase() === context.response
        case 'checkbox':
            return (
                answer.length <= context.responses.length && 
                answer.length > 0 &&
                verifyQMC(answer, context)
            )
        default:
            return answer === context.response
    }
}

export { verifyQMC, verify }