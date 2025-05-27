import React, { useState } from "react";
import { format } from "date-fns";

export default function EventModal({ date, events, onClose, onAddEvent }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddEvent({ title, description: desc, date });
    setTitle("");
    setDesc("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-2">
          Events on {format(date, "MMMM d, yyyy")}
        </h2>

        <ul className="mb-4 max-h-32 overflow-y-auto text-sm">
          {events.length > 0 ? (
            events.map((event, index) => (
              <li key={index} className="mb-1">
                • <strong>{event.title}</strong> – {event.description}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No events yet.</p>
          )}
        </ul>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-2 py-1 w-full rounded mb-2"
            required
          />
          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border px-2 py-1 w-full rounded mb-2"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
}
