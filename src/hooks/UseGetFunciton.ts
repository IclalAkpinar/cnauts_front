import { tempResponseDataType } from "../models/default.req.res";
import { axios } from "../utils/axios";

export const UseGetFunction = async <T>(url: string) => {
 let response: { error: boolean; data: T | undefined } = {
  error: false,
  data: undefined,
 };

 try {
  const res: tempResponseDataType<T> | null = await axios.get(`${url}`);
  response.data = res?.data.result.data;
 } catch {
  response.error = true;
 }

 return response;
};
