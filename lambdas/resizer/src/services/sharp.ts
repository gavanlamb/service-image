import sharp from "sharp";

const getFormatConfigForStream = (
    fileType: string): sharp.AvailableFormatInfo => {
    
    const id = fileType.toLowerCase() === "jpg" ? "jpeg" : fileType.toLowerCase()
    
    return {
        id: id,
        input: {
            buffer: true,
            file: false,
            stream: false,
        },
        output: {
            buffer: true,
            file: false,
            stream: false,
        },
    };
};

const alterImage = (
    image: Buffer,
    height: number | null,
    width: number | null,
    quality: number | null,
    format: string | null
):Promise<Buffer> => {
    // @ts-ignore
    let sharpConfig = sharp(image, { 
            failOnError: false,
            limitInputPixels: true
        })
        .rotate()
        .withMetadata();

    if (height !== null || width !== null) {
        sharpConfig = sharpConfig.resize(width, height, { withoutEnlargement: true });
    }

    if (format != null) {
        sharpConfig = sharpConfig.toFormat(
            getFormatConfigForStream(format),
            {
                quality: quality !== null ? quality : 100,
                progressive: true
            });
    }

    return sharpConfig.toBuffer();
}

export { alterImage }