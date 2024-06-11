import { ProductState } from "../interfaces/productInterfaces";
import { productTag } from "./apiTagTypes";
import { baseApi } from "./baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<ProductState, FormData>({
      query: (formData) => ({
        url: 'base/product/',
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      }),
      invalidatesTags: [{ type: productTag, id: 'LIST'}]
    }),
    listProducts: builder.query<ProductState[], void>({
      query: () => ({
        url: 'base/product/',
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: productTag, id } as const)),
              { type: productTag, id: 'LIST' },
            ]
          : [{ type: productTag, id: 'LIST' }],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
          url: `base/product/${id}/`,
          method: 'DELETE',
      }),
      invalidatesTags: [{ type: productTag, id: 'LIST' }],
  }),
  })
})

export const { useCreateProductMutation, useListProductsQuery, useDeleteProductMutation } = productApi
