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
    searchEventByName,
    searchEventByNameForManager,
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
    const {
        pageNum = 0,
        pageSize = 10,
        status,
        sortedBy,
        order,
        capacity,
        category,
        startAfter,
        endBefore
    } = params || {};

    const query = useQuery({
        queryKey: [...EVENTS_QUERY_KEY, 'pagination', pageNum, pageSize, status, sortedBy, order, capacity, category, startAfter, endBefore],
        queryFn: async () => {
            // Build apiParams, only include defined values
            const apiParams = { pageNum, pageSize };
            if (status) apiParams.status = status;
            if (sortedBy) apiParams.sortedBy = sortedBy;
            if (order) apiParams.order = order;
            if (capacity) apiParams.capacity = capacity;
            if (category) apiParams.category = category;
            if (startAfter) apiParams.startAfter = startAfter;
            if (endBefore) apiParams.endBefore = endBefore;

            console.log("useEventPagination - API params:", apiParams);
            const result = await getEvents(apiParams);
            return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
        },
        placeholderData: keepPreviousData, // Giữ data cũ khi đang fetch data mới
        staleTime: 1000 * 30, // Data được coi là fresh
    });

    // Prefetch the next page
    useEffect(() => {
        const nextPage = pageNum + 1;
        if (query.data?.meta?.totalPages > nextPage) {
            const prefetchParams = { pageNum: nextPage, pageSize };
            if (status) prefetchParams.status = status;
            if (sortedBy) prefetchParams.sortedBy = sortedBy;
            if (order) prefetchParams.order = order;
            if (capacity) prefetchParams.capacity = capacity;
            if (category) prefetchParams.category = category;
            if (startAfter) prefetchParams.startAfter = startAfter;
            if (endBefore) prefetchParams.endBefore = endBefore;

            queryClient.prefetchQuery({
                queryKey: [...EVENTS_QUERY_KEY, 'pagination', nextPage, pageSize, status, sortedBy, order, capacity, category, startAfter, endBefore],
                queryFn: async () => {
                    const result = await getEvents(prefetchParams);
                    return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
                },
            });
        }
    }, [query.data, pageNum, pageSize, status, sortedBy, order, queryClient, capacity, category, startAfter, endBefore]);

    return query;
}

export const useEventPaginationAdmin = (params) => {
    const queryClient = useQueryClient();
    const { pageNum = 0, pageSize = 10, status, search } = params || {};
    const query = useQuery({
        queryKey: [...EVENTS_QUERY_KEY, 'admin', 'pagination', pageNum, pageSize, status, search],
        queryFn: async () => {
            const result = await getEvents({ pageNum, pageSize, status, search });
            return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 6,
        refetchInterval: 1000 * 5,
        refetchIntervalInBackground: true,
    });

    // Prefetch the next page
    useEffect(() => {
        const nextPage = pageNum + 1;
        if (query.data?.meta?.totalPages > nextPage) {
            queryClient.prefetchQuery({
                queryKey: [...EVENTS_QUERY_KEY, 'admin', 'pagination', nextPage, pageSize, status, search],
                queryFn: async () => {
                    const result = await getEvents({ pageNum: nextPage, pageSize, status, search });
                    return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
                },
            });
        }
    }, [query.data, pageNum, pageSize, status, search, queryClient]);

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
    const { pageNum = 0, pageSize = 10, sortedBy = "startTime", order = "desc", status } = params || {};

    const query = useQuery({
        queryKey: [...OWNED_EVENTS_QUERY_KEY, 'pagination', pageNum, pageSize, sortedBy, order, status],
        queryFn: async () => {
            const result = await getOwnedEvents({ pageNum, pageSize, sortedBy, order, status });
            return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 30,
    });

    // Prefetch the next page
    useEffect(() => {
        const nextPage = pageNum + 1;
        if (query.data?.meta?.totalPages > nextPage) {
            queryClient.prefetchQuery({
                queryKey: [...OWNED_EVENTS_QUERY_KEY, 'pagination', nextPage, pageSize, sortedBy, order, status],
                queryFn: async () => {
                    const result = await getOwnedEvents({ pageNum: nextPage, pageSize, sortedBy, order, status });
                    return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
                },
            });
        }
    }, [query.data, pageNum, pageSize, sortedBy, order, status, queryClient]);

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

// Hook riêng cho search by name có debounce
export const useSearchEventByName = ({
    keyword = "",
    pageNum = 0,
    pageSize = 6,
    debounceDelay = 400,
    enabled = true,
}) => {
    const queryClient = useQueryClient();
    const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

    // Debounce keyword
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, debounceDelay);

        return () => clearTimeout(timer);
    }, [keyword, debounceDelay]);

    const query = useQuery({
        queryKey: [...EVENTS_QUERY_KEY, 'searchByName', debouncedKeyword, pageNum, pageSize],
        queryFn: async () => {
            if (!debouncedKeyword.trim()) {
                return { data: [], meta: { totalPages: 0, totalElements: 0 } };
            }
            const result = await searchEventByName({ keyword: debouncedKeyword, pageNum, pageSize });
            return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
        },
        enabled: enabled && Boolean(debouncedKeyword.trim()),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60, // 1 minute
    });

    // Prefetch next page
    useEffect(() => {
        const nextPage = pageNum + 1;
        if (debouncedKeyword.trim() && query.data?.meta?.totalPages > nextPage) {
            queryClient.prefetchQuery({
                queryKey: [...EVENTS_QUERY_KEY, 'searchByName', debouncedKeyword, nextPage, pageSize],
                queryFn: async () => {
                    const result = await searchEventByName({ keyword: debouncedKeyword, pageNum: nextPage, pageSize });
                    return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
                },
            });
        }
    }, [query.data, debouncedKeyword, pageNum, pageSize, queryClient]);

    return {
        ...query,
        debouncedKeyword, // check xem search chưa
    };
};

export const useSearchEventByNameForManager = ({
    keyword = "",
    pageNum = 0,
    pageSize = 6,
    debounceDelay = 400,
    enabled = true,
}) => {
    const queryClient = useQueryClient();
    const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

    // Debounce keyword
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, debounceDelay);

        return () => clearTimeout(timer);
    }, [keyword, debounceDelay]);

    const query = useQuery({
        queryKey: [...EVENTS_QUERY_KEY, 'searchByName', debouncedKeyword, pageNum, pageSize],
        queryFn: async () => {
            if (!debouncedKeyword.trim()) {
                return { data: [], meta: { totalPages: 0, totalElements: 0 } };
            }
            const result = await searchEventByNameForManager({ keyword: debouncedKeyword, pageNum, pageSize });
            return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
        },
        enabled: enabled && Boolean(debouncedKeyword.trim()),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60, // 1 minute
    });

    // Prefetch next page
    useEffect(() => {
        const nextPage = pageNum + 1;
        if (debouncedKeyword.trim() && query.data?.meta?.totalPages > nextPage) {
            queryClient.prefetchQuery({
                queryKey: [...EVENTS_QUERY_KEY, 'searchByName', debouncedKeyword, nextPage, pageSize],
                queryFn: async () => {
                    const result = await searchEventByName({ keyword: debouncedKeyword, pageNum: nextPage, pageSize });
                    return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
                },
            });
        }
    }, [query.data, debouncedKeyword, pageNum, pageSize, queryClient]);

    return {
        ...query,
        debouncedKeyword, // check xem search chưa
    };
};

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
            queryClient.invalidateQueries({ queryKey: OWNED_EVENTS_QUERY_KEY });
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
            queryClient.invalidateQueries({ queryKey: OWNED_EVENTS_QUERY_KEY });
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

export const useApprovedEventsTop2ByName = ({ pageSize = 2, status = "APPROVED", sortedBy = "name", order = "desc" } = {}) => {
    return useQuery({
        queryKey: [...EVENTS_QUERY_KEY, 'approvedTop2ByName', { pageNum: 0, pageSize, status, sortedBy, order }],
        queryFn: async () => {
            const result = await getEvents({ pageNum: 0, pageSize, status, sortedBy, order });
            console.log("useApprovedEventsTop2ByName", result);
            return result || { data: [], meta: { totalPages: 0, totalElements: 0 } };
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 30,
    });
};