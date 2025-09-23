
import useSWR from 'swr';
import initialArgoFloatData from '@/lib/argo-float-data.json';

export type ArgoFloat = {
  id: string;
  lat: number;
  lng: number;
  location: string;
  sea: 'Arabian Sea' | 'Bay of Bengal' | string;
};

export const ARGO_FLOATS_SWR_KEY = 'argo-floats-data';

// A "fetcher" is not needed for SWR when we are managing local data.
// We provide the initial data and update it with `mutate`.
export const useArgoFloats = () => {
  const { data, error, mutate } = useSWR<ArgoFloat[]>(ARGO_FLOATS_SWR_KEY, null, {
    fallbackData: initialArgoFloatData.argoFloats as ArgoFloat[],
  });

  return {
    argoFloats: data ?? [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
