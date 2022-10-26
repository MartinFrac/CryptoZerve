import React from 'react'
import { useMMContext } from '../context/MetamaskContext';

const Header = () => {
  const mmContext = useMMContext();
  const user = mmContext.account;

  return (
    <div className='bg-gray-300 flex justify-between items-center px-8 py-2'>
      <div className='flex flex-row gap-6 items-center'>
        <span>CryptoZerve</span>
        <div className='rounded-full bg-yellow-600 px-2 py-4 flex items-center'>USDT</div>
      </div>
      <div className='flex flex-row gap-6'>
        <span>Vote</span>
        <span>List your venue</span>
        <span>Register</span>
        {
          mmContext.account ? <span>{user}</span> : 
          <button onClick={mmContext.connect}>Login</button>
        }
      </div>
    </div>
  )
}

export default Header