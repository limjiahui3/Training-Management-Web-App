// random code to hash the user_credential passwords in SQL databse

import bcrypt from "bcryptjs";

const password = "admin"

const salt =  bcrypt.genSaltSync(10);
const secPass =  bcrypt.hashSync(password, salt);
console.log(secPass);

//output:
//$2a$10$rTYZwsbnhI7HDqyncsuupuxlU8j5d.MsK2qymwqrIzL8s8.46MyQ6

//$2a$10$CNBE8c9XAjedKCIMQv40neeKR5KrNTQKQYBpRfk77.guGNoGlzODK