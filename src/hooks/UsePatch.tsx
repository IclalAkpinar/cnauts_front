import { AxiosError } from 'axios';
import { axios } from '../utils/axios';

export const UsePatch = async <T, B = any>(url: string, body: Partial<B>) => 
{
  let response: { error: boolean; data?: T; message?: string } = { error: false };

  try {
    const res = await axios.patch(url, body);
    response.data = res.data.result.data;
  } 
  catch (error) {
    response.error = true;

  }

  return response;
};