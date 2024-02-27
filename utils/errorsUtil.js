const { isValidDate } = require('../utils/dateUtil');



async function sendErrors(release_date = undefined,name = undefined) {
    let errors = [];
    let errorsObject = {};
    if(release_date != undefined){
        if (isValidDate(release_date) == false || release_date == null) {
            errors.push("The date is not valid, the correct format is day/month/year");
    
        }
    }

    if(name != undefined){
        if(name.length < 3){
            errors.push("The name must have at least three characters");
        }
    }
   
    errors.forEach((error, index) => {
        errorsObject[index] = error;
      });
     
      
    return errorsObject;
}


module.exports = {
    sendErrors
}