const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

const env = require("./lib/config");
const handlers = require("./lib/handlers");

// router
const router = {
    sample: handlers.sample,
    ping: handlers.ping,
    users: handlers.users,
};

// httpServer
const httpServer = http.createServer((req, res) => {
    server(req, res);
});

// httpServer.on("request", (req, res) => {
//     server(req, res);
// });

const server = (req, res) => {
    // get the url from the request and parse it
    const parsedUrl = url.parse(req.url, true);

    // get the pathname from the url
    const pathname = parsedUrl.pathname;
    const trimmedPathname = pathname.replace(/^\/+|\/+$/g, "");

    // get the querystring as an object
    const query = parsedUrl.query;

    // get the method from the request
    const method = req.method.toLowerCase();

    // get the headers from the request as an object
    const headers = req.headers;

    // get the payload or body, if any
    const decoder = new StringDecoder("utf-8");
    let buffer = "";

    req.on("data", (data) => {
        buffer += decoder.write(data);
    });

    req.on("end", () => {
        buffer += decoder.end();

        // Construct the data object to send to the handler
        var data = {
            trimmedPath: trimmedPathname,
            queryStringObject: query,
            method: method,
            headers: headers,
            payload: buffer,
        };

        const requestHandler =
            trimmedPathname in router
                ? router[trimmedPathname]
                : handlers.notFound;

        requestHandler(data, function (statusCode, payload) {
            statusCode = typeof statusCode === "number" ? statusCode : 200;
            payload = typeof payload === "object" ? payload : {};

            // Convert the payload to a string
            const payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

httpServer.listen(env.httpPort, () => {
    console.log(
        `Server running at port ${env.httpPort} in ${env.envName} environment....!!!`
    );
});
