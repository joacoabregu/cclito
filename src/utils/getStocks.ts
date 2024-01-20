import type { StockRatio, StocksRatio } from '@customTypes/index';
import Papa from 'papaparse';

/**
 * Parses the given text with the Papa Parse library and returns the parsed text.
 */
async function parse(text: string) {
	const ratiosParsed = await new Promise<StocksRatio>((resolve, reject) => {
		Papa.parse<StockRatio>(text, {
			header: true,
			complete: (result) => resolve(result.data),
			error: reject
		});
	});

	return ratiosParsed;
}

/**
 * Retrieves stocks data (name, ticker, price usd, cedear) from a Google Sheets document.
 */
async function getStocksFromGoogleSheets() {
	const sheet =
		'https://docs.google.com/spreadsheets/d/e/2PACX-1vS-RtvaCpilenyOw3UY8YuA0cQMj1nS5B8AvHwiy7gKGfLDCe2UtAfB3B52mkWOytr_RA4DWEdGYAED/pub?gid=779469096&single=true&output=csv';
	const data = await fetch(sheet);
	const text = await data.text();

	return text;
}

/**
 * Retrieves the stocks from Google Sheets and parses them.
 */
export const getStocks = async () => {
	return await parse(await getStocksFromGoogleSheets());
}
