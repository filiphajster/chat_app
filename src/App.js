import "./App.css";
import Messages from "./Messages";
import Input from "./Input";
import React, { useState, useEffect, useRef } from "react";

export const randomName = () => {
  const names = ["Luka", "Marko", "Ivo", "Pero", "Maja", "Ana"];
  const surnames = [" Lukić", " Markić", " Ivić", " Perić", " Majić", " Anić"];
  const randomIndex = () => Math.floor(Math.random() * names.length);

  return `${names[randomIndex()]} ${surnames[randomIndex()]}`;
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({
    username: randomName(),
  });
  const droneRef = useRef(
    new window.Scaledrone("cuOmiSP1BJbrQV97", {
      data: user,
    })
  );

  useEffect(() => {
    const drone = droneRef.current;

    drone.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      setUser((prevUser) => ({ ...prevUser, id: drone.clientId }));
    });

    const room = drone.subscribe("observable-chatappfilip");
    room.on("data", (data, user) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Math.random(), user, text: data },
      ]);
    });
  }, []);

  const sendMessage = (message) => {
    droneRef.current.publish({
      room: "observable-chatappfilip",
      message,
    });
  };

  return (
    <div className="App">
      <Messages messages={messages} currentUser={user} />
      <Input sendMessage={sendMessage} />
    </div>
  );
};

export default App;
