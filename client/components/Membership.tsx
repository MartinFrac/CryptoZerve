import React from 'react'

const Membership = () => {
  return (
    <div className='m-12 rounded-2xl bg-blue-400 flex flex-col items-start px-4 py-4'>
      <div>Membership</div>
      <div className='flex flex-row justify-center'>
        <input type="text" className='bg-inherit' />
        <div>
          datepicker
        </div>
        <div>
          slots
        </div>
        <div>
          number of people
        </div>
        <button>Search</button>
      </div>
    </div>
  )
}

export default Membership