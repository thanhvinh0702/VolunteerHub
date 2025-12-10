import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import CommunityService from "../services/CommunityService";
import { useEffect } from "react";
import toast from "react-hot-toast";

const COMMUNITY_QUERY_KEY = ["community"];

export const usePosts = (eventId, params) => {
    const queryClient = useQueryClient();
    const { pageNum = 0, pageSize = 10 } = params || {};

    const query = useQuery({
        queryKey: ["community", "posts", eventId, pageNum, pageSize],
        queryFn: () => CommunityService.getAllPosts(eventId, pageNum, pageSize),
        enabled: !!eventId,
        keepPreviousData: true,
    });

    // Prefetch page tiếp theo
    useEffect(() => {
        const nextPage = pageNum + 1;

        queryClient.prefetchQuery({
            queryKey: ["community", "posts", eventId, nextPage, pageSize],
            queryFn: () => CommunityService.getAllPosts(eventId, nextPage, pageSize),
        });
    }, [eventId, pageNum, pageSize, queryClient]);

    return query;
};

export const usePostDetail = (eventId, postId) => {
    return useQuery({
        queryKey: [...COMMUNITY_QUERY_KEY, "postDetail", eventId, postId],
        queryFn: () => CommunityService.getPostById(eventId, postId),
        enabled: !!eventId && !!postId,
    });
};

export const useCreatePost = (eventId) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({ content = "", imageFiles = [] } = {}) => {
            const form = new FormData();
            form.append(
                "postRequest",
                new Blob([JSON.stringify({ content })], { type: "application/json" })
            );
            imageFiles.forEach((file) => {
                if (file) form.append("imageFiles", file);
            });
            return CommunityService.createPost(eventId, form);
        },
        onSuccess: () => {
            toast.success("Post created successfully.");
            queryClient.invalidateQueries(["community", "posts", eventId]);
            queryClient.invalidateQueries(["community", "postsInfinite", eventId]);
        },
        onError: (error) => {
            const message = error?.response?.data?.message || error.message || "Failed to create post";
            toast.error(message);
        },
    });
    // Normalize loading state across react-query v4/v5
    return { ...mutation, isLoading: mutation.isLoading ?? mutation.isPending ?? false };
};

export const useUpdatePost = (eventId, postId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postData) => CommunityService.updatePost(eventId, postId, postData),
        onSuccess: () => {
            toast.success("Post updated successfully.");
            queryClient.invalidateQueries([...COMMUNITY_QUERY_KEY, "posts", eventId]);
            queryClient.invalidateQueries([...COMMUNITY_QUERY_KEY, "postsInfinite", eventId]);
            queryClient.invalidateQueries([...COMMUNITY_QUERY_KEY, "postDetail", eventId, postId]);
        },
        onError: (error) => {
            const message = error?.response?.data?.message || error.message || "Failed to update post";
            toast.error(message);
        },
    });
};

export const useDeletePost = (eventId, postId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => CommunityService.deletePost(eventId, postId),
        onSuccess: () => {
            toast.success("Post deleted successfully.");
            queryClient.invalidateQueries([...COMMUNITY_QUERY_KEY, "posts", eventId]);
            queryClient.invalidateQueries([...COMMUNITY_QUERY_KEY, "postsInfinite", eventId]);
        },
        onError: (error) => {
            const message = error?.response?.data?.message || error.message || "Failed to delete post";
            toast.error(message);
        },
    });
};

export const useInfinitePosts = (eventId, options = {}) => {
    const { pageSize = 10 } = options;

    return useInfiniteQuery({
        queryKey: [...COMMUNITY_QUERY_KEY, "postsInfinite", eventId, pageSize],
        queryFn: ({ pageParam = 0 }) => CommunityService.getAllPosts(eventId, pageParam, pageSize),
        getNextPageParam: (lastPage) => {
            const current = Number(lastPage?.number ?? 0);
            const totalPages = Number(lastPage?.totalPages ?? 0);
            const next = current + 1;
            return next < totalPages ? next : undefined;
        },
        initialPageParam: 0,
        enabled: !!eventId,
        keepPreviousData: true,
    });
};

export const useComments = (eventId, postId, params) => {
    const { pageNum = 0, pageSize = 10 } = params || {};

    return useQuery({
        queryKey: ["community", "comments", eventId, postId, pageNum, pageSize],
        queryFn: () => CommunityService.getAllComments(eventId, postId, pageNum, pageSize),
        enabled: !!eventId && !!postId,
        keepPreviousData: true,
    });
};

export const useInfiniteComments = (eventId, postId, options = {}) => {
    const { pageSize = 10 } = options;

    return useInfiniteQuery({
        queryKey: [...COMMUNITY_QUERY_KEY, "commentsInfinite", eventId, postId, pageSize],
        queryFn: ({ pageParam = 0 }) => CommunityService.getAllComments(eventId, postId, pageParam, pageSize),
        getNextPageParam: (lastPage) => {
            const current = Number(lastPage?.number ?? 0);
            const totalPages = Number(lastPage?.totalPages ?? 0);
            const next = current + 1;
            return next < totalPages ? next : undefined;
        },
        initialPageParam: 0,
        enabled: !!eventId && !!postId,
        keepPreviousData: true,
    });
};

export const useCreateComment = (eventId, postId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (commentData) => CommunityService.createComment(eventId, postId, commentData),
        onSuccess: () => {
            toast.success("Comment created successfully.");
            queryClient.invalidateQueries([...COMMUNITY_QUERY_KEY, "comments", eventId, postId]);
            queryClient.invalidateQueries([...COMMUNITY_QUERY_KEY, "commentsInfinite", eventId, postId]);
        },
        onError: (error) => {
            const message = error?.response?.data?.message || error.message || "Failed to create comment";
            toast.error(message);
        },
    });
};

export const useDeleteComment = (eventId, postId, commentId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => CommunityService.deleteComment(eventId, postId, commentId),
        onSuccess: () => {
            toast.success("Comment deleted successfully.");
            queryClient.invalidateQueries([...COMMUNITY_QUERY_KEY, "comments", eventId, postId]);
            queryClient.invalidateQueries([...COMMUNITY_QUERY_KEY, "commentsInfinite", eventId, postId]);
        },
        onError: (error) => {
            const message = error?.response?.data?.message || error.message || "Failed to delete comment";
            toast.error(message);
        }
    });
};

export const useReactions = (eventId, postId, params) => {
    const { pageNum = 0, pageSize = 10 } = params || {};

    return useQuery({
        queryKey: [...COMMUNITY_QUERY_KEY, "reactions", eventId, postId, pageNum, pageSize],
        queryFn: () => CommunityService.getAllReactions(eventId, postId, pageNum, pageSize),
        enabled: !!eventId && !!postId,
        keepPreviousData: true,
    });
};

export const useCreateReaction = (eventId, postId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (reactionData) => CommunityService.createReaction(eventId, postId, reactionData),
        onSuccess: () => {
            toast.success("Reaction added successfully.");
            queryClient.invalidateQueries([...COMMUNITY_QUERY_KEY, "reactions", eventId, postId]);
            queryClient.invalidateQueries([...COMMUNITY_QUERY_KEY, "post", eventId, postId]);
        },
        onError: (error) => {
            const message = error?.response?.data?.message || error.message || "Failed to add reaction";
            toast.error(message);
        },
    });
};

export const useUpdateReaction = (eventId, postId, reactionId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => CommunityService.updateReaction(eventId, postId, reactionId, data),
        onSuccess: () => {
            toast.success("Reaction updated");
            queryClient.invalidateQueries([...COMMUNITY_QUERY_KEY, "reactions", eventId, postId]);
        },
        onError: (err) => toast.error(err?.response?.data?.message ?? "Failed to update reaction"),
    });
};

export const useDeleteReaction = (eventId, postId, reactionId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => CommunityService.deleteReaction(eventId, postId, reactionId),
        onSuccess: () => {
            toast.success("Reaction removed");
            queryClient.invalidateQueries([...COMMUNITY_QUERY_KEY, "reactions", eventId, postId]);
        },
        onError: (err) => toast.error(err?.response?.data?.message ?? "Failed to remove reaction"),
    });
};