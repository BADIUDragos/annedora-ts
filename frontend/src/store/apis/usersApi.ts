import { UserInfoState } from "../interfaces/authInterfaces";
import { userTag } from "./apiTagTypes";
import { baseApi } from "./baseApi";

export type UserSortField = "created_at" | "first_name" | "email" | "is_staff";
export type SortDirection = "asc" | "desc";
export type UserPageSize = 10 | 25 | 50 | 100;

export interface UserListArgs {
  page: number;
  pageSize: UserPageSize;
  sort: UserSortField;
  direction: SortDirection;
}

export interface PaginatedUsers {
  count: number;
  page: number;
  page_size: number;
  results: UserInfoState[];
}

const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      listUsers: builder.query<PaginatedUsers, UserListArgs>({
        query: ({ page, pageSize, sort, direction }) => ({
          url: 'base/users/',
          method: 'GET',
          params: {
            page,
            page_size: pageSize,
            sort,
            direction,
          },
          headers: {
            Accept: 'application/json',
          },
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.results.map(({ id }) => ({ type: userTag, id } as const)),
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
      updateUser: builder.mutation<void, { id: number; data: Partial<UserInfoState> }>({
        query: ({ id, data }) => ({
          url: `base/users/update/${id}/`,
          method: 'PUT',
          body: data,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }),
        invalidatesTags: (result, error, { id }) => [{ type: userTag, id }],
      }),
    }),
  });
  
  export const { useListUsersQuery, useGetUserByIdQuery, useDeleteUserMutation, useUpdateUserMutation } = userApi;