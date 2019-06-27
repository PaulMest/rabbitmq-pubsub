'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var amqp = require('amqplib');
var _ = require('lodash');
var util = require('util');

var log = void 0;

var Subscriber = function () {
    function Subscriber() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var logOptions = arguments[1];
        (0, _classCallCheck3.default)(this, Subscriber);

        log = require('logfilename')(__filename, logOptions);
        if (!options.exchange) {
            throw new Error('exchange parameter missing in options');
        }
        if (!options.queueName) {
            throw new Error('queueName parameter missing in options');
        }
        this._queue;
        this._channel;
        this._options = _.defaults(options, {
            type: 'topic',
            url: 'amqp://localhost'
        });
        log.info('Subscriber options:', util.inspect(this._options));
    }

    (0, _createClass3.default)(Subscriber, [{
        key: 'start',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(onIncomingMessage) {
                var options, connection, result, routingKeys, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, routingKey;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                log.info('start');

                                options = this._options;
                                _context.next = 4;
                                return amqp.connect(options.url);

                            case 4:
                                connection = _context.sent;

                                log.info('createChannel');
                                _context.next = 8;
                                return connection.createChannel();

                            case 8:
                                this._channel = _context.sent;

                                log.info('assertExchange ', options.exchange);
                                _context.next = 12;
                                return this._channel.assertExchange(options.exchange, options.type, { durable: true });

                            case 12:
                                log.info('assertQueue name: ', options.queueName);
                                _context.next = 15;
                                return this._channel.assertQueue(options.queueName, { exclusive: false });

                            case 15:
                                result = _context.sent;


                                this._queue = result.queue;
                                routingKeys = options.routingKeys || [options.queueName];

                                log.info('assertQueue keys ', routingKeys);
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context.prev = 22;
                                _iterator = (0, _getIterator3.default)(routingKeys);

                            case 24:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context.next = 32;
                                    break;
                                }

                                routingKey = _step.value;

                                log.info('bindQueue routingKey ', routingKey);
                                _context.next = 29;
                                return this._channel.bindQueue(this._queue, options.exchange, routingKey);

                            case 29:
                                _iteratorNormalCompletion = true;
                                _context.next = 24;
                                break;

                            case 32:
                                _context.next = 38;
                                break;

                            case 34:
                                _context.prev = 34;
                                _context.t0 = _context['catch'](22);
                                _didIteratorError = true;
                                _iteratorError = _context.t0;

                            case 38:
                                _context.prev = 38;
                                _context.prev = 39;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 41:
                                _context.prev = 41;

                                if (!_didIteratorError) {
                                    _context.next = 44;
                                    break;
                                }

                                throw _iteratorError;

                            case 44:
                                return _context.finish(41);

                            case 45:
                                return _context.finish(38);

                            case 46:

                                log.info('prefetch and consume');
                                this._channel.prefetch(1);
                                _context.next = 50;
                                return this._channel.consume(this._queue, onIncomingMessage.bind(this));

                            case 50:
                                log.info('started');

                            case 51:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[22, 34, 38, 46], [39,, 41, 45]]);
            }));

            function start(_x2) {
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
                                log.warn('stopping but channel was not opened');

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
        key: 'ack',
        value: function ack(message) {
            log.debug('ack');
            this._channel.ack(message);
        }
    }, {
        key: 'nack',
        value: function nack(message) {
            log.debug('nack');
            this._channel.nack(message);
        }
    }, {
        key: 'purgeQueue',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                log.info('purgeQueue ', this._queue);

                                if (!this._channel) {
                                    _context3.next = 7;
                                    break;
                                }

                                _context3.next = 4;
                                return this._channel.purgeQueue(this._queue);

                            case 4:
                                return _context3.abrupt('return', _context3.sent);

                            case 7:
                                log.warn('purgeQueue: channel not opened');

                            case 8:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function purgeQueue() {
                return _ref3.apply(this, arguments);
            }

            return purgeQueue;
        }()
    }]);
    return Subscriber;
}();

exports.default = Subscriber;