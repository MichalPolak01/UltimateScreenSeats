"use client";

import { useAuth } from "@/providers/authProvider";
import { useEffect, useState } from "react";
import { Reservation } from "@/app/interfaces/reservation";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

const RESERVATIONS_URL = "/api/reservation";

export default function Reservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { authToken, userId } = useAuth();

    useEffect(() => {
        const fetchReservations = async () => {
            if (!authToken || !userId) {
                setError("Nieprawidłowy token lub brak userId.");
                return;
            }
            const url = `${RESERVATIONS_URL}?user_id=${userId}`;

            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    const data = await response.json();
                    setError(data.error || "Wystąpił błąd przy pobieraniu rezerwacji.");
                } else {
                    const data = await response.json();
                    setReservations(data);
                }
            } catch (err) {
                setError("Wystąpił błąd podczas pobierania danych.");
            }
        };

        fetchReservations();
    }, [authToken, userId]);

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-800">
                <div className="bg-red-500 text-white p-4 rounded-md">
                    <h2 className="font-semibold">Błąd:</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center mt-10">
            <Card className="w-full p-8">
                <CardHeader className="p-2 flex-col items-start border-b-2 border-default-200 mb-4">
                    <h1 className="text-primary text-4xl font-semibold mb-2">Moje Rezerwacje</h1>
                    <h2 className="text-default-500 text-lg">Wszystkie twoje rezerwacje w jednym miejscu.</h2>
                </CardHeader>
                <CardBody className="overflow-hidden flex flex-col">
                    {reservations.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reservations.map((reservation) => (
                                <Card key={reservation.id} className="bg-gray-900 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <h2 className="text-xl font-semibold mb-2">{reservation.showing.movie.title}</h2>
                                    </CardHeader>
                                    <CardBody>
                                        <p className="mb-2">
                                            <strong>Data:</strong> {new Date(reservation.showing.date).toLocaleString()}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Rząd:</strong> {reservation.seat_row}, <strong>Miejsce:</strong> {reservation.seat_column}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Cena:</strong> {reservation.showing.ticket_price} PLN
                                        </p>
                                        <Button className="w-full" color="default" size="sm">
                                            Zrezygnuj z rezerwacji
                                        </Button>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400">Brak rezerwacji.</p>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
