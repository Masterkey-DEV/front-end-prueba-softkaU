"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as yup from "yup"; // Importa yup
import { yupResolver } from "@hookform/resolvers/yup"; // Importa el resolver de yup

// Define el esquema de validación
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
  confirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Las contraseñas no coinciden") // Verifica que coincidan
    .required("Confirm password is required"),
});

function Register() {
  const [error, setError] = useState(null);
  const router = useRouter();
  function handleLogin() {
    router.push("/auth/login");
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // Usa el resolver de yup para validaciones
  });

  const handleSubmitForm = handleSubmit(async (data) => {
    // Enviar datos a la API
    const response = await fetch("http://localhost:3001/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const dataResponse = await response.json();
    if (response.status === 201) {
      router.push("/auth/login");
    } else {
      setError(dataResponse.message);
    }
  });

  return (
    <div className="flex flex-col w-[90vw] mx-auto h-[100vh] items-center justify-center font-bold text-slate-300">
      <h1 className="text-3xl mb-4">Register</h1>
      <form
        onSubmit={handleSubmitForm}
        className="flex flex-col border-2 border-black rounded-md p-4 w-80 gap-4"
      >
        <label className="text-slate-300" htmlFor="name">
          User
        </label>
        <input
          id="name"
          className="p-2 rounded-md outline-none bg-slate-700"
          type="text"
          placeholder="user"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}

        <label className="text-slate-300" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="p-2 rounded-md outline-none bg-slate-700"
          type="email"
          placeholder="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <label className="text-slate-300" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className="p-2 rounded-md outline-none bg-slate-700"
          type="password"
          placeholder="password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        <label className="text-slate-300" htmlFor="confirm">
          Confirm Password
        </label>
        <input
          id="confirm"
          className="p-2 rounded-md outline-none bg-slate-700"
          type="password"
          placeholder="confirm password"
          {...register("confirm")}
        />
        {errors.confirm && (
          <p className="text-red-500 text-sm">{errors.confirm.message}</p>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-sky-400 hover:bg-sky-500 hover:shadow-md text-slate-800 px-4 py-2 rounded-md"
        >
          Register
        </button>
        <p>
          ya tienes una cuenta?{" "}
          <span
            className="underline text-blue-800 cursor-pointer hover:shadow-sm"
            onClick={handleLogin}
          >
            Iniciar sesión
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;
