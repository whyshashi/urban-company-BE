import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("services", (table) => {
    table.increments("id").primary(); // service_id
    table.string("name").notNullable(); // service name e.g., Cleaning
    table.text("description"); // optional details
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("services");
}
