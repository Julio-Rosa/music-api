

async function createRoles(role_name){
    if(!(role_name == undefined || role_name == null)){
       
     return role_name;
   }else{
      const role = "USER";
      return role;
   }

 

}




module.exports = {
    createRoles
}