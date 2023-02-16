import React, { useState } from 'react'
import Link from 'next/link'

const Activity = () => {
  const [name, setName] = useState<string>('');

  return (
    <div className='m-12 rounded-2xl bg-blue-400 flex flex-col items-start px-4 py-4'>
      <div className='flex flex-row justify-evenly w-full'>
        <div>Activity:</div>
        <input type='text' value={name} onChange={e => { setName(e.currentTarget.value);}}/>
      </div>
      <div className='flex flex-row justify-center'>
        <input type="text" className='bg-inherit px-2' />
        <div className='px-2'>
          datepicker
        </div>
        <div className='px-2'>
          slots
        </div>
        <div className='px-2'>
          number of people
        </div>
        <Link href={{
          pathname: '/listings',
          query: { name: name }
        }}>
          <button className='px-2'>Search</button>
        </Link>
      </div>
    </div>
  )
}

export default Activity