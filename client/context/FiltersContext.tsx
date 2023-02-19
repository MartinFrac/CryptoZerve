import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { createContext } from "react";

type Props = {
  children: JSX.Element;
};

type ContextProps = {
  filters: Filters,
  setFilters: Dispatch<SetStateAction<Filters>> | null
};

type Filters = {
  name: string;
  units: number;
  day: Date;
  hourStart: number;
  hourEnd: number;
  minuteStart: number;
  minuteEnd: number;
}

const emptyObject = {
  name: '',
  units: 1,
  day: new Date(),
  hourStart: 12,
  hourEnd: 13,
  minuteStart: 0,
  minuteEnd: 0,
};

const FiltersContext = createContext<ContextProps>({
  filters: emptyObject,
  setFilters: null
});

export const FiltersContextProvider: React.FC<Props> = ({ children }) => {
  const [filters, setFilters] = useState<Filters>(emptyObject);

  return (
    <FiltersContext.Provider
      value={{
        filters: filters,
        setFilters: setFilters
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFiltersContext: () => ContextProps = () => {
  return useContext(FiltersContext);
};
