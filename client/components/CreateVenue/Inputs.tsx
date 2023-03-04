import React, { useState } from "react";
import { Venue } from "../../pages/api/listings";

type Props = {
  venueObject: Venue;
  setVenueObject: React.Dispatch<React.SetStateAction<Venue>>;
};

const Inputs: React.FC<Props> = ({ venueObject, setVenueObject }) => {
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [startDay, setStartDay] = useState("");
  const [venue, setVenue] = useState("");

  const setNameHandler = (value: string) => {
    setVenueObject((prev) => ({
      ...prev,
      name: value,
    }));
  };

  const setDescriptionHandler = (value: string) => {
    setVenueObject((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const setPriceHandler = (value: string) => {
    setVenueObject((prev) => ({
      ...prev,
      price: parseInt(value),
    }));
  };

  const setStartDayHandler = (value: string) => {
    setVenueObject((prev) => ({
      ...prev,
      startDay: parseInt(value),
    }));
  };

  const setVenueHandler = (value: string) => {
    setVenueObject((prev) => ({
      ...prev,
      venue: value,
    }));
  };

  return (
    <div className="text-center flex flex-col">
      <div className="px-6 py-4">
        <label className="block font-bold text-gray-700 mb-2" htmlFor="name">
          Name:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          id="name"
          value={venueObject.name}
          onChange={(event) => setNameHandler(event.target.value)}
        />
      </div>
      <div className="px-6 py-4">
        <label
          className="block font-bold text-gray-700 mb-2"
          htmlFor="description"
        >
          Description:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          id="description"
          value={venueObject.description}
          onChange={(event) => setDescriptionHandler(event.target.value)}
        />
      </div>
      <div className="px-6 py-4">
        <label className="block font-bold text-gray-700 mb-2" htmlFor="price">
          Price:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          id="price"
          value={venueObject.price}
          onChange={(event) => setPriceHandler(event.target.value)}
        />
      </div>
      <div className="px-6 py-4">
        <label
          className="block font-bold text-gray-700 mb-2"
          htmlFor="startDay"
        >
          Start Day:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          id="startDay"
          value={venueObject.startDay}
          onChange={(event) => setStartDayHandler(event.target.value)}
        />
      </div>
      <div className="px-6 py-4">
        <label className="block font-bold text-gray-700 mb-2" htmlFor="venue">
          Venue:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          id="owner"
          value={venueObject.venue}
          onChange={(event) => setVenueHandler(event.target.value)}
        />
      </div>
    </div>
  );
};

export default Inputs;
