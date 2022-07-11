const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base('coffee-stores');

const normalizeRecord = (record) => {
  return {
    ...record.fields,
  };
};
const normalizeRecords = (records) => {
  return records.map((r) => normalizeRecord(r));
};

const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return normalizeRecords(findCoffeeStoreRecords);
};

export { table, normalizeRecords, findRecordByFilter };
