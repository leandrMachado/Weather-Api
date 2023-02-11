exports.up = (knex) => {
    return knex.schema.createTable('banedtoken', (t) => {
      t.increments('id').primary();
      t.string('banedid').notNull();
    });
};
  
exports.down = (knex) => {
    return knex.schema.dropTable('banedtoken');
};
  