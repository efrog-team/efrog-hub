import * as db from '$lib/database/database'

export let authorization = async (task_id, user_id) => {
    const authors = await db.send_ecran(`SELECT user_id FROM author where task_id = ?`, [task_id]);
    for(let i = 0; i < authors.length; i++){
        if(authors[i].user_id == user_id) {
           return true;
        }
    }
    return false;
}


export let randomString = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
  
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset.charAt(randomIndex);
    }

    return randomString;
}

export function checkValue(value, min, max) {
    const regex = /^\d+$/;

    if (!regex.test(value)) {
    return false; 
    }

    const numericValue = parseFloat(value);

    if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
        return true; 
    }

    return false; 
}