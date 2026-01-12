import { useQuery, useQueryClient, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

// Query key factory
export const patientKeys = {
  all: ['patients'],
  lists: () => [...patientKeys.all, 'list'],
  list: (filters) => [...patientKeys.lists(), { filters }],
  details: () => [...patientKeys.all, 'detail'],
  detail: (id) => [...patientKeys.details(), id],
  infinite: (search = '') => [...patientKeys.all, 'infinite', search],
};

// Fetch patients function with search support
const fetchPatients = async (search = '') => {
  const searchParam = search ? `?search=${encodeURIComponent(search)}` : '';
  const { data } = await axios.get(`/v1/api/patients${searchParam}`);
  return data?.data?.patients || [];
};

// Fetch patients with pagination
const fetchPatientsPage = async ({ pageParam = 1, queryKey }) => {
  const search = queryKey?.[2] || ''; // Safely extract search from queryKey
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
  const { data } = await axios.get(`/v1/api/patients?page=${pageParam}${searchParam}`);
  return {
    patients: data?.data?.patients || [],
    pagination: data?.data?.pagination || {},
  };
};

// React Query hook for patients with search support
export const usePatientsQuery = (search = '') => {
  return useQuery({
    queryKey: [...patientKeys.lists(), search],
    queryFn: () => fetchPatients(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// NEW: React Query hook for infinite pagination
export const usePatientsInfiniteQuery = (search = '') => {
  return useInfiniteQuery({
    queryKey: patientKeys.infinite(search),
    queryFn: fetchPatientsPage,
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      // Return next page number if there are more pages, otherwise undefined
      return page < pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get patients from cache
export const usePatientsCache = () => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(patientKeys.lists());
  return data || [];
};

// Hook to invalidate patients cache
export const useInvalidatePatients = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
  };
};

// Mutation for adding a patient
export const useAddPatientMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patientData) => {
      // First get the medical ID
      const medicalIdResponse = await axios.post("/v1/api/record/medical-id", {
        firstName: patientData.firstName,
        lastName: patientData.lastName,
      });

      // Create patient with all data including medical ID
      const patientResponse = await axios.post("/v1/api/patients", {
        ...patientData,
        medicalId: medicalIdResponse.data.medicalId,
      });

      return patientResponse.data.data;
    },
    onSuccess: () => {
      // Invalidate and refetch both regular and infinite patients lists
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: patientKeys.infinite() });
    },
  });
};

// Mutation for updating a patient
export const useUpdatePatientMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ patientId, data }) => {
      const response = await axios.put(`/v1/api/patients/${patientId}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate and refetch both regular and infinite patients lists
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: patientKeys.infinite() });
    },
  });
};

// Mutation for deleting a patient
export const useDeletePatientMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patientId) => {
      await axios.delete(`/v1/api/patients/${patientId}`);
      return patientId;
    },
    onSuccess: () => {
      // Invalidate and refetch both regular and infinite patients lists
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: patientKeys.infinite() });
    },
  });
};

// Fetch single patient by ID
const fetchPatientById = async (patientId) => {
  const { data } = await axios.get(`/v1/api/patients/${patientId}`);
  return data?.data || null;
};

// React Query hook for single patient
export const usePatientQuery = (patientId) => {
  return useQuery({
    queryKey: patientKeys.detail(patientId),
    queryFn: () => fetchPatientById(patientId),
    enabled: !!patientId, // Only fetch if patientId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

