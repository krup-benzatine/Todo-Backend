"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_controllers_1 = require("../controllers/user.controllers");
var router = express_1.default.Router();
router.post("/signup", user_controllers_1.signup);
router.post("/login", user_controllers_1.login);
exports.default = router;
