import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

interface ProductCardProps {
  product: any;
  onSelect: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({product, onSelect}) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(product)}
      style={[styles.card, {}]}>
      {/* Product Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={
            product?.images?.length ?? 0 > 0
              ? {
                  uri: '' + product?.images[0],
                }
              : require('../../../assets/images/no-image.png')
          }
          style={styles.productImage}
        />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.productTitle}>{product?.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: 150,
    width: '23.6%',
  },
  imageContainer: {
    borderRadius: 15,
    height: 100,
  },
  productImage: {
    flex: 1,
    height: 120,
    width: '100%',
    borderRadius: 15,
  },
  noImageText: {
    marginTop: 5,
    fontSize: 12,
    color: '#aaa',
  },
  titleContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
  },
});

export default ProductCard;
