import {Recipe} from "@/models/recipe";
import Link from "next/link";
import {notFound} from "next/navigation";
import {apiUrl} from "@/app/utils/apiUrl";
import DeleteButton from "@/components/DeleteButton";

type Props = {
    params: Promise<{ id: string }>;
}

export default async function RecipePage({params}: Props) {
    const {id} = await params;

    console.log(apiUrl());

    const res = await fetch(`${apiUrl()}/recipes/${id}`, {cache: "no-store"});
    if (!res.ok)
        notFound();

    const recipe: Recipe = await res.json();

    return (
        <section className="container mx-auto px-4 py-8">
            <article className="bg-white rounded-2xl shadow-md p-8">
                <header className="grid grid-cols-2 gap-x-4 mb-8">
                    <div className="col-span-2 md:col-span-1">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                            {recipe.title}
                        </h1>
                        <p>
                            {recipe.description}
                        </p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="w-full aspect-video bg-zinc-200 rounded-md overflow-hidden">
                            <img
                                src={recipe.image ?? 'https://www.bachsermaert.ch/wp-content/uploads/2022/02/placeholder.png'}
                                className="w-full h-full object-contain"/>
                        </div>
                    </div>
                </header>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Zutaten
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {recipe.ingredients.map((ing, idx) => (
                            <li key={idx}>
                                {ing.name} <span className="text-gray-500">({ing.amount} {ing.unit})</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Anleitung
                    </h2>
                    <div className="prose prose-lg text-gray-700 space-y-4">
                        {recipe.instructions.map((step, idx) => (
                            <div key={idx} className="flex flex-col">
                                <div className="flex flex-row space-x-2">
                                    <strong>{idx + 1}.</strong>

                                    <div
                                        className="flex items-center justify-center bg-blue-300 px-1 py-0.5 rounded text-xs text-blue-800">
                                        ({step.time ?? (Math.random() * 100).toFixed()} min)
                                    </div>
                                </div>
                                <p>
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/"
                        className="inline-block px-5 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
                    >
                        ← Alle Rezepte
                    </Link>
                    <Link
                        href={`/recipes/${id}/edit`}
                        className="inline-block px-5 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition"
                    >
                        Rezept bearbeiten
                    </Link>
                    <DeleteButton id={id}/>
                </footer>
            </article>
        </section>
    );
}