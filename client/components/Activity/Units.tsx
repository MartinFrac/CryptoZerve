import React, { useState } from 'react'

const Units = () => {
  const [units, setUnits] = useState(0);

  const handleHoursChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUnits(parseInt(event.target.value, 10));
  }

  return (
    <div>
      <label>
        Units:
        <select value={units} onChange={handleHoursChange}>
          {Array.from(Array(24).keys()).map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default Units