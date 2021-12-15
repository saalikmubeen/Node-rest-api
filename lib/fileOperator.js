const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "..", ".data");

exports.create = function (dir, file, data, callback) {
    const filePath = path.join(baseDir, dir, `${file}.json`);

    fs.open(filePath, "wx", (err, fileDescriptor) => {
        if (err) {
            return callback(err);
        }
        var stringData = JSON.stringify(data);

        fs.writeFile(fileDescriptor, stringData, (err) => {
            if (err) {
                return callback(err);
            }

            fs.close(fileDescriptor, (err) => {
                if (err) {
                    return callback(err);
                }

                callback(false);
            });
        });
    });
};

exports.update = function (dir, file, data, callback) {
    const filePath = path.join(baseDir, dir, `${file}.json`);

    fs.open(filePath, "r+", (err, fileDescriptor) => {
        if (err) {
            return callback(err);
        }

        var stringData = JSON.stringify(data);

        fs.truncate(fileDescriptor, (err) => {
            if (err) {
                return callback(err);
            }

            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (err) {
                    return callback(err);
                }

                fs.close(fileDescriptor, (err) => {
                    if (err) {
                        return callback(err);
                    }

                    callback(false);
                });
            });
        });
    });
};

exports.read = function (dir, file, callback) {
    const filePath = path.join(baseDir, dir, `${file}.json`);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            return callback(err);
        }

        callback(false, JSON.parse(data));
    });
};

exports.deleteFile = function (dir, file, callback) {
    const filePath = path.join(baseDir, dir, `${file}.json`);

    fs.unlink(filePath, (err) => {
        if (err) {
            return callback(err);
        }

        callback(false);
    });
};

// r	To open file to read and throws exception if file doesn’t exists.
// r+	Open file to read and write. Throws exception if file doesn’t exists.
// rs+	Open file in synchronous mode to read and write.
// w	Open file for writing. File is created if it doesn’t exists.
// wx	It is same as ‘w’ but fails if path exists.
// w+	Open file to read and write. File is created if it doesn’t exists.
// wx+	It is same as ‘w+’ but fails if path exists.
// a	Open file to append. File is created if it doesn’t exists.
// ax	It is same as ‘a’ but fails if path exists.
// a+	Open file for reading and appending. File is created if it doesn’t exists.
// ax+	It is same as ‘a+’ but fails if path exists.
