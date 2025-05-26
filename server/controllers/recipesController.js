const Joi = require('joi');
const {required} = require("joi");

const recipeSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    ingredients: Joi.array().items(Joi.object()).required(),
    instructions: Joi.array().items(Joi.object()).required(),
    createdAt: Joi.date()
        .default(() => new Date())
        .description('creation date')
});

async function getAllRecipes(req, res) {
    try {
        const result = await req.app.locals.recipesDb.list({ include_docs: true });
        const recipes = result.rows.map(r => r.doc);
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getRecipeById(req, res) {
    try {
        const doc = await req.app.locals.recipesDb.get(req.params.id);
        res.json(doc);
    } catch (err) {
        res.status(404).json({ error: 'Recipe not found' });
    }
}

async function createRecipe(req, res) {
    try {
        const value = await recipeSchema.validateAsync(req.body);
        const insertResult = await req.app.locals.recipesDb.insert(value);
        const newDoc = await req.app.locals.recipesDb.get(insertResult.id);
        res.status(201).json(newDoc);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function updateRecipe(req, res) {
    try {
        const existing = await req.app.locals.recipesDb.get(req.params.id);
        const value = await recipeSchema.validateAsync(req.body);
        // preserve _id and _rev
        value._id = existing._id;
        value._rev = existing._rev;
        const updateResult = await req.app.locals.recipesDb.insert(value);
        const updatedDoc = await req.app.locals.recipesDb.get(updateResult.id);
        res.json(updatedDoc);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function deleteRecipe(req, res) {
    try {
        const doc = await req.app.locals.recipesDb.get(req.params.id);
        await req.app.locals.recipesDb.destroy(doc._id, doc._rev);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(404).json({ error: 'Recipe not found' });
    }
}

module.exports = {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe
};
