const utils = require('./utils');
const sheetsService = require('./sheetsService');

const sheetsParser = (sheetsJsonObject) => {

};


const parseSheet = (fileName, sheetObject) => {
    const mes_ano_referencia = utils.parseFileNameToDate(fileName);
    


    // returns [{magistrado}]
};


const getContrachequeSheet = sheetObject => sheetObject["Contracheque"];

const getSubsidioSheet = sheetObject => sheetObject["Subsídio - Direitos Pessoais"] ||
                                        sheetObject['Subsídio -Vantagens Pessoais'] ||
                                        sheetObject['Subsídio - Direitos Pessoais(1)'] ||
                                        sheetObject['Subsídio -Direitos Pessoais'] ||
                                        sheetObject['Subsídio -Vantagens Pessoais'] ||
                                        sheetObject['Subsídio Direitos Pessoais'] ||
                                        sheetObject['Subsídio – Direitos Pessoais'] ||
                                        sheetObject['Subsídio_-_Direitos_Pessoais'] ||
                                        sheetObject['Direitos Pessoais'];

const getIndenizacoesSheet = sheetObject => sheetObject["Indenizações"] ||
                                            sheetObject["Indenizações "] ||
                                            sheetObject["Indenizações(2)"];

const getDireitosEventuaisSheet = sheetObject => sheetObject["Direitos Eventuais"] ||
                                                 sheetObject['Vantagens Eventuais'] ||
                                                 sheetObject['Direitos_Eventuais'] ||
                                                 sheetObject['Direitos Eventuais(3)'];

const getDadosCadastraisSheet = sheetsObject => sheetObject["Dados Cadastrais"] ||
                                                sheetObject['Dados_Cadastrais'];


const isMagistradoDataLine = (params) => {
  
}

//TODO: implement
const clearData = (data, type) => data;

//TODO: implement
const isValidLine = line => {
    return true;
}

//TODO: implement
const getFistDataLine = (sheetObject) => {
  return 1;
}


const getDataFromSheet = (sheetObject, fields) => {
    const sheetData = [];
    const firstDataLine = getFistDataLine(sheetObject);

    sheetObject.forEach((line, index) => {
        if (index < firstDataLine || !isValidLine(line)) return;
        
        const magistradoData = {};

        fields.forEach((field, index) => {
            magistradoData[field.fieldName] = clearData(line[index], field.type);
            if (field.key) magistradoData.key = magistradoData[field.fieldName]; 
        });
        sheetData.push(magistradoData);
    });

    return sheetData; 
};
       
const getContrachequeData = contrachequeSheet => {
    const fields = [
        { fieldName: 'cpf', type: 'text' },
        { fieldName: 'nome', type: 'text', key: true },
        { fieldName: 'cargo', type: 'text' },
        { fieldName: 'lotacao', type: 'text' },
        { fieldName: 'subsidio', type: 'number' },
        { fieldName: 'direitos_pessoias', type: 'number' },
        { fieldName: 'indenizacoes', type: 'number' },
        { fieldName: 'direitos_eventuais', type: 'number' },
        { fieldName: 'total_de__rendimentos', type: 'number' },
        { fieldName: 'previdencia_publica', type: 'number' },
        { fieldName: 'imposto_de_renda', type: 'number' },
        { fieldName: 'descontos_diversos', type: 'number' },
        { fieldName: 'retencao_por_teto_constitucional', type: 'number' },
        { fieldName: 'total_de_descontos', type: 'number' },
        { fieldName: 'rendimento_liquido', type: 'number' },
        { fieldName: 'remuneracao_do_orgao_de_origem', type: 'number' },
        { fieldName: 'diarias', type: 'number' }
    ];

    return getDataFromSheet(contrachequeSheet, fields);
}


const sheetJson = sheetsService.parseSheetsToJson(['./downloaded-sheets/abril-2018-0dd715f156597273f48327975e64d9ab.xls']);
const contrachequeSheet = getContrachequeSheet(sheetJson['abril-2018-0dd715f156597273f48327975e64d9ab.xls']);
const contrachequeData = getContrachequeData(contrachequeSheet);

console.log(contrachequeData);