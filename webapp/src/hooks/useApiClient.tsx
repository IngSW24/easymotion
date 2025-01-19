import { useContext } from "react";
import { ApiContext } from "../context/ApiContext/ApiContext";

export const useApiClient = () => useContext(ApiContext);
