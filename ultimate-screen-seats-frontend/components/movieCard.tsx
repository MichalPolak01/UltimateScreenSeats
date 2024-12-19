"use client"

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import {Image} from '@nextui-org/image';
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";


interface MovieCardProps {
    movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {

    const router = useRouter();

    const handleGoToMovieDetails =(id: number) => {
      router.push(`/movie/${id}`)
    }

    return (
        <Card key={movie.id} isPressable className='w-[20rem] p-[0.5rem] hover:scale-105' shadow="sm" onPress={() => handleGoToMovieDetails(movie.id)}>
          <CardBody className="relative overflow-hidden w-[100%]"> 
            <Image
              alt={movie.title}
              className="object-cover "
              // fill={true}
              src="https://image.tmdb.org/t/p/original/jFhGZkogGy4D57c8AYcvGaDDcLw.jpg"
            />
          </CardBody>
          <div className="bg-danger-100 w-10 h-10 rounded-full flex justify-center items-center z-10 absolute top-8 right-8 border-2 border-danger">
            <p className="text-danger font-medium">{movie.age_classification}</p>

          </div>
          <CardFooter className="flex-col gap-2 content-between">
            <h2 className="text-primary font-semibold text-xl">{movie.title}</h2>
            <p className="text-default-500 text-small flex items-center gap-1"><Clock size={18} /> Time:<span className="font-bold">{movie.movie_length}</span> min</p>
          </CardFooter>
        </Card>
    )
}