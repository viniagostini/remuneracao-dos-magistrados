const path = require("path");
const StreamZip = require('node-stream-zip');
const fs = require('fs'), tempfile = require('tempfile');
const sheetsService = require('./sheetsService');


const parseZippedSheets = (req, res, next) => {
    if (req.file){
        var filepath = path.join(req.file.destination, req.file.filename);

        const zip = new StreamZip({
            file: filepath,
            storeEntries: true
        });

        zip.on('ready', () => {
            console.log('Entries read: ' + zip.entriesCount);
            
            Object.values(zip.entries()).forEach((entry) => {
                //const fname = tempfile('.tempSheetFile');
                //const ostream = fs.createWriteStream(fname);
                
                // zip.stream(entry.name, (err, stm) => {
                //     console.log(entry);
                //     console.log('./'+entry.name);
                //     console.log('================')
                //     console.log(err)
                //     console.log('================')
                //     stm.pipe(ostream);
                //     ostream.on('finish', function() {
                //         const parsedSheet = sheetsService.parseSheetsToJson([fname]);
                //         console.log('-------------------------------------');
                //         console.log(parsedSheet);
                //         console.log('-------------------------------------');
                //         fs.unlinkSync(fname);
                //         // var workbook = XLSX.readFile(fname);
                //         // fs.unlinkSync(fname);
                    
                //         // /* DO SOMETHING WITH workbook IN THE CALLBACK */
                //         // cb(workbook);
                //     });
                // });
                zip.extract('./'+entry.name, './file.xls', err => {
                    console.log(err ? err : 'Extracted');
                    console.log(entry.name)
                    zip.close();
                });
                
            });

            zip.close()
        });

        zip.on('error', console.log);
    }

    res.status(204).end();
};

const createSheetFile = 


module.exports = {parseZippedSheets};
