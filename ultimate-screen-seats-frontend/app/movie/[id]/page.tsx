"use client"

import { Spinner } from "@nextui-org/spinner";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { CalendarDays, Film, LoaderPinwheel, UserRound, UsersRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@nextui-org/button";

import { showToast } from "@/lib/showToast";
import { useAuth } from "@/providers/authProvider";

const MOVIES_URL = "/api/movies";

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [movie, setMovie] = useState<Movie>();
    const [loading, setLoading] = useState(true);

    const auth = useAuth();


    useEffect(() => {
        const fetchMovieDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${MOVIES_URL}/${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (response.status === 401) {
                    auth.loginRequired();

                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch movie details.");
                }

                const data = await response.json();

                setMovie(data);
            } catch {
                showToast("Nie udało się pobrać detali filmu.", true);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id, auth]);

    if (loading) {
        return (
            <div className="flex flex-row gap-4 h-full justify-center items-center">
                <Spinner />
                <p className="text-md">Loading movie details...</p>
            </div>
        );
    }

    if (!movie) {
        return <p>Nie znaleziono filmu.</p>;
    }

    return (
        <div className="w-full h-full">
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    priority
                    alt="Movie background"
                    className="object-cover blur-sm"
                    fill={true}
                    src={movie.background_image}
                />
                <div className="absolute inset-0 bg-black bg-opacity-70 z-5" />
            </div>


            <div className="relative w-full h-[80vh] max-w-7xl mx-auto flex xl:flex-row flex-col gap-16 justify-center items-center z-10 xl:px-10 px-10">
                <div className="relative w-full h-full flex items-end xl:visible invisible">
                    <Image
                        alt="Movie image"
                        className="z-0"
                        layout="fill"
                        objectFit="contain"
                        objectPosition="bottom"
                        src={movie.image}
                    />
                </div>

                <div className="h-full text-white flex flex-col justify-end gap-2 relative z-10">
                    <h1 className="text-4xl text-primary font-bold mb-4">{movie.title}</h1>
                    <p className="text-xl mb-8">{movie.description}</p>
                    <p className="text-md flex gap-4"><UserRound /><span className="font-bold">Reżyser:</span> {movie.director}</p>
                    <p className="text-md flex gap-4"><LoaderPinwheel /><span className="font-bold">Gatunek:</span> {movie.genre}</p>
                    <p className="text-md flex gap-4"><CalendarDays /><span className="font-bold">Data wydania:</span> {movie.release_date}</p>
                    <p className="text-md flex gap-4"><UsersRound size={32} /><span className="font-bold">Obsada:</span> {movie.cast}</p>
                    <p className="text-md flex gap-4"><Film /><span className="font-bold">Trailer:</span><Link className="transition-colors-opacity hover:text-primary" href={movie.trailer_url}>{movie.trailer_url}</Link></p>

                    <Button className="mt-8" color="primary" size="lg" variant="ghost">Sprwdź seanse</Button>
                </div>
            </div>
        </div>
    );

}
