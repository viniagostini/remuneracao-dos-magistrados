# Remuneração de Magistrados

API que recebe um .zip com planilhas de remunerações de magistrados retiradas do site do [CNJ](http://www.cnj.jus.br/transparencia/remuneracao-dos-magistrados), extrai, une e formata os dados em JSON ou CSV. 

A resposta da API é um aquivo .zip contendo os seguintes arquivos:
* **errors.txt**: Contém os erros gerados pelas planilhas passadas.
* **data.<csv | json>**: Dados retirados das planilhas no formato escolhido.
* **descriptor.json**: Documentação dos dados.


## Para Rodar


### Pré requisitos

Ter instalado:

1. [NodeJS](https://nodejs.org/en/) versão 8 ou acima.
2. [NPM](https://www.npmjs.com/)


### Rodando

Na raiz do projeto:

```
npm install
```
Em seguida:
```
npm start
```
Talvez seja necessário utilizar `sudo` para essas operaçẽos se você estiver no linux.

Caso deseje acompanhar os logs:
 
```
pm2 monit
```

## Usando
1. Baixe as planilhas que deseja analisar, uma ótima forma pode ser [essa](https://github.com/danielfireman/remuneracao-justica-crawler).
2. Junte todas elas em um .zip.
3. Envie em uma requisição, juntamente com o formato de saída desejado para o serviço que está rodando na porta 3000, por exemplo:
```
curl -X POST \
  http://localhost:3000 \
  -H 'content-type: multipart/form-data; \
  -F planilhas=<caminho para o .zip> \
  -F formato_saida=<json ou csv>
``` 

## Rodando os testes

Ainda não temos testes, quem sabe uma dia.

## Deploy

Só jogar no heroku e ser feliz!

Um dia desse eu boto um daqueles botões bem legais de fazer deploy com um clique.

## Contribuindo

Ainda não criei um documento de como contribuir, mas qualquer um que passar o olho nesse código vai ver que tem muita coisa a ser feita. Se você deseja contribuir, seu PR será recebido com muito carinho.

## Em breve
* CLI para quem preferir usar na linha de comando
* Testes
* Formato mais elegante de saída usando esse [formato de dado](https://frictionlessdata.io/specs/table-schema/)

## Autores

* **Vinicius A. Agostini** - [viniagostini](https://github.com/viniagostini)
* **Seu Nome Pode estar aqui** - Contribua.

