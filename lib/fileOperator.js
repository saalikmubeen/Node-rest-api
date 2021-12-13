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
