const fs = require('fs');
const path = require('path');
const nanoLib = require('nano');

async function importDemoData() {
    const db = nanoLib(process.env.COUCHDB_URL);
    const recipesDb = db.db.use('recipes');
    const rows = await recipesDb.find({
        selector: {
            _id: {$not: {$regex: '^_design'}}
        }
    });
    if (rows.docs.length) {
        console.log('DB already has data; skipping import.');
        return;
    }

    const data = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../test-data/recipes.json'), 'utf8')
    );
    const docs = data.map(r => ({
        _id: r._id || `recipe:${Date.now()}-${Math.random()}`,
        ...r
    }));
    const resp = await recipesDb.bulk({docs});
    console.log('Imported demo recipe data:', resp);
}


module.exports = {importDemoData};