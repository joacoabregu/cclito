export const fetcher: (url: string, options?: RequestInit) => Promise<any> = (
    url,
    options
  ) => fetch(url, options).then((res) => res.json());