const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

const GoogleSpreadSheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

// Configurações
const docId = '15LMVwyEdEfGh8Kh9NDbJA8kQHHgUlW9ufMZEznRC_W8'
const workSheetIndex = 0

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
    response.render('home')
    
})

app.post('/', (request, response) => {

    const doc = new GoogleSpreadSheet(docId)
    doc.useServiceAccountAuth(credentials, (err) => {
        if (err) {
            console.log('Não foi poss´vel abrir a planilha')
        } else {
            console.log('planilha aberta')
            doc.getInfo((err, info) => {
                const worksheet = info.worksheets[workSheetIndex]
                worksheet.addRow({ 
                    name: request.body.name, 
                    email: request.body.email,
                    issueType: request.body.issueType,
                    howToReproduce: request.body.howToReproduce,
                    expectedOutput: request.body.expectedOutput,
                    expectedInput: request.body.expectedInput
                 }, err => {
                    response.send('bug reportado com sucesso')
                })
            })
        }
    })
    
})

app.listen(3000, (err) => {
    if (err) {
        console.log('aconteceu um erro', err)
    } else {
        console.log('bugtracker rodando na porta http://localhost:3000')
    }
})