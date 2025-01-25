"use client";

import React, { useState, useEffect, use } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { showToast } from "@/lib/showToast";
import MovieLayout from "../layout";
import { Spinner } from "@nextui-org/spinner";
import { Image } from "@heroui/image";
import { Avatar } from "@nextui-org/avatar";

const MOVIES_URL = "/api/movies";
const SHOWINGS_URL = "/api/showings";
const RESERVATIONS_URL = "/api/reservations";



export default function ShowingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const [movie, setMovie] = useState<Movie>();
  const [showings, setShowings] = useState<Showing[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedShowingId, setSelectedShowingId] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<ReservationSeat[]>([]);
  const [summary, setSummary] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchShowings = async () => {
    try {
      const response = await fetch(`${SHOWINGS_URL}?movieId=${id}`);

      if (!response.ok) throw new Error("Failed to fetch showings.");
      const data = await response.json();

      setShowings(data);
    } catch {
      showToast("Nie udało się pobrać seansów.", true);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch(RESERVATIONS_URL);

      if (!response.ok) throw new Error("Failed to fetch reservations.");
      const data = await response.json();

      setReservations(data);
    } catch {
      showToast("Nie udało się pobrać rezerwacji.", true);
    }
  };

  const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${MOVIES_URL}/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 401) {
        // auth.loginRequired();

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

  useEffect(() => {
    fetchMovieDetails();
    fetchShowings();
    fetchReservations();
  }, [id]);

  const handleSeatToggle = (row: number, column: number) => {
    const selectedShowing = showings.find((showing) => showing.id === selectedShowingId);

    if (!selectedShowing) return;

    const isSelected = selectedSeats.some(
      (seat) =>
        seat.showing_id === selectedShowingId &&
        seat.seat_row === row &&
        seat.seat_column === column
    );

    if (isSelected) {
      setSelectedSeats((prev) =>
        prev.filter(
          (seat) =>
            !(
              seat.showing_id === selectedShowingId &&
              seat.seat_row === row &&
              seat.seat_column === column
            )
        )
      );

      setSummary((prev) => (prev ? prev - Number(selectedShowing.ticket_price) : 0));
    } else {
      setSelectedSeats((prev) => [
        ...prev,
        {
          showing_id: selectedShowingId!,
          seat_row: row,
          seat_column: column,
          ticket_price: Number(selectedShowing.ticket_price),
        },
      ]);

      setSummary((prev) =>
        prev ? prev + Number(selectedShowing.ticket_price) : Number(selectedShowing.ticket_price)
      );
    }
  };

  const handleReservation = async () => {
    if (!selectedShowingId) {
      showToast("Wybierz seans przed dokonaniem rezerwacji.", true);

      return;
    }

    console.log(selectedSeats);

    // try {
    //   const response = await fetch(RESERVATIONS_URL, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       // showing_id: selectedShowingId,
    //       // seats: selectedSeats,
    //       selectedSeats
    //     }),
    //   });

    //   if (!response.ok) throw new Error("Nie udało się dokonać rezerwacji.");
    //   showToast("Rezerwacja zakończona sukcesem!", false);
    //   setSelectedSeats([]);
    //   fetchReservations();
    // } catch {
    //   showToast("Wystąpił błąd podczas rezerwacji.", true);
    // }
  };

  const renderSeatLayout = (
    layout: number[][],
    reservedSeats: { row: number; column: number }[]
  ) => {
    return (
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${layout[0].length}, 1fr)` }}>
        {layout.flatMap((row, rowIndex) =>
          row.map((seat, columnIndex) => {
            if (seat === -1) {
              return (
                <div
                  key={`${rowIndex}-${columnIndex}`}
                  className="w-8 h-8 bg-transparent"
                  style={{ visibility: "hidden" }}
                />
              );
            }

            const isReserved = reservedSeats.some(
              (res) => res.row === rowIndex && res.column === columnIndex
            );
            const isSelected = selectedSeats.some(
              (seat) => seat.seat_row === rowIndex && seat.seat_column === columnIndex && seat.showing_id === selectedShowingId
            );

            return (
              <div
                key={`${rowIndex}-${columnIndex}`}
                className={`w-8 h-8 flex items-center justify-center rounded cursor-pointer ${isReserved
                    ? "bg-red-500 text-white"
                    : isSelected
                      ? "bg-primary text-white"
                      : "bg-gray-300"
                  }`}
                role="button"
                tabIndex={0}
                onClick={() => !isReserved && handleSeatToggle(rowIndex, columnIndex)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSeatToggle(rowIndex, columnIndex);
                  }
                }}
              >
                {isReserved ? "X" : ""}
              </div>
            );
          })
        )}
      </div>
    );
  };

  const selectedShowing = showings.find((showing) => showing.id === selectedShowingId);

  if (loading) {
    return (
      <div className="flex flex-row gap-4 h-full justify-center items-center">
        <Spinner />
        <p className="text-md">Loading movie details...</p>
      </div>
    );
  }

  return (
    <MovieLayout backgroundImage={movie?.background_image || ""}>
      <div className="max-w-7xl mx-auto p-8 text-white">


        <h1 className="text-4xl font-bold text-default-300 mb-6 pb-2 border-b-2 border-default-400">Rezerwacja miejsca</h1>

        <div className="w-full flex gap-8 mb-3">
          <div>
            <Avatar
              alt="HeroUI Fruit Image with Zoom"
              className="h-auto min-w-[5rem]"
              radius="sm"
              src={movie?.image}
            />
          </div>

          <div className="w-full">
            <div className="text-2xl font-semibold mb-2">
              <h2>Tytuł filmu: </h2>
              <h2 className="text-3xl mt-1 text-primary font-bold">{movie?.title}</h2>
            </div>
          </div>
        </div>

        <h2 className="flex gap-2 text-2xl font-semibold mb-1">Seans:</h2>
        <Select
          label="Wybierz datę seansu"
          placeholder="Wybierz datę"
          selectedKeys={new Set([selectedShowingId?.toString() || ""])}
          onSelectionChange={(selected) => {
            const showingId = Array.from(selected)[0];

            setSelectedShowingId(Number(showingId));
          }}
        >
          {showings.map((showing) => (
            <SelectItem key={showing.id.toString()} value={showing.id.toString()}>
              {new Date(showing.date).toLocaleString()}
            </SelectItem>
          ))}
        </Select>

        {selectedShowing && (
          <div className="mb-8 mt-3">
            <h2 className="text-2xl font-semibold mb-4">
              Wybierz miejsce/a w : {selectedShowing.cinema_room.name}
            </h2>
            {renderSeatLayout(
              selectedShowing.cinema_room.seat_layout,
              reservations
                .filter((res) => res.showing.id === selectedShowing.id)
                .map((res) => ({
                  row: res.seat_row,
                  column: res.seat_column,
                }))
            )}
          </div>
        )}

        {selectedSeats.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">Wybrane miejsca:</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {selectedSeats.map((seat, index) => {
                const showing = showings.find((show) => show.id === seat.showing_id);

                if (!showing) return null;

                return (
                  <div
                    key={index}
                    className="border border-gray-300 p-4 rounded-lg shadow-sm text-sm text-center"
                  >
                    <p>
                      <strong>Sala:</strong> {showing.cinema_room.name}
                    </p>
                    <p>
                      <strong>Rząd:</strong> {seat.seat_row + 1},&nbsp;
                      <strong>Miejsce:</strong> {seat.seat_column + 1}
                    </p>
                    <strong>Cena:</strong> {showing.ticket_price} zł
                    <p>
                      <strong>Data seansu:</strong>{" "}
                      {new Date(showing.date).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {summary &&
          <div className="mb-4">
            <h3 className="mb-2 border-b-2 border-default-400 text-2xl font-semibold text-success">Łącznie do zapłaty</h3>
            <p className="font-bold text-danger text-lg">{summary.toFixed(2)} zł</p>
          </div>
        }

        <Button
          color="primary"
          isDisabled={!selectedShowingId || selectedSeats.length === 0}
          onPress={handleReservation}
        >
          Zarezerwuj
        </Button>
      </div>
    </MovieLayout>
  );
}