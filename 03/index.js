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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var node_os_1 = require("node:os");
var promises_1 = require("node:fs/promises");
var A = require("fp-ts/Array");
var E = require("fp-ts/Either");
var M = require("fp-ts/Monoid");
var N = require("fp-ts/number");
var S = require("fp-ts/string");
var TE = require("fp-ts/TaskEither");
var function_1 = require("fp-ts/function");
// SHARED:
var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var getInput = TE.tryCatch(function () { return (0, promises_1.readFile)("./input", "utf-8"); }, function (e) { return e; });
var splitByNewline = function (input) { return input.split(node_os_1.EOL); };
var charToValue = function (c) {
    return alphabet.indexOf(c) + 1;
};
var sum = M.concatAll(N.MonoidSum);
// P1
var bisectItem = function (item) {
    var asArray = item.split("");
    return A.chunksOf(asArray.length / 2)(asArray);
};
var getValuesP1 = (0, function_1.flow)(bisectItem, function (item) {
    return (0, function_1.pipe)(A.intersection(S.Eq)(item[0])(item[1]), A.uniq(S.Eq), function (x) { return x[0]; }, charToValue);
});
var p1 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = function_1.pipe;
                return [4 /*yield*/, getInput()];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), E.map((0, function_1.flow)(splitByNewline, A.map(getValuesP1), sum)),
                    E.getOrElseW(function () { return "Failed to load file..."; })])];
        }
    });
}); };
// P2
var intersectRec = function (xs) {
    switch (xs.length > 1) {
        case true:
            return intersectRec(__spreadArray([
                A.intersection(S.Eq)(xs[0])(xs[1])
            ], A.dropLeft(2)(xs), true));
        default:
            return xs[0];
    }
};
var getValuesP2 = (0, function_1.flow)(A.map(function (x) { return x.split(""); }), intersectRec, A.uniq(S.Eq), function (x) { return x[0]; }, charToValue);
var p2 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = function_1.pipe;
                return [4 /*yield*/, getInput()];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), E.map((0, function_1.flow)(splitByNewline, A.chunksOf(3), A.map(getValuesP2), sum)),
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
