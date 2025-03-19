import {
  MealRecommendationRequest,
  RecommendedRecipesResponse,
} from "@/types/recipes";
import {
  PhysicalStoresResponse,
  PhysicalStore,
  ProductsResponse,
  Product,
  ProductsByEanData,
  ProductsCompareData,
} from "../types/kassal";

import { API_ROUTES } from "./apiRoutes";
import axios from "axios";

export const getPhysicalStores = async (params: {
  search?: string;
  page?: number;
  size?: number;
  lat?: number;
  lng?: number;
  km?: number;
  group?: string;
}): Promise<PhysicalStoresResponse> => {
  try {
    const response = await axios.get<PhysicalStoresResponse>(
      API_ROUTES.physicalStores.getPhysicalStores,
      { params }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.message);
  }
};

export const getPhysicalStoreById = async (
  storeId: string
): Promise<PhysicalStore> => {
  try {
    const response = await axios.get<PhysicalStore>(
      API_ROUTES.physicalStores.getPhysicalStoreById(storeId)
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.message);
  }
};

export const getProducts = async (params: {
  search?: string;
  page?: number;
  size?: number;
  vendor?: string;
  brand?: string;
  price_min?: number;
  price_max?: number;
  unique?: boolean;
  exclude_without_ean?: boolean;
  sort?: string;
}): Promise<ProductsResponse> => {
  try {
    const response = await axios.get<ProductsResponse>(
      API_ROUTES.products.getProducts,
      {
        params,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.message);
  }
};

export const getProductById = async (productId: number): Promise<Product> => {
  try {
    const response = await axios.get<Product>(
      API_ROUTES.products.getProductById(productId.toString())
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.message);
  }
};

export const getProductByEan = async (
  ean: string
): Promise<ProductsByEanData> => {
  try {
    const response = await axios.get<ProductsByEanData>(
      API_ROUTES.products.getProductsByEan(ean)
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.message);
  }
};

export const findProductByUrlSingle = async (url: string): Promise<Product> => {
  try {
    const response = await axios.get<Product>(
      API_ROUTES.products.getProductByUrlSingle(url),
      {
        params: { url },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.message);
  }
};

export const findProductByUrlCompare = async (
  url: string
): Promise<ProductsCompareData> => {
  try {
    const response = await axios.get<ProductsCompareData>(
      API_ROUTES.products.getProductByUrlCompare(url),
      {
        params: { url },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.message);
  }
};

export const recommendedRecipes = async (
  payload: MealRecommendationRequest
): Promise<RecommendedRecipesResponse> => {
  try {
    const response = await axios.post<RecommendedRecipesResponse>(
      API_ROUTES.recipes.recommend,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.message);
  }
};
