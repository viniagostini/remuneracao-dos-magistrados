const path = require('path');
const fs = require('fs');
const stream = require('stream');

const StreamZip = require('node-stream-zip');

const sheetsService = require('./sheetsService');
const parserCore = require('./parserCore');

const reflectPromise = p => p.then(data => ({data, status: "fulfilled" }),
                                   err => ({err, status: "rejected" }));

const parseZippedSheets = (req, res, next) => {
    if (req.file){
        var filepath = path.join(req.file.destination, req.file.filename);

        const zip = new StreamZip({
            file: filepath,
            storeEntries: true
        });

        zip.on('ready', () => {
            const zipEntries = zip.entries();
            
            const errors = [];
            const allData = [];
            const promises = [];
            Object.keys(zipEntries).forEach((entryName) => {
                const promise = extractEntryData(entryName, zip);
                promises.push(promise);
            });
            
            // Promise.all(promises.map(reflectPromise)).then((results) => {
            //     const success = results.filter(x => x.status === "resolved");
            //     const errors = results.filter(x => x.status === "resolved");

            //     console.log(success);
            //     console.log(errors.map(result => result.err));
            //     zip.close();
    
            //     res.status(200).json(JSON.stringify({}));
            // });
            
            Promise.all(promises.map(reflectPromise))
                .then(results => {
                    const success = results.filter(res => res.status === 'fulfilled').map(res => res.data);
                    const err = results.filter(res => res.status === 'rejected').map(res => res.err);
                    console.log(JSON.stringify(success));
                    console.log(err);
                    res.status(200).json(JSON.stringify(success));
                });
        });

        zip.on('error', console.log);
    } else {
        res.status(400).json({});
    }

};

const extractEntryData = async (entryName, zip) => {
    const entry = zip.entry(entryName);
    const entryBuffer = zip.entryDataSync(entry);
    const entryJSON = sheetsService.parseSheetToJson(entryBuffer);
    
    const sheetObj = {};
    sheetObj[entryName] = entryJSON;
    const sheetData = parserCore.sheetsParser(sheetObj);
    
    return sheetData;
};

module.exports = {parseZippedSheets};
