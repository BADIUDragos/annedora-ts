import { ProductState } from "../interfaces/productInterfaces";
import { productTag } from "./apiTagTypes";
import { baseApi } from "./baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<ProductState, FormData>({
      query: (formData) => ({
        url: 'base/products/',
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: [{ type: productTag, id: 'LIST'}]
    })
  })
})

export const { useCreateProductMutation } = productApi
