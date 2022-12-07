exports.up = function(knex) {
    return knex.schema.createTable('users-news', (t) => {
      t.increments('id').primary();
      t.string('name').notNull();
      t.string('email').notNull().unique();
    })
  };
  
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };
  