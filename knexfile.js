module.exports = {
    test: {
        client: 'pg',
        connection: {
        host : 'localhost',
        port : 6002,
        user : 'root',
        password: '123abc',
        database : 'root'
        },
        debug: false,
        migrations: {
            directory: 'src/migrations'
        },
        seeds: {
            directory: 'src/seeds',
        },
        pool: {
            min: 0,
            max: 50,
            propagateCreateError: false
        }
    }
}