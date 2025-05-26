const nanoLib = require('nano');
async function initCouch() {
    const nano = nanoLib(process.env.COUCHDB_URL);

    // create DBs if they do not exist
    const dbs = ['users', 'recipes'];
    for (const db of dbs) {
        try { await nano.db.get(db); }
        catch (e) { await nano.db.create(db); }
    }

    return {
        usersDb: nano.db.use('users'),
        recipesDb: nano.db.use('recipes')
    };
}
module.exports = { initCouch };