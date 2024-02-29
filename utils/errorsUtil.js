const { isValidDate } = require('../utils/dateUtil');



async function sendErrors(options) {
    
    let errors = [];
    let errorsObject = {};



    if(options && options.name !== undefined){
        
        if(options.name.length < 3){
            errors.push("The name must have at least three characters");
            
        }

    }
    if(options && options.release_date !== undefined){
        if(isValidDate(options.release_date) == false){
            errors.push("Invalid date");
        }
    }

    errors.forEach((error, index) =>{
        errorsObject[index] = error;
    });

    return errorsObject;

    
}
async function returnErrors(options){
    const errors =  await sendErrors(options);

    if(Object.keys(errors).length == 0){
        return false;
    }else{
        return errors;
    }
}

module.exports = {
   returnErrors
}