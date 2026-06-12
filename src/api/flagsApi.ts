import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "./config";

export interface FlagData {
  name: string;
  flagUrl: string;
  continent: string;
}

interface RestCountryResponse {
  data: {
    objects: Array<{
      names?: { common?: string };
      flag?: { png?: string; svg?: string };
      continents?: string[];
    }>;
  };
}

export const flagsApi = createApi({
  reducerPath: "flagsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getFlags: builder.query<FlagData[], void>({
      query: () => "flags",
      transformResponse: (response: RestCountryResponse) => {
        const countriesList = response?.data?.objects;

        if (!Array.isArray(countriesList)) return [];

        return countriesList.map((c) => ({
          name: c.names?.common || "Unknown",
          flagUrl: c.flag?.png || "",
          continent:
            c.continents && c.continents.length > 0
              ? c.continents[0]
              : "Unknown",
        }));
      },
    }),
  }),
});

export const { useGetFlagsQuery } = flagsApi;
