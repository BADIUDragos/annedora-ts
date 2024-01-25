import { productTag } from "./apiTagTypes";
import { baseApi } from "./baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<ProductState, ProductRequestBody>({
      query: (product) => ({
        url: '/base/product/',
        method: 'POST',
        body: product
      }),
      invalidatesTags: [{ type: productTag, id: 'LIST'}]
    })
  })
})

export const { useCreateProductMutation } = productApi
