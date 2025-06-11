'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import { Recipe } from '@/models/recipe';
import {apiUrl} from "@/app/utils/apiUrl";

export default function HomePage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const query = debouncedSearch.trim()
                    ? `?q=${encodeURIComponent(debouncedSearch.trim())}`
                    : '';
                const res = await fetch(
                    `${apiUrl()}/recipes${query}`,
                    { cache: 'no-store' }
                );
                const data: Recipe[] = await res.json();

                console.log(data);
                setRecipes(data);
            } catch (err) {
                console.error('Fehler beim Laden der Rezepte', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [debouncedSearch]);

    return (
        <section className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Alle Rezepte</h2>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Rezepte suchen..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {loading ? (
                <p className="text-center col-span-3">Lade Rezepte…</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.length <= 0 || (console.log(recipes)) ? (
                        <div className="flex items-center justify-center col-span-3">
                            <p className="text-center">
                                Keine Rezepte gefunden.
                                <br />
                                <Link href="/recipes/create">
                                    <span className="text-blue-600 hover:underline">Rezept erstellen</span>
                                </Link>
                            </p>
                        </div>
                    ) : (
                        recipes.map(r => (
                            <Link
                                key={r._id}
                                href={`/recipes/${r._id}`}
                                className="group block bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-200 p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{r.title}</h3>
                                    <div className="flex items-center justify-center bg-blue-300 px-1 py-0.5 rounded text-xs text-blue-800">
                                        ({r.instructions.reduce((sum, s) => sum + Number(s.time), 0)} min)
                                    </div>
                                </div>

                                <p className="line-clamp-2 mb-4 h-12 text-gray-600">{r.description}</p>

                                <div className="w-full aspect-video bg-zinc-200 rounded-md overflow-hidden">
                                    <img
                                        src={
                                            r.image ||
                                            'https://www.bachsermaert.ch/wp-content/uploads/2022/02/placeholder.png'
                                        }
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-gray-500">
                    {r.ingredients.length} {r.ingredients.length === 1 ? 'Zutat' : 'Zutaten'}
                  </span>
                                </div>

                                <div className="text-blue-600 font-medium mt-6 group-hover:underline">
                                    Rezept ansehen →
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </section>
    );
}
