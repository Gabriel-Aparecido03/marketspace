import { useContext } from "react";
import { AnnouncedContext } from "../context/AnnouncedContext";

export function useAnnounced() {
  const hook = useContext(AnnouncedContext)
  return hook
}