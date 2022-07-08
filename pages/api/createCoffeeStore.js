import isEmpty from 'lodash/isEmpty';

const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base('coffee-stores');

console.log('TABLE: ', table);

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `id="1"`,
        })
        .firstPage();

      console.log('CoffeeStore: ', findCoffeeStoreRecords);

      if (!isEmpty(findCoffeeStoreRecords)) {
        const records = findCoffeeStoreRecords.map((r) => {
          return {
            ...r.fields,
          };
        });
        res.json(records);
      } else {
        const createRecords = await table.create([
          {
            fields: {
              id: '1',
              name: 'My favorite Coffee store',
              address: 'my address',
              neighbourhood: 'some neighbourhood',
              voting: 200,
              imgUrl: 'https://myimage.com',
            },
          },
        ]);

        const records = createRecords.map((r) => {
          return {
            ...r.fields,
          };
        });

        res.json(records);
      }
    } catch (e) {
      console.error('Error finding store', e);
      res.status(500);
      res.json({ message: 'Error finding store', e });
    }
  } else {
    res.json({ message: 'GETTING!' });
  }
};

export default createCoffeeStore;
