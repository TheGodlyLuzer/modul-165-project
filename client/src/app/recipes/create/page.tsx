'use client';

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type Ingredient = { name: string; amount: string; unit: string };
type Step = { description: string; time: string };

export default function CreatePage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { name: '', amount: '', unit: '' },
    ]);
    const [steps, setSteps] = useState<Step[]>([
        { description: '', time: '' },
    ]);
    const router = useRouter();

    const addIngredient = () =>
        setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };
    const handleIngredientChange = (
        index: number,
        field: keyof Ingredient,
        value: string
    ) => {
        const newList = [...ingredients];
        newList[index][field] = value;
        setIngredients(newList);
    };

    const addStep = () => setSteps([...steps, { description: '', time: '' }]);
    const removeStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index));
    };
    const handleStepChange = (
        index: number,
        field: keyof Step,
        value: string
    ) => {
        const newList = [...steps];
        newList[index][field] = value;
        setSteps(newList);
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        await fetch(`${process.env.API_URL}/recipes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                image: imageUrl,
                ingredients,
                instructions: steps,
            }),
        });

        router.push('/');
    }

    return (
        <section className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Rezept erstellen</h2>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow p-6 space-y-6"
            >
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
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

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
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

                <div>
                    <label
                        htmlFor="image"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Bild URL
                    </label>
                    <input
                        id="image"
                        type="url"
                        value={imageUrl}
                        required
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Zutaten
                    </h3>
                    <div className="space-y-4">
                        {ingredients.map((ing, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-10 gap-4 items-end"
                            >
                                <div className="col-span-3">
                                    <label
                                        htmlFor={`ing-name-${idx}`}
                                        className="block text-sm text-gray-700 mb-1"
                                    >
                                        Name
                                    </label>
                                    <input
                                        id={`ing-name-${idx}`}
                                        type="text"
                                        value={ing.name}
                                        onChange={(e) =>
                                            handleIngredientChange(idx, 'name', e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label
                                        htmlFor={`ing-amount-${idx}`}
                                        className="block text-sm text-gray-700 mb-1"
                                    >
                                        Menge
                                    </label>
                                    <input
                                        id={`ing-amount-${idx}`}
                                        type="text"
                                        value={ing.amount}
                                        onChange={(e) =>
                                            handleIngredientChange(idx, 'amount', e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label
                                        htmlFor={`ing-unit-${idx}`}
                                        className="block text-sm text-gray-700 mb-1"
                                    >
                                        Einheit
                                    </label>
                                    <input
                                        id={`ing-unit-${idx}`}
                                        type="text"
                                        value={ing.unit}
                                        onChange={(e) =>
                                            handleIngredientChange(idx, 'unit', e.target.value)
                                        }
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
                    <button
                        type="button"
                        onClick={addIngredient}
                        className="mt-2 text-blue-600 text-sm"
                    >
                        + Add Ingredient
                    </button>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Schritte
                    </h3>
                    <div className="space-y-4">
                        {steps.map((step, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-x-4 space-y-2">
                                <div className="col-span-9">
                                    <label
                                        htmlFor={`step-desc-${idx}`}
                                        className="block text-sm text-gray-700 mb-1"
                                    >
                                        Beschreibung
                                    </label>
                                    <textarea
                                        id={`step-desc-${idx}`}
                                        rows={2}
                                        value={step.description}
                                        onChange={(e) =>
                                            handleStepChange(idx, 'description', e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="col-span-2 flex items-center space-x-4">
                                    <div>
                                        <label
                                            htmlFor={`step-time-${idx}`}
                                            className="block text-sm text-gray-700 mb-1"
                                        >
                                            Zeit (mins)
                                        </label>
                                        <input
                                            id={`step-time-${idx}`}
                                            type="number"
                                            value={step.time}
                                            onChange={(e) =>
                                                handleStepChange(idx, 'time', e.target.value)
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    {steps.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeStep(idx)}
                                            className="col-span-1 text-red-500 text-sm"
                                        >
                                            Entfernen
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={addStep}
                        className="mt-2 text-blue-600 text-sm"
                    >
                        + Hinzufügen
                    </button>
                </div>

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
