
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

module.exports = {dateFormater, parseFileNameToDate};