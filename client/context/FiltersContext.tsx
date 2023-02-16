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
  day: Date | null;
  slotsStart: number;
  slotsEnd: number;
}

const emptyObject = {
  name: '',
  units: 1,
  day: null,
  slotsStart: 0,
  slotsEnd: 47,
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
