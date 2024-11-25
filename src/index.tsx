import { Alert, NativeModules, Platform } from "react-native";
import type {
  MediaPicker,
  MediaConverter,
  MediaPickerConverterType,
  MediaCompress,
  Media,
} from "./types";
import {
  compressParameters,
  getCompressFormat,
  getPath,
  selectImages,
} from "./utils";
import type { OptionsCommon } from "react-native-image-picker";

const LINKING_ERROR =
  `The package 'react-native-media-picker-converter' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: "" }) +
  "- You rebuilt the app after installing the package\n" +
  "- You are not using Expo Go\n";

const MediaPickerConverter = NativeModules.MediaPickerConverter
  ? NativeModules.MediaPickerConverter
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

export const mediaCompress: MediaCompress = async ({
  source,
  format,
  maxSize,
}) => {
  try {
    const originalImages = Array.isArray(source) ? source : [source];
    const compressImage = async (img: Media): Promise<Media | null> => {
      const path = getPath(img);
      const compressFormat = getCompressFormat(format);
      for (const quality of compressParameters) {
        const compressed: Media = await MediaPickerConverter.convertImage(
          path,
          compressFormat,
          quality,
        );
        if (compressed.fileSize && compressed.fileSize / 1024 <= maxSize) {
          return compressed;
        }
      }
      console.warn(
        `Image at path ${path} cannot be compressed to less than ${maxSize} KB.`,
      );
      return null;
    };
    const results = await Promise.all(originalImages.map(compressImage));
    return results.filter((result): result is Media => result !== null);
  } catch (error) {
    throw new Error(
      `Compression failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export const mediaConvert: MediaConverter = async ({
  source,
  format = "jpeg",
  quality = 1,
}) => {
  try {
    const originalImages = Array.isArray(source) ? source : [source];
    const conversionPromises = originalImages.map(img => {
      const path = getPath(img);
      return MediaPickerConverter.convertImage(path, format, quality);
    });
    return await Promise.all(conversionPromises);
  } catch (error) {
    throw new Error(
      `Compression failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export const mediaPicker: MediaPicker = ({
  options,
  cameraOptions,
  libraryOptions,
  errorMessage,
  selectModal,
}) => {
  const selectionLimit = 1;
  const mediaOptions: OptionsCommon = { mediaType: "photo", ...options };
  const title = selectModal?.title || "Open";
  const subtitle = selectModal?.subtitle || "";
  const camera = selectModal?.camera || "Camera";
  const library = selectModal?.library || "Gallery";
  const cancel = selectModal?.cancel || "Cancel";
  const onCancel = selectModal?.onCancel;

  return new Promise(resolve => {
    Alert.alert(title, subtitle, [
      {
        text: cancel,
        style: "cancel",
        onPress: () => onCancel?.(),
      },
      {
        text: camera,
        onPress: async () => {
          const images = await selectImages(
            "camera",
            {
              ...mediaOptions,
              ...cameraOptions,
            },
            errorMessage,
          );
          resolve(images);
        },
      },
      {
        text: library,
        onPress: async () => {
          const images = await selectImages(
            "library",
            {
              ...mediaOptions,
              selectionLimit,
              ...libraryOptions,
            },
            errorMessage,
          );
          resolve(images);
        },
      },
    ]);
  });
};

export const mediaPickerConverter: MediaPickerConverterType = async ({
  pickerOptions,
  converterOptions,
}) => {
  const selectedImages = await mediaPicker({ ...pickerOptions });
  if (!selectedImages) return;
  if (converterOptions?.maxSize) {
    return await mediaCompress({
      source: selectedImages,
      format: converterOptions?.format,
      maxSize: converterOptions?.maxSize,
    });
  } else {
    return await mediaConvert({
      source: selectedImages,
      quality: converterOptions?.quality || 1,
      format: converterOptions?.format || "jpg",
    });
  }
};

export type {
  Media,
  MediaPickerOptions,
  MediaPicker,
  Format,
  MediaCompressOptions,
  MediaCompress,
  MediaConverterOptions,
  MediaConverter,
  MediaPickerConverterOptions,
  MediaPickerConverterType,
  ConverterPickerOptions,
} from "./types";
