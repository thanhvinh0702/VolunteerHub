
import { approveRegistration, checkUserParticipation, getAggregatedRegistrations, listUserOfAnEvent, numberOfEventRegistrations, registerEventList, registerForEvent, removeParticipant, reviewRegistration, unregisterFromEvent } from "../services/registrationService";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const REGISTRAION_QUERY_KEY = ["registrations"];

export const useEventRegistrations = (params) => {
    const queryClient = useQueryClient();
    const { pageNum = 0, pageSize = 10, status } = params || {};
    const query = useQuery({
        queryKey: [...REGISTRAION_QUERY_KEY, { pageNum, pageSize, status }],
        queryFn: async () => {
            console.log('🔍 Fetching registrations with params:', { pageNum, pageSize, status });
            const result = await registerEventList({ pageNum, pageSize, status });
            console.log('📦 Registration response:', result);
            return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
        },
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    useEffect(() => {
        const nextPage = pageNum + 1;
        if (query.data?.meta?.totalPages > nextPage) {
            queryClient.prefetchQuery({
                queryKey: [...REGISTRAION_QUERY_KEY, { pageNum: nextPage, pageSize, status }],
                queryFn: async () => {
                    const result = await registerEventList({ pageNum: nextPage, pageSize, status });
                    return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
                },
            });
        }
    }, [query.data, pageNum, pageSize, status, queryClient]);
    return query;
};

export const useAggregatedRegistrations = (params) => {
    const queryClient = useQueryClient();
    const { pageNum = 0, pageSize = 10, status, eventName } = params || {};
    const query = useQuery({
        queryKey: [...REGISTRAION_QUERY_KEY, "aggregated", { pageNum, pageSize, status, eventName }],
        queryFn: async () => {
            const result = await getAggregatedRegistrations({ pageNum, pageSize, status, eventName });
            return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
        },
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    useEffect(() => {
        const nextPage = pageNum + 1;
        if (query.data?.meta?.totalPages > nextPage) {
            queryClient.prefetchQuery({
                queryKey: [...REGISTRAION_QUERY_KEY, "aggregated", { pageNum: nextPage, pageSize, status, eventName }],
                queryFn: async () => {
                    const result = await getAggregatedRegistrations({ pageNum: nextPage, pageSize, status, eventName });
                    return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
                },
            });
        }
    }, [query.data, pageNum, pageSize, status, eventName, queryClient]);
    return query;
};

export const useCheckUserParticipation = (eventId) => {
    return useQuery({
        queryKey: [...REGISTRAION_QUERY_KEY, "participation", eventId],
        queryFn: () => checkUserParticipation(eventId),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!eventId,
    });
};

export const useRegisterForEvent = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (eventId) => registerForEvent(eventId),
        onSuccess: (data, eventId, context) => {
            toast.success("Registered successfully.");
            queryClient.invalidateQueries(REGISTRAION_QUERY_KEY);
            queryClient.invalidateQueries([...REGISTRAION_QUERY_KEY, "participation", eventId]);
            options.onSuccess?.(data, eventId, context);
        },
        onError: (error, variables, context) => {
            const message = error?.response?.data?.message || error.message || "Failed to register";
            toast.error(message);
            options.onError?.(error, variables, context);
        },
        onSettled: options.onSettled,
    });
};

export const useUnregisterFromEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (eventId) => unregisterFromEvent(eventId),
        onSuccess: (_, eventId) => {
            toast.success("Unregistered successfully.");
            queryClient.invalidateQueries(REGISTRAION_QUERY_KEY);
            queryClient.invalidateQueries([...REGISTRAION_QUERY_KEY, "participation", eventId]);
        },
        onError: (error) => {
            const message = error?.response?.data?.message || error.message || "Failed to unregister";
            toast.error(message);
        },
    });
};

export const useApproveRegistration = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (eventId) => approveRegistration(eventId),
        onSuccess: (_, eventId) => {
            toast.success("Approved successfully.");
            queryClient.invalidateQueries(REGISTRAION_QUERY_KEY);
            queryClient.invalidateQueries([...REGISTRAION_QUERY_KEY, "participation", eventId]);
        },
        onError: (error) => {
            const message = error?.response?.data?.message || error.message || "Failed to approve";
            toast.error(message);
        },
    });
};

export const useUserIdList = (eventIid) => {
    return useQuery({
        queryKey: [...REGISTRAION_QUERY_KEY, "userList", eventIid],
        queryFn: () => listUserOfAnEvent(eventIid),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!eventIid,
    });
};

export const useListUserOfAnEvent = (eventId, params) => {
    return useQuery({
        queryKey: [...REGISTRAION_QUERY_KEY, "users", eventId, JSON.stringify(params)],
        queryFn: async () => {
            const result = await listUserOfAnEvent(eventId, params);
            return result || [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!eventId,
        placeholderData: keepPreviousData,
        retry: false, // Don't retry on permission errors
        onError: (error) => {
            // Silently handle permission errors - user might not be event owner
            if (error?.response?.status === 403 || error?.response?.status === 500) {
                console.log("Unable to fetch participant list - permission denied or not event owner");
            }
        },
    });
}

export const useNumberOfEventRegistrations = (eventId) => {
    return useQuery({
        queryKey: [...REGISTRAION_QUERY_KEY, "numberOfRegistrations", eventId],
        queryFn: () => numberOfEventRegistrations(eventId),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!eventId,
    });
}

export const useReviewRegistration = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ eventId, participantId, status, note }) =>
            reviewRegistration(eventId, participantId, status, note),
        onSuccess: (data, variables) => {
            const statusText = variables.status === "APPROVED" ? "approved" : "rejected";
            toast.success(`Registration ${statusText} successfully.`);
            queryClient.invalidateQueries(REGISTRAION_QUERY_KEY);
        },
        onError: (error) => {
            const message = error?.response?.data?.message || error.message || "Failed to review registration";
            toast.error(message);
        },
    });
};

export const useRemoveParticipant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ eventId, participantId }) =>
            removeParticipant(eventId, participantId),
        onSuccess: () => {
            toast.success("Participant removed successfully.");
            queryClient.invalidateQueries(REGISTRAION_QUERY_KEY);
        },
        onError: (error) => {
            const message = error?.response?.data?.message || error.message || "Failed to remove participant";
            toast.error(message);
        },
    });
};   