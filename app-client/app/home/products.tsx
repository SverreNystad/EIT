import React from "react";
import ProductList from "@/components/ui/ProductList";
import { useNavigation } from "@react-navigation/native";
import { Product } from "@/types/kassal";
import { StackNavigationProp } from "@react-navigation/stack";

// Define navigation stack types
type HomeStackParamList = {
  produkt: { product: Product };
};

// Navigation typing
type NavigationProp = StackNavigationProp<HomeStackParamList, "produkt">;

export default function ProductsScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ProductList
      onProductPress={(product: Product) => navigation.navigate("produkt", { product })}
    />
  );
}