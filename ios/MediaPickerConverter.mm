#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MediaPickerConverter, NSObject)
RCT_EXTERN_METHOD(convertImage:(NSString *)sourcePath
                 toFormat:(NSString *)format
                 withQuality:(double)quality
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}
@end