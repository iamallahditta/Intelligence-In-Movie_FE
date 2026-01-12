import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const templateKeys = {
  all: ['templates'],
  names: (search = '') => [...templateKeys.all, 'names', search],
};

const fetchTemplateNames = async (search = '') => {
  const searchParam = search ? `?search=${encodeURIComponent(search)}` : '';
  const { data } = await axios.get(`/v1/api/templates/names${searchParam}`);
  return data?.data || [];
};

export const useTemplateNamesQuery = (search = '') => {
  return useQuery({
    queryKey: templateKeys.names(search),
    queryFn: () => fetchTemplateNames(search),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
