"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Tab, Tabs } from "@nextui-org/tabs";
import React, { Key, useState } from "react";
import ReservationsList from "@/components/reservations/reservations-list";

export default function Page() {
    const [selected, setSelected] = useState("reservations");

    const handleSelectionChange = (key: Key) => {
        setSelected(key as string);
    };

    return (
        <div className="flex flex-col justify-center mt-10">
            <Card className="w-full p-8">
                <CardHeader className="p-2 flex-col items-start border-b-2 border-default-200 mb-4">
                    <h1 className="text-primary text-4xl font-semibold mb-2">Moje Rezerwacje</h1>
                    <h2 className="text-default-500 text-lg">Zarządzaj swoimi rezerwacjami.</h2>
                </CardHeader>
                <CardBody className="overflow-hidden flex flex-col">
                    <Tabs
                        aria-label="Rezerwacje"
                        className="vertical-tabs"
                        isVertical={false}
                        selectedKey={selected}
                        size="md"
                        onSelectionChange={handleSelectionChange}
                    >
                        <Tab key="reservations" title="Moje Rezerwacje">
                            <ReservationsList />
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </div>
    );
}
