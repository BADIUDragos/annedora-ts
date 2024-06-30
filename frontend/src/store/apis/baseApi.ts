import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../functions/baseQueries";
import { productTag, userTag } from "./apiTagTypes";

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [productTag, userTag],
  endpoints: () => ({}),
})