import React from "react";

const Footer = () => {
  return (
    <footer className="flex justify-center bg-black text-white h-[6rem] text-xs">
      <div className="flex flex-row flex-grow px-4 py-4">
        <div className="w-2/3">
          <div>
            Resources
          </div>
        </div>
        <div className="w-1/3 flex flex-col justify-between">
          <ul className="flex list-none gap-4">
            <li>Contact</li>
            <li>LinkedIn</li>
            <li>Github</li>
          </ul>
          <p>copyright</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
