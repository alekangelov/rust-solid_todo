import { Signal, createSignal } from "solid-js";

export function createStoredSignal<T>(key: string, defaultValue: T): Signal<T> {
  if (typeof window === "undefined") {
    return [() => defaultValue, (..._args: any[]) => {}] as any;
  }

  const storage = window.localStorage;

  const initialValue = storage?.getItem(key)
    ? (JSON.parse(storage?.getItem(key) as string) as T)
    : defaultValue;

  const [value, setValue] = createSignal<T>(initialValue);

  const setValueAndStore = ((arg) => {
    const v = setValue(arg);
    storage?.setItem(key, JSON.stringify(v));
    return v;
  }) as typeof setValue;

  return [value, setValueAndStore];
}
