import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useState } from "react";
import {
  type Media,
  type MediaPickerOptions,
  mediaPicker,
  convertMedia,
  mediaPickerConverter,
  type MediaPickerConverterOptions,
} from "react-native-media-picker-converter";

const App = () => {
  const [images, setImages] = useState<Media[] | undefined>();
  const [convertedImage, setConvertedImage] = useState<Media | null>(null);

  const options: MediaPickerOptions = {
    options: {
      quality: 0.8,
    },
    cameraOptions: {
      saveToPhotos: true,
    },
    libraryOptions: {
      selectionLimit: 2,
    },
  };

  const handleSelect = async () => {
    const pickedImages = await mediaPicker(options);
    setImages(pickedImages);

    if (pickedImages && pickedImages[0] && pickedImages[0].originalPath) {
      console.log("originalPath", pickedImages[0].originalPath);
      console.log("uri", pickedImages[0].uri);

      try {
        const converted = await convertMedia({
          sourcePath: pickedImages[0].originalPath,
          format: "jpg",
          quality: 1,
        });
        setConvertedImage(converted?.[0] ?? null);
        console.log(converted);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const mediaPickerConverterOptions: MediaPickerConverterOptions = {
    pickerOptions: {
      cameraOptions: {
        saveToPhotos: true,
      },
    },
    converterOptions: {
      format: "jpg",
    },
  };

  const handleSelectandConvert = async () => {
    const convertedImages = await mediaPickerConverter(
      mediaPickerConverterOptions,
    );
    console.log(convertedImages);
  };

  const renderItem = ({ item }: { item: Media }) => (
    <View style={styles.imageContainer}>
      <Image source={item} style={styles.image} />
      <Text style={styles.text}>{item.originalPath}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Pressable onPress={handleSelect} style={styles.button}>
        <Text style={styles.buttonText}>Select Image</Text>
      </Pressable>
      <Pressable onPress={handleSelectandConvert} style={styles.button}>
        <Text style={styles.buttonText}>Select and Convert Image</Text>
      </Pressable>

      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.originalPath || String(index)}
        style={styles.list}
        scrollEnabled={false}
      />

      {convertedImage && (
        <View style={styles.convertedContainer}>
          <Text>Converted Image:</Text>
          <Image source={convertedImage} style={styles.image} />
          <Text style={styles.text}>{convertedImage.fileName}</Text>
        </View>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  list: {
    width: "100%",
    marginTop: 20,
  },
  imageContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  convertedContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  text: {
    color: "black",
  },
});
