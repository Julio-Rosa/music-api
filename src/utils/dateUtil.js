const { Model } = require("sequelize");



function isValidDate(date){
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if(!dateRegex.test(date)){
        return false;
    }

    const [,day, month, year] = date.match(dateRegex);

    const dayNumber = parseInt(day, 10);
    const monthNumber = parseInt(month, 10);
    const yearNumber = parseInt(year, 10);

    const isValidDay = dayNumber >= 1 && dayNumber <= 31;
    const isValidMonth = monthNumber >= 1 && monthNumber <= 12;
    const isValidYear = yearNumber >= 1000 && yearNumber <= 9999;

    return isValidDay && isValidMonth && isValidYear;
}
function removeSlashesFromDate(dateString) {
    return dateString.replace(/\//g, '');
}




module.exports = {
    isValidDate
}