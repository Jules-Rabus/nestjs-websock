"use client";

import { useEffect, useState } from "react";
import { ConnectionManager } from "./ConnectionManager";
import ConnectionState from "./ConnectionState";
import Events from "./Events";
import { Form } from "./Form";
import { socket } from "./socket";

export default function Chat() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      console.log(value);

      setFooEvents((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onFooEvent);
    };
  }, []);

  return (
    <div>
      <ConnectionState isConnected={isConnected} />
      <Events events={fooEvents} />
      <ConnectionManager />
      <Form />
    </div>
  );
}
