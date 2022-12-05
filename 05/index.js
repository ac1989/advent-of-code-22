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
var TE = require("fp-ts/TaskEither");
var E = require("fp-ts/Either");
var O = require("fp-ts/Option");
var function_1 = require("fp-ts/function");
var getInput = TE.tryCatch(function () { return (0, promises_1.readFile)("./input", "utf-8"); }, function (e) { return e; });
var splitCratesAndMoves = function (input) {
    var _a = A.spanLeft(function (s) { return s !== ""; })(input), init = _a.init, rest = _a.rest;
    return { crates: A.dropRight(1)(init), moves: A.dropLeft(1)(rest) };
};
var parseCrates = function (input) {
    var spl = A.map(function (s) { return s.split(""); })(input.crates);
    var chn = A.map(A.chunksOf(4))(spl);
    var tmp = A.reverse(A.map(A.map(A.filter(function (s) { return /[a-zA-Z]/.test(s); })))(chn));
    var parsed = [];
    // PRAGMATISM NOT IDEALISM
    for (var row = 0; row <= tmp.length; row++) {
        var line = [];
        for (var column = 0; column < tmp.length; column++) {
            line[column] = tmp[column][row];
        }
        parsed[row] = line;
    }
    return parsed.map(function (row) { return row.filter(function (a) { return a.length > 0; }); });
};
var parseInstructions = function (input) {
    return (0, function_1.pipe)(input.moves, A.map((0, function_1.flow)(function (s) { return s.match(/\d+/g); }, A.mapWithIndex(function (i, s) {
        // sub 1 from 'from' and 'to' for array indexing;
        return i > 0 ? parseInt(s, 10) - 1 : parseInt(s);
    }))));
};
var getTopCrates = (0, function_1.flow)(A.map(function (stack) { return A.last(stack); }), A.map(O.getOrElse(function () { return ["!"]; })), A.reduce("", function (acc, el) { return acc + el; }));
var parseCratesAndMoves = function (cratesAndMoves) { return ({
    crates: parseCrates(cratesAndMoves),
    moves: parseInstructions(cratesAndMoves)
}); };
var executeStep = function (crates, from, to) {
    var crateValue = crates[from][crates[from].length - 1];
    var nextFrom = A.dropRight(1)(crates[from]);
    var nextTo = A.append(crateValue)(crates[to]);
    var nextCrates = __spreadArray([], crates, true);
    nextCrates[from] = nextFrom;
    nextCrates[to] = nextTo;
    return nextCrates;
};
var executeMove = function (crates, _a) {
    var count = _a[0], from = _a[1], to = _a[2];
    switch (count === 0) {
        case true:
            return crates;
        default: {
            var nextCrates = executeStep(crates, from, to);
            return executeMove(nextCrates, [count - 1, from, to]);
        }
    }
};
var executeMoves = function (_a) {
    var crates = _a.crates, moves = _a.moves;
    switch (moves.length) {
        case 0:
            return crates;
        default:
            var nextCrates = executeMove(crates, moves[0]);
            return executeMoves({ crates: nextCrates, moves: A.dropLeft(1)(moves) });
    }
};
var p1Workflow = (0, function_1.flow)(splitCratesAndMoves, parseCratesAndMoves, executeMoves, getTopCrates);
var p1 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = function_1.pipe;
                return [4 /*yield*/, getInput()];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), E.map(function (input) { return input.split(node_os_1.EOL); }),
                    E.map(p1Workflow),
                    E.getOrElseW(function () { return "things went very wrong"; })])];
        }
    });
}); };
var executeMoveP2 = function (crates, _a) {
    var count = _a[0], from = _a[1], to = _a[2];
    var values = A.takeRight(count)(crates[from]);
    var nextCrates = __spreadArray([], crates, true);
    var nextFrom = A.dropRight(count)(crates[from]);
    var nextTo = __spreadArray(__spreadArray([], crates[to], true), values, true);
    nextCrates[from] = nextFrom;
    nextCrates[to] = nextTo;
    return nextCrates;
};
var executeMovesP2 = function (_a) {
    var crates = _a.crates, moves = _a.moves;
    switch (moves.length) {
        case 0:
            return crates;
        default:
            var nextCrates = executeMoveP2(crates, moves[0]);
            return executeMovesP2({
                crates: nextCrates,
                moves: A.dropLeft(1)(moves)
            });
    }
};
var p2Workflow = (0, function_1.flow)(splitCratesAndMoves, parseCratesAndMoves, executeMovesP2, getTopCrates);
var p2 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = function_1.pipe;
                return [4 /*yield*/, getInput()];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), E.map(function (input) { return input.split(node_os_1.EOL); }),
                    E.map(p2Workflow),
                    E.getOrElseW(function () { return "things went very wrong"; })])];
        }
    });
}); };
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _b = (_a = console).log;
                    _c = ["P1:"];
                    return [4 /*yield*/, p1()];
                case 1:
                    _b.apply(_a, _c.concat([_g.sent()]));
                    _e = (_d = console).log;
                    _f = ["P2:"];
                    return [4 /*yield*/, p2()];
                case 2:
                    _e.apply(_d, _f.concat([_g.sent()]));
                    return [2 /*return*/];
            }
        });
    });
}
run();
