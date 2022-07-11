import isEmpty from 'lodash/isEmpty';

import {
  findRecordByFilter,
  normalizeRecords,
  table,
} from '../../lib/airtable';

const favoriteCoffeeStoreById = async (req, res) => {
  if (req.method === 'PUT') {
    try {
      const { id } = req.body;
      if (id) {
        const records = await findRecordByFilter(id);

        if (!isEmpty(records)) {
          const record = records[0];
          const calculateVoting = parseInt(record.voting) + parseInt(1);

          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);

          if (updateRecord) {
            const normalizedRecord = normalizeRecords(updateRecord);
            res.json(normalizedRecord);
          }
        } else {
          res.json({ message: 'Coffee store id does not exist', id });
        }
      } else {
        res.json({ message: 'Id is missing!' });
      }
    } catch (e) {
      res.status(500);
      res.json({ message: 'Error up-voting coffee store', e });
    }
  }
};

export default favoriteCoffeeStoreById;
