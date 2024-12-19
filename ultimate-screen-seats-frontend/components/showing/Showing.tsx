"use client"

import { useEffect, useState } from "react"
import { Card, CardBody, CardHeader } from "@nextui-org/card"
import { Button } from "@nextui-org/button"

type SeatLayout = number[][]

export default function Showing({ id }: { id: number }) {
  const [seatLayout, setSeatLayout] = useState<SeatLayout | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<{ row: number; column: number }[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchAvailableSeats = async () => {
    try {
      const res = await fetch(`/api/showing/${id}`)
      const data = await res.json()

      console.log(data.cinema_room.seat_layout)

      if (res.ok) {
        if (Array.isArray(data.cinema_room.seat_layout)) {
          setSeatLayout(data.cinema_room.seat_layout)
        } else {
          setError("Odpowiedź z serwera jest niepoprawna.")
        }
      } else {
        setError(data?.message || "Błąd podczas pobierania dostępnych miejsc.")
      }
    } catch (err) {
      console.error("Błąd podczas pobierania dostępnych miejsc:", err)
      setError("Wystąpił błąd podczas pobierania danych.")
    }
  }

  const toggleSeatSelection = (row: number, column: number) => {
    const seatIndex = selectedSeats.findIndex(
      (seat) => seat.row === row && seat.column === column
    )
    if (seatIndex >= 0) {
      setSelectedSeats((prev) => prev.filter((_, index) => index !== seatIndex))
    } else {
      setSelectedSeats((prev) => [...prev, { row, column }])
    }
  }

  useEffect(() => {
    fetchAvailableSeats()
  }, [id])

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-lg p-8 bg-red-500 text-white rounded-lg shadow-lg">
          <CardHeader className="p-2 flex-col items-start">
            <h1 className="text-2xl font-semibold mb-2">Wystąpił błąd</h1>
          </CardHeader>
          <CardBody>
            <p className="text-lg mb-4">{error}</p>
            <Button
              color="default"
              onClick={() => window.location.reload()}
              className="w-full mt-4"
            >
              Odśwież stronę
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <Card className="w-full p-8 max-w-4xl">
        <CardHeader className="p-2 flex-col items-start border-b-2 border-default-200 mb-4">
          <h1 className="text-primary text-4xl font-semibold mb-2">Układ Sali Kinowej</h1>
          <h2 className="text-default-500 text-lg">Wybierz swoje miejsca.</h2>
        </CardHeader>
        <CardBody className="overflow-hidden flex flex-col">
          {seatLayout ? (
            <div className="grid gap-4">
              {seatLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center space-x-2">
                  {row.map((seat, columnIndex) => {
                    if (seat === -1) {
                      return (
                        <div
                          key={columnIndex}
                          className="w-8 h-8 bg-transparent"
                          style={{ visibility: "hidden" }}
                        ></div>
                      )
                    }

                    const isSelected = selectedSeats.some(
                      (selectedSeat) =>
                        selectedSeat.row === rowIndex && selectedSeat.column === columnIndex
                    )

                    const isOccupied = seat === 1

                    const seatClass = isOccupied
                      ? "bg-red-500 cursor-not-allowed"
                      : isSelected
                      ? "bg-blue-500"
                      : "bg-green-500"

                    return (
                      <input
                        type="checkbox"
                        key={columnIndex}
                        disabled={isOccupied}
                        checked={isSelected}
                        onChange={() => toggleSeatSelection(rowIndex, columnIndex)}
                        className={`w-8 h-8 cursor-pointer ${seatClass}`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">Ładowanie układu sali...</p>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
