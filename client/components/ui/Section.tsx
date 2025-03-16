import React from 'react';
import { View, Text, FlatList, Pressable, useColorScheme, Animated } from 'react-native';
import Colors, { getTheme } from '@/constants/Colors';
import ProductCard from '@/components/ui/ProductCard';
import OfferCard from '@/components/ui/OfferCard';
import { Product } from '@/types/kassal';

interface SectionProps {
  title: string;
  data: Product[];
  isOfferSection?: boolean;
  onSeeMore: () => void;
  productClick: (product: Product) => void;
 
}

export default function Section({ title, data, isOfferSection = false, onSeeMore, productClick}: SectionProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View style={{ marginBottom: 30 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>{title}</Text>
        <Pressable onPress={onSeeMore}>
          <Text style={{ fontSize: 16, color: theme.primary }}>Se mer →</Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable onPress={() => productClick(item)}>
            {isOfferSection ? <OfferCard product={item}/> : <ProductCard product={item}/>}
          </Pressable>
        )}
      />
    </View>
  );
}
