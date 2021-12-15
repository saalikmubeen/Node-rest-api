const { scrypt, randomBytes, createHmac } = require("crypto");
const { promisify } = require("util");
const environment = require("../config");

// const scryptAsync = promisify(scrypt);

// const hashPassword = async (password) => {
//     const salt = randomBytes(8).toString("hex");
//     const buff = await cryptAsync(password, salt, 64);

//     return `${buff.toString("hex")}.${salt}`;
// }

// const comparePassword = async (storedPassword, suppliedPassword) => {
//     const [hashedPassword, salt] = storedPassword.split(".");
//     const buff = await scryptAsync(suppliedPassword, salt, 64);

//     return buff.toString("hex") === hashedPassword;
// }

exports.hashPassword = (password) => {
    const hash = createHmac("sha256", environment.hashingSecret)
        .update(password)
        .digest("hex");

    return hash;
};
