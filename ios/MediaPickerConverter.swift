import Foundation
import UIKit

@objc(MediaPickerConverter)
class MediaPickerConverter: NSObject {
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
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
        case "webp", "jpg", "jpeg":
            convertedData = sourceImage.jpegData(compressionQuality: CGFloat(quality))
            mimeType = "image/jpeg"
            
        case "png":
            convertedData = sourceImage.pngData()
            mimeType = "image/png"
             
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
