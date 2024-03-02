

async function createRoles(options){
    const roles = [];

    if(options != undefined){
        for (const [key, value] of Object.entries(options)) {
            if(value == true){
                roles.push(key);
            }
            
          }
    }
    console.log(roles);
}

const can_edit_user = true;
const can_edit_music = true;
createRoles({can_edit_user,can_edit_music});