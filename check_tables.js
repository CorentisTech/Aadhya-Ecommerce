const { queryDb } = require('./src/utils/db.js');
async function run() {
  const res = await queryDb('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
  console.log(res);
}
run().catch(console.error);
