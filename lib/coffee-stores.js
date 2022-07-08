import { createApi } from 'unsplash-js';

// on your node server
const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getUrlForCoffeeStores = (latLong, category, limit) => {
  return `https://api.foursquare.com/v3/places/search?ll=${latLong}&categories=${category}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: 'coffee shop',
    page: 1,
    perPage: 40,
  });

  const unsplashResults = photos.response.results;

  return unsplashResults.map((r) => r.urls['small']);
};

export const fetchCoffeeStores = async (
  latLong = '43.65,-79.38',
  limit = 6
) => {
  const photos = await getListOfCoffeeStorePhotos();

  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores(latLong, 13032, limit),
    options
  );

  const data = await response.json();

  return data.results.map((r, index) => {
    return {
      id: r.fsq_id,
      name: r.name,
      address: r.location.address || '',
      locality: r.location.locality,
      imgUrl: photos.length > 0 ? photos[index] : null,
    };
  });
};
