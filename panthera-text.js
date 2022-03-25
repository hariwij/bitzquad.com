import { Langs, TextFolder, TextTSV_URL, TextTSV_Header_Section, TextTSV_Header_Identifier, TextTSV_Header_Languages } from "./site-settings.js"
import fetch from "node-fetch"
import fs from "fs"


let headerSection
let headerId
let headerLangs = {}

let textData = {}


console.log("Panthera text build")
await parseTextData()

async function parseTextData() {
    console.log("Downloading text data from Google Sheets")
    const tsvLines = await fetch(TextTSV_URL).then(response => response.text()).then(text => text.split("\r\n"))

    if (!tsvLines || tsvLines.length < 2) {
        console.error("Parsing text failed")
        throw new Error("Parsing text failed")
        stop()
    }

    const sep = "\t"

    const headers = tsvLines[0].split(sep)

    headerSection = headers.indexOf(TextTSV_Header_Section)
    headerId = headers.indexOf(TextTSV_Header_Identifier)
    headerLangs = {}

    if (headerSection < 0) {
        console.error("Missing section header")
        throw new Error("Missing section header")
        stop()
    }

    if (headerId < 0) {
        console.error("Missing identifier header")
        throw new Error("Missing identifier header")
        stop()
    }

    for (const key in TextTSV_Header_Languages) {
        if (Object.hasOwnProperty.call(TextTSV_Header_Languages, key)) {
            const lang = TextTSV_Header_Languages[key]

            let headerIndex = headers.indexOf(key)
            if (headerIndex < 0) {
                console.error("Missing language header", key)
                throw new Error("Missing language header " + key)
                stop()
            }

            headerLangs[lang] = headerIndex
        }
    }

    console.log("Language columns : ", headerLangs)

    for (let i = 1; i < tsvLines.length; i++) {
        const line = tsvLines[i]
        const values = line.split(sep)

        let section = values[headerSection]
        const identifier = values[headerId]

        // Remove whitespaces
        section = section.replace(/\s/g, "")

        if (!textData[section]) {
            textData[section] = {}
        }

        textData[section][identifier] = {}

        for (const lang in headerLangs) {
            if (Object.hasOwnProperty.call(headerLangs, lang)) {
                const headerIndex = headerLangs[lang]
                const value = values[headerIndex]

                textData[section][identifier][lang] = value
            }
        }
    }

    // console.log("Text data : ", textData)

}


await cleanOutputFolder()

async function cleanOutputFolder() {
    if (!TextFolder || TextFolder.length < 2) {
        console.error("Invalid text folder : ", TextFolder)
        throw new Error("Invalid text folder : " + TextFolder)
        stop()
    }

    if (TextFolder.endsWith("/")) {
        TextFolder = TextFolder.substring(0, TextFolder.length - 1)
    }

    fs.rmSync(TextFolder, { recursive: true, force: true })
    fs.mkdirSync(TextFolder)
}

await generateFiles()
async function generateFiles() {
    for (const section in textData) {
        if (Object.hasOwnProperty.call(textData, section)) {
            const sectionData = textData[section]

            let sectionFile = `${TextFolder}/${section}.ts`

            let sec = {}

            for (const lang in headerLangs) {
                if (Object.hasOwnProperty.call(headerLangs, lang)) {
                    sec[lang] = {}
                }
            }

            let sectionTextType = section + "Text"

            let str = `export interface ${sectionTextType} {`

            for (const identifier in sectionData) {
                if (Object.hasOwnProperty.call(sectionData, identifier)) {
                    const identifierData = sectionData[identifier]

                    for (const lang in headerLangs) {
                        if (Object.hasOwnProperty.call(headerLangs, lang)) {

                            const value = identifierData[lang]
                            sec[lang][identifier] = value

                        }
                    }

                    // Create type definition for id
                    str += `\n\t${identifier}: string`
                }
            }

            str += `\n}\n\nexport default {\n`

            for (const lang in headerLangs) {
                if (Object.hasOwnProperty.call(headerLangs, lang)) {
                    let langSection = JSON.stringify(sec[lang], null, "\t\t")
                    langSection = langSection.substring(0, langSection.length - 2)

                    str += `\t${lang}: ` + langSection + `\n\t} as ${sectionTextType},\n`
                }
            }

            str += `}\n`

            fs.writeFileSync(sectionFile, str)
        }
    }
}