import { useEffect, useState } from "react";

export interface UsePromiseResult<T> {
  readonly state: "pending" | "fulfilled" | "rejected";
  readonly value?: T;
  readonly reason?: unknown;
}

interface UsePromiseResultInternal<T> extends UsePromiseResult<T> {
  readonly promise?: Promise<T>;
}

/**
 * Awaits `promise` and returns its value and state.
 *
 * If no promise is provided, returns `{ "state": "pending" }`.
 */
export function usePromise<T>(promise?: Promise<T>): UsePromiseResult<T> {
  const [result, setResult] = useState<UsePromiseResultInternal<T>>(() => ({
    state: "pending",
  }));

  useEffect(() => {
    if (!promise) return;

    let cancelled = false;
    (async () => {
      try {
        const value = await promise;
        if (!cancelled) setResult({ state: "fulfilled", value, promise });
      } catch (reason) {
        if (!cancelled) setResult({ state: "rejected", reason, promise });
      }
    })();

    return () => {
      cancelled = true;
      setResult({ state: "pending" });
    };
  }, [promise]);

  return result.promise === promise ? result : { state: "pending" };
}
