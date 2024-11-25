import type {
  CameraOptions,
  ImageLibraryOptions,
  OptionsCommon,
  PhotoQuality,
} from "react-native-image-picker";

export type Media = {
  name?: string;
  url?: string;
  base64?: string;
  uri?: string;
  width?: number;
  height?: number;
  path?: string;
  originalPath?: string;
  size?: string;
  fileSize?: number;
  type?: string;
  mimeType?: string;
  fileName?: string;
  timestamp?: string;
  id?: string;
};

export type MediaPickerOptions = Partial<{
  options: Pick<
    OptionsCommon,
    "quality" | "maxWidth" | "maxHeight" | "includeBase64" | "presentationStyle"
  >;
  libraryOptions: Pick<ImageLibraryOptions, "selectionLimit">;
  cameraOptions: Pick<CameraOptions, "saveToPhotos" | "cameraType">;
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
  source: Media | Media[];
  format?: Format;
  quality?: PhotoQuality;
};
export type MediaConverter = (
  mediaConverterOptions: MediaConverterOptions,
) => Promise<Media[]>;

export type MediaCompressOptions = Omit<MediaConverterOptions, "quality"> & {
  maxSize: number;
};
export type MediaCompress = (
  mediaConverterOptions: MediaCompressOptions,
) => Promise<Media[]>;

export type ConverterPickerOptions = Pick<
  OptionsCommon,
  "maxWidth" | "maxHeight" | "includeBase64" | "presentationStyle"
>;
export type MediaPickerConverterOptions = {
  pickerOptions?: Omit<MediaPickerOptions, "options"> & {
    options?: ConverterPickerOptions;
  };
  converterOptions?: Omit<MediaConverterOptions, "source"> & {
    maxSize?: number;
  };
};

export type MediaPickerConverterType = (
  mediaPickerConverter: MediaPickerConverterOptions,
) => Promise<Media[] | undefined>;
