exports.seed = (knex) => {
    return knex('users').del()
        .then(() => knex('users').insert([
            {
                id: 1,
                username: 'Leandro Test',
                email: '1675094013363@ipca.pt',
                password: '111',
                location: 'amares',
                appid: '1213231-123',
                status: false
            }
        ]))
}