const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AdminUsers = require('../model/adminusers');

const Authadmin = catchAsync(async (req, res, next) => {
  console.log("headers-->", req.headers);
  const bearerHeader = req.headers['authorization'];
  console.log("authorization-->", bearerHeader);
  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    console.log("bearerToken-->", bearerToken);
    if (bearerToken == "null" || bearer.length < 2) {
      res.send({
        success: false,
        code: 201,
        status: "Invalid Auth Token.",
        timestamp: new Date()
      });
    }
    else {
      jwt.verify(bearerToken, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          // Token is either invalid or expired
          if (err.name === 'TokenExpiredError') {
            console.log('Token has expired');
            res.send({
              success: false,
              code: 401,
              status: "Token has expired",
              timestamp: new Date()
            });
          } else {
            console.error('Invalid token:', err.message);
            res.send({
              success: false,
              code: 401,
              status: err.message,
              timestamp: new Date()
            });
          }
        } else {
          console.log('Token is valid');
          console.log('Decoded payload:', decoded);
          if (decoded != '' && decoded != null && decoded != undefined) {
            let AdminuserDetails = await AdminUsers.findOne({ id: decoded.id });
            if (AdminuserDetails != null) {
              req.userdetails = AdminuserDetails
              next();
            } else {
              res.send({
                success: false,
                code: 201,
                status: "Username Doesn't Exist",
                timestamp: new Date()
              });
            }
          } else {
            res.send({
              success: false,
              code: 201,
              status: "Username Doesn't Exist",
              timestamp: new Date()
            });
          }
        }
      });
    }
  } else {
    res.send({
      success: false,
      code: 201,
      status: "Unauthorized",
      timestamp: new Date()
    });
  }
});


module.exports = {
  Authadmin
};
