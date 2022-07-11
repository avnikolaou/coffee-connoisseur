import isEmpty from 'lodash/isEmpty';

import { table, normalizeRecords } from '../../lib/airtable';

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `id="${id}"`,
        })
        .firstPage();

      if (!isEmpty(findCoffeeStoreRecords)) {
        const records = normalizeRecords(findCoffeeStoreRecords);
        res.json(records);
      } else {
        res.json({ message: 'Id could not be found!' });
      }
    } else {
      res.status(400);
      res.json({ message: 'Id is missing' });
    }
  } catch (e) {
    res.status(500);
    res.json({ message: 'Something went wrong', e });
  }
};

export default getCoffeeStoreById;
