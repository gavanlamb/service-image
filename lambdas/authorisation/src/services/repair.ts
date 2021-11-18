import axios from "axios";

const getImageInformation = async (
    jobId: string,
    s3Name: string,
    token: string):Promise<ErrorDetails> => {
    const response = await axios.get(`https://dev.repair.wilbur.app/v1/Jobs/${jobId}/Photos/${s3Name}`, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    });

    return {
        status: response.status,
        statusDescription: response.statusText
    }
}

interface ErrorDetails {
    status: number,
    statusDescription: string
}

export {getImageInformation}
