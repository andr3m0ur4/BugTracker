const GoogleSpreadSheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')

const addRowToSheet = async() => {
    const doc = new GoogleSpreadSheet('15LMVwyEdEfGh8Kh9NDbJA8kQHHgUlW9ufMZEznRC_W8')
    await promisify(doc.useServiceAccountAuth)(credentials)
    console.log('planilha aberta')
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[0]
    await promisify(worksheet.addRow)({ name: 'André Moura', email: 'teste' })
}
addRowToSheet()

/*
const doc = new GoogleSpreadSheet('15LMVwyEdEfGh8Kh9NDbJA8kQHHgUlW9ufMZEznRC_W8')
doc.useServiceAccountAuth(credentials, (err) => {
    if (err) {
        console.log('Não foi poss´vel abrir a planilha')
    } else {
        console.log('planilha aberta')
        doc.getInfo((err, info) => {
            const worksheet = info.worksheets[0]
            worksheet.addRow({ name: 'André Moura', email: 'teste' }, err => {
                console.log('linha inserida')
            })
        })
    }
})
*/