import bcrypt from 'bcrypt'
import { readFileSync, writeFileSync } from 'node:fs';

const saltRounds = 10;
const fileName = 'password.txt';

const myPlaintextPassword = process.argv[2];
if (!myPlaintextPassword) {
    console.log("Please enter the password after the file name. Example: node hash.js my_password");
    process.exit(1);
}

let storedHash = "";
try {
    const data = readFileSync(fileName, 'utf8');
    storedHash = data.trim();
} catch (error) {
    console.log("The file has not been created yet, we will register a new password.");
}

async function processPassword() {
    if (!storedHash) {
        try {
            const hash = await bcrypt.hash(myPlaintextPassword, saltRounds);
            writeFileSync(fileName, hash);
            console.log("The new password has been hashed and saved to a file!");
        } catch (err) {
            console.error("Hashing error:", err)
        }
    } else {
        try {
            const isMatch = await bcrypt.compare(myPlaintextPassword, storedHash);
            if (isMatch) {
                console.log("Access allowed: Passwords match!");
            } else {
                console.log("Access denied: Incorrect password!");
            }
        } catch (err) {
            console.error("Error while comparing:", err);
        }
    }
}
processPassword();
