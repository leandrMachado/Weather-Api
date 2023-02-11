# Weather-Api

## API Documentation

#### Return weather data from cords

```http
  GET: http://localhost:3001/data/?lat={lat}&lon={lon}
```

| Parâmetro   | Tipo       |            | Descrição                           |
| :---------- | :--------- | :--------- | :---------------------------------- |
| `lat, lon` | `string` | required  |Geographical coordinates (latitude, longitude).|

#### Return weather data from name location

```http
  GET: http://localhost:3001/data/?name={name}
```

| Parâmetro   | Tipo       |            | Descrição                           |
| :---------- | :--------- | :--------- | :---------------------------------- |
| `name` | `string` | required  | Requested location name (ex: Amares) |




## Genreate Database

1.  **Create a docker conteiner.**

    Use Docker Desktop ([install instructions](https://docs.docker.com/get-docker/)) to create a new containers.

    ```shell
        # create a new Conteiner in docker
        docker run --name db-weather -e POSTGRES_USER=root -e POSTGRES_PASSWORD=123abc -p 6002:5432 -d postgres
    ```

2.  **Create database migrations.**

    Use knex.js ([install instructions](https://www.npmjs.com/package/knex)) client to create tables in the database.

    ```shell
        # create a users table
        node_modules/.bin/knex migrate:make create_table_users --env test
        # create a subscriptions table
        node_modules/.bin/knex migrate:make create_table_subscriptions --env test
        # create a users locations
        node_modules/.bin/knex migrate:make create_table_locations --env test
        # create a users data_locations
        node_modules/.bin/knex migrate:make create_table_data_locations --env test
    ```

3.  **Create database tables.**

    ```shell
        # apply migrations to the database
        node_modules/.bin/knex migrate:latest --env test
        # remove database migrations
        node_modules/.bin/knex migrate:rollback --env test
        # inicialize seeds
        node_modules/.bin/knex seed:run --env test
    ```


## Autores

- [@Silmi@L](https://github.com/leandrMachado)

