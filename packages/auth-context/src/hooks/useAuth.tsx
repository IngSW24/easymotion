import { useContext } from "react";
import { AuthContext } from "../AuthContext/AuthContext";

export const useAuth = () => useContext(AuthContext);
