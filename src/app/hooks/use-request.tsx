import { useCallback, useState } from 'react';
import { NextResponse } from 'next/server';


type RequestParams = {
  url: string,
  method: string,
  body?: any,
  onSuccess?: (response: any) => void
}

type RequestResponse<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

const useRequest = (params: RequestParams) => {

  const { url, method, body = {}, onSuccess } = params;

  const [response, setResponse] = useState<RequestResponse<any>>({
    data: null,
    error: null,
    loading: false,
  });

  console.log('inside use request, URL ' + url)

  const doRequest = useCallback(async (cache?: boolean) => {
    setResponse({ data: null, error: null, loading: true });

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        cache: cache ? 'force-cache' : 'no-cache'
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('inside use request, data ')
      console.log(data)


      setResponse({ data, error: null, loading: false });

      if (onSuccess) {
        onSuccess(data)

      }

    } catch (err: any) {
    }
  }, [url, method, body, onSuccess]);
  return { ...response, doRequest };
};

export default useRequest;
