"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { registerRoute } from "@/utils/APIRoutes";
import { useRouter } from "next/navigation";

export default function Register() {
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

    if (values.username == "") {
      setErrMsg("Required");
      return;
    }

    const data = await axios.post(registerRoute, values);

    if (data.data.status === 0) {
      setErrMsg(data.data.msg);
    }
    if (data.data.status === 1) {
      setErrMsg("");
      router.push("/login");
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

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
