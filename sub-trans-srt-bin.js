#!/usr/bin/env node
// Imports
const fs = require('fs')
const axios = require('axios')
const querystring = require('querystring')

// Defaults
// const srtDir = 'YOUR DIRECTORY HERE'
let srtDir = ''
// output dir
let srtDir2 = ''
// Type Origin Language
let originLang = ''
// Type Destination Language
let destLang = ''
// Add your Yandex Translate API Key Here
let apiKey = ''
// Character cutoff per request
let charPerReq = 9800
// Choose Translation Service
let modeSelected = 'yandex'
// TranslationStyle can be add or swap (put translated line below old line or swap replaces line with translated)
let translationStyle = 'add'

// Parse Arguments
let args = process.argv.slice(2)
// If Args from NPM Script, unpack them
// Foreach 1x was not evaluating all array indices when modified in place so extra runs through ensure all args are correctly unpacked
args.forEach((item, idx, arr)=>{if(item.split('=').length>1){arr.splice(idx, 1, ...item.split('='))}})
args.forEach((item, idx, arr)=>{if(item.split('=').length>1){arr.splice(idx, 1, ...item.split('='))}})
args.forEach((item, idx, arr)=>{if(item.split('=').length>1){arr.splice(idx, 1, ...item.split('='))}})
//Continue parsing args
for(let a=0;a<args.length;a++){
    switch(args[a]){
        // directory flag
        case 'dir':
        case '-dir':
        case '--dir':
            srtDir = args[a+1]
            ++a
            break;
        // origin language flag
        case 'o':
        case '-o':
        case '--o':
            originLang = args[a+1]
            ++a
            break;
        // destination language flag
        case 'd':
        case '-d':
        case '--d':
            destLang = args[a+1]
            ++a
            break;
        // api key flag
        case 'key':
        case '-key':
        case '--key':
            apiKey = args[a+1]
            ++a
            break;
        // translation service selector flag
        case 'service':
        case '-service':
        case '--service':
            modeSelected = args[a+1]
            ++a
            break;
        case 'style':
        case '-style':
        case '--style':
            translationStyle = args[a+1]
            ++a
            break;
        // output directory flag
        case 'out':
        case '-out':
        case '--out':
            srtDir2 = args[a+1]
            ++a
            break;
        default:
            break;        
    }
}

console.log('Packages Imported') // Console Reporting


async function main(){

    // Identify and Queue all files in Directory 
    const filesInDir = []
    fs.readdirSync(srtDir).forEach(file => {
        filesInDir.push(file)
    });

    for(let i=0;i<filesInDir.length;i++){
        // extract text in batches of maxlength
        try {
            let wholedata = fs.readFileSync(`./${srtDir}/${filesInDir[i]}`, 'utf8');
            let charsum = wholedata.length
            let data = wholedata.split('\n')
            let texts = []
            let translatedTexts = []
            console.log('Starting Processing Text from Document: ', filesInDir[i],'\n\n', `${charsum} characters, ${data.length} lines to process`) // Console Reporting
            // Pull out any segments with text, and translate them in batches of length charPerReq
            let j=0
            while(j<data.length){
                while(texts.join('\n').length<charPerReq){
                    if(/.*[a-zA-Zа-яА-Я].*/.test(data[j])){
                        texts.push(data[j])
                        if(j==data.length-1){break}
                        else{j+=1}
                    }else{
                        j+=1
                    }
                }
                // Create the document to be translated, api request/translate the document, add the response to the translated document, then clear texts to continue
                const selectedText =(modeSelected=='google'?texts.join('\n<br/>'):texts.join('\n')) // google removes newline chars so using <br/> to differentiate lines
                const direction = `${originLang}-${destLang}`
                charsum-=selectedText.length
                console.log(`Translating ${selectedText.length} characters...\n~${charsum} characters remain.`) // Console Reporting
                switch(modeSelected){
                    case 'google':
                        let gtrans = await axios.post(`https://translation.googleapis.com/language/translate/v2?`, querystring.stringify({ key:apiKey, q: selectedText, target:destLang, format:'html', source:originLang }))
                        const splitTranslatedTxt = gtrans.data.data.translations[0].translatedText.split('<br/>')
                        for(let m=0;m<splitTranslatedTxt.length;m++){translatedTexts.push(splitTranslatedTxt[m])}
                        break;
                    case 'yandex':
                        let ytrans = await axios.post('https://translate.yandex.net/api/v1.5/tr.json/translate?', querystring.stringify({ key:apiKey, text: selectedText, lang:direction, format:'html' }))
                        if(ytrans.data.code!==200){
                            // Catch Imporoper Behavior From Yandex
                            console.error('Improper Status Code Response Yandex Translate')
                        }
                        const splitTranslatedText = ytrans.data.text[0].split('\n')
                        console.log('Translation Part Complete') // Console Reporting
                        for(let m=0;m<splitTranslatedText.length;m++){translatedTexts.push(splitTranslatedText[m])}
                        break;
                    default:
                        console.error('Missing Translation Service Flag')
                }
                texts = []
                //Terminate loop when finished
                if(j==data.length-1){break}
            }

            console.log('Translation Phase Complete') // Console Reporting
            console.log(`${translatedTexts.length} lines translated\n${charsum} characters did not require translation.`) // Console Reporting

            // Translation styles: add / swap
            switch(translationStyle){
                case 'add':
                    // Reconstruct the file, with translation lines (combined)
                    for(let k=0;k<data.length;k++){
                        if(/.*[a-zA-Zа-яА-Я].*/.test(data[k])){
                            // If line has text, shift corresponding queue entry into file
                            data.splice(k+1,0,translatedTexts.shift().split('\r\n')[0])
                            // skip added line
                            k+=1
                        }
                    }
                    break;
                case 'swap':
                    // Reconstruct the file, with translation lines (replace line)
                    for(let k=0;k<data.length;k++){
                        if(/.*[a-zA-Zа-яА-Я].*/.test(data[k])){
                            // If line has text, shift corresponding queue entry into file
                            data.splice(k,1,translatedTexts.shift().split('\r\n')[0])
                        }
                    }
                    break;
                default:
                    console.error('Missing Translation Style Flag')
            }

            console.log('File Reconstructed in Memory') // Console Reporting

            // Write translated subs data to New File
            fs.writeFileSync(`./${srtDir2}/${destLang}-${filesInDir[i]}`, data.join('\n'))

            console.log(`File Written to Disk.\nTranslation #${i+1} Complete.`) // Console Reporting
            
        } catch (err) {
            console.error(err);
        }
    }
}
if(srtDir.length>0){
    main();
}

module.exports.run = async function (dir, out, origin, dest, key, svc, style){
    try {
        srtDir=dir
        srtDir2=out
        originLang=origin
        destLang=dest
        apiKey=key
        modeSelected=svc
        translationStyle=style
        await main()
        return true
    } catch (err){
        return err
    }
}