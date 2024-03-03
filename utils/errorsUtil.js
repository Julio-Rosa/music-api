const { role } = require('../models/model');
const { isValidDate } = require('../utils/dateUtil');


async function validateEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!(emailPattern.test(email))) {
        return "Please, type a valid email !";
    }


}
async function checkPassword(password) {
    const errors = [];
    const errorsObject = {};


    if (password.length < 8) {
        errors.push("Password minimum length of 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("The password must contain at least one capital letter");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push("The password must contain at least one special character");
    }
    if (!/\d/.test(password)) {
        errors.push("The password must contain at least one number");
    }
    errors.forEach((error, index) => {
        errorsObject[index] = error;
    });
    if (Object.keys(errors).length == 0) {
        return 0;
    } else {
        return errorsObject;
    }



}
async function sendErrors(options) {

    let errors = [];
    let errorsObject = {};
    if(options && options.role !== undefined){
        
        if(!(options.role == "ADMIN" || options.role == "USER")){
            errors.push("Invalid Role");
        }
    }

    if (options && options.email !== undefined) {
        const emailErrors = await validateEmail(options.email);
        if (emailErrors) {
            errors.push(emailErrors);
        }
    }
    if (options && options.password !== undefined) {
        
        const passErrors = await checkPassword(options.password);
        if (passErrors != false) {
            errors.push(passErrors);
        }

    }
    if (options && options.newPassword !== undefined) {
        
        const passErrors = await checkPassword(options.newPassword);
        if (passErrors != false) {
            errors.push(passErrors);
        }else if(options.newPassword != options.newPasswordRepeat){
            errors.push("The repeated password must be the same as the new password");
        }

    }

    if (options && options.name !== undefined) {

        if (options.name.length < 3) {
            errors.push("The name must have at least three characters");

        }

    }
    if (options && options.release_date !== undefined) {
        if (isValidDate(options.release_date) == false) {
            errors.push("Invalid date");
        }
    }

    errors.forEach((error, index) => {
        errorsObject[index] = error;
    });

    return errorsObject;


}
async function returnErrors(options) {
    const errors = await sendErrors(options);

    if (Object.keys(errors).length == 0) {
        return false;
    } else {
        return errors;
    }
}



module.exports = {
    returnErrors
}