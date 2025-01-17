import { useState, useEffect } from 'react';
import { getRequest } from './Axios.js';

export const useFetchData = (url, params) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest(url, params);
        if (response.status === 200) {
          setData(response.data);
        } else {
  
          setError('Error fetching data');
        }
      } catch (error) {
        
        setError('Error fetching data');
      }
    };

    fetchData();
  }, [url, params]);

  return { data, error };
};
