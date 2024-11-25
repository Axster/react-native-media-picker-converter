# React Native Media Picker Converter

> A powerful React Native library for picking, converting, and compressing images with a simple API.

![Demo](./assets/media-picker-coverter-demo.gif)

## Features

- 📱 Pick images from camera or gallery
- 🔄 Convert between image formats (JPEG, PNG, WEBP*)
- 🗜️ Compress images to a target file size
- 📊 Batch processing support
- 🎯 Quality control for lossy formats
- 📱 iOS and Android support

> *WEBP conversion is currently supported only on Android

## Installation

```bash
# First install the required peer dependencies
npm install react-native-image-picker react-native-file-access

# Then install the main package
npm install react-native-media-picker-converter
```

### iOS Setup

1. Add these permissions to your `Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to take photos.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photo library to select images.</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>We need access to save photos to your library.</string>
```

2. Run `pod install` in the `ios` directory

### Android Setup

Add these permissions to your `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## Usage

### Basic Image Picker

```typescript
import { mediaPicker } from 'react-native-media-picker-converter';

const pickImages = async () => {
  const options = {
    options: {
      quality: 1,
      maxHeight: 1024,
      maxWidth: 1024,
    },
    libraryOptions: {
      selectionLimit: 5,
    },
    selectModal: {
      title: "Select Images",
      subtitle: "Choose an option",
      camera: "Take Photo",
      library: "Choose from Library",
    }
  };

  const images = await mediaPicker(options);
};
```

### Convert Images

```typescript
import { mediaConvert } from 'react-native-media-picker-converter';

const convertImages = async (images) => {
  const converted = await mediaConvert({
    source: images,
    format: 'jpg',
    quality: 0.9
  });
};
```

### Compress Images to Target Size

```typescript
import { mediaCompress } from 'react-native-media-picker-converter';

const compressImages = async (images) => {
  const compressed = await mediaCompress({
    source: images,
    format: 'jpg',
    maxSize: 500 // Target size in KB
  });
};
```

### All-in-One Solution: Pick, Convert & Compress

```typescript
import { mediaPickerConverter } from 'react-native-media-picker-converter';

const pickAndProcess = async () => {
  const images = await mediaPickerConverter({
    pickerOptions: {
      libraryOptions: {
        selectionLimit: 3,
      }
    },
    converterOptions: {
      format: 'jpg',
      maxSize: 500 // in KB
    }
  });
};
```

## Important Notes

### Image Quality and Compression

- Quality values range from 0 to 1
- Quality settings affect file size non-linearly
- Quality only affects JPEG and WEBP formats
- PNG files are always lossless and ignore quality settings
- When using `maxSize`:
  - The library will automatically find the best quality level that meets the size requirement
  - If specified alongside `quality`, `maxSize` takes precedence
  - PNG files will be converted to JPEG for compression

### Format Support

- Supported formats: JPEG, PNG, WEBP (Android only)
- iOS automatically converts WEBP requests to JPEG
- When no format is specified during compression, images default to JPEG

### Image Storage

Currently, processed images are stored in the app's cache directory. Permanent storage implementation is planned for future releases.

## API Reference

### MediaPicker Options

| Option | Type | Description |
|--------|------|-------------|
| options | `OptionsCommon` | Basic image options (quality, dimensions, etc.) |
| libraryOptions | `ImageLibraryOptions` | Gallery picker specific options |
| cameraOptions | `CameraOptions` | Camera specific options |
| selectModal | `Object` | Customize picker modal UI |

### MediaConverter Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| source | `Media \| Media[]` | - | Image(s) to convert |
| format | `'jpg' \| 'jpeg' \| 'png' \| 'webp'` | 'jpeg' | Target format |
| quality | `number` | 1 | Output quality (0-1) |

### MediaCompress Options

| Option | Type | Description |
|--------|------|-------------|
| source | `Media \| Media[]` | Image(s) to compress |
| format | `Format` | Target format |
| maxSize | `number` | Maximum size in KB |

## Contributing

Contributions are welcome! Please read our contributing guidelines for details.

## TODO

- [ ] Embed peer dependencies in native modules
- [ ] Add iOS WEBP support
- [ ] Enable new architecture support
- [ ] Add image grid component with crop/rotate functionality
- [ ] Preserve original format during compression when no target format specified
- [ ] Add permanent storage option for processed images

## License

MIT

## Support

If you like this project, please consider giving it a ⭐️!