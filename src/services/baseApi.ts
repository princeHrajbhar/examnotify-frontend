import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Resolve the API base URL
const resolveApiBaseUrl = (): string => {
  const raw = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1')
    .trim()
    .replace(/\/+$/, '');
  return raw.endsWith('/api/v1') ? raw : `${raw}/api/v1`;
};

const API_BASE_URL = resolveApiBaseUrl();

// Helper to get token from localStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

// Helper to clear auth data
const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Track refresh state globally
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Notify subscribers when token is refreshed
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

// Helper to create a new fetch query with token and return a proper Promise
const createAuthenticatedQuery = async (token: string, args: string | FetchArgs): Promise<any> => {
  const authenticatedBaseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${token}`);
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  });
  
  // Await the result to ensure we get a proper Promise
  return await authenticatedBaseQuery(args, {} as any, {} as any);
};

// Custom base query with refresh token handling
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Skip refresh for login and refresh endpoints
  const isAuthEndpoint = typeof args === 'object' && 
    (args.url?.includes('/auth/login') || 
     args.url?.includes('/auth/refresh') ||
     args.url?.includes('/auth/logout'));
  
  // Don't attempt refresh for auth endpoints
  if (isAuthEndpoint) {
    return await baseQuery(args, api, extraOptions);
  }

  // Public endpoints (courses, blogs, categories, etc.) must work for logged-out
  // visitors, so we DO NOT block requests when there's no token. The token, if
  // present, is attached by prepareHeaders. We only run the refresh + redirect
  // flow when the user actually had a token (i.e. a logged-in session expired).
  const hadToken = !!getToken();

  let result = await baseQuery(args, api, extraOptions);

  // If a logged-in user's token expired (401), attempt a refresh.
  // For logged-out visitors we just return the response — never redirect them.
  if (result.error && result.error.status === 401 && hadToken) {

    // If already refreshing, wait for the refresh to complete
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh(async (newToken) => {
          try {
            const retryResult = await createAuthenticatedQuery(newToken, args);
            resolve(retryResult);
          } catch (err) {
            resolve({
              error: {
                status: 401,
                data: { message: 'Retry failed' }
              } as FetchBaseQueryError
            });
          }
        });
      });
    }

    // Start refresh process
    isRefreshing = true;

    try {
      // Try to refresh the token
      const refreshBaseQuery = fetchBaseQuery({
        baseUrl: API_BASE_URL,
        credentials: 'include',
      });

      const refreshResult = await refreshBaseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        
        const responseData = refreshResult.data as any;
        const newToken = responseData?.data?.accessToken;
        
        if (newToken && typeof window !== 'undefined') {
          // Store new token
          localStorage.setItem('accessToken', newToken);
          document.cookie = `accessToken=${newToken}; path=/; max-age=86400; SameSite=Lax`;
          
          // Notify subscribers
          onRefreshed(newToken);
          
          // Retry the original request with the new token
          result = await createAuthenticatedQuery(newToken, args);
        } else {
          clearAuthData();
          isRefreshing = false;
          redirectToLogin();
          return {
            error: {
              status: 401,
              data: { message: 'No new token received' }
            } as FetchBaseQueryError
          };
        }
      } else {
        clearAuthData();
        isRefreshing = false;
        redirectToLogin();
        return {
          error: {
            status: 401,
            data: { message: 'Refresh failed' }
          } as FetchBaseQueryError
        };
      }
    } catch (error) {
      clearAuthData();
      isRefreshing = false;
      redirectToLogin();
      return {
        error: {
          status: 401,
          data: { message: 'Refresh error' }
        } as FetchBaseQueryError
      };
    } finally {
      isRefreshing = false;
    }
  }

  return result;
};

// Helper to redirect to login
const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    if (!pathname.startsWith('/login') && !pathname.startsWith('/register')) {
      window.location.href = '/login';
    }
  }
};

// Create base API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Session', 'Course', 'Profile', 'Job', 'Blog', 'BlogCategory', 'lead', 'CourseCategory', 'File'],
  endpoints: () => ({}),
  keepUnusedDataFor: 60,
});

export default baseApi;