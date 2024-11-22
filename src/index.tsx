import { Alert, NativeModules } from "react-native";
import type {
  MediaPicker,
  MediaConverter,
  MediaPickerConverterType,
} from "./types";
import { selectImages } from "./utils";
import type { OptionsCommon } from "react-native-image-picker";

// const LINKING_ERROR =
//   `The package 'react-native-media-picker-converter' doesn't seem to be linked. Make sure: \n\n` +
//   Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
//   '- You rebuilt the app after installing the package\n' +
//   '- You are not using Expo Go\n';

// const MediaPickerConverter = NativeModules.MediaPickerConverter
//   ? NativeModules.MediaPickerConverter
//   : new Proxy(
//       {},
//       {
//         get() {
//           throw new Error(LINKING_ERROR);
//         },
//       }
//     );

const { MediaPickerConverter } = NativeModules;

export const convertMedia: MediaConverter = async ({
  source,
  format,
  quality,
}) => {
  const convertFormat = format || "jpeg";
  const convertQuality = quality || 1;
  try {
    if (Array.isArray(source)) {
      const conversionPromises = source.map(img => {
        const path = (img.uri || img.url)?.replace("file://", "");
        return MediaPickerConverter.convertImage(
          path,
          convertFormat,
          convertQuality,
        );
      });
      return await Promise.all(conversionPromises);
    }
    const path = (source.uri || source.url)?.replace("file://", "");
    return [await MediaPickerConverter.convertImage(path, format, quality)];
  } catch (error) {
    throw new Error(`Conversion failed: ${error}`);
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
  const convertedImages = await convertMedia({
    source: selectedImages,
    quality: converterOptions?.quality || 1,
    format: converterOptions?.format || "jpg",
  });
  return convertedImages;
};

export type {
  Media,
  MediaPickerOptions,
  MediaPicker,
  Format,
  MediaConverterOptions,
  MediaConverter,
  MediaPickerConverterOptions,
  MediaPickerConverterType,
  ConverterPickerOptions,
} from "./types";
