import React from 'react'
import { Data } from '../pages/api/listings'
import Venue from '../abi/Venue.json';
import { ethers } from 'ethers';

type Props = {
  details: Data
}

const Listing: React.FC<Props> = (props) => {
  return (
    <div className='bg-slate-600 flex flex-col m-4 py-4 items-center'>
      <div>{props.details.name}</div>
      <div>{props.details.description}</div>
      <div>{props.details.price.toString()}</div>
      <div>{props.details.venue}</div>
      <button className='bg-white max-w-md m-2'>Ask for booking</button>
      <button className='bg-white max-w-md m-2'>Propose offer</button>
      <button className='bg-white max-w-md m-2'>Book</button>
    </div>
  )
}

export default Listing