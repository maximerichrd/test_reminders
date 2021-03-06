"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.sendReminders = exports.COLUMNS = exports.REMINDER_TABLE = void 0;
var date_fns_1 = require("date-fns");
var knex_1 = require("knex");
var knex = knex_1["default"]({
    client: "mysql",
    version: '5.7',
    connection: {
        host: '127.0.0.1',
        user: 'user',
        password: 'password',
        database: 'testdb',
        port: 6606
    }
});
exports.REMINDER_TABLE = "reminders";
exports.COLUMNS = {
    DOCUMENT_NUMBER: "DOC_NUMBER",
    STORE_ID: "STORE_ID",
    CREATED_AT: "CREATED_AT"
};
function sendReminders(checkWindowInMinutes, expiryTimeInMinutes, reminderPeriodicityInMinutes, knex) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, knex.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                        var now, expiryDate, subQuery, reminderRows, reminders;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    now = Date.now();
                                    expiryDate = date_fns_1.subMinutes(new Date(now), expiryTimeInMinutes);
                                    subQuery = knex(exports.REMINDER_TABLE)
                                        .select(exports.COLUMNS.STORE_ID, knex.raw("max(" + exports.COLUMNS.CREATED_AT + ") as " + exports.COLUMNS.CREATED_AT))
                                        .groupBy(exports.COLUMNS.STORE_ID);
                                    return [4 /*yield*/, trx(exports.REMINDER_TABLE)
                                            .select(exports.COLUMNS.STORE_ID, exports.COLUMNS.CREATED_AT)
                                            .where(exports.COLUMNS.CREATED_AT, ">=", expiryDate)
                                            .whereIn([exports.COLUMNS.STORE_ID, exports.COLUMNS.CREATED_AT], subQuery)
                                            .distinct()];
                                case 1:
                                    reminderRows = _a.sent();
                                    reminders = reminderRows.filter(function (row) {
                                        return shouldWake(row, checkWindowInMinutes, reminderPeriodicityInMinutes, now);
                                    });
                                    console.log(reminderRows);
                                    console.log("============== " + new Date(Date.now()) + " AFTER SHOULD_WAKE=================");
                                    console.log(reminders);
                                    console.log("============== DONE =================");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendReminders = sendReminders;
setInterval(function () { return sendReminders(1, 180, 30, knex); }, 30 * 1000);
function shouldWake(reminder, checkWindowInMinutes, reminderPeriodicityInMinutes, now) {
    var nowInSeconds = date_fns_1.getUnixTime(now);
    var createdAtInSeconds = date_fns_1.getUnixTime(reminder.CREATED_AT);
    var elapsedSecondsSinceCreation = nowInSeconds - createdAtInSeconds;
    var frequencyInSeconds = reminderPeriodicityInMinutes * 60;
    var windowInSeconds = checkWindowInMinutes * 60;
    var firstHalfHourInSeconds = 30 * 60;
    // not before the first halfhour
    if (elapsedSecondsSinceCreation < firstHalfHourInSeconds) {
        return false;
    }
    // every half-hour, starting from creation.
    else {
        return elapsedSecondsSinceCreation % frequencyInSeconds < windowInSeconds;
    }
}
