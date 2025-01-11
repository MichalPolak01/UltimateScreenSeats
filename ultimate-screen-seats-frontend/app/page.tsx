"use client"

import { useEffect, useState } from "react";
import Image from 'next/image'
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/providers/authProvider";
import { showToast } from "@/lib/showToast";
import MovieCard from '@/components/movie-card/movieCard';
import FilterCarousel from "@/components/movies/filterCarousel";

const MOVIES_URL = "api/movies";


export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const [activeFilter, setActiveFilter] = useState<string>(filter ? filter : "");

  const auth = useAuth();

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
      } catch {
        showToast("Nie udało się pobrać filmów.", true);
  
        return null;
      }
    }

    fetchMovies();
  }, [auth]);

  return (
    <div>
      <div className="relative h-[40svh] p-[4rem] w-full rounded-b-2xl overflow-hidden flex items-end justify-center">
        <Image
          fill
          alt=""
          className="absolute inset-0 object-cover w-full h-full"
          src="/images/slider.jpg"
        />

        <div className="absolute inset-0 bg-black opacity-50 flex flex-col" />
          <div className='flex flex-col gap-2'>
          <h1 className="relative z-10 text-white md:text-6xl text-3xl font-semibold text-center italic">
            Witaj w <span className='text-primary font-semibold'>UltimateScreeenSeats</span>
          </h1>
          <h2  className="relative z-10 text-white md:text-2xl text-lg font-light text-center italic">
            Rezerwuj wybrane miejsca na wymarzone filmy.
          </h2>
          </div>
      </div>

      <FilterCarousel activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <section className='py-8 px-8 max-w-[1640px] m-auto flex flex-row flex-wrap justify-center gap-8'>
        {Array.from({ length: 5 }).map((_, index) => (
          movies.map((movie) => (
            <MovieCard key={`${movie.id}-${index}`} movie={movie} />
          ))
        ))}
      </section>
    </div>
  );
}
