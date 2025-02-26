import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Product } from '../../types/kassal';

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
  // Optionally pass an onPress handler to navigate to a product detail screen.
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, horizontal = false, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={[styles.card, horizontal && styles.horizontalCard]}>
        {horizontal ? (
          <View style={styles.horizontalContainer}>
            <Card.Cover source={{ uri: product.image }} style={styles.horizontalImage} />
            <View style={styles.content}>
              <Title numberOfLines={1} style={styles.title}>
                {product.name}
              </Title>
              {product.brand && (
                <Paragraph style={styles.brand}>
                  {product.brand}
                </Paragraph>
              )}
              <Paragraph style={styles.price}>
                ${product.current_price.toFixed(2)}
              </Paragraph>
            </View>
          </View>
        ) : (
          <>
            <Card.Cover source={{ uri: product.image }} style={styles.image} />
            <Card.Content>
              <Title numberOfLines={1} style={styles.title}>
                {product.name}
              </Title>
              {product.brand && (
                <Paragraph style={styles.brand}>
                  {product.brand}
                </Paragraph>
              )}
              <Paragraph style={styles.price}>
                ${product.current_price.toFixed(2)}
              </Paragraph>
            </Card.Content>
          </>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  horizontalCard: {
    flexDirection: 'row',
  },
  horizontalContainer: {
    flexDirection: 'row',
  },
  horizontalImage: {
    width: 100,
    height: 100,
  },
  image: {
    height: 150,
  },
  content: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  brand: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default ProductCard;
