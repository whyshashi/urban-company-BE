
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("providers", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("contact").notNullable();
    table
      .integer("service_id")
      .unsigned()
      .references("id")
      .inTable("services")
      .onDelete("CASCADE"); // if service is deleted, provider also goes
    table.decimal("price", 10, 2).notNullable(); // price for the service
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("providers");
}
