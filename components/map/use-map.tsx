import { createContext, useContext } from "react";

export type MapContextValues = {
  handleUseCurrent: () => void;
};

export const MapContext = createContext({} as MapContextValues);

export const useMap = () => useContext(MapContext);
