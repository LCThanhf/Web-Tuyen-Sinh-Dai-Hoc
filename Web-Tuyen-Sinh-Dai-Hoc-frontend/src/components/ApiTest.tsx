// Simple API test component to verify frontend-backend connection
import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';

interface School {
  id: string;
  name: string;
  code: string;
  totalQuota: number;
  isActive: boolean;
}

export const ApiTest = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/schools');
        console.log('Schools API response:', response.data);
        setSchools(response.data.data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching schools:', err);
        setError(err.message || 'Failed to fetch schools');
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  if (loading) return <div>Loading schools...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <div>
      <h3>API Connection Test - Schools ({schools.length})</h3>
      {schools.length > 0 ? (
        <ul>
          {schools.map(school => (
            <li key={school.id}>
              <strong>{school.code}</strong>: {school.name} 
              <small> (Quota: {school.totalQuota})</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No schools found</p>
      )}
    </div>
  );
};
