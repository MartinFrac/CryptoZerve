import React from "react";
import { useMMContext } from "../context/MetamaskContext";
import Link from "next/link";

const Header = () => {
  const mmContext = useMMContext();
  const user = mmContext.account;

  return (
    <div className="fixed w-full bg-black flex justify-between items-center px-8 py-2 text-white">
      <div className="flex flex-row gap-6 items-stretch">
        <Link href="/">
          <div className={styles}>CryptoZerve</div>
        </Link>
        <div className="rounded-full bg-yellow-600 px-2 py-4 flex items-center">
          USDT
        </div>
      </div>
      <div className="flex flex-row gap-6">
        <Link href="/myBookings">
          <div className={styles}>My Bookings</div>
        </Link>
        <Link href="/createVenue">
          <div className={styles}>List your venue</div>
        </Link>
        <Link href="/myVenues">
          <div className={styles}>My Venues</div>
        </Link>
        {mmContext.account ? (
          <span>{user}</span>
        ) : (
          <button onClick={mmContext.connect} className={styles}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

const styles =
  "cursor-pointer flex items-center px-4 py-4 hover:bg-slate-400 rounded-md";

export default Header;
