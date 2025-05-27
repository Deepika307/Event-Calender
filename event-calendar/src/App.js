import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import AddEventModal from "./components/AddEventModal";
import "./App.css";

const Event = ({ event, date, onEdit, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "event",
    item: { event, originalDate: date },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "event",
    drop: (item) => onDrop(item.event, item.originalDate, date),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`event p-1 rounded mb-1 text-white ${
        isDragging ? "opacity-50" : ""
      } ${isOver ? "border-2 border-dashed border-white" : ""}`}
      onClick={(e) => onEdit(event, date, e)}
      style={{ backgroundColor: event.color }}
    >
      {event.title}
    </div>
  );
};

const App = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    id: null,
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    recurrence: "none",
    color: "#5e3023",
  });

  const colorOptions = [
    { name: "Green", hex: "#00b894" },
    { name: "Red", hex: "#d63031" },
    { name: "Pink", hex: "#e84393" },
    { name: "Yellow", hex: "#fdcb6e" },
    { name: "Purple", hex: "#6c5ce7" },
  ];

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const openModal = (date = null) => {
    setSelectedDate(date);
    setEventForm({
      id: null,
      title: "",
      date: date ? date.toISOString().split("T")[0] : "",
      startTime: "",
      endTime: "",
      description: "",
      recurrence: "none",
      color: "#5e3023",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
  };

  const handleEditEvent = (event, date, e) => {
    e.stopPropagation();
    setEventForm({
      id: event.id,
      title: event.title,
      date: date.toISOString().split("T")[0],
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description,
      recurrence: event.recurrence,
      color: event.color,
    });
    setSelectedDate(date);
    setModalOpen(true);
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isTimeOverlap = (newEvent, date) => {
    return events.some((ev) => {
      const sameDay = new Date(ev.date).toDateString() === date.toDateString();
      if (!sameDay || ev.id === newEvent.id) return false;

      return (
        (newEvent.startTime >= ev.startTime &&
          newEvent.startTime < ev.endTime) ||
        (newEvent.endTime > ev.startTime && newEvent.endTime <= ev.endTime) ||
        (newEvent.startTime <= ev.startTime && newEvent.endTime >= ev.endTime)
      );
    });
  };

  const handleDropEvent = (event, originalDate, newDate) => {
    if (originalDate.toDateString() === newDate.toDateString()) return;

    const potentialConflict = events.some((e) => {
      const sameDay =
        new Date(e.date).toDateString() === newDate.toDateString();
      if (!sameDay || e.id === event.id) return false;

      return (
        (event.startTime >= e.startTime && event.startTime < e.endTime) ||
        (event.endTime > e.startTime && event.endTime <= e.endTime) ||
        (event.startTime <= e.startTime && event.endTime >= e.endTime)
      );
    });

    if (potentialConflict) {
      alert("Cannot move event - time conflict with existing event!");
      return;
    }

    const updatedEvent = { ...event, date: newDate };
    setEvents(events.map((e) => (e.id === event.id ? updatedEvent : e)));
  };

  const saveEvent = () => {
    if (!eventForm.title.trim() || !selectedDate) return;

    const newEvent = {
      id: eventForm.id || Date.now(),
      title: eventForm.title.trim(),
      date: selectedDate,
      startTime: eventForm.startTime,
      endTime: eventForm.endTime,
      description: eventForm.description,
      recurrence: eventForm.recurrence,
      color: eventForm.color,
    };

    if (isTimeOverlap(newEvent, selectedDate)) {
      alert("This event overlaps with another event!");
      return;
    }

    if (eventForm.id) {
      setEvents(events.map((e) => (e.id === eventForm.id ? newEvent : e)));
    } else {
      setEvents([...events, newEvent]);
    }

    closeModal();
  };

  const shouldShowEvent = (event, date) => {
    const eventDate = new Date(event.date);

    if (event.recurrence === "none")
      return eventDate.toDateString() === date.toDateString();
    if (event.recurrence === "daily") return eventDate <= date;
    if (event.recurrence === "weekly")
      return eventDate <= date && date.getDay() === eventDate.getDay();
    if (event.recurrence === "monthly")
      return eventDate <= date && date.getDate() === eventDate.getDate();
    if (event.recurrence === "yearly")
      return (
        eventDate <= date &&
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth()
      );

    return false;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const calendarCells = [];

    for (let i = 0; i < firstDay; i++) {
      calendarCells.push(<div className="day empty" key={`empty-${i}`}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const key = date.toDateString();
      const isToday = date.toDateString() === today.toDateString();

      calendarCells.push(
        <div
          className={`day ${isToday ? "today" : ""}`}
          key={key}
          onClick={() => openModal(date)}
        >
          <div className="date">{day}</div>
          {events
            .filter((event) => shouldShowEvent(event, date))
            .map((event) => (
              <Event
                key={event.id}
                event={event}
                date={date}
                onEdit={handleEditEvent}
                onDrop={handleDropEvent}
              />
            ))}
        </div>
      );
    }

    return calendarCells;
  };

  const monthYearString = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    {
      month: "long",
      year: "numeric",
    }
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div className="flex justify-between items-center px-4 py-4">
          <h1 className="title">Event Calendar</h1>
          <button
            className="bg-[#5e3023] hover:bg-[#895737] text-white font-medium py-2 px-4 rounded"
            onClick={() => openModal()}
          >
            + Add Event
          </button>
        </div>

        <div className="navigation">
          <button onClick={goToPreviousMonth}>⟨</button>
          <span>{monthYearString}</span>
          <button onClick={goToNextMonth}>⟩</button>
        </div>

        <div className="calendar">{renderCalendar()}</div>

        <AddEventModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSave={saveEvent}
          selectedDate={selectedDate}
          eventForm={eventForm}
          setEventForm={setEventForm}
          isEditing={!!eventForm.id}
          colorOptions={colorOptions}
        />
      </div>
    </DndProvider>
  );
};

export default App;
