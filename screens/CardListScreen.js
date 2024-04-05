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
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import pokemon from "pokemontcgsdk";

const CardListScreen = ({ navigation }) => {
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [model, setModel] = useState(null);

  pokemon.configure({ apiKey: "123abc" });

  useEffect(() => {
    // Carica il modello all'avvio dell'applicazione
    loadModel();
    // Carica le carte all'avvio dell'applicazione
    loadCardsOnStart();
  }, []);

  const loadModel = async () => {
    try {
      const mobilenet = await tf.loadLayersModel(
        "https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/feature_vector/4",
        { fromTFHub: true }
      );
      const newModel = tf.sequential();
      newModel.add(mobilenet);
      newModel.add(tf.layers.dense({ units: 3, activation: "softmax" }));
      newModel.compile({
        optimizer: "adam",
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      });
      setModel(newModel);
      console.log("Modello caricato con successo:", newModel);
    } catch (error) {
      console.error("Errore durante il caricamento del modello:", error);
    }
  };

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

  const handleTrainModel = async () => {
    // Creazione del dataset
    const dataset = createDataset(cards);
    // Addestramento del modello
    await model.fit(dataset.xs, dataset.ys, { epochs: 10 });
  };

  const createDataset = async (cards) => {
    console.log("inizio la creazione del dataset");
    const xs = [];
    const ys = [];
    for (let card of cards) {
      const imageUri = card.images.large;
      const imageTensor = await loadImage(imageUri);
      const normalizedImageTensor = imageTensor.div(255);
      xs.push(normalizedImageTensor);
      ys.push(tf.oneHot(tf.tensor1d([card.id]), 3));
    }
    console.log("ho finito la creazione del dataset");
    return { xs: tf.stack(xs), ys: tf.stack(ys) };
  };

  const loadImage = async (uri) => {
    console.log("inizio il loadImage");
    const response = await fetch(uri);
    const blob = await response.blob();
    const image = await createImageBitmap(blob);
    const tensor = tf.browser
      .fromPixels(image)
      .resizeNearestNeighbor([224, 224])
      .toFloat();
    console.log("ho finito il loadImage");
    return tensor;
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
      <Button title="Train Model" onPress={handleTrainModel} />
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
