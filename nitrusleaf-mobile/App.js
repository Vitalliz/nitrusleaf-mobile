import { useEffect } from "react";
import { initDB } from "./database/database";

export default function App() {
  useEffect(() => {
    initDB();
  }, []);

  return (...);
}
