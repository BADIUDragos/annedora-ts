import { UserInfoState } from "../interfaces/authInterfaces";
import { userTag } from "./apiTagTypes";
import { baseApi } from "./baseApi";

const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      listUsers: builder.query<UserInfoState[], void>({
        query: () => ({
          url: 'base/users/',
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ id }) => ({ type: userTag, id } as const)),
                { type: userTag, id: 'LIST' },
              ]
            : [{ type: userTag, id: 'LIST' }],
      }),
      getUserById: builder.query<UserInfoState, number>({
        query: (id) => ({
          url: `base/users/${id}/`,
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }),
        providesTags: (result, error, id) => [{ type: userTag, id }],
      }),
      deleteUser: builder.mutation<void, number>({
        query: (id) => ({
          url: `base/users/${id}/`,
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
          },
        }),
        invalidatesTags: (result, error, id) => [{ type: userTag, id }, { type: userTag, id: 'LIST' }],
      }),
    }),
  });
  
  export const { useListUsersQuery, useGetUserByIdQuery, useDeleteUserMutation } = userApi;