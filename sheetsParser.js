const utils = require('./utils');
const sheetsService = require('./sheetsService');

/**
 * 
 * @param {Object} sheetsJsonObject - Object where the keys are the file name and 
 *                                    the value is the sheetObject.
 * @returns
 */
const sheetsParser = (sheetsJsonObject) => {

};

/**
 * 
 * @param {String} fileName 
 * @param {Object} sheetObject 
 */
const parseSheet = (fileName, sheetObject) => {
    //TODO: remove coupling of "ano/mes referencia" from file name.
    //TODO: get data from "tribunal"
    //TODO: think about error handling design
    const mes_ano_referencia = utils.parseFileNameToDate(fileName);
    
    const contrachequeData = getContrachequeData(getContrachequeSheet(sheetObject)),
          subsidioData = getSubsidioData(getSubsidioSheet(sheetObject)),  
          indenizacoesData = getIndenizacoesData(getIndenizacoesSheet(sheetObject)),  
          direitosEventuaisData = getDireitosEventuaisData(getDireitosEventuaisSheet(sheetObject)),  
          dadosCadastraisData = getDadosCadastraisData(getDadosCadastraisSheet(sheetObject));

    const magistradosData = [];
    Object.keys(contrachequeData).forEach((key) => {
        let magistradoData = {};
        magistradoData = Object.assign(magistradoData, contrachequeData[key]);
        magistradoData = Object.assign(magistradoData, subsidioData[key]);
        magistradoData = Object.assign(magistradoData, indenizacoesData[key]);
        magistradoData = Object.assign(magistradoData, direitosEventuaisData[key]);
        magistradoData = Object.assign(magistradoData, dadosCadastraisData[key]);

        magistradoData.mes_ano_referencia = mes_ano_referencia;
        magistradosData.push(magistradoData);
    });

    return magistradosData;
};

//TODO: Find a better strategy than just list every possibility of sheet name.
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

const getDadosCadastraisSheet = sheetObject => sheetObject["Dados Cadastrais"] ||
                                                sheetObject['Dados_Cadastrais'];

/**
 * Sanitize the passed value acordind to the type.
 * 
 * @param {String} data - value to be sanitized
 * @param {String} type - Can be: text | number 
 */
const clearData = (data, type) => {
    if (type === 'number') {
        return utils.clearNumberData(data);
    } else {
        return utils.clearTextData(data);
    }
};


/**
 * Checks if the line has the number of elements to fill the 
 * fields and if the the first fields has any content.
 * 
 * @param {Array} line 
 * @param {Integer} fieldsLength 
 * 
 * @returns {Boolean} true if it is a valid line.
 */
const isValidLine = (line, fieldsLength) => line.length >= fieldsLength && 
                                            !!line[1] && !!line[2] && line[1].length > 3;

/**
 * Returns the first data line of the sheet object.
 * 
 * @param {Object} sheetObject 
 */
const getFistDataLine = (sheetObject) => {
  let firstDataLine;

  sheetObject.some((line, index) => {
      firstDataLine = index + 1;
      return line.length > 0 && line[0] && line[1] && 
             (line[0].toLowerCase().includes('cpf')) &&
             (line[1].toLowerCase().includes('nome'));
  });

  return firstDataLine;
};

/**
 * Given a sheetObject and an array of fields, extracts the sheet data according to the fields.
 * 
 * @param {Object} sheetObject - The sheet object.
 * @param {Array} fields - An array of the itens that will be collected from each line of the sheet. 
 */
const getDataFromSheet = (sheetObject, fields) => {
    const sheetData = {};
    const firstDataLine = getFistDataLine(sheetObject);

    sheetObject.forEach((line, index) => {
        if (index < firstDataLine || !isValidLine(line, fields.length)) return;
        
        const magistradoData = {};
        let key;
        fields.forEach((field, index) => {
            magistradoData[field.fieldName] = clearData(line[index], field.type);
            if (field.key) key = magistradoData[field.fieldName]; 
        });
        sheetData[key] = magistradoData;
    });

    return sheetData; 
};

/**
 * Returns the sheet data, clear, sanitized and formated.
 * 
 * @param {Object} contrachequeSheet - Sheet object containing data from "Contracheque".
 */
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
};

/**
 * Returns the sheet data, clear, sanitized and formated.
 * 
 * @param {Object} subsidioSheet - Sheet object containing data from "Subsídios".
 */
const getSubsidioData = subsidioSheet => {
    const fields = [
        { fieldName: 'cpf', type: 'text' },
        { fieldName: 'nome', type: 'text', key: true },
        { fieldName: 'abono_de_permanencia', type: 'number' },
        { fieldName: 'subsidio_outra1', type: 'number' },
        { fieldName: 'subsidio_detalhe1', type: 'text' },
        { fieldName: 'subsidio_outra2', type: 'number' },
        { fieldName: 'subsidio_detalhe2', type: 'text' },
        { fieldName: 'total_de_direitos_pessoais', type: 'number' },
    ];

    return getDataFromSheet(subsidioSheet, fields);
};

/**
 * Returns the sheet data, clear, sanitized and formated.
 * 
 * @param {Object} indenizacoesSheet - Sheet object containing data from "Indenizções".
 */
const getIndenizacoesData = indenizacoesSheet => {
    const fields = [
        { fieldName: 'cpf', type: 'text' },
        { fieldName: 'nome', type: 'text', key: true },
        { fieldName: 'auxilio_alimentacao', type: 'number' },
        { fieldName: 'auxilio_pre_escolar', type: 'number' },
        { fieldName: 'auxilio_saude', type: 'number' },
        { fieldName: 'auxilio_natalidade', type: 'number' },
        { fieldName: 'auxilio_moradia', type: 'number' },
        { fieldName: 'ajuda_de_custo', type: 'number' },
        { fieldName: 'indenizacoes_outra1', type: 'number' },
        { fieldName: 'indenizacoes_detalhe1', type: 'text' },
        { fieldName: 'indenizacoes_outra2', type: 'number' },
        { fieldName: 'indenizacoes_detalhe2', type: 'text' },
        { fieldName: 'indenizacoes_outra3', type: 'number' },
        { fieldName: 'indenizacoes_detalhe3', type: 'text' },
        { fieldName: 'total_indenizacoes', type: 'number' },
    ];

    return getDataFromSheet(indenizacoesSheet, fields);
};

/**
 * Returns the sheet data, clear, sanitized and formated.
 * 
 * @param {Object} direitosEventuaisSheet - Sheet object containing data from "Direitos Eventuais".
 */
const getDireitosEventuaisData = direitosEventuaisSheet => {
    const fields = [
        { fieldName: 'cpf', type: 'text' },
        { fieldName: 'nome', type: 'text', key: true },
        { fieldName: 'abono_contitucional_de_1_3_de_ferias', type: 'number' },
        { fieldName: 'indenizacao_de_ferias', type: 'number' },
        { fieldName: 'antecipacao_de_ferias', type: 'number' },
        { fieldName: 'gratificacao_natalina', type: 'number' },
        { fieldName: 'antecipacao_de_gratificacao_natalina', type: 'number' },
        { fieldName: 'substituicao', type: 'number' },
        { fieldName: 'gratificacao_por_exercicio_cumulativo', type: 'number' },
        { fieldName: 'gratificacao_por_encargo_curso_concurso', type: 'number' },
        { fieldName: 'pagamento_em_retroativos', type: 'number' },
        { fieldName: 'jeton', type: 'number' },
        { fieldName: 'direitos_eventuais_outra1', type: 'number' },
        { fieldName: 'direitos_eventuais_detalhe1', type: 'text' },
        { fieldName: 'direitos_eventuais_outra2', type: 'number' },
        { fieldName: 'direitos_eventuais_detalhe2', type: 'text' },
        { fieldName: 'total_de_direitos_eventuais', type: 'number' },
    ];

    return getDataFromSheet(direitosEventuaisSheet, fields);
};

/**
 * Returns the sheet data, clear, sanitized and formated.
 * 
 * @param {Object} dadosCadastraisSheet - Sheet object containing data from "Dados Cadastrais".
 */
const getDadosCadastraisData = dadosCadastraisSheet => {
    const fields = [
        { fieldName: 'cpf', type: 'text' },
        { fieldName: 'nome', type: 'text', key: true },
        { fieldName: 'matricula', type: 'text' },
        { fieldName: 'lotacao_de_origem', type: 'text' },
        { fieldName: 'orgao_de_origem', type: 'text' },
        { fieldName: 'cargo_de_origem', type: 'text' },   
    ];

    return getDataFromSheet(dadosCadastraisSheet, fields);
};

const sheetJson = sheetsService.parseSheetsToJson(['./downloaded-sheets/abril-2018-0dd715f156597273f48327975e64d9ab.xls']);

const allSheetsData = parseSheet('abril-2018-0dd715f156597273f48327975e64d9ab.xls', sheetJson['abril-2018-0dd715f156597273f48327975e64d9ab.xls']);

console.log(JSON.stringify(allSheetsData));