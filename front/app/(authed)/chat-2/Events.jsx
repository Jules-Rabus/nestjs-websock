"use client";

export default function Events({ events }) {
  return (
    <ul>
      {events.map((event, index) => (
        <li key={index}>
          {event.sender}: {event.text}
        </li>
      ))}
    </ul>
  );
}
