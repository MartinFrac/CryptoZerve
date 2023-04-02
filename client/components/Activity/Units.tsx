import React, { useState } from 'react'

type Props = {
  startUnits?: number,
  onSetUnits: (units: number) => void;
}

const Units: React.FC<Props> = ({ startUnits = 0, onSetUnits }) => {
  const [units, setUnits] = useState(startUnits);

  const handleHoursChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setUnits(value);
    onSetUnits(value);
  }

  return (
    <div>
      <label>
        {'Units: '}
        <select value={units} onChange={handleHoursChange} className='bg-white'>
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