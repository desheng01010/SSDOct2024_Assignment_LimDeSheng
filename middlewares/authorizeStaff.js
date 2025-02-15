const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden-empty token" });
    }

    // Check Staff role for authorization
    const authorizedRoles = {
      "/legends": ["clerk", "admin"], // Anyone can view legends
      "/buildings": ["clerk", "admin"], // Anyone can view buildings
      "/contactlists": ["clerk", "admin"], // Anyone can view contactlists
      "/quotations": ["clerk", "admin"], // Anyone can view quotations
      "/invoices": ["admin"], // Only admin can view & update invoices
      "/invoices/:invoice": ["admin"],
    };

    const requestedEndpoint = req.url;
    const staffRole = decoded.role;

    const authorizedRole = Object.entries(authorizedRoles).find(
      ([endpoint, roles]) => {
        const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
        return regex.test(requestedEndpoint) && roles.includes(staffRole);
      }
    );

    if (!authorizedRole) {
      return res.status(403).json({ message: "Forbidden-token" });
    }

    req.user = decoded; // Attach decoded user information to the request object
    next();
  });
}

module.exports = verifyJWT;
