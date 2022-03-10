const accessControl = (req, res, next) => {
    console.log("Middleware: access control");
    next();
}
module.exports = {
    accessControl
}