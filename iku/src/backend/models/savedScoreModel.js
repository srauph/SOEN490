// import connection
import {savedScoreDBModel} from "../config/db.js";

// Get saved scores by origin and destination
export const getSavedScoresByLocations = (originID, destID, result) => {
    savedScoreDBModel.findOne({'origin':originID,'destination':destID},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Get saved scores by origin only
export const getSavedScoresByOrigin = (originID, result) => {
    savedScoreDBModel.findOne({'origin':originID,'destination':{ $exists: false }},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Creates a new location using given data
export const createSavedScore = (data, result) => {
    savedScoreDBModel.create(data, (err, data) => {
        if (err){
            console.log(err);
        }
        else{
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Updates or upserts an existing origin/destination score using given data
export const updateSavedScoreByLocations = (originID, destID, updateData, result) => {
    savedScoreDBModel.findOneAndUpdate({'origin': originID, 'destination': destID}, updateData, {
        new: true,
        upsert: true
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Updates or upserts an existing origin score using given data
export const updateSavedScoreByOrigin = (originID, updateData, result) => {
    savedScoreDBModel.findOneAndUpdate({'origin': originID, 'destination': {$exists: false}}, updateData, {
        new: true,
        upsert: true
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Remove a SavedScore by its Object ID
export const removeSavedScore = (_id, result) => {
    savedScoreDBModel.findOneAndDelete({_id:_id},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Remove saved scores by origin and destination
export const removeSavedScoresByLocations = (originID, destID, result) => {
    savedScoreDBModel.deleteMany({'origin':originID,'destination':destID},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Remove saved scores by origin only (where destination is null)
export const removeSavedScoresByOriginNoDest = (originID, result) => {
    savedScoreDBModel.deleteMany({'origin':originID,'destination':{ $exists: false }},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Remove saved scores by origin only
export const removeSavedScoresByOrigin = (originID, result) => {
    savedScoreDBModel.deleteMany({'origin':originID},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}

// Remove saved scores by destination only
export const removeSavedScoresByDestination = (destinationID, result) => {
    savedScoreDBModel.deleteMany({'destination':destinationID},(err, data) => {
        if (err){
            console.log(err);
        }
        else{
            if (process.env.REACT_APP_LOG_SUCCESSFUL_DB_CALLS === 'true') {
                console.log(data);
            }
            result(null, data);
        }
    });
}
