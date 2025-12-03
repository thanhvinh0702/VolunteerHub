import { useMutation, useQuery, useQueryClient } from "react-query";
import { approveRegistration, checkUserParticipation, listUserOfAnEvent, numberOfEventRegistrations, registerEventList, registerForEvent, unregisterFromEvent } from "../services/registrationService";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { keepPreviousData } from "@tanstack/react-query";


const REGISTRAION_QUERY_KEY = ["registrations"];

export const useEventRegistrations = (params) => {
    const queryClient = useQueryClient();
    const { pageNum = 0, pageSize = 10, status } = params || {};
    const query = useQuery({
        queryKey: [...REGISTRAION_QUERY_KEY, { pageNum, pageSize, status }],
        queryFn: () => registerEventList({ pageNum, pageSize, status }),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    useEffect(() => {
        const nextPage = pageNum + 1;
        if (query.data?.meta?.totalPages > nextPage) {
            queryClient.prefetchQuery(
                [...REGISTRAION_QUERY_KEY, nextPage, pageSize, status],
                () => registerEventList({ pageNum: nextPage, pageSize, status })
            );
        }
    }, [query.data, pageNum, pageSize, status, queryClient]);
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

export const useRegisterForEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (eventId) => registerForEvent(eventId),
        onSuccess: (_, eventId) => {
            toast.success("Registered successfully.");
            queryClient.invalidateQueries(REGISTRAION_QUERY_KEY);
            queryClient.invalidateQueries([...REGISTRAION_QUERY_KEY, "participation", eventId]);
        },
        onError: (error) => {
            const message = error?.response?.data?.message || error.message || "Failed to register";
            toast.error(message);
        },
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
        queryFn: () => listUserOfAnEvent(eventId, params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!eventId,
        keepPreviousData: true,
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