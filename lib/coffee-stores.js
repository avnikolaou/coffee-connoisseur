import { createApi } from 'unsplash-js';

// on your node server
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getUrlForCoffeeStores = (latLong, category, limit) => {
  return `https://api.foursquare.com/v3/places/search?ll=${latLong}&categories=${category}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: 'coffee shop',
    page: 1,
    perPage: 30,
  });

  const unsplashResults = photos.response.results;

  return unsplashResults.map((r) => r.urls['small']);
};

export const fetchCoffeeStores = async () => {
  const photos = await getListOfCoffeeStorePhotos();

  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores('40.63%2C22.94', 13032, 6),
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
