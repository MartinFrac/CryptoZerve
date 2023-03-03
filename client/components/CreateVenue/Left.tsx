import React, { useState } from "react";

const Left = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [startDay, setStartDay] = useState("");
  const [venue, setVenue] = useState("");

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
          value={name}
          onChange={(event) => setName(event.target.value)}
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
          value={description}
          onChange={(event) => setDescription(event.target.value)}
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
          value={price}
          onChange={(event) => setPrice(event.target.value)}
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
          value={startDay}
          onChange={(event) => setStartDay(event.target.value)}
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
          value={venue}
          onChange={(event) => setVenue(event.target.value)}
        />
      </div>
    </div>
  );
};

export default Left;
