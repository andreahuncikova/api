"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// CRUD
router.get('/', (req, res) => {
    //connect to database 
    res.status(200).send('Welcome to this API');
    // disconnect from database
});
exports.default = router;
//# sourceMappingURL=routes.js.map