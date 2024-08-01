import { INewPost, INewUser, IUpdatePost } from "@/Types";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  SearchPosts,
  createPost,
  createUserAccount,
  deletePost,
  deleteSavedPost,
  getCurrentUser,
  getInfinitePosts,
  getPostById,
  getRecentPosts,
  likePost,
  savePost,
  signOutAccount,
  signinAccount,
  updatePost,
} from "../appwrite/api";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { toast } from "@/components/ui/use-toast";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSigninAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signinAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryFn: getRecentPosts,
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      /// here we are invalidating queries that doesn't exist yet , which i find very weird and odd, i asked bing about it and the response i down bleow , am sleepy as of now . am ganan go catch some sleep and get back to understanding this part. if i did manage to understand it, the explanation will be written here .
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      savePost(userId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetCurrentUser = () =>
  useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryFn: () => getPostById(postId),
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    enabled: !!postId, // 4:34:25 https://www.youtube.com/watch?v=_W3R2VwRyF4&t=17958s
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      toast({ title: `Post has been deleted ` });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
    onError: () => {
      toast({ title: `Faced problems while trying to delete a post` });
    },
  });
};

export const useGetPosts = () => {
  //@ts-ignore
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],

    queryFn: getInfinitePosts as any,

    getNextPageParam: (lastPage: any) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
  //@ts-ignore
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryFn: () => SearchPosts(searchTerm),
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    // !Important this mean that query will refetch the data when ever the searchTerm changes
    enabled: !!searchTerm,
  });
};
/**
 * 
 *
 * No, React Query will not create new keys in the cache by invalidating queries that do not exist yet. It will only mark the existing queries that match the query keys as stale and refetch them if they are active1. If there are no matching queries in the cache, invalidating them will have no effect, unless you use the refetchInactive option1.

The query keys that you are using in your code are arrays that contain two elements: a constant string (such as QUERY_KEYS.GET_POST_BY_ID) and a dynamic value (such as data?.$id). The dynamic value is the ID of the post that is being liked by the mutation. This means that you are invalidating queries that are specific to that post, not all posts. For example, if the post ID is “123”, you are invalidating queries like [“GET_POST_BY_ID”, “123”], [“GET_RECENT_POSTS”, “123”], etc.

The reason you are invalidating these queries is to update the data in the cache after the mutation. For example, if you invalidate the query [“GET_POST_BY_ID”, “123”], React Query will refetch the data for that post and update the number of likes in the cache. This will ensure that the UI is consistent and reflects the latest state of the data.

However, if you invalidate a query that does not exist yet, such as [“GET_POST_BY_ID”, “456”], React Query will not create a new key in the cache or fetch the data for that post. It will only mark that query as stale, so that when you use it later with useQuery, it will fetch the data from the server instead of using the stale data in the cache1.

I hope this helps you understand how invalidating queries works in React Query. If you want to learn more, you can check out the official documentation or this blog post. 😊

1: Query Invalidation | TanStack Query Docs 2: Fine-tuning invalidateQueries with React Query (v4) - Codemzy 3: Understanding invalidateQueries in React Query | Basedash

Learn more


1

tanstack.com
2

tanstack.com
3

basedash.com
4

tanstack.com
5

codemzy.com
6

codemzy.com
7

basedash.com
8

basedash.com
9

devcodef1.com
10

stackoverflow.com



it will mark what query as stale?
Generating answers for you…

It will mark the query that matches the query key as stale. For example, if you invalidate the query [“GET_POST_BY_ID”, “456”], React Query will mark that query as stale, meaning that the data in the cache for that query is outdated and needs to be refetched. 😊




but there is no query with that name in the cache to begin with
Generating answers for you…

That is correct. There is no query with that name in the cache to begin with. However, React Query still allows you to invalidate a query that does not exist yet, as long as you know the query key that you will use later to fetch the data. This can be useful for scenarios where you want to pre-fetch or pre-stale some data before rendering it.

Invalidating a query that does not exist yet does not create a new key in the cache or fetch the data for that query. It only marks that query as stale, so that when you use it later with useQuery, it will fetch the data from the server instead of using the stale data in the cache.

: [Query Invalidation | TanStack Query Docs]
 */
