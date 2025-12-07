import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
    getEvents,
    getOwnedEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    approveEvent,
    rejectEvent,
} from "../services/eventService";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

const EVENTS_QUERY_KEY = ["events"];
const OWNED_EVENTS_QUERY_KEY = ["ownedEvents"];

export const useEvents = (params) => {
    const queryKey = params ? [...EVENTS_QUERY_KEY, JSON.stringify(params)] : EVENTS_QUERY_KEY;

    return useQuery({
        queryKey,
        queryFn: () => getEvents(params),
        placeholderData: (previousData) => previousData,
    });
};

export const useEventPagination = (params) => {
    const queryClient = useQueryClient();
    const { pageNum = 0, pageSize = 10, status } = params || {};
    const query = useQuery({
        queryKey: [...EVENTS_QUERY_KEY, 'pagination', pageNum, pageSize, status],
        queryFn: async () => {
            const result = await getEvents({ pageNum, pageSize, status });
            return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });

    // Prefetch the next page
    useEffect(() => {
        const nextPage = pageNum + 1;
        if (query.data?.meta?.totalPages > nextPage) {
            queryClient.prefetchQuery({
                queryKey: [...EVENTS_QUERY_KEY, 'pagination', nextPage, pageSize, status],
                queryFn: async () => {
                    const result = await getEvents({ pageNum: nextPage, pageSize, status });
                    return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
                },
            });
        }
    }, [query.data, pageNum, pageSize, status, queryClient]);

    return query;
}

export const useOwnedEvents = (params) => {
    const queryKey = params ? [...OWNED_EVENTS_QUERY_KEY, JSON.stringify(params)] : OWNED_EVENTS_QUERY_KEY;

    return useQuery({
        queryKey,
        queryFn: () => getOwnedEvents(params),
        placeholderData: (previousData) => previousData,
    });
};

export const useOwnedEventsPagination = (params) => {
    const queryClient = useQueryClient();
    const { pageNum = 0, pageSize = 10, sortedBy = "id", order = "desc" } = params || {};
    
    const query = useQuery({
        queryKey: [...OWNED_EVENTS_QUERY_KEY, 'pagination', pageNum, pageSize, sortedBy, order],
        queryFn: async () => {
            const result = await getOwnedEvents({ pageNum, pageSize, sortedBy, order });
            return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });

    // Prefetch the next page
    useEffect(() => {
        const nextPage = pageNum + 1;
        if (query.data?.meta?.totalPages > nextPage) {
            queryClient.prefetchQuery({
                queryKey: [...OWNED_EVENTS_QUERY_KEY, 'pagination', nextPage, pageSize, sortedBy, order],
                queryFn: async () => {
                    const result = await getOwnedEvents({ pageNum: nextPage, pageSize, sortedBy, order });
                    return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
                },
            });
        }
    }, [query.data, pageNum, pageSize, sortedBy, order, queryClient]);

    return query;
};

// New hook for search with debounce, pagination, and sorting
export const useSearchEvents = ({
    search = "",
    pageNum = 0,
    pageSize = 9,
    status,
    sortBy = "Date", // Date, Name
    filterBy,
    filterValue,
    debounceDelay = 500
}) => {
    const queryClient = useQueryClient();
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, debounceDelay);

        return () => clearTimeout(timer);
    }, [search, debounceDelay]);

    const query = useQuery({
        queryKey: [...EVENTS_QUERY_KEY, 'search', debouncedSearch, pageNum, pageSize, status, sortBy, filterBy, filterValue],
        queryFn: async () => {
            const params = {
                pageNum,
                pageSize,
                status,
                sortBy,
            };

            // Add search if provided
            if (debouncedSearch) {
                params.search = debouncedSearch;
            }

            // Add filter if provided
            if (filterBy && filterValue) {
                params.filterBy = filterBy;
                params.filterValue = Array.isArray(filterValue) ? filterValue.join(',') : filterValue;
            }

            const result = await getEvents(params);
            return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 minutes for search results
    });

    // Prefetch next page
    useEffect(() => {
        const nextPage = pageNum + 1;
        if (query.data?.meta?.totalPages > nextPage) {
            queryClient.prefetchQuery({
                queryKey: [...EVENTS_QUERY_KEY, 'search', debouncedSearch, nextPage, pageSize, status, sortBy, filterBy, filterValue],
                queryFn: async () => {
                    const params = {
                        pageNum: nextPage,
                        pageSize,
                        status,
                        sortBy,
                    };

                    if (debouncedSearch) {
                        params.search = debouncedSearch;
                    }

                    if (filterBy && filterValue) {
                        params.filterBy = filterBy;
                        params.filterValue = Array.isArray(filterValue) ? filterValue.join(',') : filterValue;
                    }

                    const result = await getEvents(params);
                    return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
                },
            });
        }
    }, [query.data, pageNum, pageSize, status, sortBy, filterBy, filterValue, debouncedSearch, queryClient]);

    return query;
}

export const useEventDetail = (eventId, options = {}) => {
    return useQuery({
        queryKey: [...EVENTS_QUERY_KEY, eventId],
        queryFn: () => getEventById(eventId),
        enabled: Boolean(eventId),
        ...options,
    });
};

export const useCreateEvent = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEvent,
        onSuccess: (data, variables, context) => {
            toast.success("Event created successfully.");
            // Invalidate both events and owned events queries
            queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: OWNED_EVENTS_QUERY_KEY });
            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            const message =
                error?.response?.data?.message || error?.message || "Failed to create event.";
            toast.error(message);
            options.onError?.(error, variables, context);
        },
        onSettled: options.onSettled,
    });
};

export const useUpdateEvent = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ eventId, payload }) => updateEvent(eventId, payload),
        onSuccess: (data, variables, context) => {
            toast.success("Event updated successfully.");
            queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
            if (variables?.eventId) {
                queryClient.invalidateQueries({ queryKey: [...EVENTS_QUERY_KEY, variables.eventId] });
            }
            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            const message =
                error?.response?.data?.message || error?.message || "Failed to update event.";
            toast.error(message);
            options.onError?.(error, variables, context);
        },
        onSettled: options.onSettled,
    });
};

export const useDeleteEvent = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (eventId) => deleteEvent(eventId),
        onMutate: async (eventId) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: EVENTS_QUERY_KEY });

            // Snapshot the previous value
            const previousEvents = queryClient.getQueriesData({ queryKey: EVENTS_QUERY_KEY });

            // Optimistically update to show loading state
            queryClient.setQueriesData({ queryKey: EVENTS_QUERY_KEY }, (old) => {
                if (!old) return old;

                // Handle pagination data structure
                if (old.data && Array.isArray(old.data)) {
                    return {
                        ...old,
                        data: old.data.map((event) =>
                            event.id === eventId
                                ? { ...event, _isDeleting: true }
                                : event
                        ),
                    };
                }

                // Handle simple array structure
                if (Array.isArray(old)) {
                    return old.map((event) =>
                        event.id === eventId
                            ? { ...event, _isDeleting: true }
                            : event
                    );
                }

                return old;
            });

            return { previousEvents };
        },
        onSuccess: (data, variables, context) => {
            toast.success("Event deleted successfully.");
            queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
            if (variables) {
                queryClient.removeQueries({ queryKey: [...EVENTS_QUERY_KEY, variables] });
            }
            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            // Rollback to previous state on error
            if (context?.previousEvents) {
                context.previousEvents.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
            const message =
                error?.response?.data?.message || error?.message || "Failed to delete event.";
            toast.error(message);
            options.onError?.(error, variables, context);
        },
        onSettled: (data, error, variables, context) => {
            // Always refetch after error or success to ensure server state
            queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
            options.onSettled?.(data, error, variables, context);
        },
    });
};

export const useApproveEvent = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (eventId) => approveEvent(eventId),
        onMutate: async (eventId) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: EVENTS_QUERY_KEY });

            // Snapshot the previous value
            const previousEvents = queryClient.getQueriesData({ queryKey: EVENTS_QUERY_KEY });

            // Optimistically update to show loading state
            queryClient.setQueriesData({ queryKey: EVENTS_QUERY_KEY }, (old) => {
                if (!old) return old;

                // Handle pagination data structure
                if (old.data && Array.isArray(old.data)) {
                    return {
                        ...old,
                        data: old.data.map((event) =>
                            event.id === eventId
                                ? { ...event, _isUpdating: true }
                                : event
                        ),
                    };
                }

                // Handle simple array structure
                if (Array.isArray(old)) {
                    return old.map((event) =>
                        event.id === eventId
                            ? { ...event, _isUpdating: true }
                            : event
                    );
                }

                return old;
            });

            return { previousEvents };
        },
        onSuccess: (data, variables, context) => {
            queryClient.setQueriesData({ queryKey: EVENTS_QUERY_KEY }, (old) => {
                if (!old) return old;

                const applyUpdate = (event) =>
                    event.id === variables
                        ? {
                            ...event,
                            ...(data || {}),
                            status: data?.status || "APPROVED",
                            _isUpdating: false,
                        }
                        : event;

                if (old.data && Array.isArray(old.data)) {
                    return {
                        ...old,
                        data: old.data.map(applyUpdate),
                    };
                }

                if (Array.isArray(old)) {
                    return old.map(applyUpdate);
                }

                return old;
            });

            toast.success("Event approved successfully.");
            queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
            if (variables) {
                queryClient.invalidateQueries({ queryKey: [...EVENTS_QUERY_KEY, variables] });
            }
            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            // Rollback to previous state on error
            if (context?.previousEvents) {
                context.previousEvents.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
            const message =
                error?.response?.data?.message || error?.message || "Failed to approve event.";
            toast.error(message);
            options.onError?.(error, variables, context);
        },
        onSettled: (data, error, variables, context) => {
            // Always refetch after error or success to ensure server state
            queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
            options.onSettled?.(data, error, variables, context);
        },
    });
};

export const useRejectEvent = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (eventId) => rejectEvent(eventId),
        onMutate: async (eventId) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: EVENTS_QUERY_KEY });

            // Snapshot the previous value
            const previousEvents = queryClient.getQueriesData({ queryKey: EVENTS_QUERY_KEY });

            // Optimistically update to show loading state
            queryClient.setQueriesData({ queryKey: EVENTS_QUERY_KEY }, (old) => {
                if (!old) return old;

                // Handle pagination data structure
                if (old.data && Array.isArray(old.data)) {
                    return {
                        ...old,
                        data: old.data.map((event) =>
                            event.id === eventId
                                ? { ...event, _isUpdating: true }
                                : event
                        ),
                    };
                }

                // Handle simple array structure
                if (Array.isArray(old)) {
                    return old.map((event) =>
                        event.id === eventId
                            ? { ...event, _isUpdating: true }
                            : event
                    );
                }

                return old;
            });

            return { previousEvents };
        },
        onSuccess: (data, variables, context) => {
            queryClient.setQueriesData({ queryKey: EVENTS_QUERY_KEY }, (old) => {
                if (!old) return old;

                const applyUpdate = (event) =>
                    event.id === variables
                        ? {
                            ...event,
                            ...(data || {}),
                            status: data?.status || "REJECTED",
                            _isUpdating: false,
                        }
                        : event;

                if (old.data && Array.isArray(old.data)) {
                    return {
                        ...old,
                        data: old.data.map(applyUpdate),
                    };
                }

                if (Array.isArray(old)) {
                    return old.map(applyUpdate);
                }

                return old;
            });

            toast.success("Event rejected successfully.");
            queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
            if (variables) {
                queryClient.invalidateQueries({ queryKey: [...EVENTS_QUERY_KEY, variables] });
            }
            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            // Rollback to previous state on error
            if (context?.previousEvents) {
                context.previousEvents.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
            const message =
                error?.response?.data?.message || error?.message || "Failed to reject event.";
            toast.error(message);
            options.onError?.(error, variables, context);
        },
        onSettled: (data, error, variables, context) => {
            // Always refetch after error or success to ensure server state
            queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
            options.onSettled?.(data, error, variables, context);
        },
    });
};

