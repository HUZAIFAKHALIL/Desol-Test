import { BASE_URL } from "@/config/constant";
import axios, { AxiosResponse } from "axios";

interface LoginRequestBody {
    email: string;
    password: string;
}

interface LoginResponse {
    statusCode: number;
    status: boolean;
    message: string;
    token?: string;
}

const login = (requestBody: LoginRequestBody): Promise<AxiosResponse<LoginResponse>> => {
    return axios.post<LoginResponse>(`${BASE_URL.USER}/login`, requestBody);
};

export { login };
