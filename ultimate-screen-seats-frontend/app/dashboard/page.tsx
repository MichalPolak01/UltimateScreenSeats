"use client"

import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@nextui-org/card";
import { Tab, Tabs } from "@nextui-org/tabs";
import { GalleryVertical, Music2, Video } from "lucide-react";
import { useEffect, useState } from "react";

import ConfirmDeleteModal from "@/components/dashboard/movies/movieDelete";
import DetailsModal from "@/components/dashboard/movies/movieDetail";
import EditModal from "@/components/dashboard/movies/movieEdit";
import MoviesTable from "@/components/dashboard/movies/moviesTable";
import { showToast } from "@/lib/showToast";
import HallTable from "@/components/dashboard/cinema-rooms/cinemaRoomsTable";
import EditHallModal from "@/components/dashboard/cinema-rooms/hallEdit";
import ConfirmHallDeleteModal from "@/components/dashboard/cinema-rooms/hallDelete";


const MOVIES_URL = "api/movies";
const HALLS_URL = "api/halls";
const GENRES_URL = 'api/movies/genres'

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [halls, setHalls] = useState<CinemaRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedMovie, setSelectedResource] = useState<Movie | undefined>(undefined);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedHall, setSelectedHall] = useState<CinemaRoom | undefined>(undefined);
  const [isEditHallModalOpen, setEditHallModalOpen] = useState(false);
  const [isDeleteHallModalOpen, setDeleteHallModalOpen] = useState(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(MOVIES_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch movies.");
      }

      const data = await response.json();

      setMovies(data);
    } catch {
      showToast("Nie udało się pobrać filmów.", true);

      return null;
    } finally {
      setLoading(false);
    }
  }

  const fetchGenres = async () => {
    try {
      const response = await fetch(GENRES_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch movies.");
      }

      const data = await response.json();

      setGenres(data);
    } catch {
      showToast("Nie udało się pobrać gatunków filmów.", true);

      return null;
    }
  }

  const fetchHalls = async () => {
    try {
      const response = await fetch(HALLS_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch movie halls.");
      }

      const data = await response.json();

      setHalls(data);
    } catch {
      showToast("Nie udało się pobrać sal kinowych.", true);

      return null;
    }
  }

  useEffect(() => {
    fetchGenres();
    fetchMovies();
    fetchHalls();
  }, []);


  const handleShowDetail = (movie: Movie) => {
    setSelectedResource(movie);
    setDetailsModalOpen(true);
  };

  const handleUpdate = (movie?: Movie) => {
    setSelectedResource(movie || undefined);
    setEditModalOpen(true);
  };

  const handleDelete = (movie: Movie) => {
    setSelectedResource(movie);
    setDeleteModalOpen(true);
  };

  const handleUpdateCinemaRoom = (cinemaRoom?: CinemaRoom) => {
    setSelectedHall(cinemaRoom);
    setEditHallModalOpen(true);
  };

  const handleDeleteCinemaRoom = (cinemaRoom: CinemaRoom) => {
    setSelectedHall(cinemaRoom);
    setDeleteHallModalOpen(true);
  };

  return (
    <div className="flex w-full flex-col px-8 pt-5">
      <Tabs
        aria-label="Options"
        classNames={{
          tabList: "gap-6 w-full h-full relative rounded-none pr-8 mr-4 border-r border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]",
        }}
        color="primary"
        isVertical={true}
        variant="underlined"
      >
        <Tab
          key="movies"
          className="w-full"
          title={
            <div className="flex items-center space-x-2">
              <GalleryVertical />
              <span>Filmy</span>
              <Chip size="sm" variant="faded">
                {movies.length}
              </Chip>
            </div>
          }
        >
          <Card className="h-[80svh]">
            <CardBody>
              <MoviesTable
                loading={loading}
                movies={movies}
                setMovies={setMovies}
                onDelete={handleDelete}
                onShowDetail={handleShowDetail}
                onUpdate={handleUpdate}
              />
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="cinema-rooms"
          className="w-full"
          title={
            <div className="flex items-center space-x-2">
              <Music2 />
              <span>Sale kinowe</span>
              <Chip size="sm" variant="faded">
                {halls.length}
              </Chip>
            </div>
          }
        >
          <Card className="h-[80svh]">
            <CardBody>
              <HallTable
                halls={halls}
                loading={loading}
                onDelete={handleDeleteCinemaRoom}
                onUpdate={handleUpdateCinemaRoom}
              />
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="showings"
          title={
            <div className="flex items-center space-x-2">
              <Video />
              <span>Seanse</span>
              <Chip size="sm" variant="faded">
                1
              </Chip>
            </div>
          }
        />
      </Tabs>

      {isDetailsModalOpen && selectedMovie && (
        <DetailsModal isOpen={isDetailsModalOpen} movie={selectedMovie} onClose={() => setDetailsModalOpen(false)} />
      )}

      {isEditModalOpen && (
        <EditModal
          genres={genres}
          isOpen={isEditModalOpen}
          movie={selectedMovie}
          onClose={() => setEditModalOpen(false)}
          onSave={(updatedMovie) => {
            if (movies.some((m) => m.id === updatedMovie.id)) {
              setMovies((prev) =>
                prev.map((m) => (m.id === updatedMovie.id ? updatedMovie : m))
              );
              fetchMovies();
            } else {
              setMovies((prev) => [...prev, updatedMovie]);
              fetchMovies();
            }
          }}
        />
      )}

      {isDeleteModalOpen && selectedMovie && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          movie={selectedMovie}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => {
            setMovies((prev) => prev.filter((m) => m.id !== selectedMovie.id));
            setDeleteModalOpen(false);
          }}
        />
      )}

      {/* Cinema rooms */}
      {isEditHallModalOpen && (
        <EditHallModal
          hall={selectedHall}
          isOpen={isEditHallModalOpen}
          onClose={() => setEditHallModalOpen(false)}
          onSave={(updatedHall) => {
            if (halls.some((m) => m.id === updatedHall.id)) {
              setHalls((prev) =>
                prev.map((m) => (m.id === updatedHall.id ? updatedHall : m))
              );
              fetchHalls();
            } else {
              setHalls((prev) => [...prev, updatedHall]);
              fetchHalls();
            }
          }}
        />
      )}

      {isDeleteHallModalOpen && selectedHall && (
        <ConfirmHallDeleteModal
          hall={selectedHall}
          isOpen={isDeleteHallModalOpen}
          onClose={() => setDeleteHallModalOpen(false)}
          onConfirm={() => {
            setHalls((prev) => prev.filter((m) => m.id !== selectedHall.id));
            setDeleteHallModalOpen(false);
          }}
        />
      )}


    </div>
  );
}
