const environment = {};

environment.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: "staging",
    hashingSecret: "secret to hash the passwords in staging environment",
};

environment.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: "production",
    hashingSecret: "secret to hash the passwords in production environment",
};

const currentEnvironment =
    typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

module.exports = environment[currentEnvironment];
