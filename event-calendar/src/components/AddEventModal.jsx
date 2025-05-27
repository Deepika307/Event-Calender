import React from "react";
import { X } from "lucide-react";

const AddEventModal = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  eventForm,
  setEventForm,
  isEditing,
  colorOptions,
}) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-stone-300 rounded-lg p-6 w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-darkbrown">
            {isEditing ? "Edit Event" : "Add Event"}
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X className="text-gray-600 hover:text-slate-800" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-darkbrown font-medium">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={eventForm.title}
                onChange={handleInputChange}
                placeholder="Add title"
                className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-walnut"
                required
              />
            </div>

            {selectedDate && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm text-darkbrown font-medium">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={eventForm.date}
                    onChange={handleInputChange}
                    className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-walnut"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-darkbrown font-medium">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={eventForm.startTime || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-walnut"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-darkbrown font-medium">
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={eventForm.endTime || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-walnut"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-darkbrown font-medium">
                Description
              </label>
              <textarea
                name="description"
                value={eventForm.description || ""}
                onChange={handleInputChange}
                placeholder="Add a description"
                rows="3"
                className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-walnut"
              />
            </div>

            <div>
              <label className="block text-sm text-darkbrown font-medium mb-1">
                Event Color
              </label>
              <div className="flex gap-3">
                {colorOptions.map((color) => (
                  <button
                    type="button"
                    key={color.hex}
                    className={`w-8 h-8 rounded-full ${
                      eventForm.color === color.hex
                        ? "ring-2 ring-offset-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() =>
                      setEventForm({ ...eventForm, color: color.hex })
                    }
                    title={color.name}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-darkbrown font-medium">
                Recurrence
              </label>
              <select
                name="recurrence"
                value={eventForm.recurrence}
                onChange={handleInputChange}
                className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-walnut"
              >
                <option value="none">No recurrence</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:z-10 focus:ring-4 focus:ring-blue-100"
              >
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
