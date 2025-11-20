import React, { useState } from "react";
import FormLayout from "../../Layout/FormLayout";
import DropdownSelect from "../Dropdown/DropdownSelect";
import LocationAutocomplete from "../Location/LocationAutoComplete";
import { getCoordinates } from "../../utils/getCoordinates";
import MapPreview from "../Location/MapPreview";

const categoryOptions = [
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "environment", label: "Environment" },
  { value: "animals", label: "Animals" },
  { value: "other", label: "Other" },
];

function CreateEvent({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    location: "",
    date: "",
    starttime: "",
    duration: "",
    capacity: "",
    registrationDeadline: "",
    difficulty: "",
    minAge: "",
    lat: null,
    lon: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess();
    console.log(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationBlur = async () => {
    if (!formData.location) {
      setFormData((prev) => ({ ...prev, lat: null, lon: null }));
      return;
    }
    try {
      const coords = await getCoordinates(formData.location);
      if (coords) {
        setFormData((prev) => ({ ...prev, lat: coords.lat, lon: coords.lon }));
      } else {
        setFormData((prev) => ({ ...prev, lat: null, lon: null }));
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setFormData((prev) => ({ ...prev, lat: null, lon: null }));
    }
  };

  return (
    <FormLayout
      title="Create New Event"
      description="Fill in the event information. All fields marked with * are required."
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="title">Event Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Beach Cleanup Drive"
            className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your volunteer opportunity..."
          className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="category">Category *</label>
          <DropdownSelect
            value={formData.category}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
            options={categoryOptions}
            placeholder="Select category"
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="difficulty">Difficulty *</label>
          <DropdownSelect
            value={formData.difficulty}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, difficulty: value }))
            }
            options={[
              { value: "easy", label: "Easy" },
              { value: "medium", label: "Medium" },
              { value: "hard", label: "Hard" },
            ]}
            placeholder="Select difficulty"
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="starttime">Start Time *</label>
          <input
            type="time"
            name="starttime"
            value={formData.starttime}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="duration">Duration (hours) *</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="capacity">Max Volunteers *</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="registrationDeadline">Registration Deadline *</label>
          <input
            type="date"
            name="registrationDeadline"
            value={formData.registrationDeadline}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="location">Location *</label>
        <LocationAutocomplete
          formData={formData}
          setFormData={setFormData}
          onBlur={handleLocationBlur}
        />
        <div className="mt-4">
          <MapPreview
            lat={formData.lat}
            lon={formData.lon}
            address={formData.location}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-2xl border border-gray-300 px-5 py-3 text-base font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-2xl bg-red-400 px-5 py-3 text-base font-semibold text-white shadow-lg hover:bg-red-600 transition"
        >
          Create Event
        </button>
      </div>
    </FormLayout>
  );
}

export default CreateEvent;
