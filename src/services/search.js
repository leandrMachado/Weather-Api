const axios = require('axios')

module.exports = (app) => {

    const findByZone = async (filter = {}) => {
        const options = {
            method: 'GET',
            url: `https://api.openweathermap.org/data/2.5/forecast?q=${filter.zone}&appid=bcbf5e8717f11d10404dc9e7a81b1735`
        }

        try{
            return await axios.request(options)
            .then((snapshot) => {
                return snapshot.data
            })
        }
        catch(error) { return error }
    }

    return { findByZone }
}