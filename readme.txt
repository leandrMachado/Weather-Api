#Weather-Api

##Generate Docker conteiner

docker run --name weather -e POSTGRES_USER=root -e POSTGRES_PASSWORD=1234 -p 6001:5432 -d postgres

##Executar base de dados

node_modules/.bin/knex migrate:make table_users_token --env test

node_modules/.bin/knex migrate:make create_table_users_newsletter --env test

node_modules/.bin/knex migrate:latest --env test
