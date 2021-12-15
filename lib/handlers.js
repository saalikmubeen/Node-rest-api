const { read, create } = require("./fileOperator");
const { hashPassword } = require("./helpers");

const handlers = {};

handlers.sample = (data, callback) => {
    // callback(statusCode, payload)
    callback(406, { name: "sample handler" });
};

handlers.ping = (data, callback) => {
    callback(200);
};

handlers.notFound = (data, callback) => {
    callback(404);
};

handlers._users = {};

handlers._users.post = (data, callback) => {
    let { payload } = data;
    payload = JSON.parse(payload);

    const firstName =
        typeof payload.firstName === "string" &&
        payload.firstName.trim().length > 0
            ? payload.firstName.trim()
            : false;
    const lastName =
        typeof payload.lastName === "string" &&
        payload.lastName.trim().length > 0
            ? payload.lastName.trim()
            : false;
    const phone =
        typeof payload.phone === "string" && payload.phone.trim().length === 12
            ? payload.phone.trim()
            : false;
    const password =
        typeof payload.password === "string" &&
        payload.password.trim().length > 0
            ? payload.password.trim()
            : false;
    const tosAgreement =
        typeof payload.tosAgreement === "boolean" && payload.tosAgreement;

    if (firstName && lastName && phone && password && tosAgreement) {
        // check the user with the phone number does not exist already

        read("users", phone, (err, data) => {
            // means the user already exists
            if (!err) {
                return callback(400, {
                    error: "A user with that phone number already exists",
                });
            }

            //hash the password
            const hashedPassword = hashPassword(password);

            if (!hashedPassword) {
                return callback(500, { error: "Could not hash the password" });
            }

            // create the user
            const userObj = {
                firstName,
                lastName,
                phone,
                hashedPassword,
                tosAgreement,
            };

            // insert the user into the database (filesystem)
            create("users", phone, userObj, (err) => {
                if (err) {
                    return callback(500, {
                        error: "Could not create the user",
                    });
                }

                callback(200, { user: userObj });
            });
        });
        return;
    }

    callback(400, { Error: "Missing required fields" });
};

handlers._users.get = (data, callback) => {};

handlers._users.put = (data, callback) => {};

handlers._users.delete = (data, callback) => {};

handlers.users = (data, callback) => {
    const allowedMethods = ["post", "get", "put", "delete"];

    if (!allowedMethods.includes(data.method)) {
        return callback(405);
    }

    handlers._users[data.method](data, callback);
};

module.exports = handlers;
