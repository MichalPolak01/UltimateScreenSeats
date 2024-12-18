"use client"

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import Image from 'next/image'


interface MovieCardProps {
    movie: Movie
}


export default function MovieCard({ movie }: MovieCardProps) {

    return (
        <Card key={movie.id} isPressable shadow="sm" onPress={() => console.log("item pressed")} className="w-[20rem] h-[30rem] hover:scale-110">
          <CardBody className="relative overflow-hidden p-0 h-[140px]"> 
            <Image
              alt={movie.title}
              className="w-full object-cover h-max"
              fill={true}
              src="https://image.tmdb.org/t/p/original/jFhGZkogGy4D57c8AYcvGaDDcLw.jpg"
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>{movie.title}</b>
            <p className="text-default-500">{movie.movie_length}</p>
            <p className="text-default-500">{movie.age_classification}</p>
          </CardFooter>
        </Card>
    )
}