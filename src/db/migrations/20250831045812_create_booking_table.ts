// src/db/migrations/create_booking_slots_table.ts
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("booking_slots", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    table.timestamp("start_time").notNullable();
    table.timestamp("end_time").notNullable();
    table.enum("status", ["available", "booked"]).defaultTo("available");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("booking_slots");
}
