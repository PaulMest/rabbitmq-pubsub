'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Promise = require('bluebird');
var amqp = require('amqplib');
var _ = require('lodash');
var util = require('util');

var log = void 0;

var Publisher = function () {
    function Publisher() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var logOptions = arguments[1];
        (0, _classCallCheck3.default)(this, Publisher);

        log = require('logfilename')(__filename, logOptions);
        if (!options.exchange) {
            throw new Error('exchange parameter missing in options');
        }
        this._options = _.defaults(options, {
            type: 'topic',
            url: 'amqp://localhost'
        });
        log.info('Publisher options:', util.inspect(this._options));
    }

    (0, _createClass3.default)(Publisher, [{
        key: 'start',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var options, connection, res;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                options = this._options;

                                log.info('start ', util.inspect(options));
                                _context.next = 4;
                                return amqp.connect(options.url);

                            case 4:
                                connection = _context.sent;

                                log.info('connected to mq');
                                _context.next = 8;
                                return connection.createChannel();

                            case 8:
                                this._channel = _context.sent;

                                log.info('connected to channel');
                                _context.next = 12;
                                return this._channel.assertExchange(options.exchange, options.type, { durable: true });

                            case 12:
                                res = _context.sent;

                                log.info('connected ', res);

                            case 14:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function start() {
                return _ref.apply(this, arguments);
            }

            return start;
        }()
    }, {
        key: 'stop',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                log.info('stop');

                                if (!this._channel) {
                                    _context2.next = 7;
                                    break;
                                }

                                _context2.next = 4;
                                return this._channel.close();

                            case 4:
                                return _context2.abrupt('return', _context2.sent);

                            case 7:
                                return _context2.abrupt('return', Promise.resolve());

                            case 8:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function stop() {
                return _ref2.apply(this, arguments);
            }

            return stop;
        }()
    }, {
        key: 'publish',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(key, message) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                log.info('publish exchange:%s, key:%s, message ', this._options.exchange, key, message);

                                if (!this._channel) {
                                    _context3.next = 5;
                                    break;
                                }

                                return _context3.abrupt('return', this._channel.publish(this._options.exchange, key, new Buffer(message)));

                            case 5:
                                throw {
                                    code: 503,
                                    name: "MessageQueueNotAvailable",
                                    message: "Message queue channel not available"
                                };

                            case 6:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function publish(_x2, _x3) {
                return _ref3.apply(this, arguments);
            }

            return publish;
        }()
    }]);
    return Publisher;
}();

exports.default = Publisher;