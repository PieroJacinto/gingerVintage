const {readFileSync, writeFileSync} = require('fs');
const {join} = require('path');
const model = {
    file: join(__dirname, '../data', 'categorias.json'),
    indexCat: () => JSON.parse(readFileSync(model.file)),
    oneCat: id => model.index().find(e => e.id == id)
};
module.exports = model;