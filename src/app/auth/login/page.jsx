"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Definir el esquema de validación
const schema = yup.object().shape({
  name: yup.string().required("User is required"),
  email: yup
    .string()
    .email("Email is invalid")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email domain is invalid"
    )
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Estado de carga
  const router = useRouter();
  function handleRegister() {
    router.push("/auth/register");
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = handleSubmit(async (data) => {
    console.log(data);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const responseData = await response.json();
      console.log(responseData);
      if (response.ok) {
        sessionStorage.setItem("previousAccess", JSON.stringify(true));
        router.push("/bingo");
      } else {
        setError(responseData.message);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  });

  return (
    <div className="flex flex-col w-[90vw] mx-auto h-[100vh] items-center justify-center font-bold text-slate-300">
      <h1 className="text-3xl mb-4">Login</h1>
      <form
        onSubmit={handleSubmitForm}
        className="flex flex-col border-2 border-black rounded-md p-4 w-80 gap-4"
      >
        <input
          className="p-2 rounded-md outline-none bg-slate-700"
          type="text"
          placeholder="User"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}

        <input
          className="p-2 rounded-md outline-none bg-slate-700"
          type="email"
          placeholder="Email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <input
          className="p-2 rounded-md outline-none bg-slate-700"
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading} // Deshabilitar mientras carga
          className={`bg-sky-400 hover:bg-sky-500 hover:shadow-md text-slate-800 px-4 py-2 rounded-md ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}{" "}
          {/* Cambiar texto mientras carga */}
        </button>
        <p>
          No tienes una cuenta?{" "}
          <span
            onClick={handleRegister}
            className="underline  text-blue-800 cursor-pointer hover:text-blue-700 hover:shadow-sm"
          >
            Regístrate
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
