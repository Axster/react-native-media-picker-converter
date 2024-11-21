import type {
  Asset,
  CameraOptions,
  ImageLibraryOptions,
  OptionsCommon,
  PhotoQuality,
} from "react-native-image-picker";

export type Media = Asset & {
  name?: string;
  url?: string;
};

export type MediaPickerOptions = Partial<{
  options: Pick<
    OptionsCommon,
    "quality" | "maxWidth" | "maxHeight" | "includeBase64" | "presentationStyle"
  >;
  libraryOptions: Pick<ImageLibraryOptions, "selectionLimit">;
  cameraOptions: Pick<CameraOptions, "saveToPhotos" | "cameraType">;
  // convertTo?: Format;
  errorMessage: string;
  selectModal: Partial<{
    title: string;
    subtitle: string;
    camera: string;
    library: string;
    cancel: string;
    onCancel: () => void;
  }>;
}>;

export type MediaPicker = (
  mediaPickerOptions: MediaPickerOptions,
) => Promise<Media[] | undefined>;

export type Format = "jpg" | "jpeg" | "png" | "webp";
export type MediaConverterOptions = {
  sourcePath: string | string[];
  format?: Format;
  quality?: PhotoQuality;
};
export type MediaConverter = (
  mediaConverterOptions: MediaConverterOptions,
) => Promise<Media[]>;

export type ConverterPickerOptions = Pick<
  OptionsCommon,
  "maxWidth" | "maxHeight" | "includeBase64" | "presentationStyle"
>;
export type MediaPickerConverterOptions = {
  pickerOptions?: Omit<MediaPickerOptions, "options"> & {
    options?: ConverterPickerOptions;
  };
  converterOptions?: Omit<MediaConverterOptions, "sourcePath">;
};

export type MediaPickerConverterType = (
  mediaPickerConverter: MediaPickerConverterOptions,
) => Promise<Media[] | undefined>;
