docker run --name basedados -e POSTGRES_USER=root -e POSTGRES_PASSWORD=1234 -p 6001:5432 -d postgres

node_modules/.bin/knex migrate:latest --env test

node_modules/.bin/knex migrate:make create_table_accounts --env test

node_modules/.bin/knex migrate:latest --env test

docker run --name realtime-chat -e POSTGRES_USER=root -e POSTGRES_PASSWORD=ananas21 -p 6002:5432 -d postgres
