import isEmpty from 'lodash/isEmpty';
import { table, normalizeRecords } from '../../lib/airtable';

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    const { id, name, neighbourhood, address, imgUrl, voting } = req.body;
    try {
      if (id) {
        const findCoffeeStoreRecords = await table
          .select({
            filterByFormula: `id=${id}`,
          })
          .firstPage();

        if (!isEmpty(findCoffeeStoreRecords)) {
          const records = normalizeRecords(findCoffeeStoreRecords);
          res.json(records);
        } else {
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  voting,
                  imgUrl,
                },
              },
            ]);

            const records = normalizeRecords(createRecords);

            res.json(records);
          } else {
            res.status(400);
            res.json({ message: 'Name is missing!' });
          }
        }
      } else {
        res.status(400);
        res.json({ message: 'Id is missing!' });
      }
    } catch (e) {
      console.error('Error creating or finding store', e);
      res.status(500);
      res.json({ message: 'Error creating or finding store', e });
    }
  } else {
    res.json({ message: 'GETTING!' });
  }
};

export default createCoffeeStore;
