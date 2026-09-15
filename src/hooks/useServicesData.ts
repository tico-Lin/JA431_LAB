import { useState, useEffect } from 'react';
import type { ServicesData } from '../types/serviceTypes';

export function useServicesData() {
  const [data, setData] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${import.meta.env.BASE_URL}data/servicesData.json`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to load services data: ${res.statusText}`);
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
}
