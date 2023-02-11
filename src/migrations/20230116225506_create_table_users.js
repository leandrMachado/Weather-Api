exports.up = (knex) => {
    return knex.schema.createTable('users', (t) => {
      t.increments('id').primary();
      t.string('email').notNull().unique();
      t.string('username').notNull();
      t.string('location').notNull();
      t.string('password').notNull();
      t.string('appid').notNull();
      t.boolean('status').notNull();
    });
};
  
exports.down = (knex) => {
    return knex.schema.dropTable('users');
};
  