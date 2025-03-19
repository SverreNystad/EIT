const API_BASE_URL =  "http://10.22.234.132:8000";

console.log("API_BASE_URL", API_BASE_URL);
// $ npm install -D react-native-dotenv
export const API_ROUTES = {
  physicalStores: {
    getPhysicalStores: `${API_BASE_URL}/physical-stores`,
    getPhysicalStoreById: (storeId: string) =>
      `${API_BASE_URL}/physical-stores/${storeId}`,
  },
  products: {
    getProducts: `${API_BASE_URL}/products`,
    getProductById: (productId: string) =>
      `${API_BASE_URL}/products/id/${productId}`,
    getProductsByEan: (ean: string) => `${API_BASE_URL}/products/ean/${ean}`,
    getProductByUrlSingle: (url: string) =>
      `${API_BASE_URL}/products/find-by-url/single?url=${url}`,
    getProductByUrlCompare: (url: string) =>
      `${API_BASE_URL}/products/find-by-url/compare?url=${url}`,
  },
  recipes: {
    recommend: `${API_BASE_URL}/recipes/recommend`,
  },
};
