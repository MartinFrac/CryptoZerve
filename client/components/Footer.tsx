import React from "react";

const Footer = () => {
  return (
    <footer className="flex justify-center bg-black text-white h-[6rem] text-xs">
      <div className="flex flex-row flex-grow px-4 py-4">
        <div className="w-2/3">
          <div></div>
        </div>
        <div className="w-1/3 flex flex-col justify-between">
          <ul className="flex list-none gap-8">
            <a href="mailto:marcin.jarek.frackiewicz@gmail.com">
              <li>Contact</li>
            </a>
            <a
              target="window"
              href="https://www.linkedin.com/in/marcin-frackiewicz1/"
            >
              <li>LinkedIn</li>
            </a>
            <a target="window" href="https://github.com/MartinFrac">
              <li>GitHub</li>
            </a>
          </ul>
          <p>© Copyright 2023, UOB University of Bedforshire</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
