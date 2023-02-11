exports.seed = (knex) => {
    return knex('subscriptions').del()
        .then(() => knex('subscriptions').insert([
            {
                id: 1,
                email: '1675094013363@ipca.pt',
                location: 'amares',
                status: false
            },
            {
                id: 2,
                email: '1675094013427@ipca.pt',
                location: 'braga',
                status: true
            },
            {
                id: 3,
                email: '1675094013493@ipca.pt',
                location: 'louselo',
                status: true
            }
        ]))
}