import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "./authSlice";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4080/api";

const isRefreshRequest = (args) => {
  const url = typeof args === "string" ? args : args?.url ?? "";
  return String(url).includes("/user/refresh");
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.user?.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && !isRefreshRequest(args)) {
    const refreshResult = await rawBaseQuery(
      { url: "/user/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.error) {
      api.dispatch(logout());
      return result;
    }

    const payload =
      refreshResult.data?.responseBody?.data ??
      refreshResult.data?.data ??
      refreshResult.data;
    const accessToken = payload?.accessToken;

    if (accessToken) {
      const currentUser = api.getState().auth?.user;
      api.dispatch(
        setCredentials({
          ...currentUser,
          accessToken,
        })
      );
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

const baseQuery = async (args, api, extraOptions) => {
  const result = await baseQueryWithReauth(args, api, extraOptions);
  if (result.data && typeof result.data === "object" && "data" in result.data) {
    return { ...result, data: result.data.data };
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "AdminDashboard",
    "AdminUsers",
    "AdminOrders",
    "AdminProducts",
    "AdminCategories",
    "ProductReviews",
  ],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({ url: "/user/refresh", method: "POST" }),
    }),
    logout: builder.mutation({
      query: () => ({ url: "/user/logout", method: "POST" }),
    }),
    getDashboardStats: builder.query({
      query: (params = {}) => ({
        url: "/admin/dashboard/stats",
        method: "GET",
        params,
      }),
      providesTags: ["AdminDashboard"],
    }),
    getAdminUsers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/admin/users",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["AdminUsers"],
    }),
    getAdminOrders: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/orders/admin/all",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["AdminOrders"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["AdminOrders", "AdminDashboard"],
    }),
    getAdminProducts: builder.query({
      query: ({ page = 1, limit = 10, search } = {}) => ({
        url: "/products/admin/all",
        method: "GET",
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
        },
      }),
      providesTags: ["AdminProducts"],
    }),
    createProduct: builder.mutation({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminProducts", "AdminDashboard"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdminProducts", "AdminDashboard"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminProducts", "AdminDashboard"],
    }),
    getAdminCategories: builder.query({
      query: () => ({
        url: "/categories/admin/all",
        method: "GET",
      }),
      providesTags: ["AdminCategories"],
    }),
    createCategory: builder.mutation({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminCategories", "AdminProducts"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdminCategories", "AdminProducts"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminCategories", "AdminProducts"],
    }),
    getProductReviews: builder.query({
      query: ({ productId, page = 1, limit = 10 }) => ({
        url: `/reviews/product/${productId}`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (_result, _error, arg) => [
        { type: "ProductReviews", id: arg.productId },
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useLazyGetProfileQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetDashboardStatsQuery,
  useGetAdminUsersQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetProductReviewsQuery,
} = api;

