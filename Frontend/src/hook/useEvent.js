import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
} from "../services/eventService";
import { toast } from "react-hot-toast";

const EVENTS_QUERY_KEY = ["events"];

export const useEvents = (params) => {
    const queryKey = params ? [...EVENTS_QUERY_KEY, JSON.stringify(params)] : EVENTS_QUERY_KEY;

    return useQuery({
        queryKey,
        queryFn: () => getEvents(params),
        placeholderData: (previousData) => previousData,
    });
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
            queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
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
        onSuccess: (data, variables, context) => {
            toast.success("Event deleted successfully.");
            queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
            if (variables) {
                queryClient.removeQueries({ queryKey: [...EVENTS_QUERY_KEY, variables] });
            }
            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            const message =
                error?.response?.data?.message || error?.message || "Failed to delete event.";
            toast.error(message);
            options.onError?.(error, variables, context);
        },
        onSettled: options.onSettled,
    });
};
