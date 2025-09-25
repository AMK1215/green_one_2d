import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useFetch = (url) => {
    let [data, setData] = useState([]);
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState(null);
    let navigate = useNavigate();

    useEffect(() => {
        let abortController = new AbortController();
        let signal = abortController.signal;

        setLoading(true);
        setError(null); // Clear previous errors
        console.log('Fetching URL:', url);
        
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem('auth_token')
            },
            signal
        })
            .then(res => {
                console.log('Response status:', res.status, 'for URL:', url);
                if(res.status === 401){
                    localStorage.removeItem('auth_token');
                    navigate('/?type=all');
                    return;
                }
                if (!res.ok) {
                    throw Error("Something Went Wrong!");
                }
                return res.json();
            })
            .then(data => {
                // Only update state if the request wasn't aborted
                if (!signal.aborted) {
                    console.log('API Response for', url, ':', data);
                    setData(data.data);
                    setLoading(false);
                }
            })
            .catch(e => {
                // Only log errors if they're not due to abort
                if (e.name !== 'AbortError') {
                    console.error('API Error for', url, ':', e.message);
                    setError(e.message);
                    setLoading(false);
                }
            });

        // Cleanup function
        return () => {
            abortController.abort();
        };

    }, [url, navigate]);

    return { data, loading, error };
}

export default useFetch;