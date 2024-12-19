import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Reservation } from "@/app/interfaces/reservation";

interface ReservationItemProps {
    reservation: Reservation;
    onDelete: (reservationId: number) => void;
}

const ReservationItem: React.FC<ReservationItemProps> = ({ reservation, onDelete }) => {
    return (
        <Card key={reservation.id} className="bg-gray-900 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full aspect-w-1 aspect-h-1">
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
                <Button
                    className="w-full"
                    color="danger"
                    size="sm"
                    onClick={() => onDelete(reservation.id)}
                >
                    Zrezygnuj z rezerwacji
                </Button>
            </CardBody>
        </Card>
    );
};

export default ReservationItem;
