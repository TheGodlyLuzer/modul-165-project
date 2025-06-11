const nanoLib = require('nano');
async function initCouch() {
    const nano = nanoLib(process.env.COUCHDB_URL);

    // create DBs if they do not exist
    const dbs = ['users', 'recipes'];
    for (const db of dbs) {
        try { await nano.db.get(db); }
        catch (e) { await nano.db.create(db); }
    }

    const recipesDb = nano.db.use('recipes');
    await recipesDb.createIndex({
        index: { fields: ['title', 'createdAt'] },
        ddoc: 'recipes-index',
        name: 'by-title-and-date'
    });

    return {
        usersDb: nano.db.use('users'),
        recipesDb
    };
}
module.exports = { initCouch };