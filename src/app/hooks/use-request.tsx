import { useState, useCallback } from 'react';

type RequestOptions<T> = {
  url: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  body?: any;
  onSuccess?: (data: T) => void;
  cache?: boolean;
};

type RequestState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

function useRequest<T = any>() {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const doRequest = useCallback(
    async ({
      url,
      method = 'get',
      body,
      onSuccess,
      cache = false,
    }: RequestOptions<T>) => {
      setState({ data: null, loading: true, error: null });

      try {
        const res = await fetch(url, {
          method: method.toUpperCase(),
          headers: {
            'Content-Type': 'application/json',
          },
          cache: cache ? 'force-cache' : 'no-cache',
          body: method !== 'get' ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) throw new Error('Request failed');

        const data = await res.json();
        setState({ data, loading: false, error: null });

        if (onSuccess) onSuccess(data);

        return data;
      } catch (err: any) {
        setState({ data: null, loading: false, error: err.message || 'Unknown error' });
        return null;
      }
    },
    []
  );

  return { ...state, doRequest };
}

export default useRequest;