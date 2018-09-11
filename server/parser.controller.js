const path = require('path');
const fs = require('fs');
const stream = require('stream');

const StreamZip = require('node-stream-zip');

const sheetsService = require('./sheets.service');
const parserCore = require('./parser.core');

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

        zip.on('ready', () => {
            const zipEntries = zip.entries();
            
            const promises = [];
            Object.keys(zipEntries).forEach((entryName) => {
                const entryBuffer = getEntryBuffer(zip, entryName);
                const promise = extractEntryData(entryName, entryBuffer);
                promises.push(promise);
            }); 
            
            
            const errors = [];
            const allData = [];
            Promise.all(promises.map(reflectPromise))
                .then(results => {
                    const data = results.filter(result => result.status === PROMISE_FULFILLED).map(result => result.data);
                    const err = results.filter(result => result.status === PROMISE_REJECTED).map(result => result.err);
                    //console.log(err);
                    console.log(JSON.stringify(data));
                    res.status(200).json(JSON.stringify(data));
                });
        });

        zip.on('error', console.log);
    } else {
        res.status(400).json({});
    }

};

const getEntryBuffer = (zip, entryName) => {
    const entry = zip.entry(entryName);
    return zip.entryDataSync(entry);
};

const extractEntryData = async (entryName, entryBuffer) => {
    try {
        const entryJSON = sheetsService.parseSheetToJson(entryBuffer);
        
        const sheetObj = {};
        sheetObj[entryName] = entryJSON;
        const sheetData = parserCore.sheetsParser(sheetObj);
        
        return sheetData;
    } catch(err)  {
        throw ErrorHandler(err, entryName);
    }
};

const ErrorHandler = (error, filename) => {
    return {
        error,
        filename
    }
};

module.exports = {parseZippedSheets};
