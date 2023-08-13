export const fetcher: (url: string, options?: RequestInit) => Promise<any> = (
    url,
    options
  ) => fetch(url, options).then((res) => res.json());

  export function formatTimestampToDDMMYYY(timestamp: number) {
    const date = new Date(timestamp * 1000); // Multiplicamos por 1000 para convertir de segundos a milisegundos
    const day = String(date.getDate()).padStart(2, '0'); // Día (2 dígitos, cero a la izquierda)
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes (0-11, sumamos 1, 2 dígitos, cero a la izquierda)
    const year = date.getFullYear(); // Año
    return `${day}/${month}/${year}`;
  }