import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

interface ProductCardProps {
  product: any;
  onSelect: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({product, onSelect}) => {
  return (
    <TouchableOpacity onPress={() => onSelect(product)} style={styles.card}>
      {/* Product Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={
            product?.image
              ? {uri: product?.image}
              : require('../../../assets/images/no-image.png')
          }
          style={styles.productImage}
        />
      </View>

      {/* Product Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.productTitle}>{product?.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '23.4%',
    height: 180,
    borderRadius: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginTop: 10,
    marginRight: 10,
  },
  imageContainer: {
    flex: 2,
    backgroundColor: '#fdecec',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  productImage: {
    width: 50,
    height: 50,
    tintColor: '#aaa',
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
