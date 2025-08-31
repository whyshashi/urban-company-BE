import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.timestamps(true, true); // created_at, updated_at
  });

  await knex.schema.createTable("doctors", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("specialization").notNullable();
    table.integer("experience_years").notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("appointments", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    table.integer("doctor_id").unsigned().references("id").inTable("doctors").onDelete("CASCADE");
    table.timestamp("appointment_time").notNullable();
    table.string("status").defaultTo("pending"); // pending, confirmed, completed, cancelled
    table.timestamps(true, true);
  });

  await knex.schema.createTable("payments", (table) => {
    table.increments("id").primary();
    table.integer("appointment_id").unsigned().references("id").inTable("appointments").onDelete("CASCADE");
    table.decimal("amount", 10, 2).notNullable();
    table.string("payment_method").notNullable(); // e.g., card, upi, cash
    table.string("status").defaultTo("pending"); // pending, success, failed
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("payments");
  await knex.schema.dropTableIfExists("appointments");
  await knex.schema.dropTableIfExists("doctors");
  await knex.schema.dropTableIfExists("users");
}
