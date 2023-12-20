"use client";

import { loginRoute } from "@/utils/APIRoutes";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("user")) {
      router.push("/");
    }
  }, []);

  const [values, setValues] = useState({
    username: "",
  });

  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await axios.post(loginRoute, values);

    if (data.data.status === 0) {
      setErrMsg(data.data.msg);
    }
    if (data.data.status === 1) {
      setErrMsg("");
      localStorage.setItem("user", JSON.stringify(data.data.user));
      router.push("/");
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="mb-4">
          <div className="mb-4">
            <label className="block text-sm capitalize font-medium text-gray-600">
              Username
            </label>
            <input
              name="username"
              className="mt-1 p-2 w-full border rounded-md"
              onChange={(e) => handleChange(e)}
            />
            {errMsg && <p className="text-sm text-red-400">{errMsg}</p>}
          </div>

          <div className="flex items-center justify-end mb-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
            >
              Login
            </button>
          </div>

          <div className="mb-4">
            <Link
              href="/register"
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Register Here
            </Link>
          </div>
        </div>
      </form>
    </main>
  );
}
