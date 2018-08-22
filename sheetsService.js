const fs = require('fs');
const xlsx = require('xlsx');


/**
 * Given an array with the path to the sheets, parse then into json and returns an object where
 * the key is the file name and the value is the resultant json.
 */
const parseSheetsToJson = sheetsFilePath => {
    const result = {};
    sheetsFilePath.forEach((filePath) => {
        const fileName = filePath.split('/').pop();
        result[fileName] = parseSheetToJson(filePath);
    });
    return result;
};

/**
 * Given an .xls or .xlsx file path, convert the file content into json.
 */
const parseSheetToJson = sheetFilePath => {
    const workbook = xlsx.readFile(sheetFilePath);
    const result = {};
    workbook.SheetNames.forEach(sheetName => {
        const tab = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
        if(tab.length) result[sheetName] = tab;
    });
    return result;
};

module.exports = {parseSheetsToJson};