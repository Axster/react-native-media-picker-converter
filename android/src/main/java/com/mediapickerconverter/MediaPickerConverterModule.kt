package com.mediapickerconverter

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import com.facebook.react.bridge.*
import java.io.*
import kotlin.math.roundToInt

class MediaPickerConverterModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "MediaPickerConverter"

    @ReactMethod
    fun convertImage(sourcePath: String, format: String, quality: Double, promise: Promise) {
        try {
            val sourceFile = File(sourcePath)
            if (!sourceFile.exists()) {
                promise.reject("ERROR", "Source file does not exist")
                return
            }

            // Load the source image
            val sourceBitmap = BitmapFactory.decodeFile(sourcePath)
                ?: throw Exception("Failed to load source image")

            val destinationFormat = format.lowercase()
            val compressFormat = when (destinationFormat) {
                "jpg", "jpeg" -> Bitmap.CompressFormat.JPEG
                "png" -> Bitmap.CompressFormat.PNG
                "webp" -> {
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
                        Bitmap.CompressFormat.WEBP_LOSSY
                    } else {
                        @Suppress("DEPRECATION")
                        Bitmap.CompressFormat.WEBP
                    }
                }
                else -> throw Exception("Unsupported format: $format")
            }

            // Create output file
            val outputFileName = "${System.currentTimeMillis()}_converted.$destinationFormat"
            val outputFile = File(reactApplicationContext.cacheDir, outputFileName)
            
            // Convert and save
            FileOutputStream(outputFile).use { fos ->
                sourceBitmap.compress(
                    compressFormat,
                    (quality * 100).roundToInt(),
                    fos
                )
            }

            // Create response
            val response = Arguments.createMap().apply {
                putString("mimeType", "image/$destinationFormat")
                putString("type", "image/$destinationFormat")
                putString("uri", "file://${outputFile.absolutePath}") // Android expects a `file://` URI
                putString("url", "file://${outputFile.absolutePath}") // Alternative naming for web-like access
                putString("name", outputFileName)
                putInt("width", sourceBitmap.width)
                putInt("height", sourceBitmap.height)
                putString("path", outputFile.absolutePath)
                putString("originalPath", sourcePath)
                putInt("size", outputFile.length().toInt())
                putInt("fileSize", outputFile.length().toInt())
                putString("fileName", outputFileName)
                putString("timestamp", System.currentTimeMillis().toString())
                // Keys not supported: base64, duration, bitrate, id
            }

            promise.resolve(response)
            
        } catch (e: Exception) {
            promise.reject("ERROR", "Conversion failed: ${e.message}")
        }
    }
}