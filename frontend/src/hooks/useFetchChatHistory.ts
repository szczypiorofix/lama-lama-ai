import { useCallback, useEffect, useState } from 'react';

import { API_BASE_URL } from '../shared/constants';
import { ChatHistory } from '../shared/models';

export const useFetchChatHistory = (limit = 20, autoFetch = true) => {
    const [data, setData] = useState<ChatHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/history?limit=${limit}`);
            const json: ChatHistory[] = await res.json();
            setData(json ?? []);
        } catch (err: any) {
            console.error(err);
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        if (autoFetch) {
            fetchHistory();
        }
    }, [autoFetch, fetchHistory]);

    return { data, loading, error };
};
