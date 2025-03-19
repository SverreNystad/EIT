import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  useColorScheme,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { getProducts } from "@/services/api";
import { Product, ProductsResponse } from "@/types/kassal";
import ProductItem from "./ProductItem";

interface ProductListProps {
  isOfferPage?: boolean; // If true, shows fake before-price for offers
  onProductPress: (product: Product) => void;
}

export default function ProductList({ isOfferPage, onProductPress }: ProductListProps) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme] || Colors.light;

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Main search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);

  // Derived lists for filters
  const [storeList, setStoreList] = useState<string[]>([]);
  const [brandList, setBrandList] = useState<string[]>([]);
  const [allergenList, setAllergenList] = useState<string[]>([]);

  // Modal visibility
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Temporary states for user’s selection in the modal
  const [tempSelectedStores, setTempSelectedStores] = useState<string[]>([]);
  const [tempSelectedBrands, setTempSelectedBrands] = useState<string[]>([]);
  const [tempSelectedAllergens, setTempSelectedAllergens] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const productsData: ProductsResponse = await getProducts({ size: 50 });
        setProducts(productsData.data);
        setFilteredProducts(productsData.data);

        // Build store and brand lists from product data
        const stores = Array.from(
          new Set(productsData.data.map((p) => p.store?.name).filter(Boolean))
        ) as string[];

        const brands = Array.from(
          new Set(productsData.data.map((p) => p.brand).filter(Boolean))
        ) as string[];

        // Build allergen list by flattening the allergens from each product
        const allergens = Array.from(
          new Set(
            productsData.data.flatMap((p) =>
              p.allergens ? p.allergens.map((a) => a.display_name) : []
            )
          )
        ) as string[];

        setStoreList(stores);
        setBrandList(brands);
        setAllergenList(allergens);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply main filters to product list
  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStores.length > 0) {
      filtered = filtered.filter(
        (p) => p.store?.name && selectedStores.includes(p.store.name)
      );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(
        (p) => p.brand && selectedBrands.includes(p.brand)
      );
    }

    if (selectedAllergens.length > 0) {
      filtered = filtered.filter((p) =>
        p.allergens?.some((a) => selectedAllergens.includes(a.display_name))
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedStores, selectedBrands, selectedAllergens, products]);

  // Toggle the filter modal
  const openFilterModal = () => {
    // Copy current filters into temp states
    setTempSelectedStores([...selectedStores]);
    setTempSelectedBrands([...selectedBrands]);
    setTempSelectedAllergens([...selectedAllergens]);
    setFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  // "Bruk Filtre" button
  const applyFilters = () => {
    setSelectedStores([...tempSelectedStores]);
    setSelectedBrands([...tempSelectedBrands]);
    setSelectedAllergens([...tempSelectedAllergens]);
    setFilterModalVisible(false);
  };

  // "Fjern alle" button
  const clearAllFilters = () => {
    setTempSelectedStores([]);
    setTempSelectedBrands([]);
    setTempSelectedAllergens([]);
  };

  // Toggle store in local state
  const toggleTempStore = (store: string) => {
    setTempSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
  };

  // Toggle brand in local state
  const toggleTempBrand = (brand: string) => {
    setTempSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Toggle allergen in local state
  const toggleTempAllergen = (allergen: string) => {
    setTempSelectedAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    );
  };

  // Renders the list of checkboxes for a filter category
  const renderFilterCheckboxes = (
    data: string[],
    tempSelected: string[],
    toggleFn: (val: string) => void
  ) => {
    return data.map((item) => {
      const checked = tempSelected.includes(item);
      return (
        <TouchableOpacity
          key={item}
          style={styles.checkboxRow}
          onPress={() => toggleFn(item)}
        >
          <Ionicons
            name={checked ? "checkbox" : "checkbox-outline"}
            size={20}
            color={theme.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: theme.text, fontSize: 15 }}>{item}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.card, borderColor: theme.primary },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={theme.text}
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Søk etter produkter..."
          placeholderTextColor={theme.text}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Button Under Search Bar */}
      <View style={{ marginBottom: 5, marginTop: 10 }}>
        <TouchableOpacity
          onPress={openFilterModal}
          style={[
            styles.filterButton,
            { backgroundColor: theme.card, borderColor: theme.primary },
          ]}
        >
          <Ionicons
            name="options"
            size={20}
            color={theme.text}
            style={{ marginRight: 6 }}
          />
          <Text style={{ color: theme.text, fontWeight: "500" }}>Filter</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={{ marginTop: 12 }}
        />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          style={{ marginTop: 10 }}
          renderItem={({ item }) => (
            <ProductItem
              product={item}
              isOffer={isOfferPage}
              onPress={() => onProductPress(item)}
            />
          )}
        />
      )}

      {/* Modal for Filters */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        onRequestClose={closeFilterModal}
        transparent
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Filtre
            </Text>

            {/* "Fjern alle" button */}
            <TouchableOpacity
              onPress={clearAllFilters}
              style={[
                styles.clearAllButton,
                {
                  borderColor: theme.primary,
                  backgroundColor: theme.background,
                },
              ]}
            >
              <Ionicons
                name="trash-outline"
                size={16}
                color={theme.primary}
              />
              <Text style={{ color: theme.primary, marginLeft: 6 }}>
                Fjern alle
              </Text>
            </TouchableOpacity>

            <ScrollView style={{ maxHeight: "70%", marginTop: 10 }}>
              <Text style={[styles.modalSubtitle, { color: theme.text }]}>
                Butikker
              </Text>
              <View style={styles.checkboxContainer}>
                {renderFilterCheckboxes(storeList, tempSelectedStores, toggleTempStore)}
              </View>

              <Text style={[styles.modalSubtitle, { color: theme.text }]}>
                Merker
              </Text>
              <View style={styles.checkboxContainer}>
                {renderFilterCheckboxes(brandList, tempSelectedBrands, toggleTempBrand)}
              </View>

              <Text style={[styles.modalSubtitle, { color: theme.text }]}>
                Allergener
              </Text>
              <View style={styles.checkboxContainer}>
                {renderFilterCheckboxes(allergenList, tempSelectedAllergens, toggleTempAllergen)}
              </View>
            </ScrollView>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                onPress={closeFilterModal}
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
              >
                <Text style={{ color: "#333" }}>Avbryt</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={applyFilters}
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
              >
                <Text style={{ color: "white" }}>Bruk Filtre</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
  },
  checkboxContainer: {
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
});
