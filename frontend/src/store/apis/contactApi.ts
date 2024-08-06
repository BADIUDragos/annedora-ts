import { baseApi } from "./baseApi";

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    makeContact: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: 'base/contact/',
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      }),
    }),
  })
})

export const { useMakeContactMutation } = contactApi
