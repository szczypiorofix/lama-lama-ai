import { useCallback, useEffect, useState } from 'react';

import { changeLlmList } from '../context/AppActions.ts';
import { useGlobalAppContext } from '../context/AppContext.tsx';
import { API_BASE_URL } from '../shared/constants';
import { LlmModelImageStatus } from '../shared/enums';
import { LlmImage } from '../shared/models';

export const useFetchLlmModels = (autoFetch: boolean = true) => {
    const { dispatch } = useGlobalAppContext();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [updated, setUpdated] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/models`);
            const data: LlmImage[] = await res.json();
            data?.forEach((llmImage: LlmImage) => {
                llmImage.status = llmImage.downloaded
                    ? LlmModelImageStatus.DOWNLOADED
                    : LlmModelImageStatus.NOT_DOWNLOADED;
            });
            changeLlmList(dispatch, data ?? []);
            setUpdated(true);
        } catch (err: any) {
            console.error(err);
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        if (autoFetch && !updated) {
            refresh();
        }
    }, [autoFetch, updated, refresh]);

    return { error, loading, updated, refresh };
};
