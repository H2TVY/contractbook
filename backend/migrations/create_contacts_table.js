exports.up = function (knex) {
  return knex.schema.createTable("contacts", function (table) {
    table.increments("id").primary(); //  SERIAL PRIMARY KEY
    table.text("name").notNullable(); // TEXT NOT NULL
    table.text("email"); // TEXT
    table.text("address"); // TEXT
    table.string("phone", 255); // VARCHAR(255)
    table.boolean("favorite").notNullable().defaultTo(false); // BOOLEAN NOT NULL DEFAULT FALSE
    table.text("avatar"); // TEXT
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("contacts");
};
