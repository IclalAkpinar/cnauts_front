import { tempResponseDataType } from "../models/default.req.res";
import { axios } from "../utils/axios";

export const UsePost = async <T, B = any>(url: string, body: B) => {
  let response: {
    [x: string]: any;
    error: boolean;
    data: T | undefined;
  } = {
    error: false,
    data: undefined,
  };

  try {
    const res: tempResponseDataType<T> | null = await axios.post(
      `${url}`,
      body
    );
    response.data = res?.data.result.data || res?.data?.result?.data;
  } catch (error: any) {
    response.error = true;
    const errorMessage =
      error.response?.data?.result?.message ||
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      "Bilinmeyen bir hata oluştu";

    const duplicateValuesRegex = /Duplicate values found: (.+?)\.\s?$/;
    const match = errorMessage.match(duplicateValuesRegex);
  }

  return response;
};
