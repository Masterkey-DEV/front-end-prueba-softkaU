"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { Square } from "@/app/components/Square";

const Bingo = () => {
  const router = useRouter();
  const [timer, setTimer] = useState(30);
  const [players, setPlayers] = useState(0);
  const [numberPlayed, setNumberPlayed] = useState("FREE");
  const [gameCard, setGameCard] = useState(Array(5).fill(null));
  const [gameStarted, setGameStarted] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {});

    newSocket.on("game_card", (card) => {
      let cardValues = [];
      card.forEach((value) => {
        value.forEach((item) => {
          cardValues.push(item);
        });
      });
      setGameCard(cardValues);
    });

    newSocket.on("current_players", (players) => {
      setPlayers(players);
    });

    newSocket.on("waiting_players", (waitingPlayers) => {
      setPlayers(waitingPlayers);
    });

    newSocket.on("game_start", () => {
      setGameStarted(true);
    });

    newSocket.on("pre_game_timer", (timer) => {
      setTimer(timer);
    });

    newSocket.on("number_played", (numberPlayed) => {
      setNumberPlayed(numberPlayed);
    });

    newSocket.on("victory", (victory) => {
      alert(victory);
      router.push("/");
    });

    newSocket.on("lose", (lose) => {
      alert(lose, "perdedor");
      router.push("/");
    });

    newSocket.on("error", (error) => {
      alert(error);
      router.push("/");
    });

    newSocket.on("disconnect", () => {
      router.push("/");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [router]);

  const handleVictory = () => {
    if (socket) {
      socket.emit("iWin");
    } else {
      console.log("Socket no está conectado");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <h1>{gameStarted ? "En partida" : "Bingo para todos"}</h1>
      <main>
        <div className="grid grid-cols-5 grid-rows-5 items-center gap-3 p-3 rounded-sm border border-cyan-200 bg-neutral-700 ">
          {gameCard.map((card, index) => (
            <Square key={index} gameStarted={gameStarted}>
              {card}
            </Square>
          ))}
        </div>
      </main>
      {timer === 30 ? (
        <div>
          <p>En espera de más jugadores</p>
        </div>
      ) : timer > 1 ? (
        <div className="text-center">
          <p>Iniciando partida</p>
          <p>Tiempo restante: {timer}</p>
          <p>Jugadores actuales: {players}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p>Número jugado:</p>
          <div className="h-12 w-12 text-xl rounded-full text-center bg-green-400 flex items-center justify-center mb-3">
            {numberPlayed}
          </div>
        </div>
      )}

      {gameStarted && (
        <button
          onClick={handleVictory}
          className="bg-gradient-to-l  from-purple-500 to-indigo-600 hover:opacity-65 rounded-md w-40 h-8"
        >
          Bingo
        </button>
      )}
    </div>
  );
};

export default Bingo;
