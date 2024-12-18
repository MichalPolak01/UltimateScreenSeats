"use client"

import Image from 'next/image'
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/authProvider";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/showToast";
import MovieCard from '@/components/movieCard';


const MOVIES_URL = "api/movies";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);

  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(MOVIES_URL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
  
        if (response.status === 401) {
          auth.loginRequired();
  
          return null;
        }
  
        if (!response.ok) {
          throw new Error("Failed to fetch movies.");
        }
  
        const data = await response.json();
  
        setMovies(data);
      } catch (error) {
        showToast("Nie udało się pobrać filmów.", true);
  
        return null;
      }
    }

    fetchMovies();
  }, [auth]);

  return (
    <div>
      <div className="relative h-[50svh] w-full rounded-b-2xl overflow-hidden flex items-center justify-center">
        <Image
          fill
          alt=""
          className="absolute inset-0 object-cover w-full h-full"
          src="/images/slider.jpg"
        />

        <div className="absolute inset-0 bg-black opacity-50 flex flex-col" />
          <div className='flex flex-col gap-2'>
          <h1 className="relative z-10 text-white text-6xl font-semibold text-center italic">
            Witaj w <span className='text-primary font-semibold'>UltimateScreeenSeats</span>
          </h1>
          <h2  className="relative z-10 text-white text-2xl font-light text-center italic">
            Rezerwuj wybrane miejsca na wymarzone filmy.
          </h2>
          </div>

      </div>

      <section className='py-16 px-8 max-w-[1640px] m-auto flex flex-row flex-wrap justify-around gap-8'>
        {Array.from({ length: 20 }).map((_, index) => (
          movies.map((movie) => (
            <MovieCard movie={movie} key={`${movie.id}-${index}`} />
          ))
        ))}
      </section>
    </div>
  );
}
