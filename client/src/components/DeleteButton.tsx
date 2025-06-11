"use client";

import {useRouter} from "next/navigation";
import {apiUrl} from "@/app/utils/apiUrl";

export default function DeleteButton({id}: {id: string}) {
    const router = useRouter();

    const deleteRecipe = async () => {
        await fetch(`${apiUrl()}/recipes/${id}`, {
            method: 'DELETE',
        });

        router.push('/');
    }

    return (
        <button type="button"
                onClick={deleteRecipe}
                className="inline-block px-5 py-3 bg-red-200 text-red-800 rounded-xl hover:bg-red-300 transition"
        >
            Löschen
        </button>
    )
}