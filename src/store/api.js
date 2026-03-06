import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4080/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    try {
      const raw = localStorage.getItem("adminTokens");
      if (raw) {
        const { accessToken } = JSON.parse(raw);
        if (accessToken) {
          headers.set("authorization", `Bearer ${accessToken}`);
        }
      }
    } catch {
      // ignore parse errors
    }
    return headers;
  },
});

const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
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
    getDashboardStats: builder.query({
      query: () => ({
        url: "/admin/dashboard/stats",
        method: "GET",
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

