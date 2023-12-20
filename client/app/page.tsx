"use client";
import {
  allUsersRoute,
  host,
  recieveMessageRoute,
  sendMessageRoute,
} from "@/utils/APIRoutes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

type Contacts = { _id: string; username: string };
type Messages = { fromSelf: boolean; message: string };

export default function Home() {
  const router = useRouter();
  const socket = useRef<any>();
  const [userName, setUserName] = useState();
  const [currentChat, setCurrentChat] = useState<Contacts>();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<Messages>();
  const [contacts, setContacts] = useState<Contacts[]>([]);

  const fetchContacts = async () => {
    const data = await axios.get(
      `${allUsersRoute}/${
        JSON.parse(localStorage.getItem("user") || "[]").username
      }`
    );
    setContacts(data.data);
  };

  const fetchMessages = async () => {
    if (currentChat) {
      const response = await axios.post(recieveMessageRoute, {
        from: JSON.parse(localStorage.getItem("user") || "[]")._id,
        to: currentChat._id,
      });

      setMessages(response.data);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      router.push("/login");
    } else {
      setUserName(JSON.parse(localStorage.getItem("user") || "[]").username);
      fetchContacts();
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [currentChat]);

  useEffect(() => {
    if (userName) {
      socket.current = io(host);
      socket.current.emit(
        "add-user",
        JSON.parse(localStorage.getItem("user") || "[]")._id
      );
    }
  }, [userName]);

  const handleClickLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleSendMsg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await JSON.parse(localStorage.getItem("user") || "[]");
    socket.current.emit("send-msg", {
      to: currentChat?._id,
      from: data._id,
      msg,
    });

    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat?._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
    setMsg("");
  };

  useEffect(() => {
    if (socket.current) {
      socket.current?.on("msg-recieve", (msg: string) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket.current]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-4">
        <h1 className="mb-4">
          Welcome, <span>{userName}!</span> |{" "}
          <a
            href="#"
            onClick={handleClickLogout}
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Logout
          </a>
        </h1>
        <div className="max-w-6xl mx-auto bg-white shadow-md overflow-hidden sm:rounded-md p-4">
          <div className="flex flex-row flex-wrap py-4">
            <div className="flex flex-col m-4 items-center">
              <div className="flex mb-4">Contact List</div>
              {contacts.map((contact) => {
                return (
                  <a
                    href="#"
                    onClick={() => setCurrentChat(contact)}
                    key={contact._id}
                    className={
                      currentChat?._id == contact._id
                        ? "flex mb-4 bg-blue-500 text-white"
                        : "flex mb-4 hover:bg-gray-200"
                    }
                  >
                    {contact.username}
                  </a>
                );
              })}
            </div>
            <div className="flex flex-col m-4">
              {!currentChat?._id ? (
                "Please select a chat to Start messaging."
              ) : (
                <div className="flex flex-col">
                  <div className="flex flex-col-reverse m-4 chat-messages h-[50vh] overflow-y-scroll">
                    {messages.toReversed().map((message, index: number) => {
                      return (
                        <span
                          key={index}
                          className={
                            message.fromSelf == false
                              ? "mb-4 bg-slate-200"
                              : "mb-4 text-right"
                          }
                        >
                          {message.message}
                        </span>
                      );
                    })}
                  </div>
                  <form
                    className="flex input-container"
                    onSubmit={(e) => handleSendMsg(e)}
                  >
                    <input
                      type="text"
                      placeholder={"Message with " + currentChat.username}
                      onChange={(e) => setMsg(e.target.value)}
                      value={msg}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mx-2"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
