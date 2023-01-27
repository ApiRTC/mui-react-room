import { useCallback, useEffect, useRef } from 'react';

const useIntervalAsync = <R = unknown>(fn: (() => Promise<R>) | null, ms: number) => {
  const runningCount = useRef(0);
  const timeout = useRef<number>();
  const mountedRef = useRef(false);

  const next = useCallback((handler: TimerHandler) => {
    if (mountedRef.current && runningCount.current === 0) {
      timeout.current = window.setTimeout(handler, ms);
    }
  }, [ms]);

  const run = useCallback(fn ? async () => {
    runningCount.current += 1;
    const result = await fn();
    runningCount.current -= 1;
    next(run);
    return result;
  } : () => { }, [fn, next]);

  useEffect(() => {
    if (fn) {
      mountedRef.current = true;
      run();
      return () => {
        mountedRef.current = false;
        window.clearTimeout(timeout.current);
      }
    }
  }, [fn, run])

  const flush = useCallback(() => {
    window.clearTimeout(timeout.current);
    return run();
  }, [run]);

  return flush
};

export default useIntervalAsync;