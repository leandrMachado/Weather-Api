const axios = require('axios')
const validationError = require('../errors/validationError')

module.exports = (app) => {

    // consultar a base de dados para ver se a apikey existe
    const shareWeather = async (type = {}) => {
        if(!type.appid) throw new validationError('Appid is a required attribute')
        if((!type.lat && !type.lon) && !type.name) throw new validationError('Name of location or coordinates is a required attribute')
        if((!type.lat && type.lon) && !type.name) throw new validationError('Latitude is a required attribute')
        if((type.lat && !type.lon) && !type.name) throw new validationError('Longitude is a required attribute')

        const userDb = await app.services.user.findOne({ appid: type.appid })
        if(!userDb) throw new validationError(`This appid doesn't exist please create un account to use the api!`)

        if((!type.lat && !type.lon) && type.name){
            return searchByCity(type)
                .then((res) => {
                    return res
                })
        }

        if((type.lat || type.lon) && !type.name){
            return searchByCords(type)
                .then((res) => {
                    return res
                })
        }
    }

    const search = async (type = {}) => {
        if(type.name){
            return searchByCity(type)
                .then((res) => {
                    return res
                })
        }

        if(type.lat && type.lon){
            return searchByCords(type)
                .then((res) => {
                    return res
                })
        }
    }

    const searchByCords = async (coordinates = {}) =>{

        const options = {
            method: 'GET',
            url: `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=bcbf5e8717f11d10404dc9e7a81b1735&units=metric`
        }

        try{
            return await axios.request(options)
            .then((snapshot) => {
               return snapshot.data
            })
        }
        catch(error) { throw new validationError('Invalid coordinates') }
    }

    const searchByCity = async (city ={}) => {
        const options = {
            method: 'GET',
            url: `https://api.openweathermap.org/data/2.5/forecast?q=${city.name}&appid=bcbf5e8717f11d10404dc9e7a81b1735&units=metric`
        }

        try {
            return await axios.request(options)
                .then((snapshot) => {
                    return snapshot.data
                })
        }
        catch (error) { throw new validationError('Invalid location name') }
    }

    return { shareWeather, search }
}