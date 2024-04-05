import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
} from "react-native";
import pokemon from "pokemontcgsdk";

const CardListScreen = ({ navigation }) => {
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  pokemon.configure({ apiKey: "123abc" });

  useEffect(() => {
    // Carica le carte all'avvio dell'applicazione
    loadCardsOnStart();
  }, []);

  const loadCardsOnStart = () => {
    // Effettua la ricerca in base al termine inserito dall'utente
    pokemon.card.where({ orderBy: "set.releaseDate" }).then((result) => {
      setCards(result.data);
    });
  };
  const loadCards = () => {
    // Effettua la ricerca in base al termine inserito dall'utente
    pokemon.card
      .where({ q: `name:${searchTerm}`, orderBy: "set.releaseDate" })
      .then((result) => {
        setCards(result.data);
      });
  };

  const handleSearch = () => {
    // Esegui la ricerca delle carte quando l'utente preme il pulsante di ricerca
    loadCards();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("CardDetail", { card: item })}
    >
      <Image
        source={{ uri: item.images.large }}
        style={{ width: 200, height: 300, marginBottom: 10 }}
      />
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
      }}
    >
      <TextInput
        style={{
          height: 40,
          width: "100%",
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
        placeholder="Inserisci il nome della carta Pokémon..."
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
      />
      <Button title="Cerca" onPress={handleSearch} />
      <FlatList
        data={cards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

export default CardListScreen;
