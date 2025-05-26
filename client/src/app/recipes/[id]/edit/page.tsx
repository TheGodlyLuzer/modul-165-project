'use client';

import {useState, useEffect, FormEvent} from 'react';
import { useRouter, useParams } from 'next/navigation';
import {Recipe} from "@/models/recipe";
export default function EditRecipePage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function load() {
            const res = await fetch(`${process.env.API_URL}/recipes/${id}`, {
                credentials: 'include'
            });
            setRecipe(await res.json());
        }

        load();
    }, [id]);

    async function handleSubmit(e: FormEvent) {
        if (!recipe) return;

        e.preventDefault();

        const data = {
            title: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions.split(',').map(i => i.trim()),
        };

        await fetch(`${process.env.API_URL}/recipes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        router.push(`/recipes/${id}`);
    }
    if (!recipe) return <p>Loading...</p>;
    return (
        <>
            <h2>Edit Recipe</h2>
            <form onSubmit={handleSubmit}>
                <p><input value={recipe.title} onChange={e => setRecipe({ ...recipe, title: e.target.value })} /></p>
                <p><textarea value={recipe.ingredients.join(', ')} onChange={e => setRecipe({ ...recipe, ingredients: e.target.value.split(',').map(i => i.trim()) })} /></p>
                <p><textarea value={recipe.instructions} onChange={e => setRecipe({ ...recipe, instructions: e.target.value })} /></p>
                <button type="submit">Update</button>
            </form>
        </>
    );
}