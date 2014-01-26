exports.filter = function authorize(req, res, next) {
  if(!req.isAuthenticated) {
    res.send({
      error: "you need to register and pass in an authentication header to see this resource",
      register: {
        method: 'post',
        url: '/register'
      },
      root: {
        method: 'get',
        url: '/'
      }
    });
  } else {
    next();
  }
}
