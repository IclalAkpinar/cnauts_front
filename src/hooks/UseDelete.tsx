import { useState } from "react";
import { tempResponseDataType } from "../models/default.req.res";
import { axios } from "../utils/axios";

export const UseDelete = <T,>(url: string) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<T | null>(null);

    const deleteData = async (productId: string) => {
      setLoading(true);
      setError(null);

      try {
        const response: tempResponseDataType<T> = await axios.delete(`${url}/${productId}`);
        setData(response.data.result as T); 
        return { success: true, message: "Silme işlemi başarılı bir şekilde yapıldı." };  
      } catch (err) {
        setError("Silme işlemi başarısız oldu.");
        return { success: false, message: "Silme işlemi başarısız oldu!" };
      } finally {
        setLoading(false);
      }
    };

    return { deleteData, loading, error, data };
};  