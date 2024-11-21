import Foundation
import UIKit
import WebP

@objc(MediaPickerConverter)
class MediaPickerConverter: NSObject {
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    private func encodeWebP(from image: UIImage, quality: Double) -> Data? {
        guard let cgImage = image.cgImage else { return nil }
        
        let width = cgImage.width
        let height = cgImage.height
        
        // Allocate memory for RGBA data
        guard let data = malloc(width * height * 4) else { return nil }
        defer { free(data) }
        
        // Create RGB color space
        guard let colorSpace = CGColorSpaceCreateDeviceRGB() else { return nil }
        
        // Create bitmap context
        guard let context = CGContext(
            data: data,
            width: width,
            height: height,
            bitsPerComponent: 8,
            bytesPerRow: width * 4,
            space: colorSpace,
            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
        ) else { return nil }
        
        // Draw image into context
        context.draw(cgImage, in: CGRect(x: 0, y: 0, width: width, height: height))
        
        // Encode WebP
        var config = WebPConfig()
        if WebPConfigInit(&config) == 0 {
            return nil
        }
        
        // Set encoding parameters
        config.lossless = 0  // Lossy compression
        config.quality = Float(quality * 100.0)  // Convert quality to 0-100 scale
        
        var picture = WebPPicture()
        if WebPPictureInit(&picture) == 0 {
            return nil
        }
        defer { WebPPictureFree(&picture) }
        
        picture.width = Int32(width)
        picture.height = Int32(height)
        
        // Import RGBA data
        if WebPPictureImportRGBA(&picture, data.assumingMemoryBound(to: UInt8.self), Int32(width * 4)) == 0 {
            return nil
        }
        
        var webpData: Data = Data()
        picture.writer = { (data: UnsafeRawPointer?, size: Int, picture: UnsafePointer<WebPPicture>?) -> Int32 in
            guard let data = data else { return 0 }
            webpData.append(Data(bytes: data, count: size))
            return 1
        }
        
        if WebPEncode(&config, &picture) == 0 {
            return nil
        }
        
        return webpData
    }
    
    @objc(convertImage:toFormat:withQuality:withResolver:withRejecter:)
    func convertImage(_ sourcePath: String,
                     toFormat format: String,
                     withQuality quality: Double,
                     resolve: @escaping RCTPromiseResolveBlock,
                     reject: @escaping RCTPromiseRejectBlock) {
        
        guard let sourceImage = UIImage(contentsOfFile: sourcePath) else {
            reject("ERROR", "Cannot load source image", nil)
            return
        }
        
        let destinationFormat = format.lowercased()
        var convertedData: Data?
        var mimeType: String?
        
        switch destinationFormat {
        case "jpg", "jpeg":
            convertedData = sourceImage.jpegData(compressionQuality: CGFloat(quality))
            mimeType = "image/jpeg"
            
        case "png":
            convertedData = sourceImage.pngData()
            mimeType = "image/png"
            
        case "webp":
            convertedData = encodeWebP(from: sourceImage, quality: quality)
            mimeType = "image/webp"
            if convertedData == nil {
                reject("ERROR", "WebP conversion failed", nil)
                return
            }
            
        default:
            reject("ERROR", "Unsupported format: \(format)", nil)
            return
        }
        
        guard let finalData = convertedData else {
            reject("ERROR", "Conversion failed", nil)
            return
        }
        
        // Generate output filename
        let outputFileName = UUID().uuidString + "." + destinationFormat
        let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
        let outputPath = (documentsPath as NSString).appendingPathComponent(outputFileName)
        let timestamp = ISO8601DateFormatter().string(from: Date())
        
        do {
            try finalData.write(to: URL(fileURLWithPath: outputPath))
            
            // Prepare response
            let response: [String: Any?] = [
                "uri": "file://" + outputPath,
                "url": "file://" + outputPath,
                "path": outputPath,
                "name": outputFileName,
                "fileName": outputFileName,
                "size": finalData.count,
                "fileSize": finalData.count, // in bytes
                "type": mimeType,
                "mimeType": mimeType,
                "originalPath": sourcePath,
                "width": Int(sourceImage.size.width),
                "height": Int(sourceImage.size.height),
                "timestamp": timestamp
            ]
            
            resolve(response.compactMapValues { $0 }) // remove nil
        } catch {
            reject("ERROR", "Failed to save converted image: \(error.localizedDescription)", nil)
        }
    }
}
