import { useEffect, useRef, useState } from "react";
import { readStorage, writeStorage } from "../utils/storage.js";

// useState that is initialised from (validated) localStorage and persisted on change.
export default function useLocalStorage(key, initialValue, validate) {
  const [value, setValue] = useState(() => readStorage(key, initialValue, validate));
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    writeStorage(key, value);
  }, [key, value]);

  return [value, setValue];
}
