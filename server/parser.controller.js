const path = require('path');
const fs = require('fs');
const stream = require('stream');
const StreamZip = require('node-stream-zip');
const CreateZip = new require('node-zip')();

const sheetsService = require('./sheets.service');

const PROMISE_FULFILLED = 'fulfilled';
const PROMISE_REJECTED = 'rejected';

const reflectPromise = promise => promise.then(data => ({data, status: PROMISE_FULFILLED }), err => ({err, status: PROMISE_REJECTED }));

const parseZippedSheets = (req, res, next) => {
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
                    const extractedData = extractEntryData(entryName, entryBuffer);
                } catch (err) {
                    allErrors.push(err);
                }

                allExtractedData.push(extractedData);
            }); 
            
            const joinedData = sheetsService.joinAllSheetsData(allExtractedData);
            fs.unlinkSync(filepath);
            respond(res, joinedData, allErrors);
        });
        
        zip.on('error', console.log);
    } else {
        res.status(400).json({});
    }

};

//TODO: Receber tipo de saída desejado (json ou csv)
//TODO: Logger
//TODO: PM2
//TODO: Corrigir tratamento de erros


const respond = (res, data, errors) => {
    const fileName = shortid.generate();

    CreateZip.file('data.json', JSON.stringify(data));
    CreateZip.file('errors.txt', JSON.stringify(errors));

    const zipData = CreateZip.generate({ base64:false, compression: 'DEFLATE' });

    console.log("foi");
    res.end(zipData, 'binary');
};

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
