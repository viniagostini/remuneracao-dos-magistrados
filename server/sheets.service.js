const xlsx = require('xlsx');
const parserCore = require('./parser.core');

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
 * Given an .xls or .xlsx file buffer, convert the file content into json.
 */
const parseSheetToJson = sheetBuffer => {
    const workbook = xlsx.read(sheetBuffer, {type:"buffer"});
    const result = {};
    workbook.SheetNames.forEach(sheetName => {
        const tab = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
        if(tab.length) result[sheetName] = tab;
    });
    return result;
};

const getSheetData = (sheetBuffer, sheetName) => {
    const sheetObj = {};
    const jsonSheet = parseSheetToJson(sheetBuffer);
    sheetObj[sheetName] = jsonSheet;
    return parserCore.sheetsParser(sheetObj);
};

const joinAllSheetsData = (allSheetsData) => {
    const allData = [];
    return allSheetsData.reduce((allData, sheetData) => allData.concat(sheetData), []);
};

module.exports = {getSheetData, joinAllSheetsData};