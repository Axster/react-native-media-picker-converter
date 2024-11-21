import { Alert } from "react-native";
import {
  type ImagePickerResponse,
  type OptionsCommon,
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";
import RNFS from "react-native-fs";

console.log("RNFS:", RNFS);

export const saveToGallery = async (response: ImagePickerResponse) => {
  const images = response?.assets;
  if (!images || images.length < 1) return response;

  const savedAssets = await Promise.all(
    images.map(async image => {
      const originalPath = image.uri;
      if (originalPath && originalPath.startsWith("file://")) {
        const destinationPath =
          RNFS.DocumentDirectoryPath + "/" + image.fileName;

        await RNFS.copyFile(originalPath, destinationPath);

        return {
          ...image,
          originalPath: destinationPath,
        };
      }
      return image;
    }),
  );

  return { ...response, assets: savedAssets } as ImagePickerResponse;
};

export const selectImages = async (
  origin: "camera" | "library",
  options: OptionsCommon,
  errorMessage?: string,
) => {
  let response: ImagePickerResponse;
  try {
    if (origin === "camera") {
      const cameraResponse = await launchCamera(options);
      response = await saveToGallery(cameraResponse);
    } else {
      response = await launchImageLibrary(options);
    }
    if (response.assets && response.assets.length > 0) {
      return response.assets;
    }
  } catch (error) {
    console.error(error);
    if (errorMessage) {
      Alert.alert(errorMessage);
    }
  }
  return;
};
