// useFetchData.js
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
          console.error('Error fetching data: Unexpected response status', response.status);
          setError('Error fetching data: Unexpected response status ' + response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data: ' + error);
      }
    };

    fetchData();
  }, [url, params]);

  return { data, error };
};
