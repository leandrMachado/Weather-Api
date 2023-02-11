exports.up = (knex) => {
    return knex.schema.createTable('subscriptions', (t) => {
      t.increments('id').primary();
      t.string('email').notNull().unique();
      t.string('location').notNull();
      t.boolean('status').notNull();
    });
};
  
exports.down = (knex) => {
    return knex.schema.dropTable('subscriptions');
};
  