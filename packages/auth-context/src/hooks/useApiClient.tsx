import { useContext } from "react";
import { ApiContext } from "../ApiContext/ApiContext";

export const useApiClient = () => useContext(ApiContext);
