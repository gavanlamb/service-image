import sharp from "sharp";
import {PassThrough, Readable} from "stream";

const getFormatConfigForStream = (
    fileType: string): sharp.AvailableFormatInfo => {
    
    const id = fileType.toLowerCase() === "jpg" ? "jpeg" : fileType.toLowerCase()
    
    return {
        id: id,
        input: {
            buffer: false,
            file: false,
            stream: true,
        },
        output: {
            buffer: false,
            file: false,
            stream: true,
        },
    };
};

const setupSharp = (
    format: string,
    width: number | null,
    height: number | null,
    quality: number): sharp.Sharp => {
    let config = sharp({
            failOnError: false,
            limitInputPixels: true
        })
        .rotate()
        .withMetadata();

    if(width || height){
        config = config.resize(width, height, { 
            withoutEnlargement: true 
        });
    }

    return config.toFormat(
        getFormatConfigForStream(format),
        {
            quality,
            progressive: true
        });
}

const alterImage = (
    source: Readable,
    destination: PassThrough,
    format: string,
    height: number | null,
    width: number | null,
    quality: number):void => {
    const sharp = setupSharp(
        format, 
        width, 
        height, 
        quality);
    
    sharp.pipe(destination)
    source.pipe(sharp);
}

export { alterImage }
