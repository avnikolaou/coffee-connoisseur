import { fetchCoffeeStores } from '../../lib/coffee-stores';

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { latlong, limit } = req.query;
    const response = await fetchCoffeeStores(latlong, limit);

    res.status(200);
    res.json(response);
  } catch (e) {
    res.status(500);
    res.json({ message: 'There is an error: ', e });
  }
};

export default getCoffeeStoresByLocation;
