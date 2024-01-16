import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../functions/baseQueries";

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
})