
const stringToNumberDateMap = {
  'janeiro':   '01',
  'ferereiro': '02',
  'marco':     '03',
  'abril':     '04',
  'maio':      '05',
  'junho':     '06',
  'julho':     '07',
  'agosto':    '08',
  'setembro':  '09',
  'outubro':   '10',
  'novembro':  '11',
  'dezembro':  '12',
};

const dateFormater = (stringDate) => {
    const [stringMonth, aaaa] = stringDate.split('-');

    const aa = aaaa.slice(2);
    const mm = stringToNumberDateMap[stringMonth];

    return `${mm}-${aa}`;
};

const parseFileNameToDate = (fileName) => {
  const namesList = fileName.split('-');
  return dateFormater(`${namesList[0]}-${namesList[1]}`);
};

const clearNumberData = (dirtyNumber) => {
  if (!dirtyNumber) return 0;
  const formatedString = dirtyNumber.replace(/,/g, '').replace('R$', '').trim();
  return formatedString !== '-' ? parseFloat(formatedString) : 0;
};

const clearTextData = (dirtyText) => {
  if (!dirtyText) return '';
  return dirtyText.trim();
};

const isDDMMYYY = (stringDate) => {
  const regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
  return regex.test(stringDate)  
}


const isMMYYYY = (stringDate) => {
  const regex = /[\d]{2}\/[\d]{4}/;
  return regex.test(stringDate)  
}

const isMMYY = (stringDate) => {
  const regex = /[\d]{2}\/[\d]{2}/;
  return regex.test(stringDate)  
}

module.exports = {dateFormater, parseFileNameToDate, clearNumberData, clearTextData};