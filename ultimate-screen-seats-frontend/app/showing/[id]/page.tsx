"use client";

import { useEffect, useState } from "react"; 

import Showing from "@/components/showing/Showing";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [showingId, setShowingId] = useState<number | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      if (resolvedParams.id) {
        setShowingId(parseInt(resolvedParams.id, 10));
      }
    });
  }, [params]);

  if (showingId === null) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <Showing id={showingId} />
    </div>
  );
}
