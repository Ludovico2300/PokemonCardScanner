// In CardDetailScreen.js
import React from "react";
import { View, Text, Image } from "react-native";

const CardDetailScreen = ({ route }) => {
  const { card } = route.params;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={{ uri: card.images.large }}
        style={{ width: 300, height: 450 }}
      />
      <Text>{card.name}</Text>
      <Text>{card.set.name}</Text>
    </View>
  );
};

export default CardDetailScreen;
