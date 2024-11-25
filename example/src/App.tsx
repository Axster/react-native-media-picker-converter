import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import {
  type Media,
  type MediaPickerOptions,
  type MediaPickerConverterOptions,
  type MediaConverterOptions,
  type Format,
  mediaPicker,
  mediaConvert,
  mediaPickerConverter,
  mediaCompress,
  type MediaCompressOptions,
} from "react-native-media-picker-converter";

const App = () => {
  const [pickedImages, setPickedImages] = useState<Media[]>([]);
  const [convertedImages, setConvertedImages] = useState<Media[]>([]);
  const [pickerConverterImages, setPickerConverterImages] = useState<Media[]>(
    [],
  );
  const [compressedImages, setCompressedImages] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const TARGET_FORMAT: Format = "jpg";

  // Media Picker Options
  const mediaPickerOptions: MediaPickerOptions = {
    options: {
      quality: 1,
      maxHeight: 1024,
      maxWidth: 1024,
    },
    cameraOptions: {
      saveToPhotos: true,
    },
    libraryOptions: {
      selectionLimit: 5,
    },
    selectModal: {
      onCancel: () => setLoading(false),
      subtitle: "choose an option",
      camera: "Your camera",
    },
  };

  // Media Converter Options
  const mediaConverterOptions: Omit<MediaConverterOptions, "source"> = {
    format: TARGET_FORMAT,
    quality: 0.9,
  };

  // Media Picker Converter Options
  const mediaPickerConverterOptions: MediaPickerConverterOptions = {
    pickerOptions: {
      libraryOptions: {
        selectionLimit: 3,
      },
      selectModal: {
        onCancel: () => setLoading(false),
        title: "Select images",
      },
    },
    converterOptions: {
      format: TARGET_FORMAT,
      quality: 0.8, // only maxSize will work if present
      maxSize: 500,
    },
  };

  // Media Compress Options
  const mediaCompressOptions: Omit<MediaCompressOptions, "source"> = {
    format: TARGET_FORMAT,
    maxSize: 500,
  };

  // Handle Media Picker
  const handleMediaPicker = async () => {
    setLoading(true);
    const images = await mediaPicker(mediaPickerOptions);
    console.log(
      "First image picked from MediaPicker: ",
      JSON.stringify(images?.[0], null, 2),
    );
    if (images) {
      setPickedImages(images);
    }
    setLoading(false);
  };

  // Handle Convert Media
  const handleConvertMedia = async () => {
    if (pickedImages.length > 0) {
      setLoading(true);
      const converted = await mediaConvert({
        source: pickedImages,
        ...mediaConverterOptions,
      });
      setConvertedImages(converted || []);
      console.log(
        "First image converted from ConvertMedia: ",
        JSON.stringify(converted, null, 2),
      );
      setLoading(false);
    }
  };

  // Handle Media Picker Converter
  const handleMediaPickerConverter = async () => {
    setLoading(true);
    const images = await mediaPickerConverter(mediaPickerConverterOptions);
    console.log(
      "First image picked and converted from MediaPickerConverter: ",
      JSON.stringify(images?.[0], null, 2),
    );
    if (images) {
      setPickerConverterImages(images);
    }
    setLoading(false);
  };

  // Handle Media Compress
  const handleCompressMedia = async () => {
    if (pickedImages.length > 0) {
      setLoading(true);
      const compressed = await mediaCompress({
        source: pickedImages,
        ...mediaCompressOptions,
      });
      setCompressedImages(compressed || []);
      console.log(
        "First image compressed from MediaCompress: ",
        JSON.stringify(compressed?.[0], null, 2),
      );
      setLoading(false);
    }
  };

  // Render Image Item
  const renderImageItem = ({ item }: { item: Media }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.uri || item.originalPath }}
        style={styles.image}
      />
      <Text style={styles.text}>{item.fileName}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Target format {TARGET_FORMAT}</Text>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleMediaPicker}
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}>
          <Text style={styles.buttonText}>Select Images</Text>
        </Pressable>
        <Pressable
          onPress={handleConvertMedia}
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}>
          <Text style={styles.buttonText}>Convert Images</Text>
        </Pressable>
        <Pressable
          onPress={handleMediaPickerConverter}
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}>
          <Text style={styles.buttonText}>Pick & Convert</Text>
        </Pressable>
        <Pressable
          onPress={handleCompressMedia}
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}>
          <Text style={styles.buttonText}>Compress Images</Text>
        </Pressable>
      </View>

      {pickedImages.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Picked Images</Text>
          <FlatList
            data={pickedImages}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => item.originalPath || String(index)}
            horizontal
          />
        </View>
      )}

      {convertedImages.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Converted Images</Text>
          <FlatList
            data={convertedImages}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => item.originalPath || String(index)}
            horizontal
          />
        </View>
      )}

      {pickerConverterImages.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Picker Converter Images</Text>
          <FlatList
            data={pickerConverterImages}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => item.originalPath || String(index)}
            horizontal
          />
        </View>
      )}

      {compressedImages.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Compressed Images</Text>
          <FlatList
            data={compressedImages}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => item.originalPath || String(index)}
            horizontal
          />
        </View>
      )}

      {loading && (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={styles.loading}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    gap: 10,
    marginBottom: 30,
  },
  button: {
    minWidth: 150,
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: "#b0b0b0",
  },
  listContainer: {
    width: "100%",
    marginVertical: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageContainer: {
    marginRight: 10,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  text: {
    color: "black",
    marginTop: 5,
  },
  loading: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default App;
