import { Dispatch, SetStateAction, useEffect, useState } from "react";

function replacer(key: any, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key: any, value: any) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

export function parseMapFromJSON(value: any) {
  return value !== null ? JSON.parse(value, reviver) : null;
}

export function parseJSONFromMap(value: any) {
  return JSON.stringify(value, replacer);
}

export function useStickyState<T>(
  defaultValue: T,
  key: string
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? JSON.parse(stickyValue, reviver)
      : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value, replacer));
  }, [key, value]);
  return [value, setValue];
}
