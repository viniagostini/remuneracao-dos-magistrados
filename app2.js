const http = require('http');
const url = require('url');

const jsonexport = require('jsonexport');
const express = require('express');

const app = express();

const sheetsService = require('./server/sheets.service');


app.get('/', (request, response) => {
    http.get(url.parse('http://www.cnj.jus.br/files/conteudo/arquivo/2018/05/51b37b361ea0e0d803ed704c3f694a98.xls'), function(res) {
        const data = [];
        res.on('data', function(chunk) {
            data.push(chunk);
        }).on('end', function() {
            //at this point data is an array of Buffers
            //so Buffer.concat() can make us a new Buffer
            //of all of them together
            const buffer = Buffer.concat(data);
            //console.log(buffer.toString('base64'));
            const t1 = new Date();
            const d = sheetsService.getSheetData(buffer, 'qualquer_nome')        
            const t2 = new Date() - t1;
            console.log(t2);
            
            jsonexport(d, {}, (err, csv) => {
                response.send(csv);
            });

        });
    });
});

app.listen(3002, () => {
    console.log('running on 3002');
});

