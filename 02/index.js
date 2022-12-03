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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var node_os_1 = require("node:os");
var promises_1 = require("node:fs/promises");
var A = require("fp-ts/Array");
var TE = require("fp-ts/TaskEither");
var E = require("fp-ts/Either");
var function_1 = require("fp-ts/function");
var getInput = TE.tryCatch(function () { return (0, promises_1.readFile)("./input", "utf-8"); }, function (e) { return e; });
var modulo = function (n, m) { return ((n % m) + m) % m; };
var codedOppMoves = ["A", "B", "C"];
var codedUsrMoves = ["X", "Y", "Z"];
var requiredShifts = [-1, 0, 1];
var points = [0, 3, 6];
var getBasePointsFromIndex = function (i) { return i + 1; };
var calculateRoundP1 = function (_a) {
    var oppMove = _a[0], usrMove = _a[1];
    var oppMoveIndex = codedOppMoves.indexOf(oppMove);
    var usrMoveIndex = codedUsrMoves.indexOf(usrMove);
    var basePoints = getBasePointsFromIndex(usrMoveIndex);
    if (oppMoveIndex == usrMoveIndex)
        return basePoints + 3;
    return modulo(oppMoveIndex + 1, 3) === usrMoveIndex
        ? basePoints + 6
        : basePoints;
};
var calculateRoundP2 = function (_a) {
    var oppMove = _a[0], desiredOutcome = _a[1];
    var oppMoveIndex = codedOppMoves.indexOf(oppMove);
    var desiredOutcomeIndex = codedUsrMoves.indexOf(desiredOutcome);
    var requiredShift = requiredShifts[desiredOutcomeIndex];
    var usrMoveIndex = modulo(oppMoveIndex + requiredShift, 3);
    return getBasePointsFromIndex(usrMoveIndex) + points[desiredOutcomeIndex];
};
var getPairsFromInput = (0, function_1.flow)(function (input) { return input.split(node_os_1.EOL); }, A.map(function (x) { return x.split(" "); }));
var sumArray = A.reduce(0, function (acc, cur) { return acc + cur; });
var p1 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = function_1.pipe;
                return [4 /*yield*/, getInput()];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), E.map((0, function_1.flow)(getPairsFromInput, A.map(calculateRoundP1), sumArray)),
                    E.getOrElseW(function () { return "Failed to load file..."; })])];
        }
    });
}); };
var p2 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = function_1.pipe;
                return [4 /*yield*/, getInput()];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), E.map((0, function_1.flow)(getPairsFromInput, A.map(calculateRoundP2), sumArray)),
                    E.getOrElseW(function () { return "Failed to load file..."; })])];
        }
    });
}); };
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _b = (_a = console).log;
                _c = ["P1"];
                return [4 /*yield*/, p1()];
            case 1:
                _b.apply(_a, _c.concat([_g.sent()]));
                _e = (_d = console).log;
                _f = ["P2"];
                return [4 /*yield*/, p2()];
            case 2:
                _e.apply(_d, _f.concat([_g.sent()]));
                return [2 /*return*/];
        }
    });
}); };
run();
