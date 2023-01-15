import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { faker } from '@faker-js/faker'

// helpful pause function used to slow down requests a little bit
// so we can really see whats going on with some state changes that happen
// really fast otherwise.
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const albumsApi = createApi({
  reducerPath: 'albums',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3005',
    // if we ever want to override the fetch fn that RTKQ uses,
    // we can do so with fetchFn. Here we are using it as a way
    // to introduce that little pause.
    // This will cause any requests related to the albumsApi to have
    // a one second delay tied to it.
    fetchFn: async (...args) => {
      await pause(1000)
      return fetch(...args);
    }
  }),
  endpoints (builder) {
    return {
      // The 'fetchAlbums' key is very important because it
      // it used as a template for deciding what the nae of the
      // automatically created hook should be
      fetchAlbums: builder.query({
        // we can pass tags in this way
        // `providesTags: ['Albums'],`

        // OR we can do it like this to be more dynamic
        // whenever you define providesTags as a function, it is called
        // with the following arguments.
        // results -
        // error -
        // arg - this is whatever you passed to your hook when you called it
        // providesTags: (result,error, user) => {
        //   return [{ type: 'Album', id: user.id }]
        // },

        // We can get clever with what we return from our tags
        // and return different types from our tags. We can do it ths way
        // so that it also works for the removeAlbum hook
        providesTags: (result, error, user) => {
          const tags = result.map((album) => {
            return { type: 'Album', id: album.id };
          });
          tags.push({ type: 'UsersAlbums', id: user.id });
          return tags;
        },
        query: (user) => {
          return {
            url: '/albums',
            params: {
              userId: user.id,
            },
            method: 'GET'
          }
        },
      }),
      addAlbum: builder.mutation({
        // Think of 'query' as a function that we use to
        // tell RTK Query about some params to use for the
        // request
        query: (user) => {
          return {
            url: '/albums',
            method: 'POST',
            body: {
              userId: user.id,
              title: faker.commerce.productName(),
            },
          };
        },
        // We can call invalidatesTags just like this
        // invalidatesTags: ['Albums']

        // OR we can make it more dynamic:
        invalidatesTags: (result, error, user) => {
          return [{ type: 'UsersAlbums', id: user.id }];
        },
      }),
      removeAlbum: builder.mutation({
        // We can use this because the album object happens to have
        // the userId on it. We kinda got lucky with the data
        // format we have here.
        invalidatesTags: (result, error, album) => {
          return [{ type: 'Album', id: album.id }];
        },
        query: (album) => {
          return {
            url: `/albums/${album.id}`,
            method: 'DELETE',
          };
        },
      }),
    }
  }
})

export const {
  useFetchAlbumsQuery,
  useAddAlbumMutation,
  useRemoveAlbumMutation
} = albumsApi;
export { albumsApi };
