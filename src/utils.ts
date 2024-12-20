import { Alert } from "react-native";
import {
  type ImagePickerResponse,
  type OptionsCommon,
  type PhotoQuality,
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";
import { FileSystem, Dirs } from "react-native-file-access";
import type { Format, Media } from "./types";

export const saveToGallery = async (response: ImagePickerResponse) => {
  const images = response?.assets;
  if (!images || !images.length) return response;
  try {
    const savedAssets = await Promise.all(
      images.map(async image => {
        const originalPath = image.uri;
        if (originalPath && originalPath.startsWith("file://")) {
          const fileName = image.fileName || `image_${Date.now()}.jpg`;
          const destinationPath = `${Dirs.DocumentDir}/${fileName}`;

          await FileSystem.cp(originalPath, destinationPath);

          return {
            ...image,
            originalPath: destinationPath,
          };
        }
        return image;
      }),
    );
    return { ...response, assets: savedAssets } as ImagePickerResponse;
  } catch (e) {
    console.error(e);
  }
  return response;
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
      if (typeof cameraResponse === "string") console.warn(cameraResponse);
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

export const getPath = (img: Media) => {
  return (img.uri || img.url)?.replace("file://", "");
};

export const compressParameters: PhotoQuality[] = [
  1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3,
];

export const getCompressFormat = (format?: Format) => {
  return !format || format === "png" ? "jpg" : format;
};
