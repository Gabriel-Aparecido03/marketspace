import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const hook = useContext(AuthContext) 
  return hook
}