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
      codes?: { alpha_2?: string; alpha_3?: string };
      flag?: {
        url_png?: string;
        url_svg?: string;
        emoji?: string;
      };
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

        return countriesList.map((c) => {
          const countryCode = c.codes?.alpha_2?.toLowerCase() || "";
          let flagUrl = c.flag?.url_png || c.flag?.url_svg || "";
          if (!flagUrl && countryCode) {
            flagUrl = `https://flagcdn.com/w40/${countryCode}.png`;
          }

          return {
            name: c.names?.common || "Unknown",
            flagUrl: flagUrl,
            continent:
              c.continents && c.continents.length > 0
                ? c.continents[0]
                : "Unknown",
          };
        });
      },
    }),
  }),
});

export const { useGetFlagsQuery } = flagsApi;
