module.exports = {
    test: {
        client: 'pg',
        connection: {
        host : 'localhost',
        port : 6001,
        user : 'root',
        password: '1234',
        database : 'root'
        },
        debug: true,
        migrations: {
            directory: 'src/migrations'
        },
        pool: {
            min: 0,
            max: 50,
            propagateCreateError: false
        }
    }
}