import knex, { Knex } from 'knex';
import { Model } from 'objection';
import * as database from 'src/config/database';
export async function connection() {
  console.log(
    'connecting to:',
    database.connection.host,
    'SSL',
    database.connection.ssl ? 'Yes' : 'No',
  );
  const db = knex({
    client: database.client,
    connection: database.connection,
  });
  Model.knex(db);
  await createView(db);
  return db;
}

function createView(db: Knex) {
  return db.schema.raw(`CREATE OR REPLACE VIEW post_term AS
      SELECT wp_term_relationships.object_id as post_id, wp_term_taxonomy.term_id, wp_term_taxonomy.taxonomy
      FROM wp_term_relationships
      INNER JOIN wp_term_taxonomy ON wp_term_relationships.term_taxonomy_id = wp_term_taxonomy.term_taxonomy_id
  `);
}
