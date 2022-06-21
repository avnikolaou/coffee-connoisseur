const getUrlForCoffeeStores = (latLong, category, limit) => {
  return `https://api.foursquare.com/v3/places/search?ll=${latLong}&categories=${category}&limit=${limit}`;
};

export const fetchCoffeeStores = async () => {
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

  return data.results;
};
