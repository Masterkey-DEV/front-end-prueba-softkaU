"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [previousAccess, setPreviousAccess] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const access = JSON.parse(
      sessionStorage.getItem("previousAccess") || "null"
    );
    console.log(access);
    setPreviousAccess(access);
  }, []);

  const handlePlay = () => {
    router.push("/bingo");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
      {previousAccess ? (
        <h1 className="text-5xl font-bold mb-6">
          ¡Bienvenido de nuevo a Bingo Game!
        </h1>
      ) : (
        <h1 className="text-5xl font-bold mb-6">¡Bienvenido a Bingo Game!</h1>
      )}
      <p className="text-lg text-center mb-10 max-w-md">
        Únete a la diversión y desafía a tus amigos en una partida de Bingo
        emocionante. ¿Listo para ganar?
      </p>
      <button
        onClick={handlePlay}
        className="bg-yellow-400 text-indigo-900 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-yellow-500 transition duration-300 ease-in-out"
      >
        Jugar
      </button>
    </div>
  );
}
