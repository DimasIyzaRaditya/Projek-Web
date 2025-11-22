// Konfigurasi API
export const API_AHMENG = 'http://localhost:3000/api';

// Endpoint Produk
export const API_PRODUK = `${API_AHMENG}/produk`;
export const API_PRODUK_BY_ID = (id: number) => `${API_AHMENG}/produk/${id}`;

// Endpoint Transaksi
export const API_TRANSAKSI = `${API_AHMENG}/transaksi`;
export const API_TRANSAKSI_BY_ID = (id: number) => `${API_AHMENG}/transaksi/${id}`;

// Endpoint User
export const API_USER = `${API_AHMENG}/user`;
export const API_USER_BY_ID = (id: number) => `${API_AHMENG}/user/${id}`;
