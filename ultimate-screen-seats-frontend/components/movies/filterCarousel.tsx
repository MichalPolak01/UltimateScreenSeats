"use client"

import { Button } from "@nextui-org/button";


export default function FilterCarousel({
    activeFilter,
    onFilterChange,
}: {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}) {

    const options = [
        { filter: "", text: "Wszystkie" },
        { filter: "action", text: "Akcja" },
        { filter: "animation", text: "Animowane" },
        { filter: "adventure", text: "Przygodowe" },
        { filter: "horror", text: "Horrory" },
        { filter: "documentary", text: "Dokumentacyjne" },
        { filter: "romance", text: "Romense" },
        { filter: "kids", text: "Dla dzieci" },
        { filter: "comedy", text: "Komedie" },
    ];

    return (
        <div className="flex flex-row flex-wrap justify-center gap-3 py-5 mt-5">
            {options.map(({ filter, text }) => (
                <Button
                    key={filter}
                    className={`px-6 py-2 rounded ${activeFilter === filter ? "bg-primary text-white" : "bg-default-300 text-default-700"
                        }`}
                    radius="lg"
                    onClick={() => {
                        onFilterChange(filter);
                    }}
                >
                    {text}
                </Button>
            ))}
        </div>
    );
}