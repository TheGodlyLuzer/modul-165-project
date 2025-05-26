import Link from "next/link";
import { Recipe } from "@/models/recipe";

export default async function HomePage() {
    const res = await fetch(`${process.env.API_URL}/recipes`, { cache: "no-store" });
    const recipes: Recipe[] = await res.json();

    return (
        <section className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Alle Rezepte</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((r) => (
                    <Link
                        key={r._id}
                        href={`/recipes/${r._id}`}
                        className="group block bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-200 p-6"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{r.title}</h3>

                        <p className="line-clamp-2 mb-4 text-gray-600">
                            {r.description}
                        </p>

                        <div className="w-full h-40 bg-zinc-200 rounded-md overflow-hidden">
                            <img src={r.image ?? 'https://www.bachsermaert.ch/wp-content/uploads/2022/02/placeholder.png'}
                                 className="w-full h-full object-contain"/>
                        </div>
                        {/*{r.description && (
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                {r.description}
                            </p>
                        )}*/}
                        <div className="text-blue-600 font-medium mt-6 group-hover:underline">
                            Rezept ansehen &rarr;
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
