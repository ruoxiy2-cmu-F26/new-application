//once the server receive a http request, it will console the method(get/post/patch/delete)+URL. ->next()
function loggerMiddleware(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
}

module.exports = loggerMiddleware;