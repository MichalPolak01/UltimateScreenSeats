export interface Movie {
    title: string;
    description?: string;
    release_date: string;
}

export interface Showing {
    id: number;
    movie: Movie;
    date: string;
    ticket_price: number;
}

export interface Reservation {
    id: number;
    user_id: number;
    seat_row: string;
    seat_column: string;
    showing: Showing;
}