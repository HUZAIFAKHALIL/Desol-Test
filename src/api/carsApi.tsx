
import { BASE_URL } from "@/config/constant";
import axios, { AxiosResponse } from "axios";

export interface SubmitCarRequestBody {
    carModel: string;
    price: number;
    phoneNumber: string;
    numOfPictures: number;
    images: FileList;
}


export interface SubmitCarResponse {
    status: boolean;
    message: string;
    data?: Car;
}


export interface Car {
    _id: string;
    carModel: string;
    price: number;
    phoneNumber: string;
    images: string[];
}

export const submitCar = (
    requestBody: SubmitCarRequestBody
): Promise<AxiosResponse<SubmitCarResponse>> => {
    const formData = new FormData();
    formData.append("carModel", requestBody.carModel);
    formData.append("price", requestBody.price.toString());
    formData.append("phoneNumber", requestBody.phoneNumber);
    formData.append("numOfPictures", requestBody.numOfPictures.toString());

    Array.from(requestBody.images).forEach((file) => {
        formData.append("images", file);
    })

    return axios.post<SubmitCarResponse>(
        `${BASE_URL.CARS}`,
        formData,
        {

            headers: {
            },
        }
    );
};
