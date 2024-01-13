export const PATHS = {
	HOME: '/',
	FAVORITES: '/favoritos',
	api: '/api'
};

const API_STOCK = `${PATHS.api}/stock`;

export const PATHS_API = {
	stock: { url: API_STOCK, price: `${API_STOCK}/price}` },
	stocks: `${PATHS.api}/stocks`
};
