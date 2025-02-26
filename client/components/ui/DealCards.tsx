import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import { Deal } from '../../types/kassal';
import { useShoppingList } from '../../context/ShoppingListContext';

interface DealCardProps {
  deal: Deal;
  horizontal?: boolean;
}

const DealCard = ({ deal, horizontal = false }: DealCardProps) => {
  const { addToShoppingList } = useShoppingList();
  
  const calculateSavings = (original: number, dealPrice: number) => {
    return ((original - dealPrice) / original * 100).toFixed(0);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' });
  };
  
  const handleAddToList = () => {
    addToShoppingList(deal);
  };
  
  const savingsPercent = calculateSavings(deal.originalPrice, deal.dealPrice);
  
  return (
    <Card style={[styles.card, horizontal && styles.horizontalCard]}>
      <Card.Content>
        <View style={styles.dealHeader}>
          <Text variant="titleLarge">{deal.name}</Text>
          <Chip icon="percent" style={styles.savingsChip}>
            {savingsPercent}% rabatt
          </Chip>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>{deal.originalPrice.toFixed(2)} kr</Text>
          <Text style={styles.dealPrice}>{deal.dealPrice.toFixed(2)} kr</Text>
        </View>
        
        <Text style={styles.storeInfo}>{deal.store}</Text>
        <Text style={styles.validUntil}>Gyldig til {formatDate(deal.validUntil)}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={handleAddToList}>Legg til i handleliste</Button>
      </Card.Actions>
    </Card>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  horizontalCard: {
    width: width * 0.8,
    marginRight: 12,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  savingsChip: {
    backgroundColor: '#e53935',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 8,
  },
  dealPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e53935',
  },
  storeInfo: {
    marginBottom: 4,
  },
  validUntil: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default DealCard;
