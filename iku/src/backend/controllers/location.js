import {Client} from "@googlemaps/google-maps-services-js";

// Import function from location Model
import { createLocation, getLocationsByUserID, modifyLocation, removeLocation } from "../models/locationModel.js";

import "dotenv/config"

// Google client for Geocoding API
const geocodingClient = new Client({});
const key = process.env.REACT_APP_GEOCODING_KEY;

// Create a new location with data
export const addLocation = async (req, res) => {
    const data = req.body;
    createLocation(data, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Get locations by user ID
export const showLocationsByUserID = (req, res) => {
    getLocationsByUserID(req.params.id, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Get address by coordinates
export const getAddressByCoordinates = async (req, res) => {
    const latlng = req.query.lat + ',' + req.query.lng;
    // const key = process.env.GEOCODING_KEY;

    const params = {
        key: key,
        latlng: latlng
    };

    console.log("retrieving address for " + req.query.lat + ", " + req.query.lng);
    await geocodingClient.geocode({
        params:params
    })
    .then((response) => {
        const address = response.data.results[0].formatted_address;
        res.json({'address': address});
    })
    .catch((error)=>{
        console.log(error.message);
        res.send(error);
    });
}

// Get places suggestions given user input
export const getSuggestions = async (req, res) => {
    const input = req.query.input;
    // const key = process.env.GEOCODING_KEY;

    const params = {
        key: key,
        input: input
    }
    await geocodingClient.placeAutocomplete({
        params: params
    })
    .then((response) => {
        const predictions = response.data.predictions.map(prediction => (
            prediction.description
        ));
        res.json({'predictions': predictions});
    })
    .catch((error) => {
        console.log(error.response);
        res.send(error);
    });
}

//Get Coordinates of specified address
export const getCoordinatesByAddress = async (req, res) => {
    // const key = process.env.GEOCODING_KEY;

    const address = req.query.address;
    const params = {
        key: key,
        address: address
    }
    await geocodingClient.geocode({
        params: params
    })
    .then(response => {
        const coordinates = response.data.results[0].geometry.location;
        res.json({'coordinates': coordinates});
    })
    .catch(error => {
        console.log(error.message);
        res.send(error);
    })
}
    
// Update a location by its object ID
export const updateLocation = (req, res) => {
    modifyLocation(req.body, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Delete a location by its object ID
export const deleteLocation = (req, res) => {
    removeLocation(req.body._id, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}