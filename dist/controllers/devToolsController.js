"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCron = startCron;
const cron = __importStar(require("node-cron"));
const https_1 = __importDefault(require("https"));
// Settings
const MINUTES_DELTA = 1;
const URL = "https://api-e7dw.onrender.com/api-docs/";
let counter = 0;
let task;
/**
   * Small helper function to ping the server and output to console.
   */
function pingServer() {
    https_1.default.get(URL, () => {
        counter -= MINUTES_DELTA;
        console.log('Pinged the server');
        console.log("Minutes Left: ", counter);
    });
}
/**
   * Small helper function to stop the task
   */
function stopPingingServer() {
    task.stop();
    console.log('Stopped the cron job due to inactivity');
}
/**
 * Stop and clear any scheduled tasks
 */
function cleanUpTasks() {
    // Clean up any existing tasks
    for (const task of cron.getTasks().values()) {
        task.stop();
    }
    cron.getTasks().clear();
}
/**
   *
   * @param req
   * @param res
   */
function startCron(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            cleanUpTasks();
            const cronPattern = "*/" + MINUTES_DELTA + " * * * *";
            // Docs here: https://crontab.guru/#*/5_*_*_*_*
            const totalDuration = parseInt(req.params.duration) || 60;
            //Initialize the task with the specified cronPattern
            counter = totalDuration; // set counter, so we can output how much time is left
            task = cron.schedule(cronPattern, pingServer);
            task.start();
            setTimeout(stopPingingServer, totalDuration * 60 * 1000);
            res.status(200).send("Started background task (duration:" + totalDuration + " mins)");
        }
        catch (error) {
            console.log("Error:" + error); // Debug info
            res.status(500).send(error);
        }
    });
}
;
//# sourceMappingURL=devToolsController.js.map