"use client";

import { useState, useEffect } from "react";
import ReservationItem from "@/components/reservations/reservation-item";
import { Reservation } from "@/app/interfaces/reservation";
import ApiProxy from "@/app/api/proxy";
import { useAuth } from "@/providers/authProvider";

const RESERVATIONS_URL = "/api/reservation";

export default function ReservationsList() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { authToken, userId } = useAuth();

    const fetchReservations = async () => {
        if (!authToken || !userId) {
            setError("Nieprawidłowy token lub brak userId.");
            return;
        }
        const url = `${RESERVATIONS_URL}?user_id=${userId}`;

        try {
            const { data, status, error } = await ApiProxy.get(url, true);

            if (status === 200) {
                setReservations(Array.isArray(data) ? data : []);
            } else {
                setError(error?.message || "Wystąpił błąd przy pobieraniu rezerwacji.");
            }
        } catch (err: any) {
            console.error("Błąd podczas pobierania rezerwacji:", err);
            setError("Wystąpił błąd podczas pobierania danych.");
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [authToken, userId]);

    const handleDelete = async (reservationId: number) => {
        const url = `/api/reservation/${reservationId}`;

        try {
            const { status, error } = await ApiProxy.delete(url, true);

            if (status === 200) {
                setReservations((prevReservations) =>
                    prevReservations.filter((reservation) => reservation.id !== reservationId)
                );
            } else {
                setError(error?.message || "Nie udało się usunąć rezerwacji.");
            }
        } catch (err: any) {
            console.error("Błąd podczas usuwania rezerwacji:", err);
            setError("Błąd podczas usuwania rezerwacji.");
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {error && (
                <div className="text-red-500 text-center">
                    <p>{error}</p>
                </div>
            )}
            {reservations.length > 0 ? (
                reservations.map((reservation) => (
                    <ReservationItem
                        key={reservation.id}
                        reservation={reservation}
                        onDelete={handleDelete}
                    />
                ))
            ) : (
                <p className="text-center text-gray-500">Brak rezerwacji.</p>
            )}
        </div>
    );
}
