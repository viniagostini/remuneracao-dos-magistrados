const path = require('path');
const fs = require('fs');
const stream = require('stream');
const StreamZip = require('node-stream-zip');
const NodeZip = require('node-zip');

var jsonexport = require('jsonexport');

const sheetsService = require('./sheets.service');

const JSON_FORMART = 'json';
const CSV = 'csv';
const HEADLESS_CSV = 'headless_csv';

const parseZippedSheets = (req, res, next) => {
    const responseType = req.body.formato_saida || JSON_FORMART;

    if (req.file){        
        var filepath = path.join(req.file.destination, req.file.filename);

        const zip = new StreamZip({
            file: filepath,
            storeEntries: true
        });

        console.log('pre zip');

        zip.on('ready', () => {
            const zipEntries = zip.entries();
            
            const allExtractedData = [];
            const allErrors = [];
            Object.keys(zipEntries).forEach((entryName) => {
                console.log(entryName);
                const entryBuffer = getEntryBuffer(zip, entryName);
                let extractedData = [];
                try{
                    extractedData = extractEntryData(entryName, entryBuffer);
                } catch (err) {
                    allErrors.push(err);
                }
                allExtractedData.push(extractedData);
            }); 
            const joinedData = sheetsService.joinAllSheetsData(allExtractedData);
            fs.unlinkSync(filepath);
            respond(res, joinedData, allErrors, responseType);
        });
        
        zip.on('error', console.log);
    } else {
        res.status(400).json({});
    }

};
//TODO: Logger
//TODO: Corrigir tratamento de erros


const respond = (res, data, errors, responseType) => {
    if (responseType === CSV || responseType === HEADLESS_CSV) {
        const csvOptions = {
            includeHeaders: responseType !== HEADLESS_CSV
        }
        jsonexport(data, csvOptions, (err, csv) => {
            createAndSendResponseZip(res, 'data.csv', csv, errors);
        });
    } else {
        createAndSendResponseZip(res, 'data.json', JSON.stringify(data), errors);
    }
};

const createAndSendResponseZip = (res, responseFileName, responseFileData, errors) => {
    const CreateZip = new NodeZip();
    
    const descriptor = fs.readFileSync(__dirname + '/../descriptor.json');

    CreateZip.file('errors.txt', JSON.stringify(errors));
    CreateZip.file('descriptor.json', descriptor);
    CreateZip.file(responseFileName, responseFileData);
    
    const zipData = CreateZip.generate({ base64:false, compression: 'DEFLATE' });
    res.end(zipData, 'binary');        
}

const getEntryBuffer = (zip, entryName) => {
    const entry = zip.entry(entryName);
    return zip.entryDataSync(entry);
};

const extractEntryData = (entryName, entryBuffer) => {
    try {
        return sheetsService.getSheetData(entryBuffer, entryName);
    } catch(err)  {
        console.log(err.message);
        throw ErrorHandler(err.message, entryName);
    }
};

const ErrorHandler = (error, filename) => {
    return {
        error,
        filename
    }
};

module.exports = {parseZippedSheets};
