const subtitleTranslator = require("sub-trans-srt")

const directory = `.\\srt\\og\\`
const output = '.\\srt\\trans\\'

const origin = 'en'
const dest = 'fi'

const key = 'YOUR_API_KEY_HERE'
const service = 'yandex'
const style = 'swap' // or 'add'

async function doWork (){
    const worker = await subtitleTranslator.run(directory,output,origin,dest,key,service,style)
    console.log('Translation Output (Should be 1)', worker)
}

doWork()