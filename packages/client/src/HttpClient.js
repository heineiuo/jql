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

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Client = function Client(options) {
  (0, _classCallCheck3.default)(this, Client);

  _initialiseProps.call(this);

  options = Object.assign({
    beforeFetch: this.beforeFetch
  }, options);
  this.url = options.url;
  this.beforeFetch = options.beforeFetch;
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.beforeFetch = function (options) {
    return new Promise(function (resolve) {
      return resolve(options);
    });
  };

  this.changeUrl = function (url) {
    _this.url = url;
  };

  this.query = function (fn, args) {

    return new Promise(function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
        var fnText, fetchOptions, res;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                fnText = '(' + String(fn) + ')';
                _context.next = 4;
                return _this.beforeFetch({
                  method: 'POST',
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ __fn: fnText, __params: args })
                });

              case 4:
                fetchOptions = _context.sent;
                _context.next = 7;
                return (0, _isomorphicFetch2.default)(_this.url, fetchOptions);

              case 7:
                res = _context.sent;

                resolve(res);
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context['catch'](0);

                reject(_context.t0);

              case 14:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this, [[0, 11]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
  };
};

exports.default = Client;