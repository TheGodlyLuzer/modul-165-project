'use client';

import React, { FormEvent, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {apiUrl} from "@/app/utils/apiUrl";

type Ingredient = { name: string; amount: string; unit: string };
type Instruction = { description: string; time: string };

interface RecipeData {
    title: string;
    description: string;
    image: string;
    ingredients: Ingredient[];
    instructions: Instruction[];
}

export default function EditRecipePage() {
    const { id } = useParams();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [instructions, setInstructions] = useState<Instruction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const res = await fetch(`${apiUrl()}/recipes/${id}`, {
                cache: 'no-store',
            });
            if (!res.ok) {
                router.replace('/');
                return;
            }
            const data: RecipeData = await res.json();
            setTitle(data.title);
            setDescription(data.description);
            setImageUrl(data.image || '');
            setIngredients(
                data.ingredients.length
                    ? data.ingredients
                    : [{ name: '', amount: '', unit: '' }]
            );
            setInstructions(
                data.instructions.length
                    ? data.instructions
                    : [{ description: '', time: '' }]
            );
            setLoading(false);
        }
        load();
    }, [id, router]);

    const addIngredient = () =>
        setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
    const removeIngredient = (idx: number) =>
        setIngredients(ingredients.filter((_, i) => i !== idx));
    const onIngredientChange = (
        idx: number,
        field: keyof Ingredient,
        val: string
    ) => {
        const arr = [...ingredients];
        arr[idx][field] = val;
        setIngredients(arr);
    };

    const addInstruction = () =>
        setInstructions([...instructions, { description: '', time: '' }]);
    const removeInstruction = (idx: number) =>
        setInstructions(instructions.filter((_, i) => i !== idx));
    const onInstructionChange = (
        idx: number,
        field: keyof Instruction,
        val: string
    ) => {
        const arr = [...instructions];
        arr[idx][field] = val;
        setInstructions(arr);
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await fetch(`${apiUrl()}/recipes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                image: imageUrl,
                ingredients,
                instructions,
            }),
        });
        router.push(`/recipes/${id}`);
    }

    if (loading) {
        return (
            <section className="container mx-auto px-4 py-8">
                <p className="text-center text-lg">Lade Rezept…</p>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Rezept bearbeiten</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-6">
                {/* Titel */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Beschreibung */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Beschreibung
                    </label>
                    <textarea
                        id="description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Bild-URL */}
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                        Bild-URL
                    </label>
                    <input
                        id="image"
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Zutaten */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Zutaten</h3>
                    <div className="space-y-4">
                        {ingredients.map((ing, idx) => (
                            <div key={idx} className="grid grid-cols-10 gap-4 items-end">
                                <div className="col-span-3">
                                    <label htmlFor={`ing-name-${idx}`} className="block text-sm text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        id={`ing-name-${idx}`}
                                        type="text"
                                        value={ing.name}
                                        onChange={(e) => onIngredientChange(idx, 'name', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label htmlFor={`ing-amount-${idx}`} className="block text-sm text-gray-700 mb-1">
                                        Menge
                                    </label>
                                    <input
                                        id={`ing-amount-${idx}`}
                                        type="text"
                                        value={ing.amount}
                                        onChange={(e) => onIngredientChange(idx, 'amount', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label htmlFor={`ing-unit-${idx}`} className="block text-sm text-gray-700 mb-1">
                                        Einheit
                                    </label>
                                    <input
                                        id={`ing-unit-${idx}`}
                                        type="text"
                                        value={ing.unit}
                                        onChange={(e) => onIngredientChange(idx, 'unit', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                {ingredients.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(idx)}
                                        className="text-red-500 text-sm"
                                    >
                                        Entfernen
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addIngredient} className="mt-2 text-blue-600 text-sm">
                        + Zutat hinzufügen
                    </button>
                </div>

                {/* Anweisungen */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Anweisungen</h3>
                    <div className="space-y-4">
                        {instructions.map((inst, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-x-4 space-y-2">
                                <div className="col-span-9">
                                    <label htmlFor={`inst-desc-${idx}`} className="block text-sm text-gray-700 mb-1">
                                        Anweisung
                                    </label>
                                    <textarea
                                        id={`inst-desc-${idx}`}
                                        rows={2}
                                        value={inst.description}
                                        onChange={(e) => onInstructionChange(idx, 'description', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="col-span-2 flex items-center space-x-4">
                                    <div>
                                        <label htmlFor={`inst-time-${idx}`} className="block text-sm text-gray-700 mb-1">
                                            Dauer (Minuten)
                                        </label>
                                        <input
                                            id={`inst-time-${idx}`}
                                            type="number"
                                            value={inst.time}
                                            onChange={(e) => onInstructionChange(idx, 'time', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    {instructions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeInstruction(idx)}
                                            className="text-red-500 text-sm"
                                        >
                                            Entfernen
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addInstruction} className="mt-2 text-blue-600 text-sm">
                        + Anweisung hinzufügen
                    </button>
                </div>

                {/* Speichern */}
                <div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Speichern
                    </button>
                </div>
            </form>
        </section>
    );
}