const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { promisify } = require('util')

const GoogleSpreadSheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const sgMail = require('@sendgrid/mail')

// Configurações
const docId = '15LMVwyEdEfGh8Kh9NDbJA8kQHHgUlW9ufMZEznRC_W8'
const workSheetIndex = 0
const sendGridKey = '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'

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
    response.render('home')
    
})

app.post('/', async(request, response) => {
    
    try {
        const doc = new GoogleSpreadSheet(docId)
        await promisify(doc.useServiceAccountAuth)(credentials)
        const info = await promisify(doc.getInfo)()
        const worksheet = info.worksheets[workSheetIndex]
        await promisify(worksheet.addRow)({
            name: request.body.name,
            email: request.body.email,
            issueType: request.body.issueType,
            howToReproduce: request.body.howToReproduce,
            expectedOutput: request.body.expectedOutput,
            expectedInput: request.body.expectedInput,
            source: request.query.source || 'direct',
            userAgent: request.body.userAgent,
            userDate: request.body.userDate
        })

        // se for crítico
        if (request.body.issueType === 'CRITICAL') {
            sgMail.setApiKey(sendGridKey)
            const msg = {
                to: 'andremoura2500@gmail.com',
                from: `${request.body.email}`,
                subject: 'Bug crítico reportado',
                text: `O usuário ${request.body.name} reportou um problema.`,
                html: `O usuário ${request.body.name} reportou um problema.`,
            };
            await sgMail.send(msg);
        }
        

        response.render('sucesso')
    } catch (err) {
        response.send('Erro ao enviar formulário')
        console.log(err)
    }
    
})

app.listen(3000, (err) => {
    if (err) {
        console.log('aconteceu um erro', err)
    } else {
        console.log('bugtracker rodando na porta http://localhost:3000')
    }
})