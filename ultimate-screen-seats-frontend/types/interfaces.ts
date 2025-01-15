// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Movie {
    id: number
    title: string
    description: string
    genre: Genre[]
    movie_length: number
    age_classification: number
    image: string
    release_date: string
    background_image: string
    trailer_url: string
    cast: string
    director: string
}

interface Genre {
    id: number
    name: string
}