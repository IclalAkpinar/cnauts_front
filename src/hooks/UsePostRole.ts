import { tempResponseDataType } from "../models/default.req.res";
import { axios } from "../utils/axios";

export const UsePostRole = async <T, B = any>(url: string, body: B) => {
  let response: {
    [x: string]: any;
    error: boolean;
    data: T | undefined;
    errorMessage?: string;
  } = {
    error: false,
    data: undefined,
  };

  try {
    const res: tempResponseDataType<T> | null = await axios.post(
      `${url}`,
      body
    );
    response.data = res?.data?.result?.data;
  } catch (error: any) {
    response.error = true;
    response.errorMessage = "Bir hata oluştu!";
  }

  return response;
};


