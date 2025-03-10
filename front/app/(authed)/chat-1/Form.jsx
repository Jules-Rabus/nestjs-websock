"use client";

import { useState } from "react";
import { socket } from "./socket";

export function Form() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    socket
      .timeout(1000)
      .emit("message", { sender: "Toto", text: value }, () => {
        setIsLoading(false);
      });
  }

  return (
    <form onSubmit={onSubmit}>
      {isLoading && <p>Loading...</p>}
      <input onChange={(e) => setValue(e.target.value)} />

      <button type="submit" disabled={isLoading}>
        Submit
      </button>
    </form>
  );
}
