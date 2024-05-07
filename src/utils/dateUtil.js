const { Model } = require("sequelize");



function isValidDate(date) {
    console.log(date);
    const dateRegex = /^(?:(?:19|20)\d\d)-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
    if (dateRegex.test(date)) {
        const [, year, month, day] = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        
        return true;
    }else{
        return false;
    }

   



}
function removeSlashesFromDate(dateString) {
    return dateString.replace(/\//g, '');
}

function stringToDate(dateString) {
    
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date;
}



module.exports = {
    isValidDate,
    stringToDate
}