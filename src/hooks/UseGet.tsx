import { useEffect, useState } from "react";
import { tempResponseDataType } from "../models/default.req.res";
import { axios } from "../utils/axios";

export const UseGet = <T,>(
  url: string,
  refreshKey?: number,
  p0?: { isDeleted: boolean }
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: tempResponseDataType<T> = await axios.get(`${url}`);
        const result = response.data.result as any;

        if (result?.data && result?.statisticalDatas) {
          setData(result as T);
        } else if (result?.data) {
          setData(result.data as T);
        } else {
          setData(result as T);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, refreshKey]);

  return { data, loading, error };
};
