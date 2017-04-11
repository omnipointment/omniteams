(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    DAY: 24 * 60 * 60 * 1000, // one day in milliseconds
    MINUTE: 60 * 1000, // one minute in milliseconds
    HOUR: 60 * 60 * 1000, // one hour in milliseconds
    MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ISO_REGEX: new RegExp(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),

    currentTimeZoneAbbreviation: function currentTimeZoneAbbreviation() {
        // http://stackoverflow.com/a/12496442/5136076
        var now = new Date().toString();
        var tz = now.indexOf('(') > -1 ? now.match(/\([^\)]+\)/)[0].slice(1, -1) : now.match(/[A-Z]{3,4}/)[0];
        if (tz === 'GMT' && /(GMT\W*\d{4})/.test(now)) {
            tz = RegExp.$1;
        }
        return tz;
    }(),

    timeCompareDesc: function timeCompareDesc(one, two) {
        if (!one && !two) {
            return 0;
        } else if (!one || !two) {
            return -1;
        }
        var hour1 = one.getHours();
        var hour2 = two.getHours();
        if (hour1 < hour2) {
            return 1;
        }
        if (hour1 > hour2) {
            return -1;
        }
        var min1 = one.getMinutes();
        var min2 = two.getMinutes();
        if (min1 < min2) {
            return 1;
        }
        if (min1 > min2) {
            return -1;
        }
        return 0;
    },
    timeCompareAsc: function timeCompareAsc(one, two) {
        if (!one && !two) {
            return 0;
        } else if (!one || !two) {
            return -1;
        }
        var hour1 = one.getHours();
        var hour2 = two.getHours();
        if (hour1 < hour2) {
            return -1;
        }
        if (hour1 > hour2) {
            return 1;
        }
        var min1 = one.getMinutes();
        var min2 = two.getMinutes();
        if (min1 < min2) {
            return -1;
        }
        if (min1 > min2) {
            return 1;
        }
        return 0;
    },
    dateCompareDesc: function dateCompareDesc(one, two) {
        if (!one && !two) {
            return 0;
        } else if (!one || !two) {
            return -1;
        }
        var time1 = one.getTime();
        var time2 = two.getTime();
        if (time1 < time2) {
            return 1;
        }
        if (time1 > time2) {
            return -1;
        }
        return 0;
    },
    dateCompareAsc: function dateCompareAsc(one, two) {
        if (!one && !two) {
            return 0;
        } else if (!one || !two) {
            return -1;
        }
        var time1 = one.getTime();
        var time2 = two.getTime();
        if (time1 < time2) {
            return -1;
        }
        if (time1 > time2) {
            return 1;
        }
        return 0;
    },
    dateFilterUnique: function dateFilterUnique(el, index, arr) {
        var dup = true;
        for (var i = index + 1; i < arr.length; i++) {
            if (arr[i].getTime() === el.getTime()) {
                dup = false;
                break;
            }
        }
        return dup;
    },
    getHistoricDate: function getHistoricDate(date) {
        return date.getFullYear() * 365 + this.dayOfYear(date);
    },


    // http://stackoverflow.com/a/1185804/5136076
    monthDays: function monthDays(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    },


    // http://stackoverflow.com/a/26426761/5136076
    dayOfYear: function dayOfYear(date) {
        var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        var month = date.getMonth();
        var dayNum = date.getDate();
        var dayOfYear = dayCount[month] + dayNum;
        if (month > 1 && this.isLeapYear(date)) {
            dayOfYear++;
        }
        return dayOfYear;
    },


    // http://stackoverflow.com/a/16353241/5136076
    isLeapYear: function isLeapYear(date) {
        var year = date.getFullYear();
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    },
    combine: function combine(yearMonthDate, hourMinutes) {
        return new Date(yearMonthDate.getFullYear(), yearMonthDate.getMonth(), yearMonthDate.getDate(), hourMinutes.getHours(), hourMinutes.getMinutes());
    },


    // Return only the year-month-date components of a date
    getYearMonthDate: function getYearMonthDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    },


    // Return only the hours-minutes components of a date
    getHoursMinutes: function getHoursMinutes(date) {
        return new Date(0, 0, 0, date.getHours(), date.getMinutes());
    },


    // Return the time (in milliseconds) between two dates
    timeBetween: function timeBetween(one, two) {
        return two.getTime() - one.getTime();
    },
    getCorners: function getCorners(time1, time2) {
        var date1time1 = this.combine(time1, time1);
        var date1time2 = this.combine(time1, time2);
        var date2time1 = this.combine(time2, time1);
        var date2time2 = this.combine(time2, time2);
        var list = [date1time1, date1time2, date2time1, date2time2];
        list.sort(this.dateCompareAsc);
        return list;
    },
    generateTimeListFromCorners: function generateTimeListFromCorners(corners, minInterval) {
        var timeList = [];
        var topLeft = corners[0].getTime();
        var bottomLeft = corners[1].getTime();
        var topRight = corners[2].getTime();
        var bottomRight = corners[3].getTime();

        var head = topLeft;
        var currentLimit = bottomLeft;
        var limit = bottomRight;

        // Account for a single column
        if (topLeft === bottomLeft && topRight === bottomRight && topLeft !== topRight && Math.abs(topLeft - topRight) < this.DAY) {
            currentLimit = bottomRight;
        }

        while (currentLimit <= limit) {
            var current = head;
            while (current <= currentLimit) {
                timeList.push(new Date(current));
                current += this.MINUTE * minInterval;
            }
            currentLimit += this.DAY;
            head += this.DAY;
        }

        return timeList.filter(this.dateFilterUnique);
    },
    generateTimeBox: function generateTimeBox(time1, time2, interval) {
        var corners = this.getCorners(time1, time2);
        var box = this.generateTimeListFromCorners(corners, interval);
        return box;
    },
    getAllDaysInMonth: function getAllDaysInMonth(month, year) {
        var counter = 0;
        var list = [];
        var start = new Date(year, month, 1);
        var current = start;
        while (current.getMonth() === start.getMonth() && counter < 40) {
            list.push(current);
            current = new Date(current.getTime() + this.DAY);
            // Daylight savings time adjustment
            if (current.getHours() === 23) {
                current = new Date(current.getTime() + this.HOUR);
            } else if (current.getHours() === 1) {
                current = new Date(current.getTime() - this.HOUR);
            }
            counter++;
        }
        return list;
    }
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    validateMid: function validateMid(mid) {
        if (typeof mid !== 'string') {
            return false;
        }
        var isEmpty = mid.length === 0;
        var isValid = mid.match(/^[a-z0-9]+(-[a-z0-9]+)*$/g);
        if (isEmpty || isValid) {
            return true;
        }
        return false;
    },
    formatMid: function formatMid(value) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var ret = value.trim().toLowerCase()
        // Replace groups of spaces with hyphens
        .replace(/\s+/g, '-')
        // Replace groups of hyphens with a single hyphen
        .replace(/\-+/g, '-')
        // Remove everything that isn't a hyphen or alphanumeric
        .replace(/[^a-z0-9\-]/g, '');
        if (options.trimHyphens !== false) {
            // Remove leading or trailing hyphens
            ret = ret.replace(/(^\-)|(\-$)/g, '');
        }
        return ret;
    },


    // http://stackoverflow.com/a/12502559/5136076
    generateRandomMid: function generateRandomMid() {
        // TODO: Might generate collisions at around 10 million iterations
        var mid = this.formatMid(Math.random().toString(36).substr(2, 12));
        return mid.length === 12 ? mid : this.generateRandomMid();
    }
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _tetherShepherd = require('tether-shepherd');

var _tetherShepherd2 = _interopRequireDefault(_tetherShepherd);

var _ampersandEvents = require('ampersand-events');

var _ampersandEvents2 = _interopRequireDefault(_ampersandEvents);

var _defer = require('lodash/defer');

var _defer2 = _interopRequireDefault(_defer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createTour = new _tetherShepherd2.default.Tour({
    defaults: {
        classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text u-hideSm',
        scrollTo: false,
        showCancelLink: true,
        constraints: [{
            pin: false
        }]
    }
});

createTour.addStep('step2', {
    text: 'Name your meeting. This will help your team members identify it.',
    attachTo: '[data-hook="title"] top',
    advanceOn: '[data-hook="meeting-name"] input',
    buttons: [{
        text: 'Skip this guide',
        classes: 'shepherd-button-link',
        action: function action() {
            return createTour.cancel();
        }
    }],
    when: {
        'before-show': function beforeShow() {
            document.querySelector('[data-hook="meeting-name"]').focus();
        }
    }
});

createTour.addStep('doneName', {
    text: 'Click "Next" when you have named your meeting.',
    attachTo: '[data-hook="title"] top',
    buttons: [{
        text: 'Next',
        action: createTour.next
    }]
});

createTour.addStep('step3', {
    text: 'Pick the dates you want to include in your meeting request. They do not have to be consecutive.',
    attachTo: '[data-hook="pick-dates"] top',
    advanceOn: '.calendar__cell click',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: createTour.back
    }],
    when: {
        'before-show': function beforeShow() {
            var selector = '[data-hook="pick-dates"] .toggle:not(.is-expanded) [data-hook="toggle"]';
            var el = document.querySelector(selector);
            if (el) {
                el.click();
            }
        }
    }
});

createTour.addStep('doneDates', {
    text: 'Click "Next" when you are done choosing your dates.',
    attachTo: '[data-hook="pick-dates"] top',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: createTour.back
    }, {
        text: 'Next',
        action: createTour.next
    }],
    when: {
        hide: function hide() {
            var el = document.querySelector('[data-hook="pick-dates"] .toggle.is-expanded [data-hook="toggle"]');
            if (el) {
                el.click();
            }
        }
    }
});

createTour.addStep('step4', {
    text: 'Pick the times of each day you want to check for availability.',
    attachTo: '[data-hook="pick-times"] top',
    advanceOn: '[data-hook="picker"] label click',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: createTour.back
    }],
    when: {
        'before-show': function beforeShow() {
            var selector = '[data-hook="pick-times"] .toggle:not(.is-expanded) [data-hook="toggle"]';
            var el = document.querySelector(selector);
            if (el) {
                el.click();
            }
        },
        hide: function hide() {
            var selector = '[data-hook="pick-times"] .toggle.is-expanded [data-hook="toggle"]';
            var el = document.querySelector(selector);
            if (el) {
                el.click();
            }
        }
    }
});

createTour.addStep('doneTimes', {
    text: 'Click "Finish" when you are done choosing your times.',
    attachTo: '[data-hook="pick-times"] top',
    buttons: [{
        text: 'Finish',
        action: function action() {
            document.querySelector('[data-hook="confirm"]').click();
        }
    }],
    when: {
        hide: function hide() {
            var el = document.querySelector('[data-hook="pick-dates"] .toggle.is-expanded [data-hook="toggle"]');
            if (el) {
                el.click();
            }
        }
    }
});

var rsvpTour = new _tetherShepherd2.default.Tour({
    defaults: {
        classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text u-hideSm',
        scrollTo: false,
        showCancelLink: true
    }
});

rsvpTour.addStep('time grid', {
    // eslint-disable-next-line max-len
    text: 'Welcome to an Omnipointment meeting! Here is the timegrid. It shows how many people are available at each time.',
    attachTo: '[data-hook="grid-columns"] top',
    classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text u-hideSm',
    buttons: [{
        text: 'Skip this guide',
        classes: 'shepherd-button-link',
        action: function action() {
            return rsvpTour.cancel();
        }
    }, {
        text: 'Next',
        action: rsvpTour.next
    }]
});

rsvpTour.addStep('people', {
    text: 'Click on a slot in the timegrid.',
    attachTo: '[data-hook="grid-body"] right',
    advanceOn: {
        selector: '.timegrid__slotData, .timegrid__slot',
        event: 'click'
    },
    buttons: [{
        text: '',
        classes: 'is-hidden'
    }]
});

rsvpTour.addStep('freebusy', {
    text: 'See when individual members of your team are free and busy here.',
    attachTo: '[data-hook="gridData"] top',
    buttons: [{
        text: 'Next',
        action: rsvpTour.next
    }]
});

rsvpTour.addStep('filter', {
    text: 'Use the filter tab to filter members in and out of the timegrid.',
    attachTo: '[data-hook="gridData"] top',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: rsvpTour.back
    }, {
        text: 'Next',
        action: rsvpTour.next
    }],
    when: {
        'before-show': function beforeShow() {
            var selector = '.nav__tab[data-index="1"]';
            var el = document.querySelector(selector);
            if (el) {
                el.click();
            }
        }
    }
});

rsvpTour.addStep('rsvp', {
    text: '"Respond!" to meetings to fill out your availability.',
    attachTo: '[data-hook="rsvp"] bottom',
    advanceOn: '[data-hook="rsvp"] click',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: rsvpTour.back
    }, {
        text: 'Finish',
        classes: 'shepherd-button-secondary',
        action: rsvpTour.next
    }]
});

var respondTour = new _tetherShepherd2.default.Tour({
    defaults: {
        classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text u-hideSm',
        scrollTo: false,
        showCancelLink: true
    }
});

respondTour.addStep('time grid', {
    text: 'Click (and drag!) to fill out your availability.',
    attachTo: '[data-hook="grid"] top',
    buttons: [{
        text: 'Done',
        action: respondTour.next
    }]
});

respondTour.addStep('time grid', {
    text: 'Now save your response.',
    attachTo: '[data-hook="save"] right',
    advanceOn: '[data-hook="save"] click',
    buttons: [{
        text: '',
        classes: 'is-hidden'
    }]
});

var finalizeTour = new _tetherShepherd2.default.Tour({
    defaults: {
        classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text u-hideSm',
        scrollTo: false,
        showCancelLink: true
    }
});

finalizeTour.addStep('finalize grid', {
    text: 'Mark times (click or drag) on the grid to schedule a meeting during those slots.',
    attachTo: '[data-hook="grid-body"] top',
    buttons: [{
        text: 'Skip this guide',
        classes: 'shepherd-button-link',
        action: function action() {
            return finalizeTour.cancel();
        }
    }, {
        text: 'OK',
        action: finalizeTour.next
    }]
});

finalizeTour.addStep('finalize grid data', {
    text: 'You can still see who\'s free, busy, or filter your team to help you schedule.',
    attachTo: '[data-hook="gridData"] left',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: finalizeTour.back
    }, {
        text: 'OK',
        action: finalizeTour.next
    }]
});

finalizeTour.addStep('finalize confirm', {
    text: 'Then confirm your selection, and you can specify a location and send email invites to your team.',
    attachTo: '[data-hook="finalize"] bottom',
    buttons: [{
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: finalizeTour.back
    }, {
        text: 'Got it!',
        action: finalizeTour.next
    }]
});

// An overlay that will dim the page while a tour is going on
var overlay = document.createElement('div');
overlay.classList.add('overlay');

_tetherShepherd2.default.on('start', function () {
    if (!overlay.parentNode) {
        (function () {
            var lastKnownScrollTop = 0;
            var page = document.getElementById('page');
            page.appendChild(overlay);
            page.addEventListener('scroll', function () {
                lastKnownScrollTop = page.scrollTop;
            });
            var updateOverlayPosition = function updateOverlayPosition() {
                requestAnimationFrame(updateOverlayPosition);
                overlay.style.top = lastKnownScrollTop + 'px';
            };
            updateOverlayPosition();
        })();
    }
    (0, _defer2.default)(function () {
        overlay.classList.remove('is-hidden');
        overlay.style.opacity = '1';
    });
});
var removeOverlay = function removeOverlay() {
    overlay.style.opacity = '0';
    overlay.classList.add('is-hidden');
};
_tetherShepherd2.default.on('complete', removeOverlay);
_tetherShepherd2.default.on('cancel', removeOverlay);

// Extend the shepherd interface we've created with ampersand-events
var shepherd = {
    create: createTour,
    meeting: rsvpTour,
    respond: respondTour,
    finalize: finalizeTour
};

_ampersandEvents2.default.createEmitter(shepherd);

(0, _defer2.default)(function () {
    shepherd.listenTo(_ampersandApp2.default.router, 'page', function () {
        // close all open shepherd windows
        if (_tetherShepherd2.default.activeTour) {
            _tetherShepherd2.default.activeTour.cancel();
        }
    });
});

exports.default = shepherd;

},{"ampersand-app":92,"ampersand-events":99,"lodash/defer":316,"tether-shepherd":undefined}],4:[function(require,module,exports){
'use strict';

require('polyfills');

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _superagentDefaults = require('superagent-defaults');

var _superagentDefaults2 = _interopRequireDefault(_superagentDefaults);

var _main = require('./views/main');

var _main2 = _interopRequireDefault(_main);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _user = require('./models/user');

var _user2 = _interopRequireDefault(_user);

var _defer = require('lodash/defer');

var _defer2 = _interopRequireDefault(_defer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Vendors

// Prometheus (script sets window.Prometheus, doesn't export anything... I'll fix that in the next release)
// eslint-disable-next-line import/no-unresolved
require('prometheusjs');

// App singleton


_ampersandApp2.default.extend({
    moment: require('moment'),
    firebase: require('firebase'),
    vex: require('vex-js'),
    prometheus: Prometheus({
        apiKey: 'AIzaSyDzqDG7BigYHeePB5U74VgVWlIRgjEyV3s',
        authDomain: 'omnipointment.firebaseapp.com',
        databaseURL: 'https://omnipointment.firebaseio.com',
        storageBucket: 'project-1919171548079707132.appspot.com',
        icon: 'https://www.omnipointment.com/img/logo.png',
        noScreenshots: true
    })
});
_ampersandApp2.default.vex.registerPlugin(require('vex-dialog'));
_ampersandApp2.default.vex.defaultOptions.className = 'vex-theme-wireframe';

// Superagent

_ampersandApp2.default.extend({ request: (0, _superagentDefaults2.default)() });
_ampersandApp2.default.request
// Default to JSON
.set('Content-Type', 'application/json').accept('application/json');

// Global 401 Unauthorized handler to tell the user to log in
var showingDialog = false;
var open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function openListener() {
    var _this = this;

    this.addEventListener('load', function () {
        if (_this.status === 401) {
            var msg = '<p>You are not logged in!' + ' Please <a href="/login">login</a>.</p>';
            if (!showingDialog) {
                showingDialog = true;
                _ampersandApp2.default.vex.open({
                    unsafeContent: msg,
                    showCloseButton: false,
                    escapeButtonCloses: false,
                    overlayClosesOnClick: false
                });
            }
        }
    });
    open.apply(this, arguments);
};

// Memes
console.info('What makes working at Omnipointment better than say, Google? jobs@omnipointment.com');

// Setup the app


_ampersandApp2.default.extend({
    me: new _user2.default(),
    router: new _router2.default(),

    blastoff: function blastoff() {
        var mainView = new _main2.default({
            el: document.body,
            model: _ampersandApp2.default.me
        });
        mainView.render();

        this.router.history.start({ pushState: true });
    },
    navigate: function navigate(page, trigger) {
        var url = page.charAt(0) === '/' ? page.slice(1) : page;
        this.router.history.navigate(url, { trigger: trigger !== undefined && trigger !== null ? trigger : true });
    }
});

_ampersandApp2.default.me.getAuthenticated().then(function () {
    var campaign = sessionStorage.getItem('prometheus_landing_page');
    if (campaign) {
        _ampersandApp2.default.prometheus.save({
            type: 'LANDING_PAGE_CONVERSION',
            campaign: campaign
        });
        sessionStorage.removeItem('prometheus_landing_page');
    }

    // Check for and prompt for empty emails
    if (_ampersandApp2.default.me.email === null || _ampersandApp2.default.me.email === undefined) {
        (0, _defer2.default)(function () {
            var m = 'Make sure your email is up to date to receive updates and goodies from the Omnipointment team!';
            _ampersandApp2.default.vex.dialog.prompt({
                message: m,
                placeholder: 'you@bomb.com',
                showCloseButton: false,
                escapeButtonCloses: false,
                overlayClosesOnClick: false,
                buttons: [Object.assign({}, _ampersandApp2.default.vex.dialog.buttons.YES, { text: 'Save' }), Object.assign({}, _ampersandApp2.default.vex.dialog.buttons.NO, { text: 'No thanks' })],
                callback: function callback(email) {
                    if (email && email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
                        _ampersandApp2.default.me.saveCustomEmail(email).then(function () {
                            _ampersandApp2.default.vex.dialog.alert('Email updated! Thanks!');
                        }).catch(function (err) {
                            console.error(err);
                            _ampersandApp2.default.vex.dialog.alert('Something went wrong!');
                        });
                    }
                }
            });
        });
    }

    // Start the app
    _ampersandApp2.default.blastoff();
});

},{"./models/user":18,"./router":34,"./views/main":75,"ampersand-app":92,"firebase":undefined,"lodash/defer":316,"moment":undefined,"polyfills":undefined,"prometheusjs":undefined,"superagent-defaults":383,"vex-dialog":undefined,"vex-js":undefined}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _ampersandModel = require('ampersand-model');

var _ampersandModel2 = _interopRequireDefault(_ampersandModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _ampersandModel2.default.extend({
    initialize: function initialize() {
        var _this = this;

        // Proxy children's change events as a generic change in the child property
        var children = this._children;

        var _loop = function _loop(childName) {
            if (children.hasOwnProperty(childName)) {
                _this[childName].on('change', function () {
                    _this.trigger('change:' + childName, _this);
                    _this.trigger('change', _this);
                });
            }
        };

        for (var childName in children) {
            _loop(childName);
        }
        // Proxy collection events using debounce as a generic change in the child property
        var collections = this._collections;

        var _loop2 = function _loop2(collectionName) {
            if (collections.hasOwnProperty(collectionName)) {
                _this[collectionName].on('add remove change', (0, _debounce2.default)(function () {
                    _this.trigger('change:' + collectionName, _this);
                }, 10));
            }
        };

        for (var collectionName in collections) {
            _loop2(collectionName);
        }
    }

    // 6/21/16 AN ATTEMPT WAS MADE. For the base model, it's impossible to replace `this` reference,
    // so caching on the model itself, as far as replacing the reference goes, isn't possible.
    // fetch(options, force) {
    //     let success = options.success;
    //     if (!force) {
    //         const existing = app.registry.lookup('omnimodel', this.getId());
    //         if (existing) {
    //             console.count('cache hit');
    //             // TODO: maybe don't trigger these?
    //             existing.trigger('request');
    //             existing.trigger('sync');
    //             if (success) {
    //                 success(existing, 'cached', options);
    //             }
    //             return;
    //         }
    //     }
    //     // Otherwise override the success callback to store the fetched model
    //     const originalSuccess = success;
    //     options.success = function success(model) {
    //         const oldType = model.type;
    //         model.type = 'omnimodel';
    //         app.registry.store(model);
    //         model.type = oldType;
    //         if (originalSuccess) {
    //             originalSuccess.apply(null, arguments);
    //         }
    //     };
    //     return Model.prototype.fetch.call(this, options);
    // }

});

},{"ampersand-model":102,"lodash/debounce":314}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandCollection = require('ampersand-collection');

var _ampersandCollection2 = _interopRequireDefault(_ampersandCollection);

var _ampersandCollectionRestMixin = require('ampersand-collection-rest-mixin');

var _ampersandCollectionRestMixin2 = _interopRequireDefault(_ampersandCollectionRestMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _ampersandCollection2.default.extend(_ampersandCollectionRestMixin2.default, {
    url: function url() {
        return this.parent ? this.parent.url() + '/' + this.resourceName : '/api/' + this.resourceName;
    },
    save: function save(options) {
        return this.sync('update', this, options);
    }

    // 6/21/16 AN ATTEMPT WAS MADE. Replacing references in the collection actually worked,
    // for a little while. Then the .collection references were getting messed up and
    // the indexes were getting out of sync. Woops.
    // fetch(options, force) {
    //     options = options || {};
    //     let success = options.success;
    //     const originalSuccess = success;
    //     options.success = function success(collection) {
    //         const toCache = [];
    //         if (!force) {
    //             const toAdd = [];
    //             collection.forEach(model => {
    //                 const existing = app.registry.lookup('omnimodel', model.getId());
    //                 if (existing) {
    //                     console.log('collection cache hit', existing);
    //                     // Replace the reference!
    //                     const addOpts = {};
    //                     if (this === model.collection) {
    //                         addOpts.at = this.indexOf(model);
    //                     }
    //                     model.collection.remove(model);
    //                     toAdd.push(existing);
    //                     // existing.trigger('change');
    //                 } else {
    //                     toCache.push(model);
    //                 }
    //             });
    //             toAdd.forEach(this.add.bind(this));
    //         }
    //         toCache.forEach(model => {
    //             const oldType = model.type;
    //             model.type = 'omnimodel';
    //             console.log('storing collection model');
    //             app.registry.store(model);
    //             model.type = oldType;
    //         });
    //         if (originalSuccess) {
    //             originalSuccess.apply(null, arguments);
    //         }
    //     }.bind(this);
    //     return RestMixin.fetch.call(this, options);
    // }

});

},{"ampersand-collection":96,"ampersand-collection-rest-mixin":94}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseCollection = require('./baseCollection');

var _baseCollection2 = _interopRequireDefault(_baseCollection);

var _meeting = require('../meeting');

var _meeting2 = _interopRequireDefault(_meeting);

var _dateTimeHelper = require('../../helpers/dateTimeHelper');

var _dateTimeHelper2 = _interopRequireDefault(_dateTimeHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _baseCollection2.default.extend({
    // TODO: circular references prevent Browserify from defining Meeting
    // on its first pass through this file. What gives?

    model: function model(attr, options) {
        return new _meeting2.default(attr, options);
    },
    isModel: function isModel(model) {
        return model instanceof _meeting2.default;
    },

    mainIndex: 'mid',
    resourceName: 'meetings',
    comparator: function comparator(one, two) {
        return _dateTimeHelper2.default.dateCompareAsc(one.updatedAt, two.updatedAt);
    }
});

},{"../../helpers/dateTimeHelper":1,"../meeting":14,"./baseCollection":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _baseCollection = require('./baseCollection');

var _baseCollection2 = _interopRequireDefault(_baseCollection);

var _dateTimeHelper = require('../../helpers/dateTimeHelper');

var _dateTimeHelper2 = _interopRequireDefault(_dateTimeHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MeetingSlot = _base2.default.extend({
    props: {
        time: 'date',
        disabled: 'boolean',
        finalized: 'boolean',
        start: 'date',
        location: 'string',
        purpose: 'string',
        end: 'date',
        finalizedUsers: 'array'
    },

    session: {
        selected: 'boolean',
        first: 'boolean',
        middle: 'boolean',
        last: 'boolean'
    },

    getAttributes: function getAttributes(options, raw) {
        return _base2.default.prototype.getAttributes.call(this, Object.assign(options, { session: true }), raw);
    },


    derived: {
        freeUsers: {
            cache: false,
            fn: function fn() {
                // this.collection.parent is the meeting model
                return this.collection.parent.getUsersFreeAtTime(this.time);
            }
        },

        busyUsers: {
            cache: false,
            fn: function fn() {
                // this.collection.parent is the meeting model
                return this.collection.parent.getUsersBusyAtTime(this.time);
            }
        },

        // the start time of this finalize range, inclusive
        startTime: {
            deps: ['start'],
            cache: false,
            fn: function fn() {
                return this.start;
            }
        },

        // the end time of this finalize range, inclusive
        endTime: {
            deps: ['end'],
            cache: false,
            fn: function fn() {
                return new Date(this.end.getTime() + this.collection.parent.slotDuration * _dateTimeHelper2.default.MINUTE);
            }
        },

        finalizedTimeString: {
            deps: ['startTime', 'endTime'],
            cache: false,
            fn: function fn() {
                if (!this.finalized) {
                    return '';
                }
                return _ampersandApp2.default.moment(this.startTime).format('M/D') + ' ' + ('from ' + _ampersandApp2.default.moment(this.startTime).format('h:mm A') + ' ') + ('to ' + _ampersandApp2.default.moment(this.endTime).format('h:mm A'));
            }
        },

        // TODO: should anyone who accesses these next few properties rather just go through the meeting model?

        finalizedFreeUsers: {
            deps: ['finalizedUsers', 'startTime', 'end'],
            cache: false,
            fn: function fn() {
                if (!this.finalized) {
                    return [];
                }
                return this.collection.parent.getUsersFreeAtTimeRange(this.startTime, this.end);
            }
        },

        finalizedPartialFreeUsers: {
            deps: ['finalizedUsers', 'startTime', 'end'],
            cache: false,
            fn: function fn() {
                if (!this.finalized) {
                    return [];
                }
                return this.collection.parent.getUsersPartiallyFreeAtTimeRange(this.startTime, this.end);
            }
        },

        finalizedBusyUsers: {
            deps: ['finalizedUsers', 'startTime', 'end'],
            cache: false,
            fn: function fn() {
                if (!this.finalized) {
                    return [];
                }
                return this.collection.parent.getUsersBusyAtTimeRange(this.startTime, this.end);
            }
        }
    }
});

exports.default = _baseCollection2.default.extend({
    model: MeetingSlot,
    indexes: ['time'],
    comparator: function comparator(one, two) {
        return _dateTimeHelper2.default.dateCompareAsc(one.time, two.time);
    },
    setSelected: function setSelected(model) {
        this.forEach(function (slot) {
            slot.selected = false;
        });
        model.selected = true;
    },
    getSelected: function getSelected() {
        return this.filter(function (slot) {
            return slot.selected;
        })[0];
    },


    // Add MeetingSlots at the specified time, for each date
    addTime: function addTime(timeDate) {
        var _this = this;

        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var time = _dateTimeHelper2.default.getHoursMinutes(timeDate);
        var currentTimes = this.getTimes();
        if (currentTimes.map(function (date) {
            return date.getTime();
        }).indexOf(time.getTime()) !== -1) {
            return;
        }
        this.getDates().forEach(function (date) {
            _this.add(Object.assign({
                time: _dateTimeHelper2.default.combine(date, time)
            }, options));
        });
    },
    addTimes: function addTimes(dates) {
        var _this2 = this;

        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        dates.forEach(function (date) {
            return _this2.addTime(date, options);
        });
    },
    addDate: function addDate(dateDate) {
        var _this3 = this;

        var day = _dateTimeHelper2.default.getYearMonthDate(dateDate);
        var currentDates = this.getDates();
        if (currentDates.map(function (date) {
            return date.getTime();
        }).indexOf(day.getTime()) !== -1) {
            return;
        }
        this.getTimes().forEach(function (time) {
            _this3.add({
                time: _dateTimeHelper2.default.combine(day, time)
            });
        });
    },
    addDates: function addDates(dates) {
        var _this4 = this;

        dates.forEach(function (date) {
            return _this4.addDate(date);
        });
    },
    setDates: function setDates(dates) {
        var _this5 = this;

        var toSet = [];
        dates.forEach(function (date) {
            _this5.getTimes().forEach(function (time) {
                toSet.push({
                    time: _dateTimeHelper2.default.combine(date, time)
                });
            });
        });
        this.reset();
        this.add(toSet);
    },


    // Remove all MeetingSlots from this collection that are at a specific hour (hour:minute)
    removeTime: function removeTime(date) {
        var time = _dateTimeHelper2.default.getHoursMinutes(date).getTime();
        var toRemove = this.filter(function (slot) {
            return _dateTimeHelper2.default.getHoursMinutes(slot.time).getTime() === time;
        });
        return toRemove.length !== this.length ? this.remove(toRemove) : [];
    },


    // Remove all MeetingSlots from this collection that are at a specific date (year-month-date)
    removeDate: function removeDate(date) {
        var dateTime = _dateTimeHelper2.default.getYearMonthDate(date).getTime();
        var toRemove = this.filter(function (slot) {
            return _dateTimeHelper2.default.getYearMonthDate(slot.time).getTime() === dateTime;
        });
        return toRemove.length !== this.length ? this.remove(toRemove) : [];
    },
    getDates: function getDates() {
        // Gather all of the dates from the time options
        var dates = this.map(function (slot) {
            return _dateTimeHelper2.default.getYearMonthDate(slot.time);
        });
        // Filter duplicates
        dates = dates.filter(_dateTimeHelper2.default.dateFilterUnique);
        // Sort in chronological order
        dates.sort(_dateTimeHelper2.default.dateCompareAsc);
        return dates;
    },
    getTimes: function getTimes() {
        // Gather all of the times from the time options
        var times = this.map(function (slot) {
            return _dateTimeHelper2.default.getHoursMinutes(slot.time);
        });
        // Filter duplicates
        times = times.filter(_dateTimeHelper2.default.dateFilterUnique);
        // Sort in chronological order
        times.sort(_dateTimeHelper2.default.timeCompareAsc);
        return times;
    }
});

},{"../../helpers/dateTimeHelper":1,"../base":5,"./baseCollection":6,"ampersand-app":92}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseCollection = require('./baseCollection');

var _baseCollection2 = _interopRequireDefault(_baseCollection);

var _rating = require('../rating');

var _rating2 = _interopRequireDefault(_rating);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _baseCollection2.default.extend({
    // TODO: something something circular references

    model: function model(attr, options) {
        return new _rating2.default(attr, options);
    },
    isModel: function isModel(model) {
        return model instanceof _rating2.default;
    },

    resourceName: 'ratings'
});

},{"../rating":15,"./baseCollection":6}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseCollection = require('./baseCollection');

var _baseCollection2 = _interopRequireDefault(_baseCollection);

var _timeRange = require('../timeRange');

var _timeRange2 = _interopRequireDefault(_timeRange);

var _dateTimeHelper = require('../../helpers/dateTimeHelper');

var _dateTimeHelper2 = _interopRequireDefault(_dateTimeHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _baseCollection2.default.extend({
    model: _timeRange2.default,
    comparator: function comparator(one, two) {
        return _dateTimeHelper2.default.dateCompareAsc(one.start, two.start);
    },
    merge: function merge(other) {
        this.add(other);
        this._merge();
        return this;
    },
    splice: function splice(other) {
        for (var i = 0; i < this.length; i++) {
            var curr = this.at(i);
            // Case 1: start time and end time are same as splice (or contained entirely within splice)
            //  - remove whole range
            if (other.start.getTime() <= curr.start.getTime() && curr.end.getTime() <= other.end.getTime()) {
                this.remove(curr);
                continue;
            }
            // Case 2: end time is after the start of the splice but start time is before
            //  - set the end time to the start of the splice
            if (other.start.getTime() <= curr.end.getTime() && curr.start.getTime() <= other.start.getTime()) {
                other.end = curr.start;
                continue;
            }
            // Case 3: start time is before the end of the splice but end time is after
            //  - set the start time to the end of the splice
            if (curr.start.getTime() <= other.end.getTime() && other.end.getTime() <= curr.end.getTime()) {
                curr.start = other.end;
                continue;
            }
        }
        return this;
    },
    _merge: function _merge() {
        for (var i = 0; i < this.length - 1; i++) {
            var curr = this.at(i);
            var next = this.at(i + 1);
            if (next.start.getTime() <= curr.end.getTime()) {
                var endDate = next.end.getTime() >= curr.end.getTime() ? next.end : curr.end;
                curr.end = endDate;
                this.remove(next);
                i--;
            }
        }
    }
});

},{"../../helpers/dateTimeHelper":1,"../timeRange":16,"./baseCollection":6}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseCollection = require('./baseCollection');

var _baseCollection2 = _interopRequireDefault(_baseCollection);

var _timeslot = require('../timeslot');

var _timeslot2 = _interopRequireDefault(_timeslot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _baseCollection2.default.extend({
    model: _timeslot2.default,
    mainIndex: 'time',
    resourceName: 'timeslots',

    initialize: function initialize() {
        _baseCollection2.default.prototype.initialize.apply(this, arguments);
        this._fetchedMids = {};
    },


    // TODO: Optimize `save` calls by only saving those that changed

    fetchByMid: function fetchByMid(mid) {
        var _this = this;

        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        if (!this._fetchedMids[mid] || options.force) {
            (function () {
                _this._fetchedMids[mid] = true;
                if (!_this._oldUrlFn) {
                    _this._oldUrlFn = _this.url;
                }
                var oldUrl = _this._oldUrlFn && _this._oldUrlFn() || _this.url();
                _this.url = function () {
                    return oldUrl + '/' + mid;
                };
                var cleanup = function cleanup() {
                    if (_this._oldUrlFn) {
                        _this.url = _this._oldUrlFn;
                        delete _this._oldUrlFn;
                    }
                };
                _this.fetch({
                    remove: false,
                    success: function success(coll) {
                        // TODO: For some reason the references get weird...
                        coll.forEach(function (model) {
                            coll._removeReference(model);
                            coll._addReference(model);
                        });
                        cleanup();
                        coll.trigger('change');
                        if (options.success) {
                            options.success(coll);
                        }
                    },
                    error: function error() {
                        cleanup();
                        if (options.error) {
                            options.error();
                        }
                    }
                });
            })();
        } else {
            this.trigger('change');
            if (options.success) {
                options.success(this);
            }
        }
    }
});

},{"../timeslot":17,"./baseCollection":6}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseCollection = require('./baseCollection');

var _baseCollection2 = _interopRequireDefault(_baseCollection);

var _user = require('../user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _baseCollection2.default.extend({
    model: _user2.default,
    resourceName: 'users',

    serialize: function serialize() {
        return this.map(function (user) {
            return user._id;
        });
    }
});

},{"../user":18,"./baseCollection":6}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    props: {
        dates: {
            type: 'array',
            required: false,
            default: function _default() {
                return [];
            },
            test: function test(val) {
                for (var i = 0; i < val.length; i++) {
                    if (!(val[i] instanceof Date)) {
                        return 'Must be an array of Date objects.';
                    }
                }
                return false;
            }
        }
    },

    derived: {
        length: {
            cache: false,
            fn: function fn() {
                return this.dates.length;
            }
        }
    },

    initialize: function initialize(options) {
        var _this = this;

        // Setup the index
        this._index = {};
        if (options && options.dates) {
            options.dates.forEach(function (date) {
                _this._index[date] = {};
            });
        }
    },
    add: function add(date) {
        var dates = (0, _clone2.default)(this.dates);
        dates.push(date);
        this.dates = dates;
        this._index[date] = {};
    },
    remove: function remove(date) {
        var dates = (0, _clone2.default)(this.dates);
        var index = void 0;
        while ((index = this.indexOf(date, dates)) !== -1) {
            dates.splice(index, 1);
        }
        this.dates = dates;
        delete this._index[date];
    },
    removeAt: function removeAt(index) {
        var dates = (0, _clone2.default)(this.dates);
        delete this._index[dates.splice(index, 1)[0]];
        this.dates = dates;
    },
    toggleDate: function toggleDate(date) {
        if (this.contains(date)) {
            this.remove(date);
        } else {
            this.add(date);
        }
    },
    contains: function contains(date) {
        return !!this._index[date];
    },
    indexOf: function indexOf(date) {
        var dates = arguments.length <= 1 || arguments[1] === undefined ? this.dates : arguments[1];

        var index = -1;
        for (var i = 0; i < dates.length; i++) {
            if (dates[i].getTime() === date.getTime()) {
                index = i;
                break;
            }
        }
        return index;
    },
    forEach: function forEach() {
        return Array.prototype.forEach.apply(this.dates, arguments);
    },
    map: function map() {
        return Array.prototype.map.apply(this.dates, arguments);
    },
    sort: function sort() {
        return Array.prototype.sort.apply(this.dates, arguments);
    }
});

},{"./base":5,"lodash/clone":313}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _userCollection = require('./collections/userCollection');

var _userCollection2 = _interopRequireDefault(_userCollection);

var _meetingSlotCollection = require('./collections/meetingSlotCollection');

var _meetingSlotCollection2 = _interopRequireDefault(_meetingSlotCollection);

var _meeting = require('../helpers/meeting');

var _meeting2 = _interopRequireDefault(_meeting);

var _dateTimeHelper = require('../helpers/dateTimeHelper');

var _dateTimeHelper2 = _interopRequireDefault(_dateTimeHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    urlRoot: '/api/meetings',
    idAttribute: 'mid',

    props: {
        mid: {
            type: 'string',
            required: true,
            test: function test(val) {
                if (!_meeting2.default.validateMid(val)) {
                    return 'mid must be a hyphenated lowercase alphanumeric string, was ' + val;
                }
                return false;
            }
        },
        createdAt: 'date',
        updatedAt: 'date',
        name: 'string',
        description: 'string',
        finalized: 'boolean',
        slotDuration: ['number', false, 15]
    },

    children: {
        creator: _user2.default
    },

    collections: {
        meetingSlots: _meetingSlotCollection2.default,
        users: _userCollection2.default
    },

    derived: {
        createdByMe: {
            deps: ['creator'],
            cache: false,
            fn: function fn() {
                return _ampersandApp2.default.me === this.creator || _ampersandApp2.default.me._id === this.creator._id;
            }
        },

        respondedToByMe: {
            deps: ['users', 'meetingSlots'],
            cache: false,
            fn: function fn() {
                var _this = this;

                var isResponder = this.users.indexOf(_ampersandApp2.default.me) !== -1 || this.users.some(function (user) {
                    return user === _ampersandApp2.default.me || user._id === _ampersandApp2.default.me._id;
                });
                return isResponder && this.enabledSlots.some(function (meetingSlot) {
                    return _ampersandApp2.default.me.isFreeAtTime(meetingSlot.time, _this);
                });
            }
        },

        visibleUsers: {
            deps: ['users'],
            cache: false,
            fn: function fn() {
                return this.users.filter(function (user) {
                    return user.show;
                });
            }
        },

        selectedSlot: {
            deps: ['meetingSlots'],
            cache: false,
            fn: function fn() {
                var slot = this.meetingSlots.getSelected();
                if (slot) {
                    slot.collection = slot.collection || this.meetingSlots;
                }
                return slot;
            }
        },

        enabledSlots: {
            deps: ['meetingSlots'],
            cache: false,
            fn: function fn() {
                return this.meetingSlots.filter(function (slot) {
                    return !slot.disabled;
                });
            }
        },

        earliestMeetingSlot: {
            deps: ['meetingSlots'],
            cache: false,
            fn: function fn() {
                // TODO: consider disabled slots
                return this.meetingSlots.at(0);
            }
        },

        latestMeetingSlot: {
            deps: ['meetingSlots'],
            cache: false,
            fn: function fn() {
                // TODO: consider disabled slots
                return this.meetingSlots.at(this.meetingSlots.length - 1);
            }
        },

        ratingsUnlocked: {
            deps: ['meetingSlots'],
            fn: function fn() {
                if (!this.earliestMeetingSlot || !this.latestMeetingSlot) {
                    return false;
                }

                // Some constants
                var now = Date.now();
                var firstTime = this.earliestMeetingSlot.time.getTime();
                var lastTime = this.latestMeetingSlot.time.getTime();
                var numDays = Math.floor((lastTime - firstTime) / _dateTimeHelper2.default.DAY);
                var numDaysPast = Math.ceil((now - firstTime) / _dateTimeHelper2.default.DAY);

                // Some booleans
                var finalized = this.finalized;
                var allDaysPast = numDaysPast > numDays;
                var halfwayPastBigMeeting = numDays > 5 && numDaysPast > Math.floor(numDays / 2);

                // Return!
                return finalized || allDaysPast || halfwayPastBigMeeting;
            }
        }
    },

    initialize: function initialize() {
        var _this2 = this;

        _base2.default.prototype.initialize.apply(this, arguments);
        // TODO: Consider a SubCollection
        // Update finalizedUsers models in MeetingSlots with the fetched responder models
        this.listenTo(this.users, 'sync', function () {
            _this2.meetingSlots.forEach(function (meetingSlot) {
                if (meetingSlot.finalized) {
                    (function () {
                        var finalizedUserModels = [];
                        meetingSlot.finalizedUsers.forEach(function (finalizedUserId) {
                            if (typeof finalizedUserId === 'string') {
                                finalizedUserModels.push(_this2.users.get(finalizedUserId));
                            } else {
                                // It's actually a model and we can push it as-is
                                finalizedUserModels.push(finalizedUserId);
                            }
                        });
                        meetingSlot.finalizedUsers = finalizedUserModels;
                    })();
                }
            });
        });
    },
    fetch: function fetch() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var oldSuccess = options.success;
        options.success = function (meeting) {
            // TODO: For some reason the references get weird...
            meeting.meetingSlots.forEach(function (model) {
                meeting.meetingSlots._removeReference(model);
                meeting.meetingSlots._addReference(model);
            });
            if (oldSuccess) {
                oldSuccess(meeting);
            }
        };
        return _base2.default.prototype.fetch.apply(this, arguments);
    },
    parse: function parse(attrs) {
        if (!attrs) {
            return attrs;
        }

        // Transform the single strings into raw models
        attrs.creator = { _id: attrs.creator };
        attrs.users = attrs.users ? attrs.users.map(function (id) {
            return { _id: id };
        }) : [];

        // Copy finalized timeslot data to every timeslot in each finalized block
        var currBlock = {};
        attrs.meetingSlots.forEach(function (meetingSlot) {
            if (meetingSlot.start) {
                meetingSlot.first = true;
                currBlock.start = meetingSlot.time;
                currBlock.location = meetingSlot.location;
                currBlock.purpose = meetingSlot.purpose;
                currBlock.finalizedUsers = meetingSlot.finalizedUsers;
                currBlock.slots = [];
            }
            if (currBlock.slots) {
                currBlock.slots.push(meetingSlot);
            }
            if (meetingSlot.end) {
                meetingSlot.last = true;
                currBlock.slots.forEach(function (slot) {
                    if (!slot.first && !slot.last) {
                        slot.middle = true;
                    }
                    slot.start = currBlock.start;
                    slot.location = currBlock.location;
                    slot.purpose = currBlock.purpose;
                    slot.finalizedUsers = currBlock.finalizedUsers;
                    slot.end = meetingSlot.time;
                });
                currBlock = {};
            }
        });

        return attrs;
    },
    serialize: function serialize() {
        // Transform the ampersand models into single strings
        var meeting = this.getAttributes({ props: true }, true);
        meeting.creator = this.creator._id;
        meeting.meetingSlots = this.meetingSlots.serialize();
        // Remove all of that duplicated data before sending back to server
        meeting.meetingSlots.forEach(function (slot) {
            if (slot.middle || slot.last) {
                delete slot.start;
                delete slot.location;
                delete slot.purpose;
                delete slot.finalizedUsers;
            }
            if (slot.first || slot.middle) {
                delete slot.end;
            }
            if (slot.first) {
                slot.start = true;
            }
            if (slot.last) {
                slot.end = true;
            }
            if (slot.disabled === false) {
                // Delete redundant data
                delete slot.disabled;
            }
            delete slot.first;
            delete slot.middle;
            delete slot.last;
            if (slot.finalizedUsers) {
                slot.finalizedUsers = slot.finalizedUsers.map(function (user) {
                    return user._id;
                });
            }
        });
        meeting.users = this.users.map(function (user) {
            return user._id;
        });
        return meeting;
    },
    inviteUser: function inviteUser(email) {
        _ampersandApp2.default.prometheus.save({
            type: 'EMAIL_INVITE',
            email: email,
            mid: this.mid
        });
        return _ampersandApp2.default.request.post(this.url() + '/invite').send({
            email: email
        });
    },
    getUsersFreeAtTime: function getUsersFreeAtTime(time) {
        var _this3 = this;

        return this.visibleUsers.filter(function (user) {
            return user.isFreeAtTime(time, _this3);
        });
    },
    getUsersBusyAtTime: function getUsersBusyAtTime(time) {
        var _this4 = this;

        return this.visibleUsers.filter(function (user) {
            return user.isBusyAtTime(time, _this4);
        });
    },
    getUsersFreeAtTimeRange: function getUsersFreeAtTimeRange(startTime, endTime) {
        var _this5 = this;

        return this.visibleUsers.filter(function (user) {
            return user.isFreeAtTimeRange(startTime, endTime, _this5);
        });
    },
    getUsersPartiallyFreeAtTimeRange: function getUsersPartiallyFreeAtTimeRange(startTime, endTime) {
        var entirelyFreeUsers = this.getUsersFreeAtTimeRange(startTime, endTime);
        var entirelyBusyUsers = this.getUsersBusyAtTimeRange(startTime, endTime);
        return this.visibleUsers.filter(function (user) {
            return entirelyFreeUsers.indexOf(user) === -1 && entirelyBusyUsers.indexOf(user) === -1;
        });
    },
    getUsersBusyAtTimeRange: function getUsersBusyAtTimeRange(startTime, endTime) {
        var _this6 = this;

        return this.visibleUsers.filter(function (user) {
            return user.isBusyAtTimeRange(startTime, endTime, _this6);
        });
    },
    finalize: function finalize(start, end, location, purpose, finalizedUsers, invitedUsers) {
        var data = {
            start: start,
            end: end,
            location: location,
            purpose: purpose,
            finalizedUsers: finalizedUsers,
            invitedUsers: invitedUsers
        };
        _ampersandApp2.default.prometheus.save(data);
        return _ampersandApp2.default.request.post(this.url() + '/finalize').send(data);
    }
});

},{"../helpers/dateTimeHelper":1,"../helpers/meeting":2,"./base":5,"./collections/meetingSlotCollection":8,"./collections/userCollection":12,"./user":18,"ampersand-app":92}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    props: {
        timestamp: 'date',
        meeting: 'state', // Meeting
        from: 'state', // User
        to: 'state', // User
        impact: 'number',
        comment: 'string'
    },

    serialize: function serialize() {
        var attributes = this.getAttributes({ props: true }, true);
        attributes.meeting = this.meeting.getId();
        attributes.from = this.from.getId();
        attributes.to = this.to.getId();
        return attributes;
    }
});

},{"./base":5}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    props: {
        start: {
            type: 'date',
            test: function test(val) {
                if (!this.end) {
                    return false;
                }
                return val < this.end.getTime() ? false : 'Start must be before end.';
            }
        },
        end: {
            type: 'date',
            test: function test(val) {
                if (!this.start) {
                    return false;
                }
                return this.start.getTime() < val ? false : 'End must be after start.';
            }
        }
    },

    derived: {
        duration: {
            deps: ['start', 'end'],
            fn: function fn() {
                return this.end.getTime() - this.start.getTime();
            }
        }
    }
});

},{"./base":5}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    props: {
        time: 'date',
        duration: ['number', false, 15],
        free: ['number', false, 0],
        mid: 'string',
        finalizedMid: 'string',
        originalFree: 'number'
    }
});

},{"./base":5}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _meetingCollection = require('./collections/meetingCollection');

var _meetingCollection2 = _interopRequireDefault(_meetingCollection);

var _timeslotCollection = require('./collections/timeslotCollection');

var _timeslotCollection2 = _interopRequireDefault(_timeslotCollection);

var _dateTimeHelper = require('../helpers/dateTimeHelper');

var _dateTimeHelper2 = _interopRequireDefault(_dateTimeHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    urlRoot: '/api/users',
    idAttribute: '_id',

    props: {
        _id: 'string',
        createdAt: 'date',
        providerType: 'string',
        providerId: 'string',
        name: 'string',
        picture: 'string',
        freeByDefault: 'boolean',
        email: {
            type: 'string',
            required: false
        }
    },

    collections: {
        meetings: _meetingCollection2.default,
        timeslots: _timeslotCollection2.default
    },

    session: {
        show: ['boolean', false, true]
    },

    derived: {
        firstName: {
            deps: ['name'],
            cache: false,
            fn: function fn() {
                return this.name ? this.name.split(' ')[0] : '';
            }
        },

        lastName: {
            deps: ['name'],
            cache: false,
            fn: function fn() {
                var index = this.name && this.name.indexOf(' ');
                if (this.name && index !== -1) {
                    return this.name.substring(index);
                }
                return '';
            }
        },

        hasMeetingsInThePast: {
            deps: ['meetings'],
            cache: false,
            fn: function fn() {
                var now = Date.now();
                return this.meetings.some(function (meeting) {
                    return meeting.earliestMeetingSlot && meeting.earliestMeetingSlot.time.getTime() < now;
                });
            }
        }
    },

    parse: function parse(attrs) {
        if (attrs.hasOwnProperty('email') && attrs.email.length === 0) {
            delete attrs.email;
        }
        return attrs;
    },
    getAuthenticated: function getAuthenticated() {
        var _this = this;

        return new Promise(function (resolve, reject) {
            _ampersandApp2.default.request.get('/loggedIn').then(function (response) {
                _this._id = response.body._id;
                _this.fetch({
                    success: function success(user) {
                        // Prometheus Logon Tracking
                        _ampersandApp2.default.prometheus.logon(user._id, {
                            name: user.name,
                            email: response.body.email,
                            picture: user.picture,
                            type: user.providerType
                        });
                        _ampersandApp2.default.prometheus.redeem('USER_DEFAULT_SEPTEMBER_2016', null, null, { silent: true });
                        resolve();
                    },

                    error: reject
                });
            }).catch(reject);
        });
    },
    saveCustomEmail: function saveCustomEmail(email) {
        var _this2 = this;

        _ampersandApp2.default.prometheus.save({
            type: 'CUSTOM_EMAIL',
            email: email
        });
        return _ampersandApp2.default.request.put(this.url() + '/email').send({
            email: email
        }).then(function () {
            _this2.email = email;
        });
    },
    isFreeAtTime: function isFreeAtTime(time) {
        var meeting = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.isFreeAtTimeRange(time, time, meeting);
    },
    isBusyAtTime: function isBusyAtTime(time) {
        var meeting = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return this.isBusyAtTimeRange(time, time, meeting);
    },
    isFreeAtTimeRange: function isFreeAtTimeRange(startTime, endTime) {
        var meeting = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        return this._isAvailableAtTimeRange(startTime, endTime, 2, meeting);
    },
    isBusyAtTimeRange: function isBusyAtTimeRange(startTime, endTime) {
        var meeting = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        return this._isAvailableAtTimeRange(startTime, endTime, 0, meeting);
    },
    _isAvailableAtTimeRange: function _isAvailableAtTimeRange(startTime, endTime, freeToCheck) {
        var meeting = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

        // If the timeslot says they're free but there's an mid associated with it, they're actually busy.
        function slotIsFree(slot) {
            if (!slot) return 0;
            if (slot.finalizedMid) {
                if (slot.finalizedMid === meeting.mid) {
                    return slot.originalFree;
                }
                return 0;
            }
            return slot.free;
        }
        // Run forward in time and verify the user is free for all of the contained slots (if applicable)
        var nextTime = endTime.getTime() + (meeting.slotDuration || 15) * _dateTimeHelper2.default.MINUTE;
        var currTime = startTime.getTime();
        for (; currTime < nextTime; currTime += 15 * _dateTimeHelper2.default.MINUTE) {
            if (slotIsFree(this.timeslots.get(new Date(currTime))) !== freeToCheck) {
                return false;
            }
        }
        return true;
    }

    // getAvailabilityByMeeting(mid) {
    //     return new Promise((resolve, reject) => {
    //         $.ajax({
    //             type: 'GET',
    //             url: `${this.url()}/calendar/freebusy/${mid}`
    //         }).done(data => {
    //             if (data.error && data.redirect) {
    //                 const win = window.open(data.redirect);
    //                 // Silly hack to detect when the popup closes
    //                 const interval = window.setInterval(() => {
    //                     if (win === null || win === undefined || win.closed) {
    //                         window.clearInterval(interval);
    //                         // TODO: Find a better solution than having to manually press the button again.
    //                         // this.getAvailabilityByMeeting(mid).then(resolve);
    //                     }
    //                 }, 100);
    //                 reject();
    //             } else {
    //                 resolve(data);
    //             }
    //         }).fail(reject);
    //     });
    // }

});

},{"../helpers/dateTimeHelper":1,"./base":5,"./collections/meetingCollection":7,"./collections/timeslotCollection":11,"ampersand-app":92}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _base = require('../views/base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    pageTitle: 'Not Found',
    template: require('../templates/pages/404.html'),
    ready: true
});

},{"../templates/pages/404.html":50,"../views/base":67}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _base = require('../views/base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    pageTitle: 'About Omnipointment',
    template: require('../templates/pages/about.html'),
    ready: true
});

},{"../templates/pages/about.html":51,"../views/base":67}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _meeting = require('../models/meeting');

var _meeting2 = _interopRequireDefault(_meeting);

var _meeting3 = require('../helpers/meeting');

var _meeting4 = _interopRequireDefault(_meeting3);

var _base = require('../views/base');

var _base2 = _interopRequireDefault(_base);

var _defer = require('lodash/defer');

var _defer2 = _interopRequireDefault(_defer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: '<div></div>', // require('../templates/pages/createMeeting.html'),
    ready: true,

    // events: {
    //     'input [data-hook=meeting-name]': 'handleNameInput',
    //     'input [data-hook=mid]': 'handleMidInput',
    //     'blur [data-hook=mid]': 'handleMidBlur',
    //     'click [data-hook=generate-random-mid]': 'handleGenerateRandomClick',
    //     'click [data-hook=mid-button]': 'handleMidSubmit',
    //     'click [data-hook=cancel]': 'handleCancelClick'
    // },

    // bindings: {
    //     'model.mid': [{
    //         type: 'value',
    //         hook: 'mid'
    //     }, {
    //         type: 'text',
    //         hook: 'url-mid'
    //     }, {
    //         type(el, val) {
    //             if (!val || val.length === 0) {
    //                 el.disabled = true;
    //             } else {
    //                 el.removeAttribute('disabled');
    //             }
    //         },
    //         hook: 'mid-button'
    //     }],

    //     'model.name': {
    //         type: 'value',
    //         hook: 'meeting-name'
    //     }
    // },

    initialize: function initialize(options) {
        var _this = this;

        // PageView.prototype.initialize.apply(this, arguments);
        this.model = options && options.model || new _meeting2.default();
        this.model.creator = _ampersandApp2.default.me;
        this.model.mid = _meeting4.default.generateRandomMid();
        _ampersandApp2.default.me.meetings.add(this.model);
        // Redirect to the actual meeting create page
        (0, _defer2.default)(function () {
            // Dirty hardcoded eliminate this page from the history
            _ampersandApp2.default.router.history.history.pushState({}, document.title, '/home');
            _ampersandApp2.default.navigate('meeting/' + _this.model.mid + '/create');
        });
    }

    // handleNameInput(e) {
    //     // Only auto-update the mid if the user hasn't picked a custom id
    //     if (!this.hasSetCustomMid && this.authCustomMid) {
    //         this.updateMid(e.target.value);
    //     }
    // },

    // handleMidInput(e) {
    //     this.updateMid(e.target.value);
    //     this.hasSetCustomMid = true;
    // },

    // handleMidBlur(e) {
    //     e.target.value = this.model.mid;
    // },

    // updateMid(mid) {
    //     const newMid = MeetingHelper.formatMid(mid);
    //     this.model.mid = newMid;
    // },

    // handleGenerateRandomClick() {
    //     this.model.mid = MeetingHelper.generateRandomMid();
    // },

    // handleMidSubmit() {
    //     // TODO: for random MIDs, 1) ensure they're unique and 2) don't prompt because it's annoying
    //     const checkID = new Promise((resolve, reject) => {
    //         $.ajax({
    //             type: 'GET',
    //             url: `/api/meetings/${this.model.mid}/exists`
    //         }).done(data => {
    //             resolve(data.exists);
    //         }).fail(reject);
    //     });
    //     checkID.then(alreadyExists => {
    //         if (alreadyExists) {
    //             app.vex.dialog.alert('Sorry, that id is already taken. Please choose a new one.');
    //             return;
    //         }
    //         if (this.isShowingDialog) {
    //             return;
    //         }
    //         this.isShowingDialog = true;
    //         app.vex.dialog.open({
    //             message: `Is '${this.model.mid}' the meeting ID you want?`,
    //             buttons: [
    //                 Object.assign({}, app.vex.dialog.buttons.YES, { text: 'Yes' }),
    //                 Object.assign({}, app.vex.dialog.buttons.NO, { text: 'No' })
    //             ],
    //             callback: (confirmed) => {
    //                 this.isShowingDialog = false;
    //                 if (confirmed) {
    //                     this.model.name = this.queryByHook('meeting-name').value;
    //                     app.me.meetings.add(this.model);
    //                     app.navigate(`meeting/${this.model.mid}/create`);
    //                 }
    //             }
    //         });
    //     });
    // },

    // handleCancelClick() {
    //     // TODO: find a better way to determine `isNew()` for a meeting
    //     this.model.isNew = () => true;
    //     this.model.destroy();
    //     app.navigate('/');
    // }

});

},{"../helpers/meeting":2,"../models/meeting":14,"../views/base":67,"ampersand-app":92,"lodash/defer":316}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _meeting = require('../models/meeting');

var _meeting2 = _interopRequireDefault(_meeting);

var _base = require('../views/base');

var _base2 = _interopRequireDefault(_base);

var _creatorgrid = require('../views/timegrid/creatorgrid');

var _creatorgrid2 = _interopRequireDefault(_creatorgrid);

var _timePicker = require('../views/timePicker');

var _timePicker2 = _interopRequireDefault(_timePicker);

var _calendarPicker = require('../views/calendarPicker');

var _calendarPicker2 = _interopRequireDefault(_calendarPicker);

var _dateTimeHelper = require('../helpers/dateTimeHelper');

var _dateTimeHelper2 = _interopRequireDefault(_dateTimeHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/pages/editMeeting.html'),

    events: {
        'blur [data-hook=meeting-name]': 'handleNameBlur',
        'blur [data-hook=meeting-description]': 'handleDescriptionBlur',
        'click [data-hook=view-meeting]': 'handleViewMeetingClick',
        'click [data-hook=add-dates]': 'handleAddDatesClick',
        'click [data-hook=add-times]': 'handleAddTimesClick',
        'click [data-hook=transfer-ownership]': 'handleTransferClick',
        'click [data-hook=invite-others]': 'handleInviteClick',
        'click [data-hook=delete-meeting]': 'handleDeleteMeetingClick',
        'change [data-hook=meeting-slot-size]': 'handleSlotSizeChange'
    },

    bindings: {
        'model.name': {
            type: 'text',
            hook: 'meeting-name'
        },
        'model.description': {
            type: 'text',
            hook: 'meeting-description'
        },
        'model.slotDuration': {
            type: function type(el, val) {
                var option = this.el.querySelector('[value="' + val + '"]');
                if (option) {
                    option.selected = true;
                }
            },

            hook: 'meeting-slot-size'
        },
        'model.users': {
            type: function type(el, val) {
                var _this = this;

                var possibleTransfers = val.filter(function (member) {
                    return member._id !== _this.model.creator._id;
                });
                if (!possibleTransfers.length) {
                    el.style.display = 'none';
                } else {
                    el.style.display = 'inline-block';
                }
            },

            hook: 'transfer-ownership'
        },
        'model.finalized': {
            type: 'booleanAttribute',
            name: 'disabled',
            hook: 'meeting-slot-size'
        }
    },

    subviews: {
        creatorGrid: {
            hook: 'creator-grid',
            prepareView: function prepareView(el) {
                return new _creatorgrid2.default({
                    el: el,
                    model: this.model
                });
            }
        }
    },

    pageTitle: function pageTitle() {
        return 'Edit ' + this.model.name;
    },
    initialize: function initialize(options) {
        var _this2 = this;

        if (!options || !options.mid) {
            throw new Error('Edit page view options must include mid.');
        }

        _base2.default.prototype.initialize.apply(this, arguments);
        this.model = _ampersandApp2.default.me.meetings.get(options.mid) || new _meeting2.default({ mid: options.mid });
        this.model.fetch({
            success: function success() {
                if (!_this2.model.createdByMe) {
                    // TODO: show a notification
                    _ampersandApp2.default.navigate('/');
                    return;
                }
                _this2.model.users.fetch();
                _this2.trigger('ready');
            },
            error: function error(meeting, response) {
                if (response.statusCode === 404) {
                    _ampersandApp2.default.navigate('/404');
                }
            }
        });
    },
    render: function render() {
        _base2.default.prototype.render.apply(this, arguments);
        // SUPER DIRTY FLOATING SAVE BUTTON
        this.saveButton = this.queryByHook('view-meeting');
        var saveContainer = this.saveButton.parentNode;
        saveContainer.parentNode.removeChild(saveContainer);
        saveContainer.style.position = 'fixed';
        saveContainer.style.bottom = '10px';
        saveContainer.style.zIndex = '9000';
        saveContainer.style.left = '0';
        saveContainer.style.right = '10px';
        saveContainer.style.margin = '0 auto';
        saveContainer.addEventListener('click', this.handleViewMeetingClick.bind(this));
        this.once('remove', function () {
            return saveContainer.parentNode.removeChild(saveContainer);
        });
        document.body.appendChild(saveContainer);
        // END SUPER DIRTY FLOATING SAVE BUTTON
        return this;
    },
    handleNameBlur: function handleNameBlur(e) {
        this.model.name = e.target.textContent;
        if (!this.model.name.length) {
            this.saveButton.disabled = true;
        } else {
            this.saveButton.removeAttribute('disabled');
        }
    },
    handleDescriptionBlur: function handleDescriptionBlur(e) {
        // TODO: write validation methods for states, use good error messages
        this.model.description = e.target.textContent;
    },
    handleViewMeetingClick: function handleViewMeetingClick() {
        var _this3 = this;

        this.model.save(null, {
            success: function success() {
                _ampersandApp2.default.navigate('meeting/' + _this3.model.mid);
            }
        });
    },
    handleSlotSizeChange: function handleSlotSizeChange() {
        var _this4 = this;

        var newSlotDuration = Number.parseInt(this.queryByHook('meeting-slot-size').value, 10);
        // TODO: this validation needs to be somewhere, either in MeetingSlotCollection or otherwise:
        var oldSlotDuration = (this.model.meetingSlots.at(1).time.getTime() - this.model.meetingSlots.at(0).time.getTime()) / 1000 / 60;
        if (oldSlotDuration !== this.model.slotDuration) {
            // Log the (possible) error
            var msg = 'Calculated slot duration does not match meeting model.';
            console.warn(msg);
            _ampersandApp2.default.prometheus.error({
                message: msg,
                url: window.location.href,
                line: 42069
            });
            // Switch to what the model says (it's probably right anyway)
            oldSlotDuration = this.model.slotDuration;
        }

        // Add every 15 minute timeslot in the current grid
        var toAdd = [];
        var toDisable = [];
        var toEnable = [];
        var fifteenInterval = 15 * _dateTimeHelper2.default.MINUTE;
        var oldInterval = oldSlotDuration * _dateTimeHelper2.default.MINUTE;
        for (var i = 0; i < this.model.meetingSlots.length; i++) {
            var currSlot = this.model.meetingSlots.at(i);
            var startTime = currSlot.time.getTime();
            var endTimeOld = currSlot.time.getTime() + oldSlotDuration * _dateTimeHelper2.default.MINUTE;
            var endTimeNew = currSlot.time.getTime() + newSlotDuration * _dateTimeHelper2.default.MINUTE;

            // Calculate if these new slots should be disabled depending on if *all* slots in the new range *were* disabled
            var disabled = true;
            for (var currTime = startTime; currTime < endTimeNew; currTime += oldInterval) {
                var slot = this.model.meetingSlots.get(new Date(currTime), 'time');
                if (!slot || !slot.disabled) {
                    disabled = false;
                    break;
                }
            }

            // Run through all of the 15 minute slots in the old range
            for (var _currTime = startTime; _currTime < endTimeOld; _currTime += fifteenInterval) {
                var time = new Date(_currTime);

                // Add the timeslot
                toAdd.push(time);

                // Enable or disable the timeslot
                if (disabled) {
                    toDisable.push(time);
                } else {
                    toEnable.push(time);
                }
            }
        }

        // Add and then enable/disable all of the new timeslots
        this.model.meetingSlots.addTimes(toAdd);
        var setDisabledAtTime = function setDisabledAtTime(disabled, time) {
            var slot = _this4.model.meetingSlots.get(time, 'time');
            if (slot) {
                slot.disabled = disabled;
            }
        };
        toDisable.forEach(setDisabledAtTime.bind(this, true));
        toEnable.forEach(setDisabledAtTime.bind(this, false));

        // Then remove the ones that aren't for this slot size
        var toRemove = [];
        var keep = newSlotDuration / 15;
        var counter = 0;
        for (var _i = 0; _i < this.model.meetingSlots.length; _i++) {
            if (counter++ % keep !== 0) {
                toRemove.push(this.model.meetingSlots.at(_i));
            }
        }
        this.model.meetingSlots.remove(toRemove);

        // And adjust the model
        this.model.slotDuration = newSlotDuration;
    },
    handleAddDatesClick: function handleAddDatesClick() {
        var _this5 = this;

        var calendarPicker = new _calendarPicker2.default({
            dates: this.model.meetingSlots.getDates(),
            renderDoneButton: true
        });
        var dialog = _ampersandApp2.default.vex.open({
            unsafeContent: calendarPicker.render().el,
            showCloseButton: false,
            overlayClosesOnClick: false,
            afterClose: function afterClose() {
                var dates = calendarPicker.getSelectedDates();
                _this5.model.meetingSlots.setDates(dates);
            }
        });
        calendarPicker.once('done', function () {
            return dialog.close();
        });
    },
    handleAddTimesClick: function handleAddTimesClick() {
        var _this6 = this;

        var timePicker = new _timePicker2.default({ slotDuration: this.model.slotDuration });
        var popup = _ampersandApp2.default.vex.open({
            unsafeContent: timePicker.render().el,
            showCloseButton: false
        });
        timePicker.once('add-times', function (timeRange) {
            popup.close();
            var interval = _this6.model.slotDuration * 60 * 1000;
            if (timeRange.end.getTime() - timeRange.start.getTime() < interval) {
                // TODO: popup/notification?
                console.warn('skipping time range, not long enough for slot size');
                return;
            }
            // TODO: Start with 30 minute slots at 10:30am. Timepicker starts at 10:45am. gg.
            var currentTime = timeRange.start.getTime();
            var endTime = timeRange.end.getTime();
            for (; currentTime < endTime; currentTime += interval) {
                _this6.model.meetingSlots.addTime(new Date(currentTime));
            }
        });
    },
    handleDeleteMeetingClick: function handleDeleteMeetingClick() {
        var _this7 = this;

        _ampersandApp2.default.vex.dialog.confirm({
            message: 'Really delete ' + this.model.name + '?',
            callback: function callback(confirmed) {
                if (confirmed) {
                    _this7.model.destroy({
                        success: function success() {
                            _ampersandApp2.default.navigate('/');
                        },
                        error: function error() {
                            // TODO: show error lol
                        }
                    });
                }
            }
        });
    },
    handleInviteClick: function handleInviteClick() {
        var _this8 = this;

        // Generate Dialog
        var html = '';
        html += '<p>Invite your teammates to "' + this.model.name + '" by email.</p>';
        html += '<input type="text" name="email" class="underscore-bar"><br>';
        _ampersandApp2.default.vex.dialog.open({
            message: '',
            input: html,
            buttons: [Object.assign({}, _ampersandApp2.default.vex.dialog.buttons.YES, { text: 'Invite' }), Object.assign({}, _ampersandApp2.default.vex.dialog.buttons.NO, { text: 'Cancel' })],
            callback: function callback(data) {
                if (data === false) return;
                // http://stackoverflow.com/a/742588/5136076
                if (data.email && data.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
                    _this8.model.inviteUser(data.email).then(function () {
                        _ampersandApp2.default.vex.dialog.alert(data.email + ' has been invited!');
                    }).catch(function () {
                        _ampersandApp2.default.vex.dialog.alert('Something went wrong. Try again later.');
                    });
                } else {
                    _ampersandApp2.default.vex.dialog.alert('Please enter a valid email.');
                }
            }
        });
    },
    handleTransferClick: function handleTransferClick() {
        var _this9 = this;

        // Generate dialog
        var html = '';
        var possibleTransfers = this.model.users.filter(function (member) {
            return member._id !== _this9.model.creator._id;
        });
        if (!possibleTransfers.length) {
            html += 'There aren\'t any responders you can transfer your meeting to.';
            _ampersandApp2.default.vex.dialog.alert(html);
            return;
        }
        html += '<div class="listGroup">';
        possibleTransfers.forEach(function (member) {
            html += '<div class="listGroup__item">';
            html += '<input type="radio" name="member" class="filter-user listGroup__element" ';
            html += 'id="member-' + member._id + '">';
            html += '<label for="member-' + member._id + '"';
            html += 'class="member-data transfer" id="member-data-' + member._id + '">';
            html += '<span class="listGroup__element listGroup__element--img u-circle"';
            html += ' style="background-image: url(\'' + member.picture + '\')"></span>';
            html += '<span class="listGroup__element listGroup__element--text">';
            html += '' + member.name;
            html += '</div>';
            html += '</label>';
            html += '</div>';
        });
        html += '</div>';
        var transferName = '';
        var transferId = '';
        _ampersandApp2.default.vex.dialog.open({
            message: 'Select a responder to own this meeting:',
            input: html,
            buttons: [Object.assign({}, _ampersandApp2.default.vex.dialog.buttons.YES, { text: 'Transfer' }), Object.assign({}, _ampersandApp2.default.vex.dialog.buttons.NO, { text: 'Cancel' })],
            callback: function callback(data) {
                if (data === false) return;
                if (transferName.length && transferId.length) {
                    _ampersandApp2.default.vex.dialog.confirm({
                        message: 'Are you sure you want to transfer this meeting to ' + transferName + '?',
                        callback: function callback(confirmed) {
                            if (confirmed) {
                                _this9.model.creator = { _id: transferId };
                                _this9.model.save(null, {
                                    success: function success() {
                                        return location.reload();
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
        var transfers = document.querySelectorAll('.transfer');
        var handler = function handler(e) {
            var el = e.currentTarget;
            transferName = el.textContent;
            transferId = el.id.substring('member-data-'.length);
        };
        for (var i = 0; i < transfers.length; i++) {
            transfers[i].addEventListener('click', handler);
        }
    }
});

},{"../helpers/dateTimeHelper":1,"../models/meeting":14,"../templates/pages/editMeeting.html":52,"../views/base":67,"../views/calendarPicker":68,"../views/timePicker":83,"../views/timegrid/creatorgrid":85,"ampersand-app":92}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _defer = require('lodash/defer');

var _defer2 = _interopRequireDefault(_defer);

var _base = require('../views/base');

var _base2 = _interopRequireDefault(_base);

var _timePeriodPicker = require('../views/timePeriodPicker');

var _timePeriodPicker2 = _interopRequireDefault(_timePeriodPicker);

var _calendarPicker = require('../views/calendarPicker');

var _calendarPicker2 = _interopRequireDefault(_calendarPicker);

var _dateTimeHelper = require('../helpers/dateTimeHelper');

var _dateTimeHelper2 = _interopRequireDefault(_dateTimeHelper);

var _dateList = require('../models/dateList');

var _dateList2 = _interopRequireDefault(_dateList);

var _timeRangeCollection = require('../models/collections/timeRangeCollection');

var _timeRangeCollection2 = _interopRequireDefault(_timeRangeCollection);

var _shepherd = require('../helpers/shepherd');

var _shepherd2 = _interopRequireDefault(_shepherd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/pages/editNewMeeting.html'),

    events: {
        'blur [data-hook=meeting-name]': 'handleNameBlur',
        'click [data-hook=confirm]': 'handleConfirmClick',
        'click [data-hook=cancel]': 'handleCancelClick'
    },

    session: {
        dates: ['state', false, function () {
            return new _dateList2.default();
        }],
        times: ['state', false, function () {
            return new _timeRangeCollection2.default();
        }],
        slotSize: ['number', false, 30]
    },

    bindings: {
        'model.name': {
            type: function type(el, val) {
                if (val && val.length) {
                    el.textContent = val;
                } else {
                    el.textContent = 'Untitled Meeting';
                }
            },

            hook: 'review-name'
        },
        'model.mid': {
            type: 'text',
            hook: 'url-mid'
        },
        dates: {
            type: function type(el, val) {
                var dates = val.map(function (date) {
                    return _ampersandApp2.default.moment(date).format('M/D');
                });
                el.textContent = dates.join(', ');
            },

            hook: 'meeting-dates'
        },
        times: {
            type: function type(el, val) {
                var times = val.map(function (timeRange) {
                    var startTime = _ampersandApp2.default.moment(timeRange.start).format('h:mm A');
                    var endTime = _ampersandApp2.default.moment(timeRange.end).format('h:mm A');
                    return startTime + ' - ' + endTime;
                });
                el.textContent = times.join(', ');
            },

            hook: 'meeting-times'
        },
        slotSize: {
            type: 'text',
            hook: 'meeting-slotSize'
        }
    },

    subviews: {
        stepOne: {
            hook: 'step-one',
            prepareView: function prepareView() {
                return new _calendarPicker2.default({
                    model: this.dates
                });
            }
        },
        stepTwo: {
            hook: 'step-two',
            prepareView: function prepareView() {
                return new _timePeriodPicker2.default({
                    collection: this.times
                });
            }
        }
    },

    initialize: function initialize(options) {
        var _this = this;

        if (!options || !options.mid) {
            throw new Error('Create new meeting page view options must include mid.');
        }

        _base2.default.prototype.initialize.apply(this, arguments);
        this.model = _ampersandApp2.default.me.meetings.get(options.mid);
        if (!this.model) {
            // TODO: show notification?
            (0, _defer2.default)(function () {
                return _ampersandApp2.default.navigate('/404');
            });
            return;
        }

        // Initialize the dates list
        var today = new Date();
        var currentYear = today.getFullYear();
        var currentMonth = today.getMonth();
        var currentDay = today.getDay();
        if (currentDay >= 5) {
            // If Friday or later, use M-F of next week
            var daysUntilNextMonday = 8 - currentDay;
            var date = today.getDate() + daysUntilNextMonday;
            for (var i = 0; i < 5; i++) {
                this.dates.add(new Date(currentYear, currentMonth, date++));
            }
        } else {
            // Otherwise use the remaining days in the week
            var daysUntilWeekend = 5 - currentDay;
            var _date = today.getDate() + 1;
            for (var _i = 0; _i < daysUntilWeekend; _i++) {
                this.dates.add(new Date(currentYear, currentMonth, _date++));
            }
        }

        // Setup some listeners that will force bindings to update
        this.listenTo(this.dates, 'change', function () {
            _this.dates.sort(_dateTimeHelper2.default.dateCompareAsc);
            _this.trigger('change:dates');
        });
        this.listenTo(this.times, 'add remove change', function () {
            _this.trigger('change:times');
        });

        // Handle simple form validation
        this.on('change:times', this.updateForm);
        this.on('change:dates', this.updateForm);
        this.once('render', this.updateForm);

        // Authenticate feature access
        _ampersandApp2.default.prometheus.can('create-meeting', function (data) {
            var str = data.createCredits + ' free meeting' + (data.createCredits !== 1 ? 's' : '');
            _this.queryByHook('meeting-credits').textContent = str;
            _this.trigger('ready');
        }, function () {
            _ampersandApp2.default.vex.dialog.alert({
                overlayClosesOnClick: false,
                unsafeMessage: 'You\'ve run out of free meetings!<br><br>' + 'If your team needs to create more meetings, send us' + ' an email at <a href="mailto:team@omnipointment.com" target="_blank">team@omnipointment.com</a>' + ' or message us on <a href="https://m.me/omnipointment" target="_blank">Facebook</a>.',
                callback: function callback() {
                    _ampersandApp2.default.navigate('/');
                }
            });
        });

        this.once('ready', function () {
            // shepherd code
            (0, _defer2.default)(function () {
                if (window.innerWidth > 992) {
                    _ampersandApp2.default.prometheus.deliver('shepherd-create', function () {
                        _shepherd2.default.create.start();
                    });
                }
            });
        });
    },
    handleNameBlur: function handleNameBlur() {
        this.model.name = this.queryByHook('meeting-name').value;
    },
    handleConfirmClick: function handleConfirmClick() {
        var _this2 = this;

        // TODO: add validation!
        _ampersandApp2.default.prometheus.deliver('create-meeting', function () {
            var interval = _this2.slotSize * _dateTimeHelper2.default.MINUTE;
            var meetingSlots = [];
            _this2.dates.forEach(function (date) {
                _this2.times.forEach(function (timeRange) {
                    if (timeRange.duration < interval) {
                        console.warn('skipping time range, not long enough for slot size');
                        return;
                    }
                    var currentTime = _dateTimeHelper2.default.combine(date, timeRange.start).getTime();
                    var endTime = _dateTimeHelper2.default.combine(date, timeRange.end).getTime();
                    // Move the endtime to the next day if the time selected was midnight
                    if (timeRange.end.getHours() === 0) {
                        endTime += 1 * _dateTimeHelper2.default.DAY;
                    }
                    for (; currentTime < endTime; currentTime += interval) {
                        meetingSlots.push({
                            time: new Date(currentTime)
                        });
                    }
                });
            });
            _this2.model.meetingSlots.set(meetingSlots);
            _this2.model.slotDuration = _this2.slotSize;
            _this2.model.name = _this2.model.name || 'Untitled Meeting';
            _this2.model.save(null, {
                success: function success() {
                    _ampersandApp2.default.me.meetings.add(_this2.model);
                    // Dirty hardcoded eliminate this page from the history
                    _ampersandApp2.default.router.history.history.pushState({}, document.title, '/home');
                    _ampersandApp2.default.navigate('/meeting/' + _this2.model.mid + '/edit');
                }
            });
        }, function (err) {
            // TODO: handle err?
            console.error(err);
        });
    },
    handleCancelClick: function handleCancelClick() {
        // TODO: find a better way to determine `isNew()` for a meeting
        this.model.isNew = function () {
            return true;
        };
        this.model.destroy();
        _ampersandApp2.default.navigate('/');
    },
    updateForm: function updateForm() {
        if (this.dates.length && this.times.length) {
            this.queryByHook('confirm').removeAttribute('disabled');
        } else {
            this.queryByHook('confirm').disabled = true;
        }
    }
});

},{"../helpers/dateTimeHelper":1,"../helpers/shepherd":3,"../models/collections/timeRangeCollection":10,"../models/dateList":13,"../templates/pages/editNewMeeting.html":53,"../views/base":67,"../views/calendarPicker":68,"../views/timePeriodPicker":82,"ampersand-app":92,"lodash/defer":316}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _rsvp = require('./rsvp');

var _rsvp2 = _interopRequireDefault(_rsvp);

var _defer = require('lodash/defer');

var _defer2 = _interopRequireDefault(_defer);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _rsvp2.default.extend({
    initialize: function initialize() {
        _rsvp2.default.prototype.initialize.apply(this, arguments);
        this.saveTimeslots = (0, _debounce2.default)(this.saveTimeslots.bind(this), 400);
        document.body.addEventListener('mouseup', this.saveTimeslots);
    },
    cleanup: function cleanup() {
        _rsvp2.default.prototype.cleanup.apply(this, arguments);
        document.body.removeEventListener('mouseup', this.saveTimeslots);
    },
    render: function render() {
        var _this = this;

        _rsvp2.default.prototype.render.apply(this, arguments);
        // Defer until the timegrid is inserted into the DOM
        (0, _defer2.default)(function () {
            // Dubiously get the timegrid element from the page
            var timegrid = document.querySelector('[data-hook=grid]').parentNode;

            // Reset styles for embeddable page
            document.body.style.paddingTop = 0;
            document.documentElement.style.overflow = 'auto';
            document.getElementById('page').style.overflowX = 'auto';
            // Timegrid view rerenders itself entirely - needs to be fixed
            _this.listenTo(_this.rsvpGrid, 'render', function () {
                document.querySelector('[data-hook=grid-columns]').style.paddingRight = '24px';
                document.querySelector('[data-hook=grid-body]').style.maxWidth = 'initial';
            });

            // Remove all elements that aren't the timegrid
            var current = document.body;
            while (current !== timegrid) {
                for (var i = 0; i < current.children.length; i++) {
                    var child = current.children[i];
                    if (!child.contains(timegrid)) {
                        child.parentNode.removeChild(child);
                        i--;
                    }
                }
                current = current.firstChild;
            }
        });
        return this;
    },
    saveTimeslots: function saveTimeslots() {
        this.user.timeslots.save();
    }
});

},{"./rsvp":32,"lodash/debounce":314,"lodash/defer":316}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _base = require('../views/base');

var _base2 = _interopRequireDefault(_base);

var _shepherd = require('../helpers/shepherd');

var _shepherd2 = _interopRequireDefault(_shepherd);

var _finalizegrid = require('../views/timegrid/finalizegrid');

var _finalizegrid2 = _interopRequireDefault(_finalizegrid);

var _meeting = require('../models/meeting');

var _meeting2 = _interopRequireDefault(_meeting);

var _dateTimeHelper = require('../helpers/dateTimeHelper');

var _dateTimeHelper2 = _interopRequireDefault(_dateTimeHelper);

var _defer = require('lodash/defer');

var _defer2 = _interopRequireDefault(_defer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = _base2.default.extend({
    template: require('../templates/pages/finalize.html'),

    bindings: {
        'model.name': {
            type: 'text',
            hook: 'meeting-name'
        },
        'model.description': {
            type: 'text',
            hook: 'meeting-message'
        }
    },

    events: {
        'click [data-hook=finalize]': 'handleFinalizeClick',
        'click [data-hook=back]': 'handleBackClick'
    },

    subviews: {
        finalizeGrid: {
            hook: 'finalize-grid',
            prepareView: function prepareView(el) {
                return new _finalizegrid2.default({
                    el: el,
                    model: this.model
                });
            }
        }
    },

    pageTitle: function pageTitle() {
        return 'Finalize ' + this.model.name;
    },
    initialize: function initialize(options) {
        var _this = this;

        if (!options || !options.mid) {
            throw new Error('Finalize page view options must include mid.');
        }

        _base2.default.prototype.initialize.apply(this, arguments);
        this.user = options.user || _ampersandApp2.default.me;
        this.model = this.user.meetings.get(options.mid) || new _meeting2.default({ mid: options.mid });
        // Fetch the relevant info for this meeting
        this.model.fetch({
            success: function success() {
                if (!_this.model.createdByMe) {
                    // TODO: show a notification
                    _ampersandApp2.default.navigate('/');
                    return;
                }
                _this.model.users.fetch({
                    success: function success() {
                        if (_this.model.users.get(_this.user.getId())) {
                            _this.model.users.remove({ _id: _this.user._id });
                            _this.model.users.add(_this.user);
                        }
                        var promises = [];
                        _this.model.users.forEach(function (user) {
                            promises.push(new Promise(function (resolve, reject) {
                                user.timeslots.fetchByMid(_this.model.mid, {
                                    success: resolve,
                                    error: reject
                                });
                            }));
                        });
                        Promise.all(promises).then(function () {
                            _this.trigger('ready');
                        });
                    }
                });
            },
            error: function error(meeting, response) {
                if (response.statusCode === 404) {
                    _ampersandApp2.default.navigate('/404');
                }
            }
        });

        this.once('ready', function () {
            (0, _defer2.default)(function () {
                if (window.innerWidth > 992) {
                    _ampersandApp2.default.prometheus.deliver('shepherd-finalize', function () {
                        _shepherd2.default.finalize.start();
                    });
                }
            });
        });
    },
    handleFinalizeClick: function handleFinalizeClick() {
        this.handleFinalizeConfirm();
    },
    handleBackClick: function handleBackClick() {
        _ampersandApp2.default.navigate('/meeting/' + this.model.mid);
    },
    handleFinalizeConfirm: function handleFinalizeConfirm() {
        var _this2 = this;

        var slotsToFinalize = this.finalizeGrid.getSlotsToFinalize();
        var times = slotsToFinalize.map(function (slot) {
            return slot.time.getTime();
        });
        var errorEl = this.queryByHook('error');

        // Validate some times were picked
        if (times.length === 0) {
            errorEl.textContent = 'Must select at least one time.';
            return;
        }

        // Validate times are on the same day
        var day = new Date(times[0]).setHours(0, 0, 0, 0);
        var sameDay = times.every(function (time) {
            return time - day > 0 && time - day < 24 * 60 * 60 * 1000;
        });
        if (!sameDay) {
            errorEl.textContent = 'Please select times that are on the same day.';
            return;
        }

        // Validate times are consecutive
        var interval = this.model.slotDuration * _dateTimeHelper2.default.MINUTE;
        var isConsecutive = function isConsecutive() {
            for (var i = 1; i < times.length; i++) {
                if (times[i] - times[i - 1] !== interval) {
                    return false;
                }
            }
            return true;
        }();
        if (!isConsecutive) {
            errorEl.textContent = 'Please select consecutive times.';
            return;
        }

        // Ensure the slots selected have more than 2 users in them
        var possibleFinalizedUsers = slotsToFinalize
        // Get all possible free users from the finalized slots
        .map(function (slot) {
            return slot.freeUsers;
        })
        // Flatten the array of freeUser arrays into one long array
        .reduce(function (arr, users) {
            return arr.concat(users);
        }, [])
        // Remove duplicate models
        .filter(function (user, index, self) {
            return self.indexOf(user) === index;
        });
        if (possibleFinalizedUsers.length < 2) {
            errorEl.textContent = 'Please select a block of time where more than two people are free.';
            return;
        }

        // Clear error
        errorEl.textContent = '';

        // Confirm finalization
        var start = _ampersandApp2.default.moment(Math.min.apply(Math, _toConsumableArray(times)));
        var end = _ampersandApp2.default.moment(Math.max.apply(Math, _toConsumableArray(times)));
        var html = '<p>Enter a meeting location (optional)</p>';
        html += '<input type="text" name="location"></input>';
        html += '<p>Enter a meeting purpose (optional)</p>';
        html += '<input type="text" name="purpose"></input>';
        _ampersandApp2.default.vex.dialog.open({
            unsafeMessage: '<p><strong>' + start.format('dddd M/D') + ' from ' + start.format('hh:mm A') + ' ' + ('to ' + end.clone().add(this.model.slotDuration, 'minutes').format('hh:mm A') + '</strong></p>'),
            input: html,
            buttons: [Object.assign({}, _ampersandApp2.default.vex.dialog.buttons.YES, { text: 'Confirm' }), Object.assign({}, _ampersandApp2.default.vex.dialog.buttons.NO, { text: 'Cancel' })],
            callback: function callback(data) {
                if (data === false) return;
                // Allow the user to pick which responders they want to finalize at this time
                _this2.gatherInvitedUsers(start.toDate(), end.toDate()).then(function (invitedUserIds) {
                    // Finalize the meeting
                    var startTime = start.valueOf();
                    var endTime = end.add(_this2.model.slotDuration, 'minutes').valueOf();
                    var location = data.location || '';
                    var purpose = data.purpose || '';
                    // Finalize all of the slots of the invited users
                    _this2.model.finalize(startTime, endTime, location, purpose, invitedUserIds, invitedUserIds).then(function () {
                        // Then force refetch your timeslots
                        _this2.user.timeslots.fetchByMid(_this2.model.mid, {
                            force: true,
                            success: function success() {
                                _ampersandApp2.default.navigate('/meeting/' + _this2.model.mid);
                            }
                        });
                    }).catch(function (err) {
                        console.error(err);
                        _ampersandApp2.default.vex.dialog.alert('Meeting could not be finalized. Try again soon.');
                    });
                }).catch(function (err) {
                    console.error(err);
                });
            }
        });
    },
    gatherInvitedUsers: function gatherInvitedUsers(startTime, endTime) {
        var _this3 = this;

        var freeUsers = this.model.getUsersFreeAtTimeRange(startTime, endTime);
        var partiallyFreeUsers = this.model.getUsersPartiallyFreeAtTimeRange(startTime, endTime);
        var busyUsers = this.model.getUsersBusyAtTimeRange(startTime, endTime);
        return new Promise(function (resolve, reject) {
            var html = '';
            var memberToHtml = function memberToHtml(member) {
                html += '<div class="listGroup__item">';
                html += '<input type="checkbox" name="member" class="filter-user listGroup__element" ';
                html += 'id="' + member._id + '">';
                html += '<label for="' + member._id + '"';
                html += 'class="member-data transfer" id="member-data-' + member._id + '">';
                html += '<span class="listGroup__element listGroup__element--img u-circle"';
                html += ' style="background-image: url(\'' + member.picture + '\')"></span>';
                html += '<span class="listGroup__element listGroup__element--text">';
                html += '' + (member._id === (_this3.model.creator._id || _this3.model.creator) ? 'Me' : member.name);
                html += '</div>';
            };
            html += '<h4>Free</h4>';
            html += '<div class="listGroup">';
            freeUsers.forEach(memberToHtml);
            html += '</div>';
            if (partiallyFreeUsers.length > 0) {
                html += '<h4>Partially Free</h4>';
                html += '<div class="listGroup">';
                partiallyFreeUsers.forEach(memberToHtml);
                html += '</div>';
            }
            if (busyUsers.length > 0) {
                html += '<h4>Busy</h4>';
                html += '<div class="listGroup">';
                busyUsers.forEach(memberToHtml);
                html += '</div>';
            }

            var dialog = _ampersandApp2.default.vex.dialog.open({
                message: 'Who would you like to send an email invitation to for this time?' + ' Invite at least two members.',
                input: html,
                buttons: [Object.assign({}, _ampersandApp2.default.vex.dialog.buttons.YES, { text: 'Invite!' }), Object.assign({}, _ampersandApp2.default.vex.dialog.buttons.NO, { text: 'Cancel' })],
                callback: function callback(data) {
                    if (data === false) {
                        reject();
                        return;
                    }
                    var finalizedUsers = [];
                    var checkedBoxes = this.content.querySelectorAll('input:checked');
                    for (var i = 0; i < checkedBoxes.length; i++) {
                        finalizedUsers.push(checkedBoxes[i].id);
                    }
                    if (finalizedUsers.length >= 2) {
                        resolve(finalizedUsers);
                    } else {
                        reject();
                    }
                }
            });
            var submitButton = dialog.form.querySelector('button[type="submit"]');
            submitButton.setAttribute('disabled', true);
            var checks = dialog.form.querySelectorAll('input[type="checkbox"]');
            var handler = function handler() {
                if (dialog.form.querySelectorAll('input:checked').length >= 2) {
                    submitButton.removeAttribute('disabled');
                } else {
                    submitButton.setAttribute('disabled', true);
                }
            };
            for (var i = 0; i < checks.length; i++) {
                checks[i].addEventListener('change', handler);
            }
        });
    }
});

},{"../helpers/dateTimeHelper":1,"../helpers/shepherd":3,"../models/meeting":14,"../templates/pages/finalize.html":54,"../views/base":67,"../views/timegrid/finalizegrid":87,"ampersand-app":92,"lodash/defer":316}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _ampersandFilteredSubcollection = require('ampersand-filtered-subcollection');

var _ampersandFilteredSubcollection2 = _interopRequireDefault(_ampersandFilteredSubcollection);

var _dateTimeHelper = require('../helpers/dateTimeHelper');

var _dateTimeHelper2 = _interopRequireDefault(_dateTimeHelper);

var _base = require('../views/base');

var _base2 = _interopRequireDefault(_base);

var _meetingBlock = require('../views/meetingBlock');

var _meetingBlock2 = _interopRequireDefault(_meetingBlock);

var _defer = require('lodash/defer');

var _defer2 = _interopRequireDefault(_defer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    pageTitle: 'Omnipointment',
    template: require('../templates/pages/home.html'),

    bindings: {
        'model.hasMeetingsInThePast': {
            type: 'booleanClass',
            name: 'is-hidden',
            hook: 'walkthrough'
        },
        'model.meetings': {
            type: function type(el, val) {
                if (val.length > 2) {
                    el.classList.add('is-hidden');
                } else {
                    el.classList.remove('is-hidden');
                }
            },

            hook: 'help-text'
        }
    },

    events: {
        'click [data-hook=walkthrough]': 'handleWalkthroughClick',
        'click [data-hook=sample-respond]': 'handleSampleRespondClick',
        'click [data-hook=create]': 'handleCreateClick'
    },

    initialize: function initialize() {
        var _this = this;

        _base2.default.prototype.initialize.apply(this, arguments);

        // Setup some subcollections to represent the meetings we want to show on this screen
        var futureMeetings = new _ampersandFilteredSubcollection2.default(this.model.meetings, {
            filter: function filter(meeting) {
                return meeting.latestMeetingSlot && meeting.latestMeetingSlot.time.getTime() > Date.now();
            },
            comparator: function comparator(one, two) {
                return _dateTimeHelper2.default.dateCompareAsc(one.earliestMeetingSlot.time, two.earliestMeetingSlot.time);
            }
        });
        this.organizedMeetings = new _ampersandFilteredSubcollection2.default(futureMeetings, {
            watched: ['creator'],
            filter: function filter(meeting) {
                return meeting.createdByMe;
            }
        });
        this.invitedMeetings = new _ampersandFilteredSubcollection2.default(futureMeetings, {
            watched: ['creator'],
            filter: function filter(meeting) {
                return !meeting.createdByMe;
            }
        });
        this.listenTo(this.organizedMeetings, 'add remove', this.handleEmptyState);
        this.listenTo(this.invitedMeetings, 'add remove', this.handleEmptyState);

        // Fetch the user's meetings
        this.model.meetings.fetch({
            success: function success() {
                var promises = [];
                futureMeetings.forEach(function (meeting) {
                    promises.push(new Promise(function (resolve, reject) {
                        _this.model.timeslots.fetchByMid(meeting.mid, {
                            success: resolve,
                            error: reject
                        });
                    }));
                });
                Promise.all(promises).then(function () {
                    (0, _defer2.default)(function () {
                        futureMeetings.forEach(function (meeting) {
                            return meeting.trigger('change:respondedToByMe');
                        });
                        _this.trigger('ready');
                    });
                });
            }
        });
    },
    render: function render() {
        _base2.default.prototype.render.call(this);
        this.handleEmptyState();
        this.renderCollection(this.organizedMeetings, _meetingBlock2.default, this.queryByHook('meetings-organized'));
        this.renderCollection(this.invitedMeetings, _meetingBlock2.default, this.queryByHook('meetings-invited'));
        return this;
    },
    handleEmptyState: function handleEmptyState() {
        if (this.organizedMeetings.length > 0) {
            this.queryByHook('sample').classList.add('is-hidden');
            this.queryByHook('organized-empty').classList.add('is-hidden');
        } else {
            this.queryByHook('sample').classList.remove('is-hidden');
            this.queryByHook('organized-empty').classList.remove('is-hidden');
        }
        if (this.invitedMeetings.length > 0) {
            this.queryByHook('invited-empty').classList.add('is-hidden');
        } else {
            this.queryByHook('invited-empty').classList.remove('is-hidden');
        }
    },
    handleSampleRespondClick: function handleSampleRespondClick() {
        var nav = function nav() {
            return _ampersandApp2.default.navigate('meeting/sample');
        };
        _ampersandApp2.default.prometheus.redeem('OMNIGUIDE', nav, nav, { silent: false });
    },
    handleWalkthroughClick: function handleWalkthroughClick() {
        this.handleSampleRespondClick();
    },
    handleCreateClick: function handleCreateClick() {
        _ampersandApp2.default.navigate('meeting/create');
    }
});

},{"../helpers/dateTimeHelper":1,"../templates/pages/home.html":55,"../views/base":67,"../views/meetingBlock":76,"ampersand-app":92,"ampersand-filtered-subcollection":101,"lodash/defer":316}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _defer = require('lodash/defer');

var _defer2 = _interopRequireDefault(_defer);

var _base = require('../views/base');

var _base2 = _interopRequireDefault(_base);

var _timegrid = require('../views/timegrid/timegrid');

var _timegrid2 = _interopRequireDefault(_timegrid);

var _meeting = require('../models/meeting');

var _meeting2 = _interopRequireDefault(_meeting);

var _shepherd = require('../helpers/shepherd');

var _shepherd2 = _interopRequireDefault(_shepherd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/pages/meeting.html'),

    bindings: {
        'model.name': {
            type: 'text',
            hook: 'meeting-name'
        },
        'model.description': {
            type: 'text',
            hook: 'meeting-message'
        },
        'model.createdByMe': [{
            type: 'toggle',
            hook: 'edit'
        }, {
            type: function type(el, val) {
                if (val && this.model.users.length >= 2) {
                    el.style.display = 'inline-block';
                } else {
                    el.style.display = 'none';
                }
            },

            hook: 'finalize'
        }],
        'model.ratingsUnlocked': {
            type: 'toggle',
            hook: 'rate'
        }
    },

    events: {
        'click [data-hook=rsvp]': 'handleRsvpClick',
        'click [data-hook=edit]': 'handleEditClick',
        'click [data-hook=finalize]': 'handleFinalizeClick',
        'click [data-hook=copy-url]': 'handleCopyUrlClick',
        'click [data-hook=video-call]': 'handleVideoClick',
        'click [data-hook=rate]': 'handleRateClick'
    },

    subviews: {
        timeGrid: {
            hook: 'time-grid',
            prepareView: function prepareView(el) {
                return new _timegrid2.default({
                    el: el,
                    model: this.model
                });
            }
        }
    },

    pageTitle: function pageTitle() {
        return this.model.name;
    },
    initialize: function initialize(options) {
        var _this = this;

        if (!options || !options.mid) {
            throw new Error('Meeting page view options must include mid.');
        }

        _base2.default.prototype.initialize.apply(this, arguments);
        this.user = options.user || _ampersandApp2.default.me;
        this.model = this.user.meetings.get(options.mid) || new _meeting2.default({ mid: options.mid });
        this.model.meetingSlots.reset();
        // TODO: think about adding something to BaseView, or finding a better binding for this
        // Register a dank dependent binding
        this.listenTo(this.model, 'change:users', function () {
            _this._applyBindingsForKey('model.createdByMe');
        });
        this.model.fetch({
            success: function success() {
                _this.model.users.fetch({
                    success: function success() {
                        if (_this.model.users.get(_this.user.getId())) {
                            _this.model.users.remove({ _id: _this.user._id });
                            _this.model.users.add(_this.user);
                        }

                        // If the current user is not a responder or creator, redirect them to the rsvp page
                        var isResponder = !!_this.model.users.get(_this.user);
                        var isCreator = _this.model.createdByMe;
                        var skip = _this.model.mid === 'sample' || window.location.search.indexOf('rdr=false') !== -1;
                        if (!skip && !isResponder && !isCreator) {
                            (0, _defer2.default)(function () {
                                return _ampersandApp2.default.navigate('/meeting/' + _this.model.mid + '/rsvp');
                            });
                            return;
                        }

                        // Fetch individual responders' timeslots
                        var promises = [];
                        _this.model.users.forEach(function (user) {
                            promises.push(new Promise(function (resolve, reject) {
                                user.timeslots.fetchByMid(_this.model.mid, {
                                    success: resolve,
                                    error: reject
                                });
                            }));
                        });
                        Promise.all(promises).then(function () {
                            _this.trigger('ready');
                        });
                    }
                });
            },
            error: function error(meeting, response) {
                if (response.statusCode === 404) {
                    _ampersandApp2.default.navigate('/404');
                }
            }
        });

        this.once('render', function () {
            _ampersandApp2.default.prometheus.can('video-call', function () {
                if (_this.model.users.length <= 8) {
                    _this.queryByHook('video-call').style.display = 'inline-block';
                }
            }, function () {
                _this.queryByHook('video-call').style.display = 'none';
            });

            _ampersandApp2.default.prometheus.can('is-student', function () {
                _this.queryByHook('rate-student').classList.remove('is-hidden');
            });
        });

        this.once('ready', function () {
            // shepherd code
            (0, _defer2.default)(function () {
                if (window.innerWidth > 992) {
                    _ampersandApp2.default.prometheus.deliver('shepherd-meeting', function () {
                        _shepherd2.default.meeting.start();
                    });
                }
            });
        });
    },
    handleRsvpClick: function handleRsvpClick() {
        _ampersandApp2.default.navigate('/meeting/' + this.model.mid + '/rsvp');
    },
    handleEditClick: function handleEditClick() {
        _ampersandApp2.default.navigate('meeting/' + this.model.mid + '/edit');
    },
    handleFinalizeClick: function handleFinalizeClick() {
        _ampersandApp2.default.navigate('/meeting/' + this.model.mid + '/finalize');
    },
    handleRateClick: function handleRateClick() {
        _ampersandApp2.default.navigate('/meeting/' + this.model.mid + '/ratings');
    },
    handleCopyUrlClick: function handleCopyUrlClick(e) {
        // Many thanks to Zeno Rocha:
        // https://github.com/zenorocha/clipboard.js/blob/ff3cd2c722b744fa21d0fc621a08ad88b7a38189/src/clipboard-action.js#L53
        var isRTL = document.documentElement.getAttribute('dir') === 'rtl';
        var tempInput = document.createElement('textarea');
        // Prevent zooming on iOS
        tempInput.style.fontSize = '12pt';
        // Reset box model
        tempInput.style.border = '0';
        tempInput.style.padding = '0';
        tempInput.style.margin = '0';
        // Move element out of screen horizontally
        tempInput.style.position = 'fixed';
        tempInput.style[isRTL ? 'right' : 'left'] = '-9999px';
        // Move element to the same position vertically
        tempInput.style.top = (window.pageYOffset || document.documentElement.scrollTop) + ' px';
        tempInput.setAttribute('readonly', '');
        tempInput.value = location.protocol + '//' + location.host + location.pathname;
        document.body.appendChild(tempInput);
        tempInput.select();

        try {
            (function () {
                if (!document.execCommand('copy')) {
                    throw new Error();
                }
                tempInput.blur();
                var oldText = e.target.innerHTML;
                e.target.innerHTML = 'Copied!';
                setTimeout(function () {
                    e.target.innerHTML = oldText;
                }, 2000);
            })();
        } catch (err) {
            /* eslint no-alert: 0 */
            window.prompt('Press Ctrl/Cmd+C to copy.', tempInput.value);
        } finally {
            document.body.removeChild(tempInput);
        }
    },
    handleVideoClick: function handleVideoClick() {
        var mid = this.model.mid;
        _ampersandApp2.default.prometheus.save({
            type: 'VIDEO_CALL',
            mid: mid
        });
        var url = 'https://appear.in/omnipointment/' + mid;
        var win = window.open(url, '_blank');
        win.focus();
    }

    // handleImportClick() {
    //     me.getAvailabilityByMeeting(this.model.mid).then(data => {
    //         const busyRanges = data.busyRanges;
    //         for (let i = 0; i < busyRanges.length; i++) {
    //             busyRanges[i].start = new Date(busyRanges[i].start);
    //             busyRanges[i].end = new Date(busyRanges[i].end);
    //         }

    //         function isAvailable(time) {
    //             let available = true;
    //             for (let i = 0; i < busyRanges.length; i++) {
    //                 const range = busyRanges[i];
    //                 if (time >= range.start.getTime() && time <= range.end.getTime()) {
    //                     available = false;
    //                     break;
    //                 }
    //             }
    //             return available;
    //         }

    //         const timeslots = [];
    //         for (let time = data.meetingStart; time <= data.meetingEnd; time += 15 * 60 * 1000) {
    //             const slot = {
    //                 userId: me._id,
    //                 time: time,
    //                 free: isAvailable(time) ? 2 : 0,
    //                 duration: 15
    //             };
    //             const notExists = me.timeslots.get(time) === undefined;
    //             if (notExists || me.timeslots.get(time).mid === undefined || me.timeslots.get(time).mid === null) {
    //                 timeslots.push(slot);
    //                 me.timeslots.set(time, new Timeslot(slot));
    //             }
    //         }
    //         me.addTimeslots(timeslots).then(this.handleRsvpClick.bind(this));
    //     });
    // },

});

},{"../helpers/shepherd":3,"../models/meeting":14,"../templates/pages/meeting.html":56,"../views/base":67,"../views/timegrid/timegrid":90,"ampersand-app":92,"lodash/defer":316}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _base = require('../views/base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    pageTitle: 'Your Omniaccount',
    template: require('../templates/pages/myAccount.html'),
    ready: true,

    session: {
        emailChanged: 'boolean'
    },

    bindings: {
        'model.name': {
            type: 'text',
            hook: 'user-name'
        },
        'model.picture': {
            type: 'attribute',
            name: 'src',
            hook: 'user-picture'
        },
        'model.email': {
            type: 'value',
            hook: 'user-email'
        },
        'model.createdAt': {
            type: function type(el, val) {
                el.textContent = _ampersandApp2.default.moment(val).format('MMMM Do, YYYY');
            },

            hook: 'user-createdAt'
        },
        'model.freeByDefault': {
            type: 'booleanAttribute',
            name: 'checked',
            hook: 'freeByDefault'
        },
        emailChanged: {
            type: 'booleanAttribute',
            name: 'disabled',
            invert: true,
            hook: 'user-email-submit'
        }
    },

    events: {
        'input [data-hook=user-email]': 'handleEmailChange',
        'keypress [data-hook=user-email]': 'handleEmailKeypress',
        'click [data-hook=user-email-submit]': 'handleEmailSubmit',
        'click [data-hook=freeByDefault]': 'handleFreeByDefaultClick'
    },

    initialize: function initialize() {
        _base2.default.prototype.initialize.apply(this, arguments);
        this.originalEmail = this.model.email;
    },
    handleEmailChange: function handleEmailChange(e) {
        if (e.target.value !== this.originalEmail && e.target.value.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
            this.emailChanged = true;
        } else {
            this.emailChanged = false;
        }
    },
    handleEmailKeypress: function handleEmailKeypress(e) {
        if (e.keyCode === 13 || e.which === 13) {
            this.handleEmailSubmit();
        }
    },
    handleEmailSubmit: function handleEmailSubmit() {
        var _this = this;

        if (this._submitting) {
            return;
        }
        this._submitting = true;
        // TODO: Move to a utility file
        var changeButton = function changeButton(oldClass, newClass, newContent, timeout) {
            var button = _this.queryByHook('user-email-submit');
            button.classList.remove(oldClass);
            button.classList.add(newClass);
            var oldContent = button.innerHTML;
            button.innerHTML = newContent;
            setTimeout(function () {
                button.classList.remove(newClass);
                button.classList.add(oldClass);
                button.innerHTML = oldContent;
                _this._submitting = false;
            }, timeout);
        };
        var newEmail = this.queryByHook('user-email').value;
        this.model.saveCustomEmail(newEmail).then(function () {
            _this.originalEmail = newEmail;
            setTimeout(function () {
                _this.emailChanged = false;
            }, 2500);
            changeButton('btn--ghost', 'btn--success', 'Success!', 2500);
        }).catch(function () {
            changeButton('btn--ghost', 'btn--danger', 'Error :(', 2500);
        });
    },
    handleFreeByDefaultClick: function handleFreeByDefaultClick(e) {
        var _this2 = this;

        if (e.target.checked) {
            this.model.freeByDefault = true;
        } else {
            this.model.freeByDefault = false;
        }
        var showSaveFeedback = function showSaveFeedback(message, clazz, timeout) {
            var feedbackEl = _this2.queryByHook('feedback');
            feedbackEl.classList.add(clazz);
            feedbackEl.innerHTML = message;
            feedbackEl.classList.remove('is-hidden');
            setTimeout(function () {
                feedbackEl.classList.add('is-hidden');
                feedbackEl.classList.remove(clazz);
                feedbackEl.innerHTML = '';
            }, timeout);
        };
        this.model.save(null, {
            success: function success() {
                showSaveFeedback('&#10004;', 'u-success', 2000);
            },
            error: function error() {
                showSaveFeedback('Error', 'u-danger', 2000);
            }
        });
    }
});

},{"../templates/pages/myAccount.html":57,"../views/base":67,"ampersand-app":92}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandFilteredSubcollection = require('ampersand-filtered-subcollection');

var _ampersandFilteredSubcollection2 = _interopRequireDefault(_ampersandFilteredSubcollection);

var _base = require('../views/base');

var _base2 = _interopRequireDefault(_base);

var _meetingSummary = require('../views/meetingSummary');

var _meetingSummary2 = _interopRequireDefault(_meetingSummary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/pages/myMeetings.html'),
    pageTitle: 'My Meetings',

    initialize: function initialize() {
        var _this = this;

        _base2.default.prototype.initialize.apply(this, arguments);
        this.model.meetings.fetch({
            success: function success() {
                _this.trigger('ready');
            }
        });
        this.organizedMeetings = new _ampersandFilteredSubcollection2.default(this.model.meetings, {
            watched: ['creator'],
            filter: function filter(meeting) {
                return meeting.createdByMe;
            }
        });
        this.invitedMeetings = new _ampersandFilteredSubcollection2.default(this.model.meetings, {
            watched: ['creator'],
            filter: function filter(meeting) {
                return !meeting.createdByMe;
            }
        });
        this.listenTo(this.organizedMeetings, 'add remove', this.handleEmptyState);
        this.listenTo(this.invitedMeetings, 'add remove', this.handleEmptyState);
    },
    render: function render() {
        _base2.default.prototype.render.call(this);
        this.handleEmptyState();
        this.renderCollection(this.organizedMeetings, _meetingSummary2.default, this.queryByHook('organized'));
        this.renderCollection(this.invitedMeetings, _meetingSummary2.default, this.queryByHook('invited'));
        return this;
    },
    handleEmptyState: function handleEmptyState() {
        if (this.organizedMeetings.length > 0) {
            this.queryByHook('organized-empty').classList.add('is-hidden');
        } else {
            this.queryByHook('organized-empty').classList.remove('is-hidden');
        }
        if (this.invitedMeetings.length > 0) {
            this.queryByHook('invited-empty').classList.add('is-hidden');
        } else {
            this.queryByHook('invited-empty').classList.remove('is-hidden');
        }
    }
});

},{"../templates/pages/myMeetings.html":58,"../views/base":67,"../views/meetingSummary":77,"ampersand-filtered-subcollection":101}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _base = require('../views/base');

var _base2 = _interopRequireDefault(_base);

var _defer = require('lodash/defer');

var _defer2 = _interopRequireDefault(_defer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    pageTitle: 'Omnipromos',
    template: require('../templates/pages/promo.html'),
    ready: true,

    session: {
        promoCode: 'string'
    },

    bindings: {
        promoCode: {
            type: 'value',
            hook: 'code'
        }
    },

    events: {
        'click [data-hook=redeem]': 'handleRedeemClick'
    },

    initialize: function initialize() {
        var _this = this;

        _base2.default.prototype.initialize.apply(this, arguments);
        this.promoCode = window.location.search.substring(window.location.search.indexOf('code=') + 'code='.length);
        this.once('ready', function () {
            (0, _defer2.default)(function () {
                _this.queryByHook('code').focus();
            });
        });
    },
    handleRedeemClick: function handleRedeemClick() {
        var el = this.queryByHook('response');
        el.style.display = 'block';
        el.textContent = '';
        var promoCode = this.queryByHook('code').value;
        _ampersandApp2.default.prometheus.redeem(promoCode, function (result) {
            el.innerHTML = '<p>Success! Here\'s what you redeemed:</p><h3>' + result.title + ': ' + result.description + '</h3>';
        }, function (err) {
            el.textContent = 'Something went wrong: ' + err.message;
        });
    }
});

},{"../templates/pages/promo.html":59,"../views/base":67,"ampersand-app":92,"lodash/defer":316}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _ampersandFilteredSubcollection = require('ampersand-filtered-subcollection');

var _ampersandFilteredSubcollection2 = _interopRequireDefault(_ampersandFilteredSubcollection);

var _cookiesJs = require('cookies-js');

var _cookiesJs2 = _interopRequireDefault(_cookiesJs);

var _base = require('../views/base');

var _base2 = _interopRequireDefault(_base);

var _rateUser = require('../views/rateUser');

var _rateUser2 = _interopRequireDefault(_rateUser);

var _ratingCollection = require('../models/collections/ratingCollection');

var _ratingCollection2 = _interopRequireDefault(_ratingCollection);

var _meeting = require('../models/meeting');

var _meeting2 = _interopRequireDefault(_meeting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/pages/ratings.html'),

    pageTitle: function pageTitle() {
        return 'Team Ratings (' + this.model.name + ')';
    },


    events: {
        'click [data-hook=save]': 'handleSaveClick'
    },

    initialize: function initialize(options) {
        var _this = this;

        if (!options || !options.mid) {
            throw new Error('Ratings page view options must include mid.');
        }

        _base2.default.prototype.initialize.apply(this, arguments);
        this.user = options.user || _ampersandApp2.default.me;
        this.model = this.user.meetings.get(options.mid) || new _meeting2.default({ mid: options.mid });

        // Users to rate
        this.usersToRate = new _ampersandFilteredSubcollection2.default(this.model.users, {
            filter: function filter() {
                // TODO: better filtering criteria
                // return user.getId() !== this.user.getId();
                return true;
            }
        });
        // The ratings collection that will actually be rendered
        this.ratings = new _ratingCollection2.default();
        var remapRatings = function remapRatings() {
            _this.ratings.reset();
            _this.ratings.add(_this.usersToRate.map(function (user) {
                return {
                    meeting: _this.model,
                    from: _this.user,
                    to: user
                };
            }));
        };
        this.usersToRate.once('sync', remapRatings);

        // Fetch the relevant info for this meeting
        this.model.fetch({
            success: function success() {
                if (!_this.model.ratingsUnlocked) {
                    // TODO: show a notification
                    _ampersandApp2.default.navigate('/meeting/' + _this.model.mid);
                    return;
                }
                _this.model.users.fetch({
                    success: function success() {
                        _this.trigger('ready');
                    }
                });
            },
            error: function error(meeting, response) {
                if (response.statusCode === 404) {
                    _ampersandApp2.default.navigate('/404');
                }
            }
        });
    },
    render: function render() {
        _base2.default.prototype.render.apply(this, arguments);
        this.rateUserViewCollection = this.renderCollection(this.ratings, _rateUser2.default, this.queryByHook('users'));
        return this;
    },
    handleSaveClick: function handleSaveClick() {
        var _this2 = this;

        // Validate each of the RateUsers
        if (!this.rateUserViewCollection.views.map(function (rateUserView) {
            return rateUserView.validate();
        }).every(function (validated) {
            return !!validated;
        })) {
            return;
        }

        // Save the ratings
        this.ratings.forEach(function (rating) {
            rating.timestamp = Date.now();
        });
        this.ratings.save({
            success: function success() {
                _this2.ratings.forEach(function (rating) {
                    return _ampersandApp2.default.prometheus.save(Object.assign({}, rating, { type: 'RATING' }));
                });
                _ampersandApp2.default.navigate('/meeting/' + _this2.model.mid);
                if (!_cookiesJs2.default.get('super_secret')) {
                    _ampersandApp2.default.vex.dialog.alert('Thanks, your feedback is appreciated! Remember to update your ratings when you meet again.');
                    _cookiesJs2.default.set('super_secret', true);
                }
            },
            error: function error() {
                _ampersandApp2.default.vex.alert('Something went wrong.');
            }
        });
    }
});

},{"../models/collections/ratingCollection":9,"../models/meeting":14,"../templates/pages/ratings.html":60,"../views/base":67,"../views/rateUser":80,"ampersand-app":92,"ampersand-filtered-subcollection":101,"cookies-js":114}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _defer = require('lodash/defer');

var _defer2 = _interopRequireDefault(_defer);

var _shepherd = require('../helpers/shepherd');

var _shepherd2 = _interopRequireDefault(_shepherd);

var _base = require('../views/base');

var _base2 = _interopRequireDefault(_base);

var _rsvpgrid = require('../views/timegrid/rsvpgrid');

var _rsvpgrid2 = _interopRequireDefault(_rsvpgrid);

var _progressBar = require('../views/progressBar');

var _progressBar2 = _interopRequireDefault(_progressBar);

var _meeting = require('../models/meeting');

var _meeting2 = _interopRequireDefault(_meeting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/pages/rsvp.html'),

    bindings: {
        'model.name': {
            type: 'text',
            hook: 'meeting-name'
        },
        'model.description': {
            type: 'text',
            hook: 'meeting-message'
        },
        percentage: {
            type: 'text',
            hook: 'rsvp-percentage'
        }
    },

    session: {
        percentage: 'string'
    },

    events: {
        'click [data-hook=save]': 'handleSaveClick'
    },

    subviews: {
        rsvpGrid: {
            hook: 'rsvp-grid',
            prepareView: function prepareView(el) {
                return new _rsvpgrid2.default({
                    el: el,
                    model: this.model
                });
            }
        },
        progressBar: {
            hook: 'progress-bar',
            constructor: _progressBar2.default
        }
    },

    pageTitle: function pageTitle() {
        return 'Respond to ' + this.model.name;
    },
    initialize: function initialize(options) {
        var _this = this;

        if (!options || !options.mid) {
            throw new Error('RSVP page view options must include mid.');
        }

        _base2.default.prototype.initialize.apply(this, arguments);
        this.user = options.user || _ampersandApp2.default.me;
        this.model = this.user.meetings.get(options.mid) || new _meeting2.default({ mid: options.mid });
        // Fetch the relevant info for this meeting
        this.model.fetch({
            success: function success() {
                // Add this user as a responder to this meeting
                _this.user.meetings.add(_this.model);
                var beforeLen = _this.model.users.length;
                var existing = _this.model.users.get(_this.user._id);
                if (existing) {
                    _this.model.users.remove(existing);
                    _this.model.users.add(_this.user);
                } else {
                    _this.model.users.add(_this.user);
                }
                if (_this.model.users.length > beforeLen) {
                    _this.model.users.save();
                }
                // Fetch the user's timeslots for this meeting
                _this.user.timeslots.fetchByMid(_this.model.mid, {
                    success: function success() {
                        _this.trigger('ready');
                        var freeBefore = _this.getFreeSlots();
                        _ampersandApp2.default.prometheus.timer('rsvp').start({
                            mid: _this.model.mid,
                            total: _this.model.enabledSlots.length,
                            free_before: freeBefore
                        });
                    }
                });
            }
        });

        this.once('ready', function () {
            (0, _defer2.default)(function () {
                // Set width of progress bar to match timegrid
                var container = _this.progressBar.el;
                var width = Math.min(_this.queryByHook('grid-columns').clientWidth, _this.queryByHook('grid-body').clientWidth);
                container.style.width = width + 'px';

                if (window.innerWidth > 992) {
                    _ampersandApp2.default.prometheus.deliver('shepherd-rsvp', function () {
                        (0, _defer2.default)(function () {
                            return _shepherd2.default.respond.start();
                        });
                    });
                }
            });
        });
    },
    render: function render() {
        var _this2 = this;

        _base2.default.prototype.render.apply(this, arguments);
        this.listenToAndRun(this.user.timeslots, 'sync change add', function () {
            _this2.calculatePercentage();
        });
        return this;
    },
    handleSaveClick: function handleSaveClick() {
        var _this3 = this;

        var db = _ampersandApp2.default.firebase.database().ref('rsvp-alerts/' + this.model.mid);
        db.push({
            uid: _ampersandApp2.default.me._id,
            timestamp: Date.now()
        });
        _ampersandApp2.default.prometheus.timer('rsvp').stop({
            free_after: this.getFreeSlots()
        });
        this.user.timeslots.save({
            success: function success() {
                _ampersandApp2.default.navigate('/meeting/' + _this3.model.mid);
            }
        });
    },
    calculatePercentage: function calculatePercentage() {
        var free = this.getFreeSlots();
        var totalSlots = this.model.enabledSlots.filter(function (slot) {
            return !slot.finalized;
        }).length;
        var percent = Math.round(free / totalSlots * 100) || 0;
        // Decoupled from implementation of progressBar:
        this.progressBar.setPercentage(percent);
    },
    getFreeSlots: function getFreeSlots() {
        var _this4 = this;

        return this.model.enabledSlots.map(function (slot) {
            var timeslot = _this4.user.timeslots.get(slot.time);
            return timeslot && timeslot.free > 0 ? 1 : 0;
        }).reduce(function (prev, curr) {
            return prev + curr;
        }, 0);
    }
});

},{"../helpers/shepherd":3,"../models/meeting":14,"../templates/pages/rsvp.html":61,"../views/base":67,"../views/progressBar":79,"../views/timegrid/rsvpgrid":89,"ampersand-app":92,"lodash/defer":316}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _base = require('../views/base');

var _base2 = _interopRequireDefault(_base);

var _navTabs = require('../views/navTabs');

var _navTabs2 = _interopRequireDefault(_navTabs);

var _calendarPicker = require('../views/calendarPicker');

var _calendarPicker2 = _interopRequireDefault(_calendarPicker);

var _timePicker = require('../views/timePicker');

var _timePicker2 = _interopRequireDefault(_timePicker);

var _creatorgrid = require('../views/timegrid/creatorgrid');

var _creatorgrid2 = _interopRequireDefault(_creatorgrid);

var _timegrid = require('../views/timegrid/timegrid');

var _timegrid2 = _interopRequireDefault(_timegrid);

var _rsvpgrid = require('../views/timegrid/rsvpgrid');

var _rsvpgrid2 = _interopRequireDefault(_rsvpgrid);

var _meeting = require('../models/meeting');

var _meeting2 = _interopRequireDefault(_meeting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserListGroupItemView = _base2.default.extend({
    template: function template() {
        return ['<div class="listGroup__item">', '<i class="fa fa-star-o" data-hook="active" style="margin-right:10px"></i>', '<div class="listGroup__element">', '<img class="listGroup__element listGroup__element--img u-circle" data-hook="picture"></img>', '<div class="listGroup__element listGroup__element--text">', '<span data-hook="first-name"></span>', '<span data-hook="last-name" class="u-hideXs"></span>', '</div>', '</div>', '<span class="remove" data-hook="remove">x</span>', '</div>'].join('');
    },

    bindings: {
        'model.picture': {
            type: 'attribute',
            name: 'src',
            hook: 'picture'
        },
        'model.firstName': {
            type: 'text',
            hook: 'first-name'
        },
        'model.lastName': {
            type: 'text',
            hook: 'last-name'
        },
        'model.active': {
            type: function type(el, val) {
                if (val) {
                    el.classList = 'fa fa-star';
                } else {
                    el.classList = 'fa fa-star-o';
                }
            },

            hook: 'active'
        }
    },
    events: {
        'click [data-hook=active]': 'handleActivateClick',
        'click [data-hook=remove]': 'handleRemoveClick'
    },
    handleActivateClick: function handleActivateClick() {
        var _this = this;

        this.model.active = !this.model.active;
        this.model.collection.forEach(function (user) {
            if (user !== _this.model && user.active === _this.model.active) {
                user.active = !_this.model.active;
            }
            user.trigger('change:active');
        });
    },
    handleRemoveClick: function handleRemoveClick() {
        this.model.collection.remove(this.model);
    }
});

exports.default = _base2.default.extend({
    pageTitle: 'Omnisandbox',
    template: require('../templates/pages/sandbox.html'),

    ready: true,

    events: {
        'click [data-hook=add-dates]': 'handleAddDatesClick',
        'click [data-hook=add-times]': 'handleAddTimesClick',
        'click [data-hook=add-user]': 'handleAddUserClick'
    },

    subviews: {
        tabs: {
            hook: 'sandbox-tabs',
            prepareView: function prepareView() {
                return new _navTabs2.default({
                    tabs: [{
                        label: '<i class="fa fa-wrench"></i> <span class="u-hideMd">Edit Grid</span>',
                        tab: new _creatorgrid2.default({
                            model: this.model
                        })
                    }, {
                        label: '<i class="fa fa-eye"></i> <span class="u-hideMd">View Responses</span>',
                        tab: new _timegrid2.default({
                            model: this.model
                        })
                    }, {
                        label: '<i class="fa fa-pencil"></i> <span class="u-hideMd">Respond</span>',
                        tab: new _rsvpgrid2.default({
                            model: this.model
                        })
                    }]
                });
            }
        }
    },

    initialize: function initialize() {
        var _this2 = this;

        _base2.default.prototype.initialize.apply(this, arguments);
        this.model = new _meeting2.default();
        this.model.meetingSlots.add({
            time: new Date()
        });
        this.listenTo(this.model.users, 'change:active', function () {
            var activeUser = _this2.model.users.filter(function (user) {
                return user.active;
            })[0];
            _this2.tabs.setTab2(new _rsvpgrid2.default({
                model: _this2.model,
                user: activeUser
            }));
            if (activeUser) {
                activeUser.trigger('change:timeslots');
            }
        });
    },
    render: function render() {
        _base2.default.prototype.render.apply(this, arguments);
        this.renderCollection(this.model.users, UserListGroupItemView, this.queryByHook('sandbox-users'));
        return this;
    },
    handleAddDatesClick: function handleAddDatesClick() {
        var _this3 = this;

        var calendarPicker = new _calendarPicker2.default({
            dates: this.model.meetingSlots.getDates(),
            renderDoneButton: true
        });
        var dialog = _ampersandApp2.default.vex.open({
            unsafeContent: calendarPicker.render().el,
            showCloseButton: false,
            overlayClosesOnClick: false,
            afterClose: function afterClose() {
                var dates = calendarPicker.getSelectedDates();
                _this3.model.meetingSlots.setDates(dates);
            }
        });
        calendarPicker.once('done', function () {
            return dialog.close();
        });
    },
    handleAddTimesClick: function handleAddTimesClick() {
        var _this4 = this;

        var timePicker = new _timePicker2.default({ slotDuration: this.model.slotDuration });
        var popup = _ampersandApp2.default.vex.open({
            unsafeContent: timePicker.render().el,
            showCloseButton: false
        });
        timePicker.once('add-times', function (timeRange) {
            popup.close();
            var interval = _this4.model.slotDuration * 60 * 1000;
            if (timeRange.end.getTime() - timeRange.start.getTime() < interval) {
                // TODO: popup/notification?
                console.warn('skipping time range, not long enough for slot size');
                return;
            }
            var currentTime = timeRange.start.getTime();
            var endTime = timeRange.end.getTime();
            for (; currentTime < endTime; currentTime += interval) {
                _this4.model.meetingSlots.addTime(new Date(currentTime));
            }
        });
    },
    handleAddUserClick: function handleAddUserClick() {
        var _this5 = this;

        _ampersandApp2.default.vex.dialog.open({
            message: 'Add New User',
            input: '\n                <label for="name">Name:</label>\n                <input name="name" type="text">\n                <label for="pictureUrl">Picture URL:</label>\n                <input name="pictureUrl" type="url">\n            ',
            callback: function callback(data) {
                if (!data || !data.name || !data.pictureUrl) {
                    return;
                }
                _this5.model.users.add({
                    name: data.name,
                    picture: data.pictureUrl
                });
            }
        });
    }
});

},{"../models/meeting":14,"../templates/pages/sandbox.html":62,"../views/base":67,"../views/calendarPicker":68,"../views/navTabs":78,"../views/timePicker":83,"../views/timegrid/creatorgrid":85,"../views/timegrid/rsvpgrid":89,"../views/timegrid/timegrid":90,"ampersand-app":92}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _ampersandRouter = require('ampersand-router');

var _ampersandRouter2 = _interopRequireDefault(_ampersandRouter);

var _home = require('./pages/home');

var _home2 = _interopRequireDefault(_home);

var _rsvp = require('./pages/rsvp');

var _rsvp2 = _interopRequireDefault(_rsvp);

var _about = require('./pages/about');

var _about2 = _interopRequireDefault(_about);

var _promo = require('./pages/promo');

var _promo2 = _interopRequireDefault(_promo);

var _ = require('./pages/404');

var _2 = _interopRequireDefault(_);

var _meeting = require('./pages/meeting');

var _meeting2 = _interopRequireDefault(_meeting);

var _sandbox = require('./pages/sandbox');

var _sandbox2 = _interopRequireDefault(_sandbox);

var _ratings = require('./pages/ratings');

var _ratings2 = _interopRequireDefault(_ratings);

var _finalize = require('./pages/finalize');

var _finalize2 = _interopRequireDefault(_finalize);

var _myAccount = require('./pages/myAccount');

var _myAccount2 = _interopRequireDefault(_myAccount);

var _myMeetings = require('./pages/myMeetings');

var _myMeetings2 = _interopRequireDefault(_myMeetings);

var _editMeeting = require('./pages/editMeeting');

var _editMeeting2 = _interopRequireDefault(_editMeeting);

var _editNewMeeting = require('./pages/editNewMeeting');

var _editNewMeeting2 = _interopRequireDefault(_editNewMeeting);

var _createMeeting = require('./pages/createMeeting');

var _createMeeting2 = _interopRequireDefault(_createMeeting);

var _embeddableRsvp = require('./pages/embeddableRsvp');

var _embeddableRsvp2 = _interopRequireDefault(_embeddableRsvp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _ampersandRouter2.default.extend({
    routes: {
        'promo': 'promo',
        'logout': 'logout',
        'about': 'showAbout',
        'menu': 'showMenu',
        'home': 'showHome',
        'me': 'showMyAccount',
        'me/meetings': 'showMyMeetings',
        'meeting/create': 'createMeeting',
        'meeting/:mid': 'showMeeting',
        'meeting/:mid/create': 'editNewMeeting',
        'meeting/:mid/rsvp': 'rsvpToMeeting',
        'meeting/:mid/rsvp/embed': 'showEmbeddableRsvp',
        'meeting/:mid/finalize': 'finalizeMeeting',
        'meeting/:mid/ratings': 'showRatings',
        'meeting/:mid/edit': 'editMeeting',
        'sandbox': 'sandbox',
        '404': 'notFound',
        '(*path)': 'catchAll'
    },

    initialize: function initialize() {
        this.on('route', this._pageView);
    },
    promo: function promo() {
        _ampersandApp2.default.prometheus.save({ type: 'PROMO_PAGE' });
        this.trigger('page', new _promo2.default({ model: _ampersandApp2.default.me }));
    },
    showMyAccount: function showMyAccount() {
        _ampersandApp2.default.prometheus.save({ type: 'MY_ACCOUNT' });
        this.trigger('page', new _myAccount2.default({ model: _ampersandApp2.default.me }));
    },
    showMyMeetings: function showMyMeetings() {
        _ampersandApp2.default.prometheus.save({ type: 'MY_MEETINGS' });
        this.trigger('page', new _myMeetings2.default({ model: _ampersandApp2.default.me }));
    },
    logout: function logout() {
        _ampersandApp2.default.prometheus.save({ type: 'LOGOUT' });
        window.location = '/logout';
    },
    showAbout: function showAbout() {
        _ampersandApp2.default.prometheus.save({ type: 'ABOUT_PAGE' });
        this.trigger('page', new _about2.default());
    },
    showMenu: function showMenu() {
        this.redirectTo('home');
    },
    showHome: function showHome() {
        _ampersandApp2.default.prometheus.save({ type: 'HOMEBASE_PAGE' });
        this.trigger('page', new _home2.default({ model: _ampersandApp2.default.me }));
    },
    createMeeting: function createMeeting() {
        _ampersandApp2.default.prometheus.save({ type: 'CREATE_MEETING' });
        this.trigger('page', new _createMeeting2.default());
    },
    showMeeting: function showMeeting(mid) {
        _ampersandApp2.default.prometheus.save({
            type: 'VIEW_MEETING',
            mid: mid
        });
        this.trigger('page', new _meeting2.default({
            mid: mid
        }));
    },
    editNewMeeting: function editNewMeeting(mid) {
        this.trigger('page', new _editNewMeeting2.default({
            mid: mid
        }));
    },
    rsvpToMeeting: function rsvpToMeeting(mid) {
        _ampersandApp2.default.prometheus.save({
            type: 'RSVP',
            mid: mid
        });
        this.trigger('page', new _rsvp2.default({
            mid: mid
        }));
    },
    showEmbeddableRsvp: function showEmbeddableRsvp(mid) {
        this.trigger('page', new _embeddableRsvp2.default({
            mid: mid
        }));
    },
    finalizeMeeting: function finalizeMeeting(mid) {
        _ampersandApp2.default.prometheus.save({
            type: 'FINALIZE',
            mid: mid
        });
        this.trigger('page', new _finalize2.default({
            mid: mid
        }));
    },
    showRatings: function showRatings(mid) {
        _ampersandApp2.default.prometheus.save({ type: 'RATINGS_PAGE' });
        this.trigger('page', new _ratings2.default({
            mid: mid
        }));
    },
    editMeeting: function editMeeting(mid) {
        _ampersandApp2.default.prometheus.save({
            type: 'EDIT_MEETING',
            mid: mid
        });
        this.trigger('page', new _editMeeting2.default({
            mid: mid
        }));
    },
    sandbox: function sandbox() {
        /* eslint no-alert: 0 */
        var pwd = window.prompt('whatisthepassword.png');
        if (pwd === 'youshallnotpass.mp4') {
            this.trigger('page', new _sandbox2.default());
        } else {
            this.redirectTo('404');
        }
    },
    notFound: function notFound() {
        _ampersandApp2.default.prometheus.save({ type: '404_PAGE' });
        this.trigger('page', new _2.default());
    },
    catchAll: function catchAll() {
        this.redirectTo('home');
    },
    _pageView: function _pageView() {
        var path = this.history.getFragment();
        ga('send', 'pageview', { page: '/' + path });
    }
}); /* eslint quote-props: 0 */

},{"./pages/404":19,"./pages/about":20,"./pages/createMeeting":21,"./pages/editMeeting":22,"./pages/editNewMeeting":23,"./pages/embeddableRsvp":24,"./pages/finalize":25,"./pages/home":26,"./pages/meeting":27,"./pages/myAccount":28,"./pages/myMeetings":29,"./pages/promo":30,"./pages/ratings":31,"./pages/rsvp":32,"./pages/sandbox":33,"ampersand-app":92,"ampersand-router":104}],35:[function(require,module,exports){
module.exports = "<div class=\"container container--wide container--condensed container--clear u-textCenter\"><h5 class=u-black data-hook=timezone-display>All times are in <span data-hook=timezone></span></h5><div class=timegrid data-hook=grid><div class=timegrid__body data-hook=grid-body><div class=timegrid__bodyColumns data-hook=grid-columns></div></div></div></div>";

},{}],36:[function(require,module,exports){
module.exports = "<body><nav id=slideout></nav><header id=header class=fixed data-hook=header></header><section id=page></section><footer id=footer class=\"fixed link u-textCenter\" data-hook=footer style=display:none></footer></body>";

},{}],37:[function(require,module,exports){
module.exports = "<div class=calendar><div class=\"row row--condensed\" style=\"margin-bottom: 10px\"><div class=\"col col--onehalf-sm\"><select class=input data-hook=month-picker></select></div><div class=\"col col--onehalf-sm\"><select class=input data-hook=year-picker></select></div></div><div class=calendar__body data-hook=calendar></div><button class=\"btn btn--primary\" data-hook=confirm-dates style=\"margin-top: 18px\">Done</button></div>";

},{}],38:[function(require,module,exports){
module.exports = "<div class=drawer data-hook=drawer><div class=drawer__handle data-hook=handle></div><div data-hook=content></div></div>";

},{}],39:[function(require,module,exports){
module.exports = "<ul class=dropdown><div class=dropdown__triangle></div><a href=/me/meetings><li class=dropdown__item>All Meetings</li></a> <a href=/me><li class=dropdown__item>Your Account</li></a> <a href=/promo><li class=dropdown__item>Promos</li></a> <a href=/logout><li class=dropdown__item>Logout</li></a></ul>";

},{}],40:[function(require,module,exports){
module.exports = "<section><h4 data-hook=filter-msg></h4><div class=\"listGroup u-textCenter\" data-hook=filter-ui data-drawer-scrollable=true data-grid-scrollable=true></div></section>";

},{}],41:[function(require,module,exports){
module.exports = "<div class=listGroup__item><label class=u-pointer data-hook=label><input type=checkbox class=listGroup__element data-hook=filter> <span><img class=\"listGroup__element listGroup__element--img u-circle\" data-hook=user-image> <span class=\"listGroup__element listGroup__element--text u-noUserSelect\"><span data-hook=first-name></span><span class=u-hideXs data-hook=last-name></span> (<span data-hook=percent-free></span>% free)</span></span></label></div>";

},{}],42:[function(require,module,exports){
module.exports = "<div class=u-white data-hook=give-feedback>Give Feedback</div>";

},{}],43:[function(require,module,exports){
module.exports = "<section><h4 data-hook=timestamp></h4><div data-hook=details><p data-hook=num-free-info><span data-hook=num-free></span>/<span data-hook=visible-users></span> of your team is free.</p><div class=\"container container--wide container--inverted\" data-hook=finalize-notification><h4 class=u-white>Finalized</h4><p>Location: <span data-hook=location></span></p><p>Purpose: <span data-hook=purpose></span></p><div data-drawer-scrollable=true data-grid-scrollable=true><div class=row data-hook=finalized-free><div class=\"col col--one listGroup\"><h5 class=u-white>Free</h5><div class=u-textCenter data-hook=finalized-freeUsers></div></div></div><div class=row data-hook=finalized-partialFree><div class=\"col col--one listGroup\"><h5 class=\"u-white u-textUnderline\">Partially free</h5><div class=u-textCenter data-hook=finalized-partialFreeUsers></div></div></div><div class=row data-hook=finalized-busy><div class=\"col col--one listGroup\"><h5 class=u-white>Busy</h5><div class=u-textCenter data-hook=finalized-busyUsers></div></div></div></div></div><div class=row data-hook=whos-freebusy><div class=\"col col--onehalf listGroup\"><h4>Free</h4><div data-hook=free-users data-drawer-scrollable=true data-grid-scrollable=true></div></div><div class=\"col col--onehalf listGroup\"><h4>Busy</h4><div data-hook=busy-users data-drawer-scrollable=true data-grid-scrollable=true></div></div></div></div></section>";

},{}],44:[function(require,module,exports){
module.exports = "<div class=\"row row--condensed valign u-fullHeight\"><div class=\"col col--onefourth u-fullHeight u-textLeft\"><div id=slideout-toggle class=u-fullHeight><div class=label>OPTIONS</div></div></div><div class=\"col col--onehalf valign__centered\"><div class=\"logo logo--white u-centerBlock\" data-hook=logo><a href=/home class=\"u-fullHeight u-fullWidth u-centerBlock\"></a></div></div><div class=\"col col--onefourth valign__centered\"><img class=\"imageBubble link u-pullRight\" data-hook=propic src=\"\"><div data-hook=dropdown></div></div></div>";

},{}],45:[function(require,module,exports){
module.exports = "<div class=\"u-fullHeight u-fullWidth valign\"><img class=\"loading u-centerBlock valign__centered\" src=/img/ring-alt.gif data-hook=spinner></div>";

},{}],46:[function(require,module,exports){
module.exports = "<section class=meetingBlock><h3 class=meetingBlock__header><span data-hook=name></span> <i class=\"fa fa-gavel is-hidden\" data-hook=finalize></i></h3><h5 class=\"meetingBlock__subheader is-hidden\" data-hook=duedate-text>Respond by <strong data-hook=duedate></strong></h5><h5 class=\"meetingBlock__subheader is-hidden\" data-hook=rsvp-count></h5><h5 class=\"meetingBlock__subheader is-hidden\" data-hook=info-text></h5><div class=\"row is-hidden\" data-hook=respond-button><div class=\"col col--onehalf\"><button class=\"btn btn--block\" data-hook=respond>Respond</button></div></div><div class=\"row is-hidden\" data-hook=secondary-button><div class=\"col col--onehalf\" style=\"padding-right: 7.5px\"><button class=\"btn btn--block\" data-hook=secondary></button></div><div class=\"col col--onehalf\" style=\"padding-left: 7.5px\"><button class=\"btn btn--block is-hidden\" data-hook=tertiary></button></div></div><div class=\"row is-hidden\" data-hook=creator-buttons><div class=\"col col--onehalf\"><button class=\"btn btn--block btn--primary\" data-hook=open>Open</button></div><div class=\"col col--onehalf\"><button class=\"btn btn--block btn--ghost\" data-hook=edit>Edit</button></div></div></section>";

},{}],47:[function(require,module,exports){
module.exports = "<div class=\"meetingSummary toggle\"><div class=toggle__section><div class=toggle__header><h4><span data-hook=meeting-name></span> <i data-hook=finalized class=\"fa fa-gavel\"></i></h4></div><div class=toggle__chevron></div></div><div class=\"toggle__section toggle__expandable\"><p class=\"meeting-members u-textMuted\" data-hook=meeting-members></p><p class=u-textMuted>meeting id: <strong data-hook=meeting-mid></strong></p><div><p data-hook=meeting-message></p><div data-hook=creator-buttons class=is-hidden><div class=\"row row--condensed\"><div class=\"col col--onehalf-xs\"><button class=\"btn btn--sm btn--block btn--primary\" data-hook=goto-meeting><i class=\"btn__i fa fa-rocket\"></i> Go To Meeting</button></div><div class=\"col col--onehalf-xs\"><button class=\"btn btn--sm btn--block btn--ghost\" data-hook=edit-meeting><i class=\"btn__i fa fa-wrench\"></i> Edit Meeting</button></div></div></div><div data-hook=normal-buttons class=is-hidden><div class=\"row row--condensed\"><div class=\"col col--one\"><button class=\"btn btn--sm btn--block btn--primary\" data-hook=goto-meeting><i class=\"btn__i fa fa-rocket\"></i> Go To Meeting</button></div></div></div></div></div></div>";

},{}],48:[function(require,module,exports){
module.exports = "<li class=nav__tab data-hook=nav-tab><div class=nav__tabContent><span data-hook=label></span></div></li>";

},{}],49:[function(require,module,exports){
module.exports = "<div><ul class=\"nav nav__tabs\" data-hook=nav></ul><div data-hook=holder></div></div>";

},{}],50:[function(require,module,exports){
module.exports = "<section><div class=container><marquee class=large>404 Not Found</marquee><h4>Not even our magic elves could find that page!</h4><p>We recommend going <a href=\"/\"><i class=\"fa fa-home\"></i> home</a> and trying again.</p></div></section>";

},{}],51:[function(require,module,exports){
module.exports = "<section><div class=container><h1>About Omnipointment</h1><p class=u-textLeft>Two people can schedule an appointment, but once a team has three or more members, calendar chaos can ensue. We created Omnipointment so that teams could have <b>omnipotent appointments.</b></p><h2>We Believe</h2><ul><li>Teams work better when they can meet in person.</li><li>Great leaders can adapt to their members' busy schedules.</li><li>Scheduling meetings with teammates should get easier the more you work with them.</li></ul><p class=u-textLeft>Our scheduling tool is built to achieve these ideals. Omnipointment doesn't just collect your teammates' availability, it makes <b>choosing</b> the best time to meet easy. With our timegrids and filtering, you can find meeting times you might never have thought of!</p><h2>Follow Us</h2><p class=u-textLeft>The more people use Omnipointment, the better we can spread our vision for seamless meeting scheduling and collaboration. Help us and share Omnipointment with your team and friends on social media!</p><div class=u-textCenter><a href=https://www.facebook.com/omnipointment/ target=_blank><i class=\"social-icon fa fa-facebook\"></i></a> <a href=https://twitter.com/omnipointment target=_blank><i class=\"social-icon fa fa-twitter\"></i></a> <a href=https://www.linkedin.com/company/omnipointment target=_blank><i class=\"social-icon fa fa-linkedin-square\"></i></a></div><h2>The Founders</h2><div class=row><div class=\"col col--onehalf-sm\"><h3>Vinesh Kannan</h3><p><a href=https://twitter.com/vineshgkannan target=_blank><i class=\"fa fa-twitter\"></i> vineshgkannan</a></p><p><a href=https://www.linkedin.com/in/vineshkannan target=_blank><i class=\"fa fa-linkedin-square\"></i> Prototyping Ninja</a></p><img class=\"headshot u-imgFluid u-centerBlock\" src=img/propic/vinesh.jpg><p class=u-textLeft>Vinesh has taught 450+ students about collaboration and entrepreneurship. His work exposed the need for a better team meeting tool: giving rise to Omnipointment. He studies Computer Science at the Illinois Institute of Technology and his versatile skills as a designer, developer, and speaker have earned him many awards, including selection for ThinkChicago Fall 2014: 150 of the top collegiate prospects for the city's fast-growing tech scene.</p></div><div class=\"col col--onehalf-sm\"><h3>Brendan Batliner</h3><p><a href=https://twitter.com/thebatliner target=_blank><i class=\"fa fa-twitter\"></i> thebatliner</a></p><p><a href=https://www.linkedin.com/in/brendanbatliner target=_blank><i class=\"fa fa-linkedin-square\"></i> Lifelong learner</a></p><img class=\"headshot u-imgFluid u-centerBlock\" src=img/propic/brendan.jpg><p class=u-textLeft>Brendan honed his skills over two summers at Techstars Chicago, providing software engineering help to some of the city's most promising tech startups. His skills are competitive on the national level, where his team ranked top 12 in CSAW's national High School Forensics contest. He studies Computer Science at the University of Nebraska-Lincoln's Raikes School: part of an elite cohort of students in the top 1% nationwide for academic success.</p></div></div></div><div class=\"container container--condensed container--clear\"><a href=/ class=\"btn btn--block btn--ghost\"><i class=\"btn__i fa fa-arrow-left\"></i>Back Home</a></div></section>";

},{}],52:[function(require,module,exports){
module.exports = "<section><div class=banner>Edit</div><div class=\"container container--condensed container--clear\"><h2 data-hook=meeting-name placeholder=Name contenteditable=true></h2><p data-hook=meeting-description placeholder=Description contenteditable=true></p><p><label for=slot-size>Slot duration:</label><select id=slot-size data-hook=meeting-slot-size><option value=15>15 minutes</option><option value=30>30 minutes</option><option value=60>60 minutes</option></select></p><div class=row><div class=\"col col--onehalf-sm\"><button class=\"btn btn--block btn--ghost\" data-hook=add-dates>Add Dates</button></div><div class=\"col col--onehalf-sm\"><button class=\"btn btn--block btn--ghost\" data-hook=add-times>Add Times</button></div></div><div class=\"row row--condensed btnGroup u-textCenter\"><button class=\"btn btn--ghost\" data-hook=invite-others>Invite Others</button> <button class=\"btn btn--ghost\" data-hook=transfer-ownership>Transfer Ownership</button> <button class=\"btn btn--danger\" data-hook=delete-meeting>Delete Meeting</button></div><div data-hook=creator-grid></div></div><div class=\"container container--condensed container--clear\"><button class=\"btn btn--block btn--primary\" data-hook=view-meeting><i class=\"btn__i fa fa-save\"></i> Save Meeting</button></div></section>";

},{}],53:[function(require,module,exports){
module.exports = "<section><div class=container><p>You have <span data-hook=meeting-credits>0 free meetings</span> remaining.</p><div class=inputGroup data-hook=title><span class=inputGroup__addon>Title</span> <input type=text class=\"input input--lg u-textCenter\" placeholder=\"Untitled Meeting\" data-hook=meeting-name></div><h5 class=u-breakWord>Meeting URL: omnipointment.com/meeting/<span data-hook=url-mid></span></h5><p>Need custom urls? Contact us: <a href=//m.me/omnipointment target=_blank><i class=\"fa fa-facebook-square\"></i></a> / <a href=mailto:team@omnipointment.com target=_blank><i class=\"fa fa-envelope-o\"></i></a></p></div><div class=container data-hook=pick-dates><h4>What dates are you considering?</h4><div data-hook=step-one></div></div><div class=container data-hook=pick-times><h4>What times were you thinking?</h4><h5>You can choose more specific times next.</h5><div data-hook=step-two></div></div><div class=\"container container--condensed container--clear\"><button class=\"btn btn--block btn--primary\" data-hook=confirm>Next</button> <button class=\"btn btn--block btn--ghost\" data-hook=cancel>Cancel</button></div></section>";

},{}],54:[function(require,module,exports){
module.exports = "<section><div class=\"banner u-textCenter\">Finalize</div><div class=\"container container--condensed container--wide container--clear\"><h2 data-hook=meeting-name placeholder=Name></h2><p data-hook=meeting-message placeholder=Description></p><div class=u-textCenter><button class=\"btn btn--ghost\" data-hook=back><i class=\"btn__i fa fa-arrow-left\"></i> Back</button> <button class=\"btn btn--primary\" data-hook=finalize><i class=\"btn__i fa fa-gavel\"></i> Finalize Meeting</button></div><div style=\"margin-top: 12px; color: red; text-align: center\" data-hook=error></div></div><div data-hook=finalize-grid></div></section>";

},{}],55:[function(require,module,exports){
module.exports = "<section><div class=\"container container--clear container--wide u-textCenter-sm\"><div class=u-textCenter><button class=\"btn btn--lg btn--info is-hidden\" data-hook=walkthrough>Walkthrough</button></div><h4 class=u-textLeft>Meetings you are part of:</h4><div class=meetingBlockContainer data-hook=meetings-invited></div><div class=meetingBlockContainer data-hook=invited-empty><section class=meetingBlock data-hook=sample><h3 class=meetingBlock__header>Sample Omnipointment</h3><h5 class=meetingBlock__subheader>Click this nice button to explore!</h5><div class=row><div class=\"col col--onehalf\"><button class=\"btn btn--block btn--primary\" data-hook=sample-respond>Respond</button></div></div></section><section class=\"meetingBlock meetingBlock--dashed link\" data-hook=sample-respond><h3 class=meetingBlock__header>New meetings will appear here!</h3><h4 class=meetingBlock__header>Click to try a sample.</h4></section></div><h4 class=u-textLeft>Organized by you:</h4><div class=meetingBlockContainer><span data-hook=meetings-organized></span><section class=meetingBlock><h3 class=\"meetingBlock__header u-info\">Create a New Meeting</h3><div class=row><div class=\"col col--onehalf\"><button class=\"btn btn--block btn--info\" data-hook=create>Create</button></div></div></section></div><div class=meetingBlockContainer data-hook=organized-empty></div><h6 class=\"u-textLeft u-black is-hidden\" data-hook=help-text>Don't see your meetings? You can see all of your past meetings on the <a href=/me/meetings>All Meetings</a> page.</h6></div></section>";

},{}],56:[function(require,module,exports){
module.exports = "<section><div class=\"container container--condensed container--wide container--clear\"><h2 data-hook=meeting-name placeholder=Name></h2><p data-hook=meeting-message placeholder=Description></p><div class=u-textCenter><button class=\"btn btn--ghost\" data-hook=video-call style=\"display: none\"><i class=\"btn__i fa fa-video-camera\"></i> Video Call</button> <button class=\"btn btn--primary\" data-hook=finalize><i class=\"btn__i fa fa-gavel\"></i> Finalize</button> <button class=\"btn btn--primary\" data-hook=edit><i class=\"btn__i fa fa-wrench\"></i> Edit</button> <button class=\"btn btn--ghost\" data-hook=copy-url><i class=\"btn__i fa fa-link\"></i> Copy Link</button> <button class=\"btn btn--primary\" data-hook=rsvp><i class=\"btn__i fa fa-pencil\"></i> Respond!</button> <span data-hook=rate-student class=is-hidden><button class=\"btn btn--primary\" data-hook=rate><i class=\"btn__i fa fa-star-o\"></i> Rate Your Team</button></span></div></div><div data-hook=time-grid></div></section>";

},{}],57:[function(require,module,exports){
module.exports = "<section><div class=container><div class=\"container container--sm container--clear\"><div class=u-textCenter><img class=\"imageBubble imageBubble--lg m-a-0 m-h-m\" src=\"\" data-hook=user-picture style=\"vertical-align: middle\"><h3 style=\"display: inline-block; vertical-align: middle\"><span data-hook=user-name></span> <span class=u-noBreak>(that's you!)</span></h3></div><p class=\"large u-textCenter m-v-m\">Omnipotent since <span data-hook=user-createdAt></span></p><label for=user-email>Email</label><div class=inputGroup><input type=email class=input data-hook=user-email id=user-email> <span class=inputGroup__button><button class=\"btn btn--ghost\" data-hook=user-email-submit>Change</button></span></div><p class=u-textLeft>To receive updates on your meetings and other important communications, please ensure your email is up to date.</p><label class=\"checkbox-inline m-t-m\"><input type=checkbox data-hook=freeByDefault id=freeByDefault>Free by default <span data-hook=feedback class=\"is-hidden m-l-s\"></span></label><p class=\"small m-t-s u-textLeft\">If you are \"free by default,\" your meeting responses will default to all free instead of all busy.</p></div></div><div class=\"container container--condensed container--clear\"><a href=/ class=\"btn btn--block btn--ghost\"><i class=\"btn__i fa fa-arrow-left\"></i>Back Home</a></div></section>";

},{}],58:[function(require,module,exports){
module.exports = "<section><div class=container><h3>Meetings You Organized</h3><div data-hook=organized-empty><p>No meetings to show, <a href=/meeting/create>create one!</a></p></div><div data-hook=organized></div><hr><h3>Meetings You're Invited To</h3><div data-hook=invited-empty><p>No meetings to show, <a href=/meeting/create>create one!</a></p></div><div data-hook=invited></div></div></section>";

},{}],59:[function(require,module,exports){
module.exports = "<section><div class=container><h3>Have a promo code? You're in the right place!</h3><p>Enter your code into the box below to redeem your freebies!</p><input class=\"input input--lg u-textCenter\" data-hook=code> <button class=\"btn btn--lg btn--block btn--primary\" data-hook=redeem>Redeem!</button> <a href=/ class=\"btn btn--block btn--ghost\"><i class=\"btn__i fa fa-arrow-left\"></i>Back Home</a></div><div class=\"container u-textCenter\" data-hook=response style=\"display: none\"></div></section>";

},{}],60:[function(require,module,exports){
module.exports = "<section><div class=container><h3>How has everyone been doing?</h3><p>On a scale from -2 (detrimental) to 2 (beneficial), rate each person's contribution to the team.</p><div class=row data-hook=users></div><button class=\"btn btn--primary btn--lg u-centerBlock m-t-l m-b-s\" data-hook=save>Submit</button></div></section>";

},{}],61:[function(require,module,exports){
module.exports = "<section><div class=banner>RSVP</div><div class=\"container container--condensed container--wide container--clear\"><h2 data-hook=meeting-name placeholder=Name></h2><p data-hook=meeting-message placeholder=Description></p><div class=u-textCenter><button class=\"btn btn--primary\" data-hook=save><i class=\"btn__i fa fa-floppy-o\"></i> Save Response</button><div data-hook=progress-bar style=\"margin-top: 35px\"></div></div></div><div data-hook=rsvp-grid></div></section>";

},{}],62:[function(require,module,exports){
module.exports = "<section><h3>Welcome to the Omnisandbox! Enjoy your stay!</h3><div class=container><h4>Sandbox Users <i class=\"fa fa-plus link\" data-hook=add-user></i></h4><div data-hook=sandbox-users></div></div><div class=\"container container--condensed container--clear\"><div class=row><div class=\"col col--onehalf-sm\"><button class=\"btn btn--block btn--ghost\" data-hook=add-dates>Add Dates</button></div><div class=\"col col--onehalf-sm\"><button class=\"btn btn--block btn--ghost\" data-hook=add-times>Add Times</button></div></div></div><div class=\"container container--condensed container--wide container--clear\"><div data-hook=sandbox-tabs></div></div></section>";

},{}],63:[function(require,module,exports){
module.exports = "<div class=progressBar><div class=progressBar__bar data-hook=bar></div><div class=progressBar__text data-hook=percentage></div></div>";

},{}],64:[function(require,module,exports){
module.exports = "<section class=\"rateUser col col--onehalf-xs col--onethird-md col--onefourth-lg\"><div class=\"listGroup__item u-textCenter\"><img class=\"listGroup__element listGroup__element--img u-circle\" data-hook=user-image src=\"\"> <span class=\"listGroup__element listGroup__element--text\" data-hook=user-name></span></div><form class=u-textCenter><div data-hook=impact-radio><div class=radio-wrapper><label><input type=radio name=impact data-value=-2>-2</label></div><div class=radio-wrapper><label><input type=radio name=impact data-value=-1>-1</label></div><div class=radio-wrapper><label><input type=radio name=impact data-value=0>0</label></div><div class=radio-wrapper><label><input type=radio name=impact data-value=1>1</label></div><div class=radio-wrapper><label><input type=radio name=impact data-value=2>2</label></div></div><input class=\"input m-t-s\" type=text placeholder=\"Additional comments\" data-hook=comment></form></section>";

},{}],65:[function(require,module,exports){
module.exports = "<div class=\"inputGroup u-center\" data-hook=picker><label class=checkbox-inline><input type=checkbox name=period value=morning>Morning</label><label class=checkbox-inline><input type=checkbox name=period value=afternoon>Afternoon</label><label class=checkbox-inline><input type=checkbox name=period value=evening>Evening</label></div>";

},{}],66:[function(require,module,exports){
module.exports = "<div class=u-textCenter><div class=\"inputGroup u-centerBlock\"><strong>Start:</strong><select data-hook=start-hour><option value=01 selected=selected>01</option><option value=02>02</option><option value=03>03</option><option value=04>04</option><option value=05>05</option><option value=06>06</option><option value=07>07</option><option value=08>08</option><option value=09>09</option><option value=10>10</option><option value=11>11</option><option value=12>12</option></select>:<select data-hook=start-minute><option value=00 selected=selected>00</option><option value=15>15</option><option value=30>30</option><option value=45>45</option></select><select data-hook=start-ampm><option value=AM>AM</option><option value=PM selected=selected>PM</option></select></div><div class=\"inputGroup u-centerBlock\"><strong>End:</strong><select data-hook=end-hour><option value=01>01</option><option value=02>02</option><option value=03>03</option><option value=04 selected=selected>04</option><option value=05>05</option><option value=06>06</option><option value=07>07</option><option value=08>08</option><option value=09>09</option><option value=10>10</option><option value=11>11</option><option value=12>12</option></select>:<select data-hook=end-minute><option value=0 selected=selected>00</option><option value=15>15</option><option value=30>30</option><option value=45>45</option></select><select data-hook=end-ampm><option value=AM>AM</option><option value=PM selected=selected>PM</option></select></div><button class=\"btn btn--ghost\" data-hook=reset-times>Reset</button> <button class=\"btn btn--success\" data-hook=add-times>Add Time Range</button></div>";

},{}],67:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandView = require('ampersand-view');

var _ampersandView2 = _interopRequireDefault(_ampersandView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _ampersandView2.default.extend({
    initialize: function initialize() {
        // Register a cleanup
        this.once('remove', this.cleanup, this);
    },
    cleanup: function cleanup() {
        // noop
    }
});

},{"ampersand-view":109}],68:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _dateList = require('../models/dateList');

var _dateList2 = _interopRequireDefault(_dateList);

var _dateTimeHelper = require('../helpers/dateTimeHelper');

var _dateTimeHelper2 = _interopRequireDefault(_dateTimeHelper);

var _domify = require('domify');

var _domify2 = _interopRequireDefault(_domify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/calendarPicker.html'),

    session: {
        month: ['number', false, new Date().getMonth()],
        year: ['number', false, new Date().getFullYear()]
    },

    events: {
        'click .calendar__cell': 'handleDate',
        'change [data-hook=month-picker]': 'updateMonth',
        'change [data-hook=year-picker]': 'updateYear',
        'click [data-hook=confirm-dates]': 'handleConfirmClick'
    },

    initialize: function initialize(options) {
        _base2.default.prototype.initialize.apply(this, arguments);
        this.model = this.model || new _dateList2.default({ dates: options.dates || {} });
        this.renderDoneButton = options.renderDoneButton;
        this.on('change:month change:year', this.render);
    },
    render: function render() {
        var _this = this;

        _base2.default.prototype.render.apply(this, arguments);
        // Render month options
        var monthPicker = this.queryByHook('month-picker');
        _dateTimeHelper2.default.MONTHS.forEach(function (month) {
            var monthVal = _dateTimeHelper2.default.MONTHS.indexOf(month);
            var str = '<option value=\'' + monthVal + '\'' + (monthVal === _this.month ? ' selected' : '') + '>' + month + '</option>';
            monthPicker.appendChild((0, _domify2.default)(str));
        });
        // Render year options
        var yearPicker = this.queryByHook('year-picker');
        var thisYear = new Date().getFullYear();
        for (var y = 0; y < 10; y++) {
            var yearVal = thisYear + y;
            var str = '<option value=\'' + yearVal + '\'' + (yearVal === this.year ? ' selected' : '') + '>' + yearVal + '</option>';
            yearPicker.appendChild((0, _domify2.default)(str));
        }
        // Render calendar
        var calendarEl = this.queryByHook('calendar');
        var weekdays = ['S', 'M', 'T', 'W', 'R', 'F', 'S'];
        weekdays.forEach(function (weekday) {
            var str = '<button type="button" class=\'calendar__cell calendar__cell--header\'>' + weekday + '</button>';
            calendarEl.appendChild((0, _domify2.default)(str));
        });

        // Function to create a calendar cell from a date
        var today = new Date();
        var makeDayCell = function makeDayCell(day, classes) {
            var clazz = _this.model.indexOf(day) > -1 ? 'is-selected' : '';
            var dayStr = _ampersandApp2.default.moment(day).format('D');
            if (day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear()) {
                clazz += ' calendar__cell--today';
            } else if (day.getTime() < today.getTime()) {
                clazz += ' calendar__cell--past';
            }
            var classStr = clazz + ' ' + (typeof classes === 'string' ? classes : '');
            var str = '<button type="button" class=\'calendar__cell ' + classStr + '\'>' + dayStr + '</button>';
            calendarEl.appendChild((0, _domify2.default)(str));
        };
        var days = _dateTimeHelper2.default.getAllDaysInMonth(this.month, this.year);

        // Show days from previous month, if necessary
        var firstDay = new Date(days[0].getTime());
        var beginningIndent = firstDay.getDay();
        firstDay.setDate(firstDay.getDate() - beginningIndent);
        for (var w = 0; w < beginningIndent; w++) {
            makeDayCell(firstDay, 'calendar__cell--lastMonth');
            firstDay.setDate(firstDay.getDate() + 1);
        }
        // Show days from this month
        days.forEach(makeDayCell);
        // Show days from next month, if necessary
        var lastDay = days[days.length - 1];
        var endIndent = 6 - lastDay.getDay();
        for (var _w = 0; _w < endIndent; _w++) {
            lastDay.setDate(lastDay.getDate() + 1);
            makeDayCell(lastDay, 'calendar__cell--nextMonth');
        }

        // Show/hide done button
        if (this.renderDoneButton) {
            this.queryByHook('confirm-dates').classList.remove('is-hidden');
        } else {
            this.queryByHook('confirm-dates').classList.add('is-hidden');
        }
        return this;
    },
    handleConfirmClick: function handleConfirmClick() {
        this.trigger('done');
    },
    updateMonth: function updateMonth(e) {
        this.month = Number.parseInt(e.target.value, 10);
    },
    updateYear: function updateYear(e) {
        this.year = Number.parseInt(e.target.value, 10);
    },
    handleDate: function handleDate(e) {
        var day = Number.parseInt(e.target.innerHTML, 10);
        var adjustment = 0;
        if (e.target.classList.contains('calendar__cell--lastMonth')) {
            adjustment = -1;
        } else if (e.target.classList.contains('calendar__cell--nextMonth')) {
            adjustment = 1;
        }
        var date = new Date(this.year, this.month + adjustment, day);
        this.model.toggleDate(date);
        e.target.classList.toggle('is-selected');
    },
    getSelectedDates: function getSelectedDates() {
        return this.model.dates;
    }
});

},{"../helpers/dateTimeHelper":1,"../models/dateList":13,"../templates/calendarPicker.html":37,"./base":67,"ampersand-app":92,"domify":117}],69:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StringView = _base2.default.extend({
    template: '<span data-hook="str"></span>',
    session: {
        str: 'string'
    },
    bindings: {
        // TODO: possible XSS vulnerability. be careful
        str: {
            type: 'innerHTML',
            hook: 'str'
        }
    }
});

exports.default = _base2.default.extend({
    constructor: function constructor(options) {
        /* eslint guard-for-in: 0 */
        for (var element in this.elements) {
            // Create setter for this element
            var type = this.elements[element];
            this['set' + (element.charAt(0).toUpperCase() + element.slice(1))] = this._createSetter(element, type);
            // Convert options, as necessary
            if (options && typeof options[element] === 'string') {
                options[element] = this._wrapString(options[element]);
            }
        }
        return _base2.default.prototype.constructor.apply(this, arguments);
    },
    initialize: function initialize(options) {
        _base2.default.prototype.initialize.apply(this, arguments);
        // Copy options that are present to instance
        if (options) {
            /* eslint guard-for-in: 0 */
            for (var element in this.elements) {
                if (options[element]) {
                    this[element] = options[element];
                }
            }
        }
    },
    render: function render() {
        _base2.default.prototype.render.apply(this, arguments);
        this.renderElements();
        return this;
    },
    renderElements: function renderElements() {
        for (var element in this.elements) {
            if (this[element]) {
                this.renderElement(element);
            }
        }
    },
    renderElement: function renderElement(element) {
        if (this.el) {
            this.renderSubview(this[element], this.queryByHook(element));
        }
    },
    _setElement: function _setElement(element, value) {
        if (this[element]) {
            this[element].remove();
        }
        this[element] = value;
        this.renderElement(element);
    },
    _createSetter: function _createSetter(element, type) {
        var _this = this;

        if (type === 'string') {
            return function (arg) {
                if (typeof arg !== 'string') {
                    throw new TypeError('Expected string for element \'' + element + '\'.');
                }
                _this._setElement(element, _this._wrapString(arg));
            };
        } else if (type === 'view') {
            return function (arg) {
                if (typeof arg === 'string') {
                    _this._setElement(element, _this._wrapString(arg));
                } else if (arg.render && arg.remove) {
                    _this._setElement(element, arg);
                } else {
                    throw new TypeError('Expected view (or string to wrap in a view) for element ' + element);
                }
            };
        }
        throw new TypeError('Unsupported element type ' + type + '.');
    },
    _wrapString: function _wrapString(str) {
        return new StringView({ str: str });
    }
});

},{"./base":67}],70:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _component2.default.extend({
    template: require('../templates/drawer.html'),

    elements: {
        content: 'view'
    },

    events: {
        'touchstart [data-hook=drawer]': 'initTouch',
        'mousedown [data-hook=handle]': 'init'
    },

    initialize: function initialize() {
        _component2.default.prototype.initialize.apply(this, arguments);
        // Cache the window innerHeight for performance reasons
        this.recalcInnerHeight = this.recalcInnerHeight.bind(this);
        this._innerHeight = window.innerHeight;
        window.addEventListener('resize', this.recalcInnerHeight);
        // Reassign these functions to their bound versions to allow for easy add/remove event listener
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.resize = this.resize.bind(this);
        this.stop = this.stop.bind(this);
    },
    cleanup: function cleanup() {
        window.removeEventListener('resize', this.recalcInnerHeight);
    },
    render: function render() {
        _component2.default.prototype.render.apply(this, arguments);
        // TODO: options...
        this._elHeight = 72;
        var translate = 'translateY(' + (this._innerHeight - this._elHeight) + 'px)';
        this.el.style.transform = translate;
        this.el.style['-webkit-transform'] = translate;
        return this;
    },
    recalcInnerHeight: function recalcInnerHeight() {
        this._innerHeight = window.innerHeight;
    },
    initScrollables: function initScrollables() {
        var scrollables = this.el.querySelectorAll('[data-drawer-scrollable=true]');
        for (var i = 0; i < scrollables.length; i++) {
            var el = scrollables[i];
            el.style.overflowY = 'auto';
            el.style.overflowX = 'hidden';
            el.style.willChange = 'transform';
        }
    },
    initTouch: function initTouch(e) {
        this.initScrollables();
        if (this._touchIsInsideScrollable(e, true)) {
            this._preventResize = true;
        } else {
            e.preventDefault();
        }
        // Always prevent dynamic resizing of scrollables for performance reasons
        this._preventResizeScrollables = true;
        this._stopTouch = false;
        // If the user drags the drawer, calculate the offset from the top of the drawer
        // for "sticky" drawer scrolling
        this._touchOffset = e.touches[0].clientY - (this._innerHeight - this._elHeight);
        window.addEventListener('touchmove', this.handleTouchMove);
        window.addEventListener('touchend', this.stop);
    },
    init: function init() {
        this.initScrollables();
        // Always prevent dynamic resizing of scrollables for performance reasons
        this._preventResizeScrollables = true;
        this._stopTouch = false;
        window.addEventListener('mousemove', this.handleTouchMove);
        window.addEventListener('mouseup', this.stop);
    },
    handleTouchMove: function handleTouchMove(e) {
        var _this = this;

        var preventResize = this._preventResize;
        var preventResizeScrollables = this._preventResizeScrollables;
        if (!this._waitingForRaf) {
            requestAnimationFrame(function () {
                _this._waitingForRaf = false;
                if (_this._stopTouch) {
                    return;
                }
                if (!preventResize) {
                    _this.resize(e);
                }
                if (!preventResizeScrollables) {
                    _this.resizeScrollables(e);
                }
            });
        }
        this._waitingForRaf = true;
    },
    resize: function resize(e) {
        var newTransform = (e.clientY || e.touches[0].clientY) - (this._touchOffset || 0);
        if (newTransform > this._innerHeight - 70) {
            newTransform = this._innerHeight - 70;
        } else if (newTransform < 76) {
            newTransform = 76;
        }
        this._elHeight = this._innerHeight - newTransform;
        var translate = 'translateY(' + newTransform + 'px)';
        this.el.style.transform = translate;
        this.el.style['-webkit-transform'] = translate;
    },
    resizeScrollables: function resizeScrollables() {
        if (this._elHeight > this._innerHeight / 2.8) {
            // magic numbers!
            var scrollables = this.el.querySelectorAll('[data-drawer-scrollable=true]');
            for (var i = 0; i < scrollables.length; i++) {
                var el = scrollables[i];
                el.style.height = this._innerHeight - el.getBoundingClientRect().top + 'px';
            }
        }
    },
    stop: function stop() {
        this._preventResize = false;
        if (this._preventResizeScrollables) {
            this._preventResizeScrollables = false;
            this.resizeScrollables();
        }
        this._stopTouch = true;
        window.removeEventListener('touchmove', this.resize);
        window.removeEventListener('touchend', this.stop);
        window.removeEventListener('mousemove', this.resize);
        window.removeEventListener('mouseup', this.stop);
    },
    _touchIsInsideScrollable: function _touchIsInsideScrollable(e, isScrolling) {
        var el = e.target;
        while (this.el !== el) {
            if (isScrolling) {
                if (el.getAttribute('data-drawer-scrollable') === 'true' && el.scrollHeight !== el.offsetHeight) {
                    return true;
                }
            } else {
                if (el.getAttribute('data-drawer-scrollable') === 'true') {
                    return true;
                }
            }
            el = el.parentNode;
        }
        return false;
    }
});

},{"../templates/drawer.html":38,"./component":69}],71:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/dropdown.html')
});

},{"../templates/dropdown.html":39,"./base":67}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/footer.html'),

    events: {
        'click [data-hook=give-feedback]': 'handleGiveFeedbackClick'
    },

    handleGiveFeedbackClick: function handleGiveFeedbackClick() {
        _ampersandApp2.default.vex.dialog.prompt({
            message: 'Hi! Care to give us some feedback on omnipointment?',
            placeholder: 'ex. Cool name, app needs work.',
            callback: function callback(feedback) {
                if (feedback) {
                    var ref = _ampersandApp2.default.firebase.database().ref('feedback');
                    ref.push({
                        timestamp: Date.now(),
                        feedback: feedback
                    });
                    _ampersandApp2.default.vex.dialog.alert('Thank you!<br>We appreciate your feedback.');
                }
            }
        });
    }
});

},{"../templates/footer.html":42,"./base":67,"ampersand-app":92}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _dropdown = require('./dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _defer = require('lodash/defer');

var _defer2 = _interopRequireDefault(_defer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/header.html'),

    session: {
        showDropdown: 'boolean'
    },

    events: {
        'click [data-hook=propic]': 'handlePropicClick'
    },

    bindings: {
        'model.picture': {
            type: 'attribute',
            name: 'src',
            hook: 'propic'
        },
        showDropdown: {
            type: 'toggle',
            hook: 'dropdown'
        }
    },

    subviews: {
        dropdown: {
            constructor: _dropdown2.default,
            hook: 'dropdown'
        }
    },

    initialize: function initialize() {
        _base2.default.prototype.initialize.apply(this, arguments);
        this.dropdownHandler = this.dropdownHandler.bind(this);
    },
    handlePropicClick: function handlePropicClick() {
        var _this = this;

        this.showDropdown = !this.showDropdown;
        document.removeEventListener('click', this.dropdownHandler);
        if (this.showDropdown) {
            (0, _defer2.default)(function () {
                return document.addEventListener('click', _this.dropdownHandler);
            });
        }
    },
    dropdownHandler: function dropdownHandler(e) {
        if (e.target !== this.dropdown.el) {
            this.showDropdown = !this.showDropdown;
            document.removeEventListener('click', this.dropdownHandler);
        }
    }
});

},{"../templates/header.html":44,"./base":67,"./dropdown":71,"lodash/defer":316}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/loading.html')
});

},{"../templates/loading.html":45,"./base":67}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _ampersandViewSwitcher = require('ampersand-view-switcher');

var _ampersandViewSwitcher2 = _interopRequireDefault(_ampersandViewSwitcher);

var _result = require('lodash/result');

var _result2 = _interopRequireDefault(_result);

var _util = require('../../lib/util');

var _util2 = _interopRequireDefault(_util);

var _slideout = require('./slideout');

var _slideout2 = _interopRequireDefault(_slideout);

var _header = require('./header');

var _header2 = _interopRequireDefault(_header);

var _footer = require('./footer');

var _footer2 = _interopRequireDefault(_footer);

var _loading = require('./loading');

var _loading2 = _interopRequireDefault(_loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/body.html'),

    events: {
        'click a[href]': 'handleLinkClick'
    },

    subviews: {
        header: {
            hook: 'header',
            prepareView: function prepareView() {
                return new _header2.default({
                    model: this.model
                });
            }
        },
        footer: {
            hook: 'footer',
            constructor: _footer2.default
        }
    },

    initialize: function initialize() {
        _base2.default.prototype.initialize.apply(this, arguments);
        this.listenTo(_ampersandApp2.default.router, 'page', this.handleNewPage);
    },
    render: function render() {
        var _this = this;

        _base2.default.prototype.render.apply(this, arguments);

        var loading = this.renderSubview(new _loading2.default(), this.query('#page'));
        loading.el.style.display = 'none';

        this.pageSwitcher = new _ampersandViewSwitcher2.default(this.query('#page'), {
            show: function show(newView) {
                // Hide view and show loading screen
                newView.el.style.display = 'none';
                loading.el.style.display = 'block';

                _this.slideout.disable();

                // Listen for the page to tell us when it's ready
                newView.once('ready', function () {
                    // Toggle them back
                    loading.el.style.display = 'none';
                    newView.el.style.display = 'block';

                    // Set page metadata
                    document.title = (0, _result2.default)(newView, 'pageTitle') || 'Omnipointment';

                    // Render slideout items for this page
                    _this.listenToAndRun(newView, 'render', function () {
                        var slideoutItems = (0, _result2.default)(newView, 'getSlideoutItems');
                        if (slideoutItems) {
                            _this.slideout.setMenuItems(slideoutItems);
                            _this.slideout.enable();
                        }
                    });
                });
                // Trigger immediately, if applicable
                if (newView.ready) {
                    newView.trigger('ready');
                }
            }
        });

        _ampersandApp2.default.slideout = this.slideout = new _slideout2.default({
            panel: this.query('#page'),
            menu: this.query('#slideout'),
            grabWidth: 40
        });

        return this;
    },
    handleNewPage: function handleNewPage(view) {
        this.slideout.trigger('close');
        this.pageSwitcher.set(view);
    },
    handleLinkClick: function handleLinkClick(e) {
        var aTag = _util2.default.findParentAnchor(e.target);
        var isLocal = aTag.host === window.location.host;
        if (isLocal && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            if (aTag.dataset.external === undefined) {
                _ampersandApp2.default.navigate(aTag.pathname);
            } else {
                window.location = aTag.pathname;
            }
        }
    }
});

},{"../../lib/util":91,"../templates/body.html":36,"./base":67,"./footer":72,"./header":73,"./loading":74,"./slideout":81,"ampersand-app":92,"ampersand-view-switcher":108,"lodash/result":360}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _dateTimeHelper = require('../helpers/dateTimeHelper');

var _dateTimeHelper2 = _interopRequireDefault(_dateTimeHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/meetingBlock.html'),

    bindings: {
        'model.name': {
            type: 'text',
            hook: 'name'
        },
        dueDate: [{
            type: 'text',
            hook: 'duedate'
        }, {
            type: function type(el, val) {
                if (val === 'Today!') {
                    el.classList.add('btn--info');
                } else {
                    el.classList.add('btn--primary');
                }
            },

            hook: 'respond'
        }],
        'model.users': {
            type: function type(el, val) {
                if (!val) return;
                var html = val.length + ' RSVPed:&nbsp;&nbsp;&nbsp;';
                if (val.length === 0) {
                    // TODO: show an invite link?
                } else {
                        if (val.length > 5) {
                            html += '<i class="fa fa-user large"></i> x' + val.length;
                        } else {
                            for (var m = 0; m < val.length; m++) {
                                html += '<i class="fa fa-user large"></i>';
                            }
                        }
                    }
                el.innerHTML = html;
            },

            hook: 'rsvp-count'
        }
    },

    derived: {
        dueDate: {
            deps: ['model.earliestMeetingSlot'],
            cache: false,
            fn: function fn() {
                var now = new Date();
                var then = this.model.earliestMeetingSlot.time;
                if (_dateTimeHelper2.default.timeBetween(now, then) <= _dateTimeHelper2.default.DAY) {
                    return 'Today!';
                }
                if (_dateTimeHelper2.default.timeBetween(now, then) <= 2 * _dateTimeHelper2.default.DAY) {
                    return 'Tomorrow';
                }
                if (_dateTimeHelper2.default.timeBetween(now, then) <= 5 * _dateTimeHelper2.default.DAY) {
                    return 'This Week';
                }
                return 'Next Week';
            }
        }
    },

    events: {
        'click [data-hook=respond]': 'handleRespondClick',
        'click [data-hook=open]': 'handleOpenClick',
        'click [data-hook=edit]': 'handleEditClick'
    },

    initialize: function initialize() {
        _base2.default.prototype.initialize.apply(this, arguments);
        this.listenTo(this.model, 'change:createdByMe', this.renderComplexBindings);
        this.listenTo(this.model, 'change:respondedToByMe', this.renderComplexBindings);
        this.listenTo(this.model, 'change:finalized', this.renderComplexBindings);
    },
    render: function render() {
        _base2.default.prototype.render.apply(this, arguments);
        this.renderComplexBindings();
        return this;
    },
    renderComplexBindings: function renderComplexBindings() {
        var _this = this;

        function show(el) {
            el.classList.remove('is-hidden');
        }
        function hide(el) {
            el.classList.add('is-hidden');
        }

        if (this.model.createdByMe) {
            // CREATED BY ME
            show(this.queryByHook('creator-buttons'));
            show(this.queryByHook('rsvp-count'));
        } else {
            // NOT CREATED BY ME
            show(this.queryByHook('respond-button'));
            show(this.queryByHook('duedate-text'));
        }

        if (this.model.respondedToByMe && !this.model.createdByMe) {
            // Hide the "NOT CREATED BY ME" elements
            hide(this.queryByHook('respond-button'));
            hide(this.queryByHook('duedate-text'));
            // Show the info text, and customize it
            show(this.queryByHook('info-text'));
            this.queryByHook('info-text').textContent = 'Already responded.';
            // Show the secondary button, and customize it
            show(this.queryByHook('secondary-button'));
            this.queryByHook('secondary').classList.add('btn--ghost');
            this.queryByHook('secondary').textContent = 'Edit Response';
            this.queryByHook('secondary').addEventListener('click', function () {
                _ampersandApp2.default.navigate('meeting/' + _this.model.mid + '/rsvp');
            });
            // Show the tertiary button, and customize it
            show(this.queryByHook('tertiary'));
            this.queryByHook('tertiary').classList.add('btn--ghost');
            this.queryByHook('tertiary').textContent = 'View Meeting';
            this.queryByHook('tertiary').addEventListener('click', function () {
                _ampersandApp2.default.navigate('meeting/' + _this.model.mid);
            });
        }

        if (this.model.finalized && !this.model.createdByMe) {
            // Hide the "NOT CREATED BY ME" elements
            hide(this.queryByHook('respond-button'));
            hide(this.queryByHook('duedate-text'));
            // Show the info text, and customize it
            show(this.queryByHook('info-text'));
            this.queryByHook('info-text').textContent = 'Meeting times finalized!';
            // Show the secondary button, and customize it
            show(this.queryByHook('secondary-button'));
            this.queryByHook('secondary').classList.add('btn--ghost');
            this.queryByHook('secondary').textContent = 'Open Meeting';
            this.queryByHook('secondary').addEventListener('click', function () {
                _ampersandApp2.default.navigate('meeting/' + _this.model.mid);
            });
        }

        if (this.model.finalized && this.model.createdByMe) {
            show(this.queryByHook('finalize'));
        }
    },
    handleRespondClick: function handleRespondClick() {
        _ampersandApp2.default.navigate('meeting/' + this.model.mid);
    },
    handleOpenClick: function handleOpenClick() {
        _ampersandApp2.default.navigate('meeting/' + this.model.mid);
    },
    handleEditClick: function handleEditClick() {
        _ampersandApp2.default.navigate('meeting/' + this.model.mid + '/edit');
    }
});

},{"../helpers/dateTimeHelper":1,"../templates/meetingBlock.html":46,"./base":67,"ampersand-app":92}],77:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: rewrite as a Card view
exports.default = _base2.default.extend({
    template: require('../templates/meetingSummary.html'),

    events: {
        click: 'toggleExpanded',
        'click [data-hook=goto-meeting]': 'handleGoToMeetingClick',
        'click [data-hook=edit-meeting]': 'handleEditMeetingClick'
    },

    session: {
        expanded: 'boolean'
    },

    bindings: {
        expanded: {
            type: 'booleanClass',
            name: 'is-expanded'
        },

        'model.name': {
            type: 'text',
            hook: 'meeting-name'
        },

        'model.finalized': {
            type: 'toggle',
            hook: 'finalized'
        },

        'model.mid': {
            type: 'text',
            hook: 'meeting-mid'
        },

        'model.description': {
            type: function type(el, val) {
                if (!val) return;
                var def = 'The organizer has not left a message for this meeting.';
                el.textContent = val.length > 0 ? val : def;
            },

            hook: 'meeting-message'
        },

        'model.users': {
            type: function type(el, val) {
                if (!val) return;
                var html = val.length + ' Member' + (val.length === 0 || val.length > 1 ? 's' : '') + ' RSVPed: ';
                for (var m = 0; m < val.length; m++) {
                    html += '<i class="fa fa-user"></i>';
                }
                el.innerHTML = html;
            },

            hook: 'meeting-members'
        },

        'model.createdByMe': {
            type: function type(el, val) {
                if (val) {
                    this.queryByHook('creator-buttons').classList.remove('is-hidden');
                    this.queryByHook('normal-buttons').classList.add('is-hidden');
                } else {
                    this.queryByHook('creator-buttons').classList.add('is-hidden');
                    this.queryByHook('normal-buttons').classList.remove('is-hidden');
                }
            }
        }
    },

    toggleExpanded: function toggleExpanded() {
        this.expanded = !this.expanded;
    },
    handleGoToMeetingClick: function handleGoToMeetingClick() {
        _ampersandApp2.default.navigate('meeting/' + this.model.mid);
    },
    handleEditMeetingClick: function handleEditMeetingClick() {
        _ampersandApp2.default.navigate('meeting/' + this.model.mid + '/edit');
    }
});

},{"../templates/meetingSummary.html":47,"./base":67,"ampersand-app":92}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _domify = require('domify');

var _domify2 = _interopRequireDefault(_domify);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: this file is disgusting.
exports.default = _component2.default.extend({
    template: require('../templates/navTabs.html'),

    events: {
        'click [data-hook=nav-tab]': 'handleNavTabClick',
        'touchstart [data-hook=nav-tab]': 'handleNavTabClick'
    },

    session: {
        activeTab: ['number', false, 0]
    },

    constructor: function constructor(options) {
        // Make sure the tabs are passed in at construction
        if (!options || !options.tabs) {
            throw new TypeError('NavTabs constructor requires options.tabs');
        }

        // Calculate the width of each tab (dirty)
        this._numTabs = options.tabs.length;
        this._tabWidth = Math.floor(100 / this._numTabs * 100) / 100;

        // Set `this.elements` dynamically for each tab
        this.elements = {};
        for (var i = 0; i < this._numTabs; i++) {
            this.elements['label' + i] = 'string';
            this.elements['tab' + i] = 'view';
            options['label' + i] = options.tabs[i].label;
            options['tab' + i] = options.tabs[i].tab;
        }

        // Then delegate to the Component constructor
        return _component2.default.prototype.constructor.apply(this, arguments);
    },
    initialize: function initialize() {
        _component2.default.prototype.initialize.apply(this, arguments);
        this.on('change:activeTab', this.renderActiveTab);
    },
    render: function render() {
        this.renderWithTemplate();
        var tabRow = this.queryByHook('nav');
        var holder = this.queryByHook('holder');
        for (var i = 0; i < this._numTabs; i++) {
            // Create the nav tab (in the bar)
            var navTab = (0, _domify2.default)(require('../templates/navTab.html'));
            navTab.style.width = this._tabWidth + '%';
            navTab.setAttribute('data-index', i);
            navTab.querySelector('[data-hook=label]').setAttribute('data-hook', 'label' + i);
            tabRow.appendChild(navTab);
            // Create the container element
            var tab = document.createElement('div');
            tab.style.display = 'none';
            tab.setAttribute('data-hook', 'tab' + i);
            holder.appendChild(tab);
        }
        this.renderActiveTab();
        return _component2.default.prototype.renderElements.apply(this, arguments);
    },
    renderActiveTab: function renderActiveTab() {
        for (var i = 0; i < this._numTabs; i++) {
            if (i === this.activeTab) {
                this.queryByHook('label' + i).parentNode.parentNode.classList.add('is-active');
                this.queryByHook('tab' + i).style.display = 'block';
            } else {
                this.queryByHook('label' + i).parentNode.parentNode.classList.remove('is-active');
                this.queryByHook('tab' + i).style.display = 'none';
            }
        }
    },
    handleNavTabClick: function handleNavTabClick(e) {
        var el = e.target;
        while (!el.hasAttribute('data-index')) {
            el = el.parentNode;
        }
        // Dirty checking to prevent nested tabs from triggering this active tab
        if (el.parentNode.parentNode === this.el) {
            this.setActiveTab(Number.parseInt(el.getAttribute('data-index'), 10));
        }
    },
    setActiveTab: function setActiveTab(num) {
        this.activeTab = num;
    }
});

},{"../templates/navTab.html":48,"../templates/navTabs.html":49,"./component":69,"domify":117}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/progressBar.html'),

    session: {
        percentage: 'number'
    },

    bindings: {
        percentage: [{
            type: function type(el, val) {
                if (val === 0) {
                    el.textContent = 'D:';
                } else if (val === 100) {
                    el.textContent = ':D';
                } else if (val < 50) {
                    el.textContent = val + '% availability :(';
                } else if (val > 75) {
                    el.textContent = val + '% availability :)';
                } else {
                    el.textContent = val + '% availability';
                }
            },

            hook: 'percentage'
        }, {
            type: function type(el, val) {
                var _this = this;

                this._lastVal = val;
                if (!this._waitingForRaf) {
                    requestAnimationFrame(function () {
                        _this._waitingForRaf = false;
                        el.style.width = _this._lastVal + '%';
                    });
                }
                this._waitingForRaf = true;
            },

            hook: 'bar'
        }, {
            type: function type(el, val) {
                var red = 0;
                var green = 0;
                if (val >= 50) {
                    red = 252 - Math.round((val - 50) / 50 * (252 - 148));
                    green = 252;
                } else {
                    red = 252;
                    green = 93 + Math.round(val / 50 * (252 - 93));
                }
                el.style.backgroundColor = 'rgb(' + red + ', ' + green + ', 56)';
            },

            hook: 'bar'
        }]
    },

    setPercentage: function setPercentage(percentage) {
        this.percentage = percentage;
    }
});

},{"../templates/progressBar.html":63,"./base":67}],80:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/rateUser.html'),

    bindings: {
        'model.to.name': {
            type: 'text',
            hook: 'user-name'
        },
        'model.to._id': {
            type: function type(el, val) {
                if (val === _ampersandApp2.default.me._id) {
                    el.innerText = 'Yourself!';
                }
            },

            hook: 'user-name'
        },
        'model.to.picture': {
            type: 'attribute',
            name: 'src',
            hook: 'user-image'
        },
        'model.impact': {
            type: function type(el, val) {
                var toCheck = el.querySelector('[data-value="' + val + '"]');
                if (toCheck) {
                    toCheck.checked = true;
                }
            },

            hook: 'impact-radio'
        },
        'model.comment': {
            type: 'value',
            hook: 'comment'
        }
    },

    events: {
        'click input[type="radio"]': 'handleImpactChange',
        'input [data-hook=comment]': 'handleCommentChange'
    },

    handleImpactChange: function handleImpactChange(e) {
        var val = Number.parseInt(e.target.dataset.value, 10);
        if (!Number.isNaN(val)) {
            this.model.impact = val;
        }
    },
    handleCommentChange: function handleCommentChange(e) {
        this.model.comment = e.target.value;
    },
    validate: function validate() {
        var _this = this;

        var ratingSelected = !!this.query('input[type="radio"]:checked');
        if (!ratingSelected) {
            this.el.classList.add('is-invalid');
            this.el.addEventListener('click', function () {
                _this.el.classList.remove('is-invalid');
            });
            return false;
        }
        return true;
    }
});

},{"../templates/rateUser.html":64,"./base":67,"ampersand-app":92}],81:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _slideout = require('slideout');

var _slideout2 = _interopRequireDefault(_slideout);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _util = require('../../lib/util');

var _util2 = _interopRequireDefault(_util);

var _domify = require('domify');

var _domify2 = _interopRequireDefault(_domify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SlideoutView = _base2.default.extend({
    initialize: function initialize(options) {
        var _this = this;

        _base2.default.prototype.initialize.apply(this, arguments);
        this.el = options.el || options.menu;
        this.slideout = new _slideout2.default(options);
        this.toggleEl = document.querySelector('#slideout-toggle');

        this.toggleEl.addEventListener('click', this.slideout.toggle.bind(this.slideout));

        this.on('close', this.slideout.close.bind(this.slideout));

        this.slideout.panel.addEventListener('click', function () {
            if (_this.slideout.isOpen()) {
                _this.slideout.close();
            }
        });

        this.fixedElems = Array.prototype.slice.call(document.querySelectorAll('.fixed'));

        this.slideout.on('beforeopen', function () {
            _this.fixedElems.forEach(function (elem) {
                elem.style.transition = 'transform 300ms ease';
                elem.classList.add('fixed-open');
            });
        });

        this.slideout.on('translate', function (translated) {
            _this.fixedElems.forEach(function (elem) {
                elem.style.transition = 'transform 0ms';
                elem.style.transform = 'translate3d(' + translated + 'px,0,0)';
            });
        });

        this.slideout.on('translateend', function () {
            _this.fixedElems.forEach(function (elem) {
                elem.style.transition = 'transform 300ms ease';
                elem.style.transform = '';
            });
        });

        this.slideout.on('beforeclose', function () {
            _this.fixedElems.forEach(function (elem) {
                elem.style.transition = 'transform 300ms ease';
                elem.classList.remove('fixed-open');
            });
        });
    },
    render: function render() {
        // Use `setMenuItems`!
        return this;
    },


    // Accepts arrays of strings, arrays of DOM nodes, HTML strings, or just a string
    setMenuItems: function setMenuItems(items) {
        var _this2 = this;

        _util2.default.empty(this.el);
        var mItems = _util2.default.isArrayLike(items) ? Array.prototype.slice.call(items) : [items];
        mItems.forEach(function (item) {
            _this2.el.appendChild(typeof item === 'string' ? (0, _domify2.default)(item) : item);
        });
    },
    disable: function disable() {
        this.slideout.disableTouch();
        this.toggleEl.style.display = 'none';
    },
    enable: function enable() {
        this.slideout.enableTouch();
        this.toggleEl.style.display = 'block';
    }
});

SlideoutView.closeAfter = function closeAfter(fn) {
    return function () {
        fn();
        _ampersandApp2.default.slideout.trigger('close');
    };
};

exports.default = SlideoutView;

},{"../../lib/util":91,"./base":67,"ampersand-app":92,"domify":117,"slideout":382}],82:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _timeRange = require('../models/timeRange');

var _timeRange2 = _interopRequireDefault(_timeRange);

var _timeRangeCollection = require('../models/collections/timeRangeCollection');

var _timeRangeCollection2 = _interopRequireDefault(_timeRangeCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/timePeriodPicker.html'),

    events: {
        'change input[type=checkbox]': 'handleCheckboxChange'
    },

    initialize: function initialize() {
        _base2.default.prototype.initialize.apply(this, arguments);
        this.collection = this.collection || new _timeRangeCollection2.default();
    },
    getTimeRange: function getTimeRange(period) {
        var start = new Date();
        var end = new Date();
        switch (period) {
            case 'morning':
                start.setHours(9, 0, 0, 0);
                end.setHours(12, 0, 0, 0);
                break;
            case 'afternoon':
                start.setHours(13, 0, 0, 0);
                end.setHours(16, 0, 0, 0);
                break;
            case 'evening':
                start.setHours(18, 0, 0, 0);
                end.setHours(21, 0, 0, 0);
                break;
            default:
                throw new Error('Time range must be morning/afternoon/evening.');
        }
        return new _timeRange2.default({
            start: start,
            end: end
        });
    },
    handleCheckboxChange: function handleCheckboxChange(e) {
        if (e.target.checked) {
            this.collection.merge(this.getTimeRange(e.target.value));
        } else {
            this.collection.splice(this.getTimeRange(e.target.value));
        }
    }
});

},{"../models/collections/timeRangeCollection":10,"../models/timeRange":16,"../templates/timePeriodPicker.html":65,"./base":67}],83:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _timeRange = require('../models/timeRange');

var _timeRange2 = _interopRequireDefault(_timeRange);

var _timeRangeCollection = require('../models/collections/timeRangeCollection');

var _timeRangeCollection2 = _interopRequireDefault(_timeRangeCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _base2.default.extend({
    template: require('../templates/timePicker.html'),

    events: {
        'click [data-hook=reset-times]': 'handleResetTimes',
        'click [data-hook=add-times]': 'handleAddTimes'
    },

    initialize: function initialize() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _base2.default.prototype.initialize.apply(this, arguments);
        this.collection = this.collection || new _timeRangeCollection2.default();
        this.slotDuration = options.slotDuration;
    },
    render: function render() {
        _base2.default.prototype.render.apply(this, arguments);
        var optionsToRemove = void 0;
        if (this.slotDuration === 30) {
            optionsToRemove = this.el.querySelectorAll('option[value="15"], option[value="45"]');
        } else if (this.slotDuration === 60) {
            optionsToRemove = this.el.querySelectorAll('option[value="15"], option[value="30"], option[value="45"]');
        }
        if (optionsToRemove && optionsToRemove.length) {
            for (var i = 0; i < optionsToRemove.length; i++) {
                optionsToRemove[i].parentNode.removeChild(optionsToRemove[i]);
            }
        }
        return this;
    },
    handleResetTimes: function handleResetTimes() {
        this.queryByHook('start-hour').getElementsByTagName('option')[0].selected = 'selected';
        this.queryByHook('start-ampm').getElementsByTagName('option')[1].selected = 'selected';
        this.queryByHook('end-hour').getElementsByTagName('option')[3].selected = 'selected';
        this.queryByHook('end-ampm').getElementsByTagName('option')[1].selected = 'selected';
        this.queryByHook('start-minute').getElementsByTagName('option')[0].selected = 'selected';
        this.queryByHook('end-minute').getElementsByTagName('option')[0].selected = 'selected';
    },
    handleAddTimes: function handleAddTimes() {
        function valToHour(val, ampm) {
            var mVal = val === 12 ? val - 12 : val;
            if (ampm === 'AM') {
                return mVal;
            } else if (ampm === 'PM') {
                return mVal + 12;
            }
            throw new TypeError('ampm must be one of AM or PM');
        }
        var startHourEl = this.queryByHook('start-hour');
        var startAMPMEl = this.queryByHook('start-ampm');
        var endHourEl = this.queryByHook('end-hour');
        var endAMPMEl = this.queryByHook('end-ampm');
        var startMinuteEl = this.queryByHook('start-minute');
        var endMinuteEl = this.queryByHook('end-minute');
        var startHour = valToHour(Number.parseInt(startHourEl.value, 10), startAMPMEl.value);
        var endHour = valToHour(Number.parseInt(endHourEl.value, 10), endAMPMEl.value);
        var start = new Date(0, 0, 0, startHour, Number.parseInt(startMinuteEl.value, 10));
        var end = new Date(0, 0, 0, endHour, Number.parseInt(endMinuteEl.value, 10));
        // If end time is midnight, move it one day forward
        if (endHour === 0 && endAMPMEl.value === 'AM') {
            end.setUTCHours(end.getUTCHours() + 24);
        }
        var newTimeRange = new _timeRange2.default({
            start: start,
            end: end
        });
        this.collection.merge(newTimeRange);
        this.trigger('add-times', newTimeRange.attributes);
        // Show the user some feedback
        var el = this.queryByHook('add-times');
        var oldHTML = el.innerHTML;
        el.innerHTML = '<i class="fa fa-check"></i>';
        setTimeout(function () {
            el.innerHTML = oldHTML;
        }, 1500);
    }
});

},{"../models/collections/timeRangeCollection":10,"../models/timeRange":16,"../templates/timePicker.html":66,"./base":67}],84:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TimeslotView = exports.DateLabelView = exports.TimeLabelView = undefined;

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _drawer = require('../drawer');

var _drawer2 = _interopRequireDefault(_drawer);

var _dateTimeHelper = require('../../helpers/dateTimeHelper');

var _dateTimeHelper2 = _interopRequireDefault(_dateTimeHelper);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ColumnView = _base2.default.extend({
    template: '<div class="timegrid__column"></div>'
});
var ColumnSpacerView = _base2.default.extend({
    template: '<div class="timegrid__column timegrid__column--spacer"></div>'
});
var BlankLabelView = _base2.default.extend({
    template: '<div class="timegrid__slot timegrid__slot--label"></div>'
});
var SlotSpacerView = _base2.default.extend({
    template: '<div class="timegrid__slot timegrid__slot--spacer"></div>'
});
var TimeLabelView = _base2.default.extend({
    template: '<div class="timegrid__slot timegrid__slot--label" data-hook="time"></div>',
    session: {
        time: 'date'
    },
    bindings: {
        time: {
            type: function type(el, val) {
                el.textContent = this.formatTime(val);
            },

            hook: 'time'
        }
    },
    formatTime: function formatTime(time) {
        return _ampersandApp2.default.moment(time).format('h:mm A');
    }
});
var DateLabelView = _base2.default.extend({
    template: '<div class="timegrid__slot timegrid__slot--label" data-hook="date"></div>',
    session: {
        date: 'date'
    },
    bindings: {
        date: {
            type: function type(el, val) {
                el.textContent = this.formatDate(val);
            },

            hook: 'date'
        }
    },
    formatDate: function formatDate(date) {
        return _ampersandApp2.default.moment(date).format('dd M/D');
    }
});

var dragStart = function dragStart(stateVar, eventName) {
    var _this = this;

    this.parent._startTime = this.meetingSlot.time;
    this.parent[stateVar] = true;
    var handler = function handler() {
        _this.parent[stateVar] = false;
        delete _this.parent._startTime;
        document.removeEventListener(eventName, handler);
        _this.resetIndicatorStyles();
        if (_this.onDragStop) {
            _this.onDragStop();
        }
    };
    document.addEventListener(eventName, handler);
    if (this.onDragStart) {
        this.onDragStart();
    }
};

var dragHandler = function dragHandler(slot) {
    var _this2 = this;

    this.resetIndicatorStyles();
    var endTime = slot.meetingSlot.time;
    var corners = _dateTimeHelper2.default.getCorners(this.parent._startTime, endTime);
    var timebox = _dateTimeHelper2.default.generateTimeBox(this.parent._startTime, endTime, slot.model.slotDuration);
    timebox.forEach(function (time) {
        var slotView = _this2.parent.getTimeslotViewByTime(time);
        if (slotView === null) {
            return;
        }
        if (slotView.onDrag) {
            slotView.onDrag();
        }
        // Detect if the current time is on an edge of the timebox,
        // and style it accordingly
        var topLeft = corners[0];
        var botRight = corners[3];
        // Top edge: time is same as startTime
        if (_dateTimeHelper2.default.getHoursMinutes(time).getTime() === _dateTimeHelper2.default.getHoursMinutes(topLeft).getTime()) {
            slotView.el.classList.add('indicator--top');
        }
        // Bottom edge: time is same as endTime
        if (_dateTimeHelper2.default.getHoursMinutes(time).getTime() === _dateTimeHelper2.default.getHoursMinutes(botRight).getTime()) {
            slotView.el.classList.add('indicator--bottom');
        }
        // Left edge: date is same as date of startTime
        if (_dateTimeHelper2.default.getYearMonthDate(time).getTime() === _dateTimeHelper2.default.getYearMonthDate(topLeft).getTime()) {
            slotView.el.classList.add('indicator--left');
        }
        // Right edge: date is same as date of endTime
        if (_dateTimeHelper2.default.getYearMonthDate(time).getTime() === _dateTimeHelper2.default.getYearMonthDate(botRight).getTime()) {
            slotView.el.classList.add('indicator--right');
        }
    });
};

var TimeslotView = _base2.default.extend({
    template: '<div class="timegrid__slot timegrid__slot--body"></div>',
    session: {
        meetingSlot: 'state',
        user: 'state'
    },
    bindings: {
        'meetingSlot.disabled': {
            type: 'booleanClass',
            name: 'is-disabled'
        },
        'meetingSlot.finalized': {
            type: 'booleanClass',
            name: 'is-meetingFinalized'
        },
        'meetingSlot.first': {
            type: 'booleanClass',
            name: 'is-meetingFinalized--first'
        },
        'meetingSlot.middle': {
            type: 'booleanClass',
            name: 'is-meetingFinalized--middle'
        },
        'meetingSlot.last': {
            type: 'booleanClass',
            name: 'is-meetingFinalized--last'
        }
    },
    events: {
        mousedown: 'startDragSelect',
        mouseover: 'handleDragSelect',
        touchstart: 'startLongPressTimer',
        touchmove: 'handleTouchDrag',
        touchend: 'endLongPressTimer'
    },
    startDragSelect: function startDragSelect() {
        if (this._timing || this.parent.disableDragSelect) {
            return;
        }
        dragStart.call(this, '_isMouseDown', 'mouseup');
    },
    handleDragSelect: function handleDragSelect() {
        if (this.parent._isMouseDown && !this.parent.disableDragSelect) {
            dragHandler.call(this, this);
        }
    },
    startLongPressTimer: function startLongPressTimer() {
        // Mysteriously, calling e.preventDefault() in a setTimeout doesn't stop a mousedown
        // event from firing ~680ms after the touchstart. So we use a state variable that is
        // checked in the mousedown handler
        this._timing = true;
        // Trigger the start of touch drag select after 650ms
        this.longPressTimer = window.setTimeout(this.startTouchDrag.bind(this), 650);
        // Record the scroll locations of relevant elements
        this._preScrollTop = document.getElementById('page').scrollTop;
        this._preScrollLeft = this.parent.el.querySelector('.timegrid__body').scrollLeft;
    },
    endLongPressTimer: function endLongPressTimer() {
        this._timing = false;
        window.clearTimeout(this.longPressTimer);
    },
    startTouchDrag: function startTouchDrag() {
        if (this.parent.disableDragSelect) {
            return;
        }
        // If the user has scrolled anywhere in the last 650ms, don't start drag select
        if (this._preScrollTop !== document.getElementById('page').scrollTop || this._preScrollLeft !== this.parent.el.querySelector('.timegrid__body').scrollLeft) {
            return;
        }
        dragStart.call(this, '_isTouchDown', 'touchend');
    },
    handleTouchDrag: function handleTouchDrag(e) {
        if (this.parent._isTouchDown && !this.parent.disableDragSelect) {
            e.preventDefault();
            var touchedEl = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
            var slot = this.parent.getTimeslotViewByEl(touchedEl);
            if (!slot) {
                return;
            }
            dragHandler.call(this, slot);
        }
    },
    resetIndicatorStyles: function resetIndicatorStyles() {
        this.parent.timeslotViews.forEach(function (timeslotView) {
            if (timeslotView.el) {
                timeslotView.el.classList.remove('indicator--top');
                timeslotView.el.classList.remove('indicator--bottom');
                timeslotView.el.classList.remove('indicator--left');
                timeslotView.el.classList.remove('indicator--right');
            }
        });
    }
});

var GridDataView = _component2.default.extend({
    template: '<div class="timegrid__data" data-hook="gridData"></div>',
    elements: {
        gridData: 'view'
    }
});

var BaseGrid = _base2.default.extend({
    template: require('../../templates/basegrid.html'),

    initialize: function initialize(options) {
        var _this3 = this;

        _base2.default.prototype.initialize.apply(this, arguments);
        this.user = options && options.user || _ampersandApp2.default.me;
        this.TimeLabelView = this.TimeLabelView || TimeLabelView;
        this.DateLabelView = this.DateLabelView || DateLabelView;
        this.TimeslotView = this.TimeslotView || TimeslotView;
        // TODO: DO NOT rerender the entire view - phantom views are bountiful!
        this.listenTo(this.model, 'sync', function () {
            _this3.render();
            _this3.trigger('render');
        });
        // Dank debounce >.>
        this.listenTo(this.model.meetingSlots, 'add remove', (0, _debounce2.default)(function () {
            _this3.render();
            _this3.trigger('render');
        }, 10));

        if (this.showGridData && !this.getGridData) {
            throw new Error('Grids showing grid data must provide a "getGridData" function.');
        }
        if (this.showGridData) {
            // Setup a scroll listener on the #page for the drawer
            this.handleScroll = this.handleScroll.bind(this);
            // this.once('render', this.handleScroll);
            document.getElementById('page').addEventListener('scroll', this.handleScroll);
        }
    },
    cleanup: function cleanup() {
        if (this.showGridData) {
            document.getElementById('page').removeEventListener('scroll', this.handleScroll);
        }
    },
    render: function render() {
        _base2.default.prototype.render.call(this);
        if (this.showGridData) {
            this.renderGridData();
        }
        if (this.type) {
            this.queryByHook('grid').classList.add(this.type);
        }
        this.queryByHook('timezone').textContent = _dateTimeHelper2.default.currentTimeZoneAbbreviation;
        this.renderGrid();
        return this;
    },
    renderGridData: function renderGridData() {
        // Hacky way to see if the gridData actually exists on the page
        if (!this.gridData || this.gridData.el.offsetHeight === 0) {
            if (this.gridData) {
                this.gridData.remove();
            }
            this.gridData = new GridDataView();
            this.renderSubview(this.gridData, this.queryByHook('grid'));
            this.gridData.el.classList.add('u-hideMd');
            this.queryByHook('grid-body').classList.add('has-data');
        }
        this.gridData.setGridData(this.getGridData());
        var scrollables = this.gridData.el.querySelectorAll('[data-grid-scrollable=true]');
        var innerHeight = window.innerHeight;
        for (var i = 0; i < scrollables.length; i++) {
            // TODO: replace this super hacky scrolling solution
            scrollables[i].style.overflowY = 'auto';
            scrollables[i].style.overflowX = 'hidden';
            scrollables[i].style.willChange = 'transform';
            scrollables[i].style.maxHeight = innerHeight - 330 + 'px';
        }
        // Also render the drawer to hold the grid data on small screens
        this.renderDrawer();
    },
    renderDrawer: function renderDrawer() {
        if (!this.drawer) {
            this.drawer = this.renderSubview(new _drawer2.default(), document.body);
            this.drawer.el.classList.add('u-showMd');
        }
        this.drawer.setContent(this.getGridData());
    },
    handleScroll: function handleScroll() {
        // Calculate the scroll distance under the grid
        this._timegridOffsetTop = this.queryByHook('grid').getBoundingClientRect().top - document.getElementById('header').offsetHeight;
        // If not currently waiting on a rAF, request one
        if (!this._waitingForRaf) {
            requestAnimationFrame(this.updateScroll.bind(this));
        }
        this._waitingForRaf = true;
    },
    updateScroll: function updateScroll() {
        // Reset the ticker so a new update can be requested
        this._waitingForRaf = false;
        // Perform the update
        var el = this.queryByHook('gridData');
        if (el === null || el === undefined) {
            return;
        }
        var translate = void 0;
        if (this._timegridOffsetTop < 0) {
            translate = 'translateY(' + -1 * this._timegridOffsetTop + 'px)';
        } else {
            translate = 'translateY(0px)';
        }
        el.style.transform = translate;
        el.style['-webkit-transform'] = translate;
    },
    renderGrid: function renderGrid() {
        var _this4 = this;

        if (this.timeslotViews && this.timeslotViews.length) {
            this.timeslotViews.forEach(function (view) {
                return view.remove();
            });
        }
        var slotDurationMs = this.model.slotDuration * _dateTimeHelper2.default.MINUTE;
        var times = this.model.meetingSlots.getTimes();
        var timeLabelsCol = this.renderSubview(new ColumnView(), this.queryByHook('grid-columns'));
        timeLabelsCol.renderSubview(new BlankLabelView(), timeLabelsCol.el);
        var prevTime = void 0;
        times.forEach(function (time) {
            // Render a spacer if there is a gap in slots
            if (prevTime && time.getTime() - prevTime.getTime() > slotDurationMs) {
                timeLabelsCol.renderSubview(new SlotSpacerView(), timeLabelsCol.el);
            }
            prevTime = time;
            timeLabelsCol.renderSubview(new _this4.TimeLabelView({
                parent: _this4,
                time: time,
                model: _this4.model
            }), timeLabelsCol.el);
        });

        this.timeslotViews = [];
        var oldDate = new Date(0, 0);
        var startHistoricDate = _dateTimeHelper2.default.getHistoricDate(oldDate);
        var currDate = void 0;
        var currCol = void 0;
        var prevSlot = void 0;
        this.model.meetingSlots.forEach(function (slot) {
            currDate = slot.time;
            var currHistoricDate = _dateTimeHelper2.default.getHistoricDate(currDate);
            var oldHistoricDate = _dateTimeHelper2.default.getHistoricDate(oldDate);
            if (currHistoricDate > oldHistoricDate) {
                // If there is a date gap bigger than one day, render a spacer
                if (oldHistoricDate !== startHistoricDate && currHistoricDate - oldHistoricDate > 1) {
                    _this4.renderSubview(new ColumnSpacerView(), _this4.queryByHook('grid-columns'));
                }
                // If the date number has incremented, render a new column in the grid
                oldDate = currDate;
                currCol = _this4.renderSubview(new ColumnView(), _this4.queryByHook('grid-columns'));
                currCol.renderSubview(new _this4.DateLabelView({
                    parent: _this4,
                    date: slot.time,
                    model: _this4.model
                }), currCol.el);
            } else if (prevSlot && slot.time.getTime() - prevSlot.time.getTime() > slotDurationMs) {
                // When rendering inside of a column, if there is a gap in slots, render a spacer
                currCol.renderSubview(new SlotSpacerView(), currCol.el);
            }
            prevSlot = slot;
            _this4.timeslotViews.push(currCol.renderSubview(new _this4.TimeslotView({
                parent: _this4,
                meetingSlot: slot,
                user: _this4.user,
                model: _this4.model
            }), currCol.el));
        });
    },
    getTimeslotViewByTime: function getTimeslotViewByTime(time) {
        for (var i = 0; i < this.timeslotViews.length; i++) {
            var view = this.timeslotViews[i];
            if (view.meetingSlot.time.getTime() === time.getTime()) {
                return view;
            }
        }
        return null;
    },
    getTimeslotViewByEl: function getTimeslotViewByEl(el) {
        var current = el;
        while (current) {
            for (var i = 0; i < this.timeslotViews.length; i++) {
                var view = this.timeslotViews[i];
                if (view.el === current) {
                    return view;
                }
            }
            current = current.parentNode;
        }
        return null;
    }
});

exports.default = BaseGrid;
exports.TimeLabelView = TimeLabelView;
exports.DateLabelView = DateLabelView;
exports.TimeslotView = TimeslotView;

},{"../../helpers/dateTimeHelper":1,"../../templates/basegrid.html":35,"../base":67,"../component":69,"../drawer":70,"ampersand-app":92,"lodash/debounce":314}],85:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CreatorGridTimeslotView = exports.CreatorGridTimeLabelView = exports.CreatorGridDateLabelView = undefined;

var _basegrid = require('./basegrid');

var _basegrid2 = _interopRequireDefault(_basegrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CreatorGridTimeLabelView = _basegrid.TimeLabelView.extend({
    template: function template() {
        return ['<div class="timegrid__slot timegrid__slot--label">', '<span data-hook="time"></span>', '<span class="remove" data-hook="remove">x</span>', '</div>'].join('');
    },

    events: {
        'click [data-hook=remove]': 'handleRemoveClick'
    },
    handleRemoveClick: function handleRemoveClick() {
        this.model.meetingSlots.removeTime(this.time);
    }
});

var CreatorGridDateLabelView = _basegrid.DateLabelView.extend({
    template: function template() {
        return ['<div class="timegrid__slot timegrid__slot--label">', '<span data-hook="date"></span>', '<span class="remove" data-hook="remove">x</span>', '</div>'].join('');
    },

    events: {
        'click [data-hook=remove]': 'handleRemoveClick'
    },
    handleRemoveClick: function handleRemoveClick() {
        this.model.meetingSlots.removeDate(this.date);
    }
});

var CreatorGridTimeslotView = _basegrid.TimeslotView.extend({
    template: '<div class="timegrid__slot timegrid__slot--edit"></div>',
    bindings: Object.assign({}, _basegrid.TimeslotView.prototype.bindings),
    toggleDisabled: function toggleDisabled() {
        this.meetingSlot.disabled = !this.meetingSlot.disabled;
    },
    onDragStart: function onDragStart() {
        this.toggleDisabled();
        this.parent._disableToToggle = this.meetingSlot.disabled;
    },
    onDrag: function onDrag() {
        if (this.meetingSlot.finalized) {
            return;
        }
        this.meetingSlot.disabled = this.parent._disableToToggle;
    },
    onDragEnd: function onDragEnd() {
        delete this.parent._disableToToggle;
    }
});

exports.default = _basegrid2.default.extend({
    type: 'creator',
    TimeLabelView: CreatorGridTimeLabelView,
    DateLabelView: CreatorGridDateLabelView,
    TimeslotView: CreatorGridTimeslotView
});
exports.CreatorGridDateLabelView = CreatorGridDateLabelView;
exports.CreatorGridTimeLabelView = CreatorGridTimeLabelView;
exports.CreatorGridTimeslotView = CreatorGridTimeslotView;

},{"./basegrid":84}],86:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ItemView = _base2.default.extend({
    template: require('../../templates/filterItem.html'),

    events: {
        'click [data-hook=filter]': 'handleFilterClick',
        'touchend [data-hook=label]': 'handleFilterTouch',
        'dblclick [data-hook=label]': 'handleFilterDoubleClick'
    },

    bindings: {
        'model.picture': {
            type: 'attribute',
            name: 'src',
            hook: 'user-image'
        },
        'model.firstName': {
            type: 'text',
            hook: 'first-name'
        },
        'model.lastName': {
            type: 'text',
            hook: 'last-name'
        },
        percentFree: {
            type: 'text',
            hook: 'percent-free'
        },
        'model.show': [{
            type: 'booleanAttribute',
            name: 'checked',
            hook: 'filter'
        }, {
            type: 'booleanClass',
            name: 'u-opacity-2of4',
            invert: true,
            selector: ''
        }]
    },

    derived: {
        percentFree: {
            deps: ['meeting.meetingSlots', 'model.timeslots'],
            cache: false,
            fn: function fn() {
                var _this = this;

                if (!this.meeting || !this.meeting.meetingSlots || !this.meeting.meetingSlots.length) {
                    return '0';
                }
                var totalSlots = this.meeting.enabledSlots.length;
                var freeSlots = this.meeting.enabledSlots.map(function (slot) {
                    var timeslot = _this.model.timeslots.get(slot.time);
                    return timeslot && timeslot.free > 0 ? 1 : 0;
                }).reduce(function (prev, curr) {
                    return prev + curr;
                }, 0);
                return (freeSlots / totalSlots * 100).toFixed();
            }
        }
    },

    initialize: function initialize() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        this.meeting = options.meeting;
    },
    handleFilterTouch: function handleFilterTouch(e) {
        e.preventDefault();
        this.handleFilterClick();
    },
    handleFilterClick: function handleFilterClick() {
        this.model.show = !this.model.show;
    },
    handleFilterDoubleClick: function handleFilterDoubleClick() {
        var _this2 = this;

        var shouldToggleAll = this.meeting.visibleUsers.length === 1 && this.model.show;
        this.meeting.users.forEach(function (user) {
            if (user !== _this2.model && !shouldToggleAll) {
                user.show = false;
            } else {
                user.show = true;
            }
        });
    }
});

exports.default = _base2.default.extend({
    template: require('../../templates/filter.html'),

    initialize: function initialize() {
        _base2.default.prototype.initialize.apply(this, arguments);
        this.listenTo(this.collection, 'add remove', this.handleEmptyState);
    },
    render: function render() {
        _base2.default.prototype.render.apply(this, arguments);
        this.handleEmptyState();
        this.renderCollection(this.collection, ItemView, this.queryByHook('filter-ui'), {
            viewOptions: {
                meeting: this.model
            }
        });
        return this;
    },
    handleEmptyState: function handleEmptyState() {
        if (!this.collection.length) {
            this.queryByHook('filter-msg').innerHTML = 'Invite your teammates, or respond, to filter availabilities.';
        } else {
            this.queryByHook('filter-msg').innerHTML = 'Click on a user to filter them in or out of the time grid.';
        }
    }
});

},{"../../templates/filter.html":40,"../../templates/filterItem.html":41,"../base":67}],87:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FinalizeGridTimeslotView = undefined;

var _timegrid = require('./timegrid');

var _timegrid2 = _interopRequireDefault(_timegrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FinalizeGridTimeslotView = _timegrid.TimegridTimeslotView.extend({
    session: {
        toFinalize: 'boolean'
    },

    bindings: Object.assign({}, _timegrid.TimegridTimeslotView.prototype.bindings, {
        toFinalize: {
            type: 'booleanClass',
            name: 'to-finalize'
        }
    }),

    toggleFinalized: function toggleFinalized() {
        var finalizedToToggle = !this.toFinalize;
        this.setFinalized(finalizedToToggle);
    },
    setFinalized: function setFinalized(finalized) {
        if (this.meetingSlot.finalized || this.meetingSlot.disabled) {
            return;
        }
        this.toFinalize = finalized;
    },
    onDragStart: function onDragStart() {
        this.toggleFinalized();
        this.parent._finalizedToToggle = this.toFinalize;
    },
    onDrag: function onDrag() {
        this.setFinalized(this.parent._finalizedToToggle);
    },
    onDragEnd: function onDragEnd() {
        delete this.parent._finalizedToToggle;
    }
});

exports.default = _timegrid2.default.extend({
    type: 'finalize',
    TimeslotView: FinalizeGridTimeslotView,
    disableDragSelect: false,

    getSlotsToFinalize: function getSlotsToFinalize() {
        return this.timeslotViews.filter(function (slotView) {
            return slotView.toFinalize;
        }).map(function (slotView) {
            return slotView.meetingSlot;
        });
    }
});
exports.FinalizeGridTimeslotView = FinalizeGridTimeslotView;

},{"./timegrid":90}],88:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ampersandApp = require('ampersand-app');

var _ampersandApp2 = _interopRequireDefault(_ampersandApp);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _util = require('../../../lib/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserListGroupItemView = _base2.default.extend({
    template: function template() {
        return ['<div class="listGroup__item">', '<img class="listGroup__element listGroup__element--img u-circle" data-hook="picture"></img>', '<div class="listGroup__element listGroup__element--text">', '<span data-hook="first-name"></span>', '<span data-hook="last-name" class="u-hideXs"></span>', '</div>', '</div>'].join('');
    },

    bindings: {
        'model.picture': {
            type: 'attribute',
            name: 'src',
            hook: 'picture'
        },
        'model.firstName': {
            type: 'text',
            hook: 'first-name'
        },
        'model.lastName': {
            type: 'text',
            hook: 'last-name'
        }
    }
});

exports.default = _base2.default.extend({
    template: require('../../templates/freebusy.html'),

    bindings: {
        'model.selectedSlot': [{
            type: 'toggle',
            hook: 'details'
        }, {
            type: 'toggle',
            hook: 'finalize-notification'
        }],

        'model.selectedSlot.time': {
            type: function type(el, val) {
                var str = 'Click on a timeslot to see who is free!';
                if (val) {
                    if (this.model.selectedSlot.finalized) {
                        str = this.model.selectedSlot.finalizedTimeString;
                    } else {
                        str = '' + _ampersandApp2.default.moment(val).format('M/D h:mm A');
                    }
                }
                el.textContent = str;
            },

            hook: 'timestamp'
        },

        'model.selectedSlot.freeUsers.length': {
            type: 'text',
            hook: 'num-free'
        },

        'model.visibleUsers.length': {
            type: 'text',
            hook: 'visible-users'
        },

        'model.selectedSlot.finalized': [{
            type: 'toggle',
            hook: 'finalize-notification'
        }, {
            type: 'toggle',
            hook: 'whos-coming'
        }, {
            type: 'toggle',
            invert: true,
            hook: 'whos-freebusy'
        }, {
            type: 'toggle',
            invert: true,
            hook: 'num-free-info'
        }],

        'model.selectedSlot.finalizedFreeUsers.length': {
            type: 'toggle',
            hook: 'finalized-free'
        },
        'model.selectedSlot.finalizedPartialFreeUsers.length': {
            type: 'toggle',
            hook: 'finalized-partialFree'
        },
        'model.selectedSlot.finalizedBusyUsers.length': {
            type: 'toggle',
            hook: 'finalized-busy'
        },

        'model.selectedSlot.location': {
            type: function type(el, val) {
                if (val) {
                    el.textContent = val;
                } else {
                    el.textContent = 'not specified';
                }
            },

            hook: 'location'
        },
        'model.selectedSlot.purpose': {
            type: function type(el, val) {
                if (val) {
                    el.textContent = val;
                } else {
                    el.textContent = 'not specified';
                }
            },

            hook: 'purpose'
        }
    },

    initialize: function initialize() {
        _base2.default.prototype.render.apply(this, arguments);
        this.listenTo(this.model, 'change:selectedSlot', this.renderFreeBusy);
        this.listenTo(this.model, 'change:visibleUsers', this.renderFreeBusy);
        this.listenTo(this.model, 'change:selectedSlot', this.renderFinalizedUsers);
    },
    render: function render() {
        _base2.default.prototype.render.apply(this, arguments);
        this.renderFreeBusy();
        this.renderFinalizedUsers();
        return this;
    },
    renderFreeBusy: function renderFreeBusy() {
        if (!this.model.selectedSlot) {
            return;
        }
        var freeUsersEl = this.queryByHook('free-users');
        var busyUsersEl = this.queryByHook('busy-users');
        _util2.default.empty(freeUsersEl);
        _util2.default.empty(busyUsersEl);
        var freeUsers = this.model.selectedSlot.freeUsers;
        var busyUsers = this.model.selectedSlot.busyUsers;
        if (!freeUsers.length && !busyUsers.length && !this.model.users.length) {
            var el = this.queryByHook('details');
            el.classList.add('u-textCenter');
            el.textContent = 'Invite your teammates, or respond, to see availability.';
            return;
        }
        this.model.selectedSlot.freeUsers.forEach(function (freeUser) {
            freeUsersEl.appendChild(new UserListGroupItemView({
                model: freeUser
            }).render().el);
        });
        this.model.selectedSlot.busyUsers.forEach(function (busyUser) {
            busyUsersEl.appendChild(new UserListGroupItemView({
                model: busyUser
            }).render().el);
        });
    },
    renderFinalizedUsers: function renderFinalizedUsers() {
        if (!this.model.selectedSlot || !this.model.selectedSlot.finalized) {
            return;
        }
        var finalizedFreeUsersEl = this.queryByHook('finalized-freeUsers');
        var finalizedPartialFreeUsersEl = this.queryByHook('finalized-partialFreeUsers');
        var finalizedBusyUsersEl = this.queryByHook('finalized-busyUsers');
        _util2.default.empty(finalizedFreeUsersEl);
        _util2.default.empty(finalizedPartialFreeUsersEl);
        _util2.default.empty(finalizedBusyUsersEl);

        // Render users who are free for the entire finalized block
        this.model.selectedSlot.finalizedFreeUsers.forEach(function (finalizedFreeUser) {
            finalizedFreeUsersEl.appendChild(new UserListGroupItemView({
                model: finalizedFreeUser
            }).render().el);
        });

        // Render users who are partially free for the finalized block
        this.model.selectedSlot.finalizedPartialFreeUsers.forEach(function (finalizedPartialFreeUser) {
            finalizedPartialFreeUsersEl.appendChild(new UserListGroupItemView({
                model: finalizedPartialFreeUser
            }).render().el);
        });

        // Render users who are busy for the entire finalized block
        this.model.selectedSlot.finalizedBusyUsers.forEach(function (finalizedBusyUser) {
            finalizedBusyUsersEl.appendChild(new UserListGroupItemView({
                model: finalizedBusyUser
            }).render().el);
        });
    }
});

},{"../../../lib/util":91,"../../templates/freebusy.html":43,"../base":67,"ampersand-app":92}],89:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RSVPGridTimeslotView = undefined;

var _basegrid = require('./basegrid');

var _basegrid2 = _interopRequireDefault(_basegrid);

var _dateTimeHelper = require('../../helpers/dateTimeHelper');

var _dateTimeHelper2 = _interopRequireDefault(_dateTimeHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RSVPGridTimeslotView = _basegrid.TimeslotView.extend({
    derived: {
        isFree: {
            cache: false,
            fn: function fn() {
                var _this = this;

                return this.timeslots.length && this.timeslots.every(function (timeslot) {
                    return _this.user.isFreeAtTime(timeslot.time);
                });
            }
        },
        isUserTimeslotFinalized: {
            cache: false,
            fn: function fn() {
                // TODO: Better UX, better "ninja scheduling" by scooping up slots in the gaps caused by this
                // If any of the timeslots in here are finalized, don't let the user fill the slot out
                return this.timeslots.length && this.timeslots.some(function (timeslot) {
                    return timeslot.finalizedMid; // && timeslot.finalizedMid !== this.model.mid
                });
            }
        }
    },

    bindings: {
        'meetingSlot.disabled': {
            type: 'booleanClass',
            name: 'is-disabled'
        },
        'meetingSlot.finalized': {
            type: 'booleanClass',
            name: 'is-meetingFinalized'
        },
        isFree: {
            type: 'booleanClass',
            name: 'is-free'
        },
        isUserTimeslotFinalized: {
            type: 'booleanClass',
            name: 'is-userFinalized'
        }
    },

    initialize: function initialize() {
        var _this2 = this;

        this.timeslots = [];
        this.listenToOnce(this.user, 'change:timeslots', function () {
            _this2.getTimeslots();
            // An array as a session variable wouldn't emit change events since its reference remains the same,
            // so we can just manually trigger these events when we need to.
            _this2.trigger('change:isFree');
            _this2.trigger('change:isUserTimeslotFinalized');
        });
    },
    getTimeslots: function getTimeslots() {
        var _this3 = this;

        var getSlot = function getSlot(time) {
            return _this3.user.timeslots.get(time) || _this3.user.timeslots.add({
                time: time,
                free: _this3.user.freeByDefault ? 2 : 0
            });
        };
        this.timeslots = [];
        if (this.model.slotDuration >= 15) {
            this.timeslots.push(getSlot(this.meetingSlot.time));
        }
        if (this.model.slotDuration >= 30) {
            var time = new Date(this.meetingSlot.time.getTime() + 15 * _dateTimeHelper2.default.MINUTE);
            this.timeslots.push(getSlot(time));
        }
        if (this.model.slotDuration >= 60) {
            var time1 = new Date(this.meetingSlot.time.getTime() + 30 * _dateTimeHelper2.default.MINUTE);
            var time2 = new Date(this.meetingSlot.time.getTime() + 45 * _dateTimeHelper2.default.MINUTE);
            this.timeslots.push(getSlot(time1));
            this.timeslots.push(getSlot(time2));
        }
        this.timeslots = this.timeslots.filter(function (slot) {
            return !!slot;
        });
    },
    toggleFree: function toggleFree() {
        var freeToToggle = this.isFree ? 0 : 2;
        this.setFree(freeToToggle);
    },
    setFree: function setFree(free) {
        if (this.isUserTimeslotFinalized) {
            return;
        }
        this.timeslots.forEach(function (timeslot) {
            timeslot.free = free;
        });
        this.trigger('change:isFree');
    },
    onDragStart: function onDragStart() {
        this.toggleFree();
        this.parent._freeToToggle = this.isFree ? 2 : 0;
    },
    onDrag: function onDrag() {
        this.setFree(this.parent._freeToToggle);
    },
    onDragEnd: function onDragEnd() {
        delete this.parent._freeToToggle;
    }
});

exports.default = _basegrid2.default.extend({
    type: 'rsvp',
    TimeslotView: RSVPGridTimeslotView
});
exports.RSVPGridTimeslotView = RSVPGridTimeslotView;

},{"../../helpers/dateTimeHelper":1,"./basegrid":84}],90:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TimegridTimeslotView = undefined;

var _basegrid = require('./basegrid');

var _basegrid2 = _interopRequireDefault(_basegrid);

var _navTabs = require('../navTabs');

var _navTabs2 = _interopRequireDefault(_navTabs);

var _filter = require('./filter');

var _filter2 = _interopRequireDefault(_filter);

var _freebusy = require('./freebusy');

var _freebusy2 = _interopRequireDefault(_freebusy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TimegridTimeslotView = _basegrid.TimeslotView.extend({
    template: function template() {
        return ['<div class="timegrid__slot timegrid__slot--body">', '<div class="timegrid__slotData" data-hook="data">0</div>', '</div>'].join('');
    },


    events: Object.assign({}, _basegrid.TimeslotView.prototype.events, {
        click: 'handleClick'
    }),

    bindings: Object.assign({}, _basegrid.TimeslotView.prototype.bindings, {
        'meetingSlot.selected': {
            type: 'booleanClass',
            name: 'is-selected'
        }
    }),

    session: {
        meetingSlot: 'state',
        user: 'state'
    },

    initialize: function initialize() {
        this.listenTo(this.model.users, 'change:timeslots', this.renderFree);
        this.listenTo(this.model, 'change:visibleUsers', this.renderFree);
    },
    render: function render() {
        this.renderWithTemplate();
        this.renderFree();
        return this;
    },
    renderFree: function renderFree() {
        var numFree = this.meetingSlot.freeUsers.length;
        var el = this.queryByHook('data');
        el.textContent = numFree;
        el.style.background = 'rgba(148, 252, 56, ' + (numFree / this.model.visibleUsers.length || 0) + ')';
    },
    handleClick: function handleClick() {
        // TODO: set up a listener in the collection?
        this.meetingSlot.collection.setSelected(this.meetingSlot);
    }
});

exports.default = _basegrid2.default.extend({
    type: 'time',
    TimeslotView: TimegridTimeslotView,
    showGridData: true,
    disableDragSelect: true,

    getGridData: function getGridData() {
        return new _navTabs2.default({
            tabs: [{
                label: '<i class="fa fa-users"></i>',
                tab: new _freebusy2.default({
                    model: this.model
                })
            }, {
                label: '<i class="fa fa-filter"></i>',
                tab: new _filter2.default({
                    model: this.model,
                    collection: this.model.users
                })
            }]
        });
    }
});
exports.TimegridTimeslotView = TimegridTimeslotView;

},{"../navTabs":78,"./basegrid":84,"./filter":86,"./freebusy":88}],91:[function(require,module,exports){
'use strict';

module.exports = {
    empty: function empty(elem) {
        if (elem && elem.firstChild) {
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            }
        }
    },

    // see if it looks and smells like an iterable object, and do accept length === 0
    // http://stackoverflow.com/a/24048615/5136076
    isArrayLike: function isArrayLike(item) {
        return Array.isArray(item) || typeof item !== 'function' && typeof item !== 'string' && item.hasOwnProperty('length') && typeof item.length === 'number' && (item.length === 0 || item.length > 0 && item.length - 1 in item);
    },

    findParentAnchor: function findParentAnchor(eTarget) {
        var el = eTarget;
        while (el && el.nodeName !== 'A') {
            el = el.parentNode;
        }
        return el;
    },

    getQueryVariables: function getQueryVariables(url) {
        var pairs = {};
        var queryString = url.substring(url.indexOf('?') + 1);
        var vars = queryString.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            pairs[pair[0]] = pair[1];
        }
        return pairs;
    }
};

},{}],92:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-app"] = window.ampersand["ampersand-app"] || [];  window.ampersand["ampersand-app"].push("2.0.0");}
var Events = require('ampersand-events');
var toArray = require('lodash/toArray');
var extend = require('lodash/assign');


// instance app, can be used just by itself
// or by calling as function to pass labels
// by attaching all instances to this, we can
// avoid globals
var app = {
    extend: function () {
        var args = toArray(arguments);
        args.unshift(this);
        return extend.apply(null, args);
    },
    reset: function () {
        // clear all events
        this.off();
        // remove all but main two methods
        for (var item in this) {
            if (item !== 'extend' && item !== 'reset') {
                delete this[item];
            }
        }
        // remix events
        Events.createEmitter(this);
    }
};

Events.createEmitter(app);

// export our singleton
module.exports = app;

},{"ampersand-events":99,"lodash/assign":309,"lodash/toArray":365}],93:[function(require,module,exports){
var assign = require('lodash/assign');

/// Following code is largely pasted from Backbone.js

// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
var extend = function(protoProps) {
    var parent = this;
    var child;
    var args = [].slice.call(arguments);

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
    } else {
        child = function () {
            return parent.apply(this, arguments);
        };
    }

    // Add static properties to the constructor function from parent
    assign(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Mix in all prototype properties to the subclass if supplied.
    if (protoProps) {
        args.unshift(child.prototype);
        assign.apply(null, args);
    }

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
};

// Expose the extend function
module.exports = extend;

},{"lodash/assign":309}],94:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-collection-rest-mixin"] = window.ampersand["ampersand-collection-rest-mixin"] || [];  window.ampersand["ampersand-collection-rest-mixin"].push("6.0.0");}
var sync = require('ampersand-sync');
var assign = require('lodash/assign');

module.exports = {
    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
        options = options ? assign({}, options) : {};
        if (options.parse === void 0) options.parse = true;
        var self = this;
        
        var success = options.success;
        options.success = function(resp) {
            var method = options.reset ? 'reset' : 'set';
            if (options.set !== false) self[method](resp, options);
            if (success) success(self, resp, options);
            if (options.set !== false) self.trigger('sync', self, resp, options);
        };
        
        // Wrap an optional error callback with a fallback error event.
        var error = options.error;
        options.error = function(resp) {
            if (error) error(self, resp, options);
            self.trigger('error', self, resp, options);
        };
        
        var request = this.sync('read', this, options);
        // Make the request available on the options object so it can be accessed
        // further down the line by `parse`, sync listeners, etc
        // https://github.com/AmpersandJS/ampersand-collection-rest-mixin/commit/d32d788aaff912387eb1106f2d7ad183ec39e11a#diff-84c84703169bf5017b1bc323653acaa3R32
        options.xhr = request;
        return request;
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
        options = options ? assign({}, options) : {};
        if (!(model = this._prepareModel(model, options))) return false;
        if (!options.wait) this.add(model, options);
        var self = this;
        var success = options.success;
        options.success = function(model, resp) {
            if (options.wait) self.add(model, options);
            if (success) success(model, resp, options);
        };
        model.save(null, options);
        return model;
    },

    sync: function() {
        return sync.apply(this, arguments);
    },

    // Get or fetch a model by Id.
    getOrFetch: function (id, options, cb) {
        if (arguments.length !== 3) {
            cb = options;
            options = {};
        }
        
        var self = this;
        var model = this.get(id);
        
        if (model) {
            return window.setTimeout(cb.bind(null, null, model), 0);
        }
        
        if (options.all) {
            //preserve original `options.always`
            var always = options.always;
            options.always = function(err, resp, body) {
                if (always) always(err, resp, body);
                if (!cb) return;
                
                var model = self.get(id);
                var err2 = model ? null : new Error('not found');
                cb(err2, model);
            };
            return this.fetch(options);
        } else {
            return this.fetchById(id, options, cb);
        }
    },

    // fetchById: fetches a model and adds it to
    // collection when fetched.
    fetchById: function (id, options, cb) {
        if (arguments.length !== 3) {
            cb = options;
            options = {};
        }
        
        var self = this;
        var idObj = {};
        idObj[this.mainIndex] = id;
        var model = new this.model(idObj, {collection: this});
        
        //preserve original `options.success`
        var success = options.success;
        options.success = function (resp) {
            model = self.add(model);
            if (success) success(self, resp, options);
            if (cb) cb(null, model);
        };
        
        //preserve original `options.error`
        var error = options.error;
        options.error = function (collection, resp) {
            delete model.collection;
            
            if (error) error(collection, resp, options);
            
            if (cb) {
                var err = new Error(resp.rawRequest.statusText);
                err.status = resp.rawRequest.status;
                cb(err);
            }
        };
        
        return model.fetch(options);
    }
};

},{"ampersand-sync":106,"lodash/assign":309}],95:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-collection-view"] = window.ampersand["ampersand-collection-view"] || [];  window.ampersand["ampersand-collection-view"].push("2.0.1");}
var assign = require('lodash/assign');
var invokeMap = require('lodash/invokeMap');
var pick = require('lodash/pick');
var find = require('lodash/find');
var difference = require('lodash/difference');
var bind = require('lodash/bind');
var Events = require('ampersand-events');
var ampExtend = require('ampersand-class-extend');

// options
var options = ['collection', 'el', 'viewOptions', 'view', 'emptyView', 'filter', 'reverse', 'parent'];


function CollectionView(spec) {
    if (!spec) {
        throw new ReferenceError('Collection view missing required parameters: collection, el');
    }
    if (!spec.collection) {
        throw new ReferenceError('Collection view requires a collection');
    }
    if (!spec.el && !this.insertSelf) {
        throw new ReferenceError('Collection view requires an el');
    }
    assign(this, pick(spec, options));
    this.views = [];
    this.listenTo(this.collection, 'add', this._addViewForModel);
    this.listenTo(this.collection, 'remove', this._removeViewForModel);
    this.listenTo(this.collection, 'sort', this._rerenderAll);
    this.listenTo(this.collection, 'refresh reset', this._reset);
}

assign(CollectionView.prototype, Events, {
    // for view contract compliance
    render: function () {
        this._renderAll();
        return this;
    },
    remove: function () {
        invokeMap(this.views, 'remove');
        this.stopListening();
    },
    _getViewByModel: function (model) {
        return find(this.views, function (view) {
            return model === view.model;
        });
    },
    _createViewForModel: function (model, renderOpts) {
        var defaultViewOptions = {model: model, collection: this.collection, parent: this};
        var view = new this.view(assign(defaultViewOptions, this.viewOptions));
        this.views.push(view);
        view.renderedByParentView = true;
        view.render(renderOpts);
        return view;
    },
    _getOrCreateByModel: function (model, renderOpts) {
        return this._getViewByModel(model) || this._createViewForModel(model, renderOpts);
    },
    _addViewForModel: function (model, collection, options) {
        var matches = this.filter ? this.filter(model) : true;
        if (!matches) {
            return;
        }
        if (this.renderedEmptyView) {
            this.renderedEmptyView.remove();
            delete this.renderedEmptyView;
        }
        var view = this._getOrCreateByModel(model, {containerEl: this.el});
        if (options && options.rerender) {
            this._insertView(view);
        } else {
            this._insertViewAtIndex(view);
        }
    },
    _insertViewAtIndex: function (view) {
        if (!view.insertSelf) {
            var pos = this.collection.indexOf(view.model);
            var modelToInsertBefore, viewToInsertBefore;

            if (this.reverse) {
                modelToInsertBefore = this.collection.at(pos - 1);
            } else {
                modelToInsertBefore = this.collection.at(pos + 1);
            }

            viewToInsertBefore = this._getViewByModel(modelToInsertBefore);

            // FIX IE bug (https://developer.mozilla.org/en-US/docs/Web/API/Node.insertBefore)
            // "In Internet Explorer an undefined value as referenceElement will throw errors, while in rest of the modern browsers, this works fine."
            if(viewToInsertBefore) {
                this.el.insertBefore(view.el, viewToInsertBefore && viewToInsertBefore.el);
            } else {
                this.el.appendChild(view.el);
            }
        }
    },
    _insertView: function (view) {
        if (!view.insertSelf) {
            if (this.reverse && this.el.firstChild) {
                this.el.insertBefore(view.el, this.el.firstChild);
            } else {
                this.el.appendChild(view.el);
            }
        }
    },
    _removeViewForModel: function (model) {
        var view = this._getViewByModel(model);
        if (!view) {
            return;
        }
        var index = this.views.indexOf(view);
        if (index !== -1) {
            // remove it if we found it calling animateRemove
            // to give user option of gracefully destroying.
            view = this.views.splice(index, 1)[0];
            this._removeView(view);
            if (this.views.length === 0) {
                this._renderEmptyView();
            }
        }
    },
    _removeView: function (view) {
        if (view.animateRemove) {
            view.animateRemove();
        } else {
            view.remove();
        }
    },
    _renderAll: function () {
        this.collection.each(bind(this._addViewForModel, this));
        if (this.views.length === 0) {
            this._renderEmptyView();
        }
    },
    _rerenderAll: function (collection, options) {
        options = options || {};
        this.collection.each(bind(function (model) {
            this._addViewForModel(model, this, assign(options, {rerender: true}));
        }, this));
    },
    _renderEmptyView: function() {
        if (this.emptyView && !this.renderedEmptyView) {
            var view = this.renderedEmptyView = new this.emptyView({parent: this});
            this.el.appendChild(view.render().el);
        }
    },
    _reset: function () {
        var newViews = this.collection.map(bind(this._getOrCreateByModel, this));

        //Remove existing views from the ui
        var toRemove = difference(this.views, newViews);
        toRemove.forEach(this._removeView, this);

        //Rerender the full list with the new views
        this.views = newViews;
        this._rerenderAll();
        if (this.views.length === 0) {
            this._renderEmptyView();
        }
    }
});

CollectionView.extend = ampExtend;

module.exports = CollectionView;

},{"ampersand-class-extend":93,"ampersand-events":99,"lodash/assign":309,"lodash/bind":312,"lodash/difference":317,"lodash/find":321,"lodash/invokeMap":331,"lodash/pick":356}],96:[function(require,module,exports){
var AmpersandEvents = require('ampersand-events');
var classExtend = require('ampersand-class-extend');
var isArray = require('lodash/isArray');
var bind = require('lodash/bind');
var assign = require('lodash/assign');
var slice = [].slice;

function Collection(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator) this.comparator = options.comparator;
    if (options.parent) this.parent = options.parent;
    if (!this.mainIndex) {
        var idAttribute = this.model && this.model.prototype && this.model.prototype.idAttribute;
        this.mainIndex = idAttribute || 'id';
    }
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, assign({silent: true}, options));
}

assign(Collection.prototype, AmpersandEvents, {
    initialize: function () {},

    isModel: function (model) {
        return this.model && model instanceof this.model;
    },

    add: function (models, options) {
        return this.set(models, assign({merge: false, add: true, remove: false}, options));
    },

    // overridable parse method
    parse: function (res, options) {
        return res;
    },

    // overridable serialize method
    serialize: function () {
        return this.map(function (model) {
            if (model.serialize) {
                return model.serialize();
            } else {
                var out = {};
                assign(out, model);
                delete out.collection;
                return out;
            }
        });
    },

    toJSON: function () {
        return this.serialize();
    },

    set: function (models, options) {
        options = assign({add: true, remove: true, merge: true}, options);
        if (options.parse) models = this.parse(models, options);
        var singular = !isArray(models);
        models = singular ? (models ? [models] : []) : models.slice();
        var id, model, attrs, existing, sort, i, length;
        var at = options.at;
        var sortable = this.comparator && (at == null) && options.sort !== false;
        var sortAttr = ('string' === typeof this.comparator) ? this.comparator : null;
        var toAdd = [], toRemove = [], modelMap = {};
        var add = options.add, merge = options.merge, remove = options.remove;
        var order = !sortable && add && remove ? [] : false;
        var targetProto = this.model && this.model.prototype || Object.prototype;

        // Turn bare objects into model references, and prevent invalid models
        // from being added.
        for (i = 0, length = models.length; i < length; i++) {
            attrs = models[i] || {};
            if (this.isModel(attrs)) {
                id = model = attrs;
            } else if (targetProto.generateId) {
                id = targetProto.generateId(attrs);
            } else {
                id = attrs[this.mainIndex];
                if (id === undefined && this._isDerivedIndex(targetProto)) {
                    id = targetProto._derived[this.mainIndex].fn.call(attrs);
                }
            }

            // If a duplicate is found, prevent it from being added and
            // optionally merge it into the existing model.
            if (existing = this.get(id)) {
                if (remove) modelMap[existing.cid || existing[this.mainIndex]] = true;
                if (merge) {
                    attrs = attrs === model ? model.attributes : attrs;
                    if (options.parse) attrs = existing.parse(attrs, options);
                    // if this is model
                    if (existing.set) {
                        existing.set(attrs, options);
                        if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
                    } else {
                        // if not just update the properties
                        assign(existing, attrs);
                    }
                }
                models[i] = existing;

            // If this is a new, valid model, push it to the `toAdd` list.
            } else if (add) {
                model = models[i] = this._prepareModel(attrs, options);
                if (!model) continue;
                toAdd.push(model);
                this._addReference(model, options);
            }

            // Do not add multiple models with the same `id`.
            model = existing || model;
            if (!model) continue;
            if (order && ((model.isNew && model.isNew() || !model[this.mainIndex]) || !modelMap[model.cid || model[this.mainIndex]])) order.push(model);
            modelMap[model[this.mainIndex]] = true;
        }

        // Remove nonexistent models if appropriate.
        if (remove) {
            for (i = 0, length = this.length; i < length; i++) {
                model = this.models[i];
                if (!modelMap[model.cid || model[this.mainIndex]]) toRemove.push(model);
            }
            if (toRemove.length) this.remove(toRemove, options);
        }

        // See if sorting is needed, update `length` and splice in new models.
        if (toAdd.length || (order && order.length)) {
            if (sortable) sort = true;
            if (at != null) {
                for (i = 0, length = toAdd.length; i < length; i++) {
                    this.models.splice(at + i, 0, toAdd[i]);
                }
            } else {
                var orderedModels = order || toAdd;
                for (i = 0, length = orderedModels.length; i < length; i++) {
                    this.models.push(orderedModels[i]);
                }
            }
        }

        // Silently sort the collection if appropriate.
        if (sort) this.sort({silent: true});

        // Unless silenced, it's time to fire all appropriate add/sort events.
        if (!options.silent) {
            for (i = 0, length = toAdd.length; i < length; i++) {
                model = toAdd[i];
                if (model.trigger) {
                    model.trigger('add', model, this, options);
                } else {
                    this.trigger('add', model, this, options);
                }
            }
            if (sort || (order && order.length)) this.trigger('sort', this, options);
        }

        // Return the added (or merged) model (or models).
        return singular ? models[0] : models;
    },

    get: function (query, indexName) {
        if (query == null) return;
        var index = this._indexes[indexName || this.mainIndex];
        return (index && (index[query] || index[query[this.mainIndex]])) || this._indexes.cid[query] || this._indexes.cid[query.cid];
    },

    // Get the model at the given index.
    at: function (index) {
        return this.models[index];
    },

    remove: function (models, options) {
        var singular = !isArray(models);
        var i, length, model, index;

        models = singular ? [models] : slice.call(models);
        options || (options = {});
        for (i = 0, length = models.length; i < length; i++) {
            model = models[i] = this.get(models[i]);
            if (!model) continue;
            this._deIndex(model);
            index = this.models.indexOf(model);
            this.models.splice(index, 1);
            if (!options.silent) {
                options.index = index;
                if (model.trigger) {
                    model.trigger('remove', model, this, options);
                } else {
                    this.trigger('remove', model, this, options);
                }
            }
            this._removeReference(model, options);
        }
        return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function (models, options) {
        options || (options = {});
        for (var i = 0, length = this.models.length; i < length; i++) {
            this._removeReference(this.models[i], options);
        }
        options.previousModels = this.models;
        this._reset();
        models = this.add(models, assign({silent: true}, options));
        if (!options.silent) this.trigger('reset', this, options);
        return models;
    },

    sort: function (options) {
        var self = this;
        if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
        options || (options = {});

        if (typeof this.comparator === 'string') {
            this.models.sort(function (left, right) {
                if (left.get) {
                    left = left.get(self.comparator);
                    right = right.get(self.comparator);
                } else {
                    left = left[self.comparator];
                    right = right[self.comparator];
                }
                if (left > right || left === void 0) return 1;
                if (left < right || right === void 0) return -1;
                return 0;
            });
        } else if (this.comparator.length === 1) {
            this.models.sort(function (left, right) {
                left = self.comparator(left);
                right = self.comparator(right);
                if (left > right || left === void 0) return 1;
                if (left < right || right === void 0) return -1;
                return 0;
            });
        } else {
            this.models.sort(bind(this.comparator,this));
        }

        if (!options.silent) this.trigger('sort', this, options);
        return this;
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function () {
        var list = slice.call(this.indexes || []);
        var i = 0;
        list.push(this.mainIndex);
        list.push('cid');
        var l = list.length;
        this.models = [];
        this._indexes = {};
        for (; i < l; i++) {
            this._indexes[list[i]] = {};
        }
    },

    _prepareModel: function (attrs, options) {
        // if we haven't defined a constructor, skip this
        if (!this.model) return attrs;

        if (this.isModel(attrs)) {
            if (!attrs.collection) attrs.collection = this;
            return attrs;
        } else {
            options = options ? assign({}, options) : {};
            options.collection = this;
            var model = new this.model(attrs, options);
            if (!model.validationError) return model;
            this.trigger('invalid', this, model.validationError, options);
            return false;
        }
    },

    _deIndex: function (model, attribute, value) {
        var indexVal;
        if (attribute !== undefined) {
            if (undefined === this._indexes[attribute]) throw new Error('Given attribute is not an index');
            delete this._indexes[attribute][value];
            return;
        }
        // Not a specific attribute
        for (var indexAttr in this._indexes) {
            indexVal = model.hasOwnProperty(indexAttr) ? model[indexAttr] : (model.get && model.get(indexAttr));
            delete this._indexes[indexAttr][indexVal];
        }
    },

    _index: function (model, attribute) {
        var indexVal;
        if (attribute !== undefined) {
            if (undefined === this._indexes[attribute]) throw new Error('Given attribute is not an index');
            indexVal = model[attribute] || (model.get && model.get(attribute));
            if (indexVal) this._indexes[attribute][indexVal] = model;
            return;
        }
        // Not a specific attribute
        for (var indexAttr in this._indexes) {
            indexVal = model.hasOwnProperty(indexAttr) ? model[indexAttr] : (model.get && model.get(indexAttr));
            if (indexVal != null) this._indexes[indexAttr][indexVal] = model;
        }
    },

    _isDerivedIndex: function(proto) {
        if (!proto || typeof proto._derived !== 'object') {
            return false;
        }
        return Object.keys(proto._derived).indexOf(this.mainIndex) >= 0;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function (model, options) {
        this._index(model);
        if (!model.collection) model.collection = this;
        if (model.on) model.on('all', this._onModelEvent, this);
    },

        // Internal method to sever a model's ties to a collection.
    _removeReference: function (model, options) {
        if (this === model.collection) delete model.collection;
        this._deIndex(model);
        if (model.off) model.off('all', this._onModelEvent, this);
    },

    _onModelEvent: function (event, model, collection, options) {
        var eventName = event.split(':')[0];
        var attribute = event.split(':')[1];

        if ((eventName === 'add' || eventName === 'remove') && collection !== this) return;
        if (eventName === 'destroy') this.remove(model, options);
        if (model && eventName === 'change' && attribute && this._indexes[attribute]) {
            this._deIndex(model, attribute, model.previousAttributes()[attribute]);
            this._index(model, attribute);
        }
        this.trigger.apply(this, arguments);
    }
});

Object.defineProperties(Collection.prototype, {
    length: {
        get: function () {
            return this.models.length;
        }
    },
    isCollection: {
        get: function () {
            return true;
        }
    }
});

var arrayMethods = [
    'indexOf',
    'lastIndexOf',
    'every',
    'some',
    'forEach',
    'map',
    'filter',
    'reduce',
    'reduceRight'
];

arrayMethods.forEach(function (method) {
    Collection.prototype[method] = function () {
        return this.models[method].apply(this.models, arguments);
    };
});

// alias each/forEach for maximum compatibility
Collection.prototype.each = Collection.prototype.forEach;

Collection.extend = classExtend;

module.exports = Collection;

},{"ampersand-class-extend":93,"ampersand-events":99,"lodash/assign":309,"lodash/bind":312,"lodash/isArray":333}],97:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-dom-bindings"] = window.ampersand["ampersand-dom-bindings"] || [];  window.ampersand["ampersand-dom-bindings"].push("3.8.0");}
var Store = require('key-tree-store');
var dom = require('ampersand-dom');
var matchesSelector = require('matches-selector');
var partial = require('lodash.partial');
var slice = Array.prototype.slice;

function getMatches(el, selector) {
    if (selector === '') return [el];
    var matches = [];
    if (matchesSelector(el, selector)) matches.push(el);
    return matches.concat(slice.call(el.querySelectorAll(selector)));
}

function setAttributes(el, attrs) {
    for (var name in attrs) {
        dom.setAttribute(el, name, attrs[name]);
    }
}

function removeAttributes(el, attrs) {
    for (var name in attrs) {
        dom.removeAttribute(el, name);
    }
}

function makeArray(val) {
    return Array.isArray(val) ? val : [val];
}

function switchHandler(binding, el, value) {
    // the element selector to show
    var showValue = binding.cases[value];
    // hide all the other elements with a different value
    for (var item in binding.cases) {
        var curValue = binding.cases[item];
        if (value !== item && curValue !== showValue) {
            getMatches(el, curValue).forEach(function (match) {
                dom.hide(match);
            });
        }
    }
    getMatches(el, showValue).forEach(function (match) {
        dom.show(match);
    });
}

function getSelector(binding) {
    if (typeof binding.selector === 'string') {
        return binding.selector;
    } else if (binding.hook) {
        return '[data-hook~="' + binding.hook + '"]';
    } else {
        return '';
    }
}

function getBindingFunc(binding, context) {
    var type = binding.type || 'text';
    var isCustomBinding = typeof type === 'function';
    var selector = getSelector(binding);
    var yes = binding.yes;
    var no = binding.no;
    var hasYesNo = !!(yes || no);

    // storage variable for previous if relevant
    var previousValue;

    if (isCustomBinding) {
        return function (el, value) {
            getMatches(el, selector).forEach(function (match) {
                type.call(context, match, value, previousValue);
            });
            previousValue = value;
        };
    } else if (type === 'text') {
        return function (el, value) {
            getMatches(el, selector).forEach(function (match) {
                dom.text(match, value);
            });
        };
    } else if (type === 'class') {
        return function (el, value) {
            getMatches(el, selector).forEach(function (match) {
                dom.switchClass(match, previousValue, value);
            });
            previousValue = value;
        };
    } else if (type === 'attribute') {
        if (!binding.name) throw Error('attribute bindings must have a "name"');
        return function (el, value) {
            var names = makeArray(binding.name);
            getMatches(el, selector).forEach(function (match) {
                names.forEach(function (name) {
                    dom.setAttribute(match, name, value);
                });
            });
            previousValue = value;
        };
    } else if (type === 'value') {
        return function (el, value) {
            getMatches(el, selector).forEach(function (match) {
                if (!value && value !== 0) value = '';
                // only apply bindings if element is not currently focused
                if (document.activeElement !== match) match.value = value;
            });
            previousValue = value;
        };
    } else if (type === 'booleanClass') {
        // if there's a `no` case this is actually a switch
        if (hasYesNo) {
            yes = makeArray(yes || '');
            no = makeArray(no || '');
            return function (el, value) {
                var prevClass = value ? no : yes;
                var newClass = value ? yes : no;
                getMatches(el, selector).forEach(function (match) {
                    prevClass.forEach(function (pc) {
                        dom.removeClass(match, pc);
                    });
                    newClass.forEach(function (nc) {
                        dom.addClass(match, nc);
                    });
                });
            };
        } else {
            return function (el, value, keyName) {
                var name = makeArray(binding.name || keyName);
                var invert = (binding.invert || false);
                value = (invert ? (value ? false : true) : value);
                getMatches(el, selector).forEach(function (match) {
                    name.forEach(function (className) {
                        dom[value ? 'addClass' : 'removeClass'](match, className);
                    });
                });
            };
        }
    } else if (type === 'booleanAttribute') {
        // if there are `yes` and `no` selectors, this swaps between them
        if (hasYesNo) {
            yes = makeArray(yes || '');
            no = makeArray(no || '');
            return function (el, value) {
                var prevAttribute = value ? no : yes;
                var newAttribute = value ? yes : no;
                getMatches(el, selector).forEach(function (match) {
                    prevAttribute.forEach(function (pa) {
                        if (pa) {
                            dom.removeAttribute(match, pa);
                        }
                    });
                    newAttribute.forEach(function (na) {
                        if (na) {
                            dom.addAttribute(match, na);
                        }
                    });
                });
            };
        } else {
            return function (el, value, keyName) {
                var name = makeArray(binding.name || keyName);
                var invert = (binding.invert || false);
                value = (invert ? (value ? false : true) : value);
                getMatches(el, selector).forEach(function (match) {
                    name.forEach(function (attr) {
                        dom[value ? 'addAttribute' : 'removeAttribute'](match, attr);
                    });
                });
            };
        }
    } else if (type === 'toggle') {
        var mode = (binding.mode || 'display');
        var invert = (binding.invert || false);
        // this doesn't require a selector since we can pass yes/no selectors
        if (hasYesNo) {
            return function (el, value) {
                getMatches(el, yes).forEach(function (match) {
                    dom[value ? 'show' : 'hide'](match, mode);
                });
                getMatches(el, no).forEach(function (match) {
                    dom[value ? 'hide' : 'show'](match, mode);
                });
            };
        } else {
            return function (el, value) {
                value = (invert ? (value ? false : true) : value);
                getMatches(el, selector).forEach(function (match) {
                    dom[value ? 'show' : 'hide'](match, mode);
                });
            };
        }
    } else if (type === 'switch') {
        if (!binding.cases) throw Error('switch bindings must have "cases"');
        return partial(switchHandler, binding);
    } else if (type === 'innerHTML') {
        return function (el, value) {
            getMatches(el, selector).forEach(function (match) {
                dom.html(match, value);
            });
        };
    } else if (type === 'switchClass') {
        if (!binding.cases) throw Error('switchClass bindings must have "cases"');
        return function (el, value, keyName) {
            var name = makeArray(binding.name || keyName);
            for (var item in binding.cases) {
                getMatches(el, binding.cases[item]).forEach(function (match) {
                    name.forEach(function (className) {
                        dom[value === item ? 'addClass' : 'removeClass'](match, className);
                    });
                });
            }
        };
    } else if (type === 'switchAttribute') {
        if (!binding.cases) throw Error('switchAttribute bindings must have "cases"');
        return function (el, value, keyName) {
            getMatches(el, selector).forEach(function (match) {
                if (previousValue) {
                    removeAttributes(match, previousValue);
                }

                if (value in binding.cases) {
                    var attrs = binding.cases[value];
                    if (typeof attrs === 'string') {
                        attrs = {};
                        attrs[binding.name || keyName] = binding.cases[value];
                    }
                    setAttributes(match, attrs);

                    previousValue = attrs;
                }
            });
        };
    } else {
        throw new Error('no such binding type: ' + type);
    }
}

// returns a key-tree-store of functions
// that can be applied to any element/model.

// all resulting functions should be called
// like func(el, value, lastKeyName)
module.exports = function (bindings, context) {
    var store = new Store();
    var key, current;

    for (key in bindings) {
        current = bindings[key];
        if (typeof current === 'string') {
            store.add(key, getBindingFunc({
                type: 'text',
                selector: current
            }));
        } else if (current.forEach) {
            current.forEach(function (binding) {
                store.add(key, getBindingFunc(binding, context));
            });
        } else {
            store.add(key, getBindingFunc(current, context));
        }
    }

    return store;
};

},{"ampersand-dom":98,"key-tree-store":125,"lodash.partial":129,"matches-selector":374}],98:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-dom"] = window.ampersand["ampersand-dom"] || [];  window.ampersand["ampersand-dom"].push("1.5.0");}
var dom = module.exports = {
    text: function (el, val) {
        el.textContent = getString(val);
    },
    // optimize if we have classList
    addClass: function (el, cls) {
        cls = getString(cls);
        if (!cls) return;
        if (Array.isArray(cls)) {
            cls.forEach(function(c) {
                dom.addClass(el, c);
            });
        } else if (el.classList) {
            el.classList.add(cls);
        } else {
            if (!hasClass(el, cls)) {
                if (el.classList) {
                    el.classList.add(cls);
                } else {
                    el.className += ' ' + cls;
                }
            }
        }
    },
    removeClass: function (el, cls) {
        if (Array.isArray(cls)) {
            cls.forEach(function(c) {
                dom.removeClass(el, c);
            });
        } else if (el.classList) {
            cls = getString(cls);
            if (cls) el.classList.remove(cls);
        } else {
            // may be faster to not edit unless we know we have it?
            el.className = el.className.replace(new RegExp('(^|\\b)' + cls.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    },
    hasClass: hasClass,
    switchClass: function (el, prevCls, newCls) {
        if (prevCls) this.removeClass(el, prevCls);
        this.addClass(el, newCls);
    },
    // makes sure attribute (with no content) is added
    // if exists it will be cleared of content
    addAttribute: function (el, attr) {
        // setting to empty string does same
        el.setAttribute(attr, '');
        // Some browsers won't update UI for boolean attributes unless you
        // set it directly. So we do both
        if (hasBooleanProperty(el, attr)) el[attr] = true;
    },
    // completely removes attribute
    removeAttribute: function (el, attr) {
        el.removeAttribute(attr);
        if (hasBooleanProperty(el, attr)) el[attr] = false;
    },
    // sets attribute to string value given, clearing any current value
    setAttribute: function (el, attr, value) {
        el.setAttribute(attr, getString(value));
    },
    getAttribute: function (el, attr) {
        return el.getAttribute(attr);
    },
    hasAttribute: function (el, attr) {
        return el.hasAttribute(attr);
    },
    hide: function (el, mode) {
        if (!mode) mode = 'display';
        if (!isHidden(el)) {
            storeDisplayStyle(el, mode);
            hide(el, mode);
        }
    },
    // show element
    show: function (el, mode) {
        if (!mode) mode = 'display';
        show(el, mode);
    },
    toggle: function (el, mode) {
        if (!isHidden(el)) {
            dom.hide(el, mode);
        } else {
            dom.show(el, mode);
        }
    },
    html: function (el, content) {
        el.innerHTML = content;
    }
};

// helpers
function getString(val) {
    if (!val && val !== 0) {
        return '';
    } else {
        return val;
    }
}

function hasClass(el, cls) {
    if (el.classList) {
        return el.classList.contains(cls);
    } else {
        return new RegExp('(^| )' + cls + '( |$)', 'gi').test(el.className);
    }
}

function hasBooleanProperty(el, prop) {
    var val = el[prop];
    return prop in el && (val === true || val === false);
}

function isHidden (el) {
    return dom.getAttribute(el, 'data-anddom-hidden') === 'true';
}

function storeDisplayStyle (el, mode) {
    dom.setAttribute(el, 'data-anddom-' + mode, el.style[mode]);
}

function show (el, mode) {
    el.style[mode] = dom.getAttribute(el, 'data-anddom-' + mode) || '';
    dom.removeAttribute(el, 'data-anddom-hidden');
}

function hide (el, mode) {
    dom.setAttribute(el, 'data-anddom-hidden', 'true');
    el.style[mode] = (mode === 'visibility' ? 'hidden' : 'none');
}

},{}],99:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-events"] = window.ampersand["ampersand-events"] || [];  window.ampersand["ampersand-events"].push("2.0.2");}
var runOnce = require('lodash/once');
var keys = require('lodash/keys');
var isEmpty = require('lodash/isEmpty');
var assign = require('lodash/assign');
var forEach = require('lodash/forEach');
var slice = Array.prototype.slice;

var utils = require('./libs/utils');

var Events = {
    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function (name, callback, context) {
        if (!utils.eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
        this._events || (this._events = {});
        var events = this._events[name] || (this._events[name] = []);
        events.push({callback: callback, context: context, ctx: context || this});
        return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function (name, callback, context) {
        if (!utils.eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
        var self = this;
        var once = runOnce(function () {
            self.off(name, once);
            callback.apply(this, arguments);
        });
        once._callback = callback;
        return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function (name, callback, context) {
        var retain, ev, events, names, i, l, j, k;
        if (!this._events || !utils.eventsApi(this, 'off', name, [callback, context])) return this;
        if (!name && !callback && !context) {
            this._events = void 0;
            return this;
        }
        names = name ? [name] : keys(this._events);
        for (i = 0, l = names.length; i < l; i++) {
            name = names[i];
            if (events = this._events[name]) {
                this._events[name] = retain = [];
                if (callback || context) {
                    for (j = 0, k = events.length; j < k; j++) {
                        ev = events[j];
                        if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                                (context && context !== ev.context)) {
                            retain.push(ev);
                        }
                    }
                }
                if (!retain.length) delete this._events[name];
            }
        }

        return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function (name) {
        if (!this._events) return this;
        var args = slice.call(arguments, 1);
        if (!utils.eventsApi(this, 'trigger', name, args)) return this;
        var events = this._events[name];
        var allEvents = this._events.all;
        if (events) utils.triggerEvents(events, args);
        if (allEvents) utils.triggerEvents(allEvents, arguments);
        return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function (obj, name, callback) {
        var listeningTo = this._listeningTo;
        if (!listeningTo) return this;
        var remove = !name && !callback;
        if (!callback && typeof name === 'object') callback = this;
        if (obj) (listeningTo = {})[obj._listenId] = obj;
        var self = this;
        forEach(listeningTo, function (item, id) {
            item.off(name, callback, self);
            if (remove || isEmpty(item._events)) delete self._listeningTo[id];
        });
        return this;
    },

    // extend an object with event capabilities if passed
    // or just return a new one.
    createEmitter: function (obj) {
        return assign(obj || {}, Events);
    },

    listenTo: utils.createListenMethod('on'),

    listenToOnce: utils.createListenMethod('once'),

    listenToAndRun: function (obj, name, callback) {
        this.listenTo.apply(this, arguments);
        if (!callback && typeof name === 'object') callback = this;
        callback.apply(this);
        return this;
    }
};

// setup aliases
Events.bind = Events.on;
Events.unbind = Events.off;
Events.removeListener = Events.off;
Events.removeAllListeners = Events.off;
Events.emit = Events.trigger;

module.exports = Events;

},{"./libs/utils":100,"lodash/assign":309,"lodash/forEach":324,"lodash/isEmpty":338,"lodash/keys":348,"lodash/once":355}],100:[function(require,module,exports){
var uniqueId = require('lodash/uniqueId');
var eventSplitter = /\s+/;

// A difficult-to-believe, but optimized internal dispatch function for
// triggering events. Tries to keep the usual cases speedy.
exports.triggerEvents = function triggerEvents(events, args) {
    var ev;
    var i = -1;
    var l = events.length;
    var a1 = args[0];
    var a2 = args[1];
    var a3 = args[2];
    switch (args.length) {
        case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
        case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
        case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
        case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
        default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
};

// Implement fancy features of the Events API such as multiple event
// names `"change blur"` and jQuery-style event maps `{change: action}`
// in terms of the existing API.
exports.eventsApi = function eventsApi(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
        for (var key in name) {
            obj[action].apply(obj, [key, name[key]].concat(rest));
        }
        return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
        var names = name.split(eventSplitter);
        for (var i = 0, l = names.length; i < l; i++) {
            obj[action].apply(obj, [names[i]].concat(rest));
        }
        return false;
    }

    return true;
};

// Inversion-of-control versions of `on` and `once`. Tell *this* object to
// listen to an event in another object ... keeping track of what it's
// listening to.
exports.createListenMethod = function createListenMethod(implementation) {
    return function listenMethod(obj, name, callback) {
        if (!obj) {
            throw new Error('Trying to listenTo event: \'' + name + '\' but the target object is undefined');
        }
        var listeningTo = this._listeningTo || (this._listeningTo = {});
        var id = obj._listenId || (obj._listenId = uniqueId('l'));
        listeningTo[id] = obj;
        if (!callback && typeof name === 'object') callback = this;
        if (typeof obj[implementation] !== 'function') {
            throw new Error('Trying to listenTo event: \'' + name + '\' on object: ' + obj.toString() + ' but it does not have an \'on\' method so is unbindable');
        }
        obj[implementation](name, callback, this);
        return this;
    };
};

},{"lodash/uniqueId":371}],101:[function(require,module,exports){
/*$AMPERSAND_VERSION*/
var includes = require('lodash/includes');
var difference = require('lodash/difference');
var bind = require('lodash/bind');
var forEach = require('lodash/forEach');
var every = require('lodash/every');
var assign = require('lodash/assign');
var isArray = require('lodash/isArray');
var isEqual = require('lodash/isEqual');
var keys = require('lodash/keys');
var reduce = require('lodash/reduce');
var sortBy = require('lodash/sortBy');
var sortedIndexBy = require('lodash/sortedIndexBy');
var union = require('lodash/union');
var classExtend = require('ampersand-class-extend');
var Events = require('ampersand-events');

var slice = Array.prototype.slice;


function FilteredCollection(collection, spec) {
    this.collection = collection;
    this.indexes = collection.indexes || [];
    this._indexes = {};
    this._resetIndexes(this._indexes);
    this.mainIndex = collection.mainIndex;
    this.models = []; //Our filtered, models
    this.configure(spec || {}, true);
    this.listenTo(this.collection, 'all', this._onCollectionEvent);
}

assign(FilteredCollection.prototype, Events, {
    // Public API

    // add a filter function directly
    addFilter: function (filter) {
        this.swapFilters([filter], []);
    },

    // remove filter function directly
    removeFilter: function (filter) {
        this.swapFilters([], [filter]);
    },

    // clears filters fires events for each add/remove
    clearFilters: function () {
        this._resetFilters();
        this._runFilters();
    },

    // Swap out a set of old filters with a set of
    // new filters
    swapFilters: function (newFilters, oldFilters) {
        var self = this;

        if (!oldFilters) {
            oldFilters = this._filters;
        } else if (!isArray(oldFilters)) {
            oldFilters = [oldFilters];
        }

        if (!newFilters) {
            newFilters = [];
        } else if (!isArray(newFilters)) {
            newFilters = [newFilters];
        }

        oldFilters.forEach(function (filter) {
            self._removeFilter(filter);
        });

        newFilters.forEach(function (filter) {
            self._addFilter(filter);
        });

        this._runFilters();
    },

    // Update config with potentially new filters/where/etc
    configure: function (opts, clear) {
        if (clear) this._resetFilters(clear);
        this._parseSpec(opts);
        if (clear) this._runFilters();
    },

    // gets a model at a given index
    at: function (index) {
        return this.models[index];
    },

    // proxy `get` method to the underlying collection
    get: function (query, indexName) {
        var model = this.collection.get(query, indexName);
        if (model && includes(this.models, model)) return model;
    },

    // clear all filters, reset everything
    reset: function () {
        this.configure({}, true);
    },

    // Internal API

    // try to get a model by index
    _indexedGet: function (query, indexName) {
        if (!query) return;
        var index = this._indexes[indexName || this.mainIndex];
        return index[query] || index[query[this.mainIndex]] || this._indexes.cid[query] || this._indexes.cid[query.cid];
    },

    _parseSpec: function (spec) {
        if (spec.watched) this._watch(spec.watched);
        //this.comparator = this.collection.comparator;
        if (spec.comparator) this.comparator = spec.comparator;
        if (spec.where) {
            forEach(spec.where, bind(function (value, item) {
                this._addFilter(function (model) {
                    return (model.get ? model.get(item) : model[item]) === value;
                });
            }, this));
            // also make sure we watch all `where` keys
            this._watch(keys(spec.where));
        }
        if (spec.filter) {
            this._addFilter(spec.filter);
        }
        if (spec.filters) {
            spec.filters.forEach(this._addFilter, this);
        }
    },
    // internal method registering new filter function
    _addFilter: function (filter) {
        this._filters.push(filter);
    },

    // remove filter if found
    _removeFilter: function (filter) {
        var index = this._filters.indexOf(filter);
        if (index !== -1) {
            this._filters.splice(index, 1);
        }
    },

    // just reset filters, no model changes
    _resetFilters: function (resetComparator) {
        this._filters = [];
        this._watched = [];
        if (resetComparator) this.comparator = undefined;
    },

    // adds a property or array of properties to watch, ensures uniquness.
    _watch: function (items) {
        this._watched = union(this._watched, items);
    },

    // removes a watched property
    _unwatch: function (item) {
        this._watched = difference(this._watched, isArray(item) ? item : [item]);
    },

    _sortModels: function (newModels, comparator) {
        comparator = comparator || this.comparator || this.collection.comparator;
        if (comparator) {
            if (typeof comparator === 'string' || comparator.length === 1) {
                newModels = sortBy(newModels, comparator);
            } else {
                // lodash sortBy does not allow for traditional a, b comparisons
                newModels = newModels.sort(comparator);
            }
        } else {
            // This only happens when parent got a .set with options.at defined
            this._runFilters();
        }
        return newModels;
    },

    //Add a model to this filtered collection that has already passed the filters
    _addModel: function (model, options, eventName) {
        var newModels = slice.call(this.models);
        var comparator = this.comparator || this.collection.comparator;
        //Whether or not we are to expect a sort event from our collection later
        var sortable = eventName === 'add' && this.collection.comparator && (options.at == null) && options.sort !== false;
        if (!sortable) {
            var index = sortedIndexBy(newModels, model, comparator);
            newModels.splice(index, 0, model);
        } else {
            newModels.push(model);
            if (options.at) newModels = this._sortModels(newModels);
        }

        this.models = newModels;
        this._addIndex(this._indexes, model);
        if (this.comparator && !sortable) {
            this.trigger('sort', this);
        }
    },

    //Remove a model if it's in this filtered collection
    _removeModel: function (model) {
        var newModels = slice.call(this.models);
        var modelIndex = newModels.indexOf(model);
        if (modelIndex > -1) {
            newModels.splice(modelIndex, 1);
            this.models = newModels;
            this._removeIndex(this._indexes, model);
            return true;
        }
        return false;
    },


    //Test if a model passes our filters
    _testModel: function (model) {
        if (this._filters.length === 0) {
            return true;
        }
        return every(this._filters, function (filter) {
            return filter(model);
        });
    },

    _addIndex: function (newIndexes, model) {
        for (var name in this._indexes) {
            var indexVal = model[name] || (model.get && model.get(name));
            if (indexVal) newIndexes[name][indexVal] = model;
        }
    },

    _removeIndex: function (newIndexes, model) {
        for (var name in this._indexes) {
            delete this._indexes[name][model[name] || (model.get && model.get(name))];
        }
    },

    _resetIndexes: function (newIndexes) {
        var list = slice.call(this.indexes);
        list.push(this.mainIndex);
        list.push('cid');
        for (var i = 0; i < list.length; i++) {
            newIndexes[list[i]] = {};
        }
    },

    // Re-run the filters on all our parent's models
    _runFilters: function () {
        // make a copy of the array for comparisons
        var existingModels = slice.call(this.models);
        var rootModels = slice.call(this.collection.models);
        var newIndexes = {};
        var newModels, toAdd, toRemove;

        this._resetIndexes(newIndexes);

        // reduce base model set by applying filters
        if (this._filters.length) {
            newModels = reduce(this._filters, function (startingArray, filterFunc) {
                return startingArray.filter(filterFunc);
            }, rootModels);
        } else {
            newModels = slice.call(rootModels);
        }

        // sort it
        if (this.comparator) newModels = this._sortModels(newModels, this.comparator);

        newModels.forEach(function (model) {
            this._addIndex(newIndexes, model);
        }, this);

        // Cache a reference to the full filtered set to allow this._filtered.length. Ref: #6
        if (rootModels.length) {
            this._filtered = newModels;
            this._indexes = newIndexes;
        } else {
            this._filtered = [];
            this._resetIndexes(this._indexes);
        }

        // now we've got our new models time to compare
        toAdd = difference(newModels, existingModels);
        toRemove = difference(existingModels, newModels);

        // save 'em
        this.models = newModels;

        forEach(toRemove, bind(function (model) {
            this.trigger('remove', model, this);
        }, this));

        forEach(toAdd, bind(function (model) {
            this.trigger('add', model, this);
        }, this));

        // unless we have the same models in same order trigger `sort`
        if (!isEqual(existingModels, newModels) && this.comparator) {
            this.trigger('sort', this);
        }
    },

    _onCollectionEvent: function (event, model, that, options) {
        /*jshint -W030 */
        options || (options = {});
        var accepted;
        var eventName = event.split(':')[0];
        var propName = event.split(':')[1];
        var action = event;
        var alreadyHave = this._indexedGet(model);
        //Whether or not we are to expect a sort event from our collection later
        var sortable = this.collection.comparator && (options.at == null) && (options.sort !== false);
        var add = options.add;
        var remove = options.remove;
        var ordered = !sortable && add && remove;

        if (
            (propName !== undefined && propName === this.comparator) ||
            includes(this._watched, propName)
        ) { //If a property we care about changed
            accepted = this._testModel(model);

            if (!alreadyHave && accepted) {
                action = 'add';
            } else if (alreadyHave && !accepted) {
                action = 'remove';
            }
        } else if (action === 'add') { //See if we really want to add
            if (!this._testModel(model) || alreadyHave) {
                action = 'ignore';
            }
        } else if (eventName === 'change' && !alreadyHave) {
            //Don't trigger change events that are not from this collection
            action = 'ignore';
        }

        // action has now passed the filters

        if (action === 'reset') return this._runFilters();

        if (action === 'add') {
            if (this.models.length === 0) {
                this._runFilters();
            } else {
                this._addModel(model, options, event);
                this.trigger('add', model, this);
            }
            return;
        }

        if (action === 'remove') {
           if (this._removeModel(model)) {
               this.trigger('remove', model, this);
           }
           return;
        }

        if (action !== 'ignore') {
          this.trigger.apply(this, arguments);
        }

        //If we were asked to sort, or we aren't gonna get a sort later and had a sortable property change
        if (action === 'sort' ||
            (propName && !sortable && includes([this.comparator, this.collection.comparator].concat(this._watched), propName))
        ) {
            if (ordered && model.isNew) return; //We'll get a sort later
            this.models = this._sortModels(this.models);
            if (this.comparator && action !== 'sort') {
                this.trigger('sort', this);
            }
        }

    }

});

Object.defineProperty(FilteredCollection.prototype, 'length', {
    get: function () {
        return this.models.length;
    }
});

Object.defineProperty(FilteredCollection.prototype, 'isCollection', {
    get: function () {
        return true;
    }
});

var arrayMethods = [
    'indexOf',
    'lastIndexOf',
    'every',
    'some',
    'forEach',
    'map',
    'filter',
    'reduce',
    'reduceRight'
];

arrayMethods.forEach(function (method) {
    FilteredCollection.prototype[method] = function () {
        return this.models[method].apply(this.models, arguments);
    };
});

// alias each/forEach for maximum compatibility
FilteredCollection.prototype.each = FilteredCollection.prototype.forEach;

// methods to copy from parent
var collectionMethods = [
    'serialize',
    'toJSON'
];

collectionMethods.forEach(function (method) {
    FilteredCollection.prototype[method] = function () {
        return this.collection[method].apply(this, arguments);
    };
});

FilteredCollection.extend = classExtend;

module.exports = FilteredCollection;

},{"ampersand-class-extend":93,"ampersand-events":99,"lodash/assign":309,"lodash/bind":312,"lodash/difference":317,"lodash/every":320,"lodash/forEach":324,"lodash/includes":330,"lodash/isArray":333,"lodash/isEqual":339,"lodash/keys":348,"lodash/reduce":358,"lodash/sortBy":361,"lodash/sortedIndexBy":362,"lodash/union":370}],102:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-model"] = window.ampersand["ampersand-model"] || [];  window.ampersand["ampersand-model"].push("8.0.0");}
var State = require('ampersand-state');
var sync = require('ampersand-sync');
var assign = require('lodash/assign');
var isObject = require('lodash/isObject');
var clone = require('lodash/clone');
var result = require('lodash/result');

// Throw an error when a URL is needed, and none is supplied.
var urlError = function () {
    throw new Error('A "url" property or function must be specified');
};

// Wrap an optional error callback with a fallback error event.
var wrapError = function (model, options) {
    var error = options.error;
    options.error = function (resp) {
        if (error) error(model, resp, options);
        model.trigger('error', model, resp, options);
    };
};

var Model = State.extend({
    save: function (key, val, options) {
        var attrs, method;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (key == null || typeof key === 'object') {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }

        options = assign({validate: true}, options);

        // If we're not waiting and attributes exist, save acts as
        // `set(attr).save(null, opts)` with validation. Otherwise, check if
        // the model will be valid when the attributes, if any, are set.
        if (attrs && !options.wait) {
            if (!this.set(attrs, options)) return false;
        } else {
            if (!this._validate(attrs, options)) return false;
        }

        // After a successful server-side save, the client is (optionally)
        // updated with the server-side state.
        if (options.parse === void 0) options.parse = true;
        var model = this;
        var success = options.success;
        options.success = function (resp) {
            var serverAttrs = model.parse(resp, options);
            if (options.wait) serverAttrs = assign(attrs || {}, serverAttrs);
            if (isObject(serverAttrs) && !model.set(serverAttrs, options)) {
                return false;
            }
            if (success) success(model, resp, options);
            model.trigger('sync', model, resp, options);
        };
        wrapError(this, options);

        method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
        if (method === 'patch') options.attrs = attrs;
        // if we're waiting we haven't actually set our attributes yet so
        // we need to do make sure we send right data
        if (options.wait && method !== 'patch') options.attrs = assign(model.serialize(), attrs);
        var sync = this.sync(method, this, options);

        // Make the request available on the options object so it can be accessed
        // further down the line by `parse`, attached listeners, etc
        // Same thing is done below for fetch and destroy
        // https://github.com/AmpersandJS/ampersand-collection-rest-mixin/commit/d32d788aaff912387eb1106f2d7ad183ec39e11a#diff-84c84703169bf5017b1bc323653acaa3R32
        options.xhr = sync;
        return sync;
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function (options) {
        options = options ? clone(options) : {};
        if (options.parse === void 0) options.parse = true;
        var model = this;
        var success = options.success;
        options.success = function (resp) {
            if (!model.set(model.parse(resp, options), options)) return false;
            if (success) success(model, resp, options);
            model.trigger('sync', model, resp, options);
        };
        wrapError(this, options);
        var sync = this.sync('read', this, options);
        options.xhr = sync;
        return sync;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function (options) {
        options = options ? clone(options) : {};
        var model = this;
        var success = options.success;

        var destroy = function () {
            model.trigger('destroy', model, model.collection, options);
        };

        options.success = function (resp) {
            if (options.wait || model.isNew()) destroy();
            if (success) success(model, resp, options);
            if (!model.isNew()) model.trigger('sync', model, resp, options);
        };

        if (this.isNew()) {
            options.success();
            return false;
        }
        wrapError(this, options);

        var sync = this.sync('delete', this, options);
        options.xhr = sync;
        if (!options.wait) destroy();
        return sync;
    },

    // Proxy `ampersand-sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function () {
        return sync.apply(this, arguments);
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function () {
        var base = result(this, 'urlRoot') || result(this.collection, 'url') || urlError();
        if (this.isNew()) return base;
        return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.getId());
    }
});

module.exports = Model;

},{"ampersand-state":105,"ampersand-sync":106,"lodash/assign":309,"lodash/clone":313,"lodash/isObject":342,"lodash/result":360}],103:[function(require,module,exports){
var Events = require('ampersand-events');
var extend = require('lodash/assign');
var bind = require('lodash/bind');


// Handles cross-browser history management, based on either
// [pushState](http://diveintohtml5.info/history.html) and real URLs, or
// [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
// and URL fragments. If the browser supports neither.
var History = function () {
    this.handlers = [];
    this.checkUrl = bind(this.checkUrl, this);

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
        this.location = window.location;
        this.history = window.history;
    }
};

// Cached regex for stripping a leading hash/slash and trailing space.
var routeStripper = /^[#\/]|\s+$/g;

// Cached regex for stripping leading and trailing slashes.
var rootStripper = /^\/+|\/+$/g;

// Cached regex for stripping urls of hash.
var pathStripper = /#.*$/;

// Has the history handling already been started?
History.started = false;

// Set up all inheritable **Backbone.History** properties and methods.
extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Are we at the app root?
    atRoot: function () {
        var path = this.location.pathname.replace(/[^\/]$/, '$&/');
        return path === this.root && !this.location.search;
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function (window) {
        var match = (window || this).location.href.match(/#(.*)$/);
        return match ? match[1] : '';
    },

    // Get the pathname and search params, without the root.
    getPath: function () {
        var path = decodeURI(this.location.pathname + this.location.search);
        var root = this.root.slice(0, -1);
        if (!path.indexOf(root)) path = path.slice(root.length);
        return path.slice(1);
    },

    // Get the cross-browser normalized URL fragment from the path or hash.
    getFragment: function (fragment) {
        if (fragment == null) {
            if (this._hasPushState || !this._wantsHashChange) {
                fragment = this.getPath();
            } else {
                fragment = this.getHash();
            }
        }
        return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function (options) {
        if (History.started) throw new Error("Backbone.history has already been started");
        History.started = true;

        // Figure out the initial configuration.
        // Is pushState desired ... is it available?
        this.options          = extend({root: '/', pushState: true}, this.options, options);
        this.root             = this.options.root;
        this._wantsHashChange = this.options.hashChange !== false;
        this._hasHashChange   = 'onhashchange' in window;
        this._wantsPushState  = !!this.options.pushState;
        this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
        this.fragment         = this.getFragment();

        // Add a cross-platform `addEventListener` shim for older browsers.
        var addEventListener = window.addEventListener;

        // Normalize root to always include a leading and trailing slash.
        this.root = ('/' + this.root + '/').replace(rootStripper, '/');

        // Depending on whether we're using pushState or hashes, and whether
        // 'onhashchange' is supported, determine how we check the URL state.
        if (this._hasPushState) {
            addEventListener('popstate', this.checkUrl, false);
        } else if (this._wantsHashChange && this._hasHashChange) {
            addEventListener('hashchange', this.checkUrl, false);
        } else if (this._wantsHashChange) {
            this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
        }

        // Transition from hashChange to pushState or vice versa if both are
        // requested.
        if (this._wantsHashChange && this._wantsPushState) {

            // If we've started off with a route from a `pushState`-enabled
            // browser, but we're currently in a browser that doesn't support it...
            if (!this._hasPushState && !this.atRoot()) {
                this.location.replace(this.root + '#' + this.getPath());
                // Return immediately as browser will do redirect to new url
                return true;

            // Or if we've started out with a hash-based route, but we're currently
            // in a browser where it could be `pushState`-based instead...
            } else if (this._hasPushState && this.atRoot()) {
                this.navigate(this.getHash(), {replace: true});
            }
        }

        if (!this.options.silent) return this.loadUrl();
    },

    // Returns the value of History.started. Allows an app or units tests to
    // check whether or not the router has been started with
    // router.history.started(); otherwise the started flag is inaccessible
    started: function () {
      return History.started;
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function () {
        // Add a cross-platform `removeEventListener` shim for older browsers.
        var removeEventListener = window.removeEventListener;

        // Remove window listeners.
        if (this._hasPushState) {
            removeEventListener('popstate', this.checkUrl, false);
        } else if (this._wantsHashChange && this._hasHashChange) {
            removeEventListener('hashchange', this.checkUrl, false);
        }

        // Some environments will throw when clearing an undefined interval.
        if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
        History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function (route, callback) {
        this.handlers.unshift({route: route, callback: callback});
    },

    urlChanged: function () {
        var current = this.getFragment();
        if (current === this.fragment) return false;
        return true;
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`.
    checkUrl: function (e) {
        this.urlChanged() && this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function (fragment) {
        fragment = this.fragment = this.getFragment(fragment);
        return this.handlers.some(function (handler) {
            if (handler.route.test(fragment)) {
                handler.callback(fragment);
                return true;
            }
        });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: false` if you wish to have the
    // route callback not be fired (sometimes desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function (fragment, options) {
        if (!History.started) return false;
        options = extend({trigger: true}, options);

        var url = this.root + (fragment = this.getFragment(fragment || ''));

        // Strip the hash and decode for matching.
        fragment = decodeURI(fragment.replace(pathStripper, ''));

        if (this.fragment === fragment) return;
        this.fragment = fragment;

        // Don't include a trailing slash on the root.
        if (fragment === '' && url !== '/') url = url.slice(0, -1);

        // If pushState is available, we use it to set the fragment as a real URL.
        if (this._hasPushState) {
            this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

            // If hash changes haven't been explicitly disabled, update the hash
            // fragment to store history.
        } else if (this._wantsHashChange) {
            this._updateHash(this.location, fragment, options.replace);
            // If you've told us that you explicitly don't want fallback hashchange-
            // based history, then `navigate` becomes a page refresh.
        } else {
            return this.location.assign(url);
        }

        if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function (location, fragment, replace) {
        if (replace) {
            var href = location.href.replace(/(javascript:|#).*$/, '');
            location.replace(href + '#' + fragment);
        } else {
            // Some browsers require that `hash` contains a leading #.
            location.hash = '#' + fragment;
        }
    }

});

module.exports = new History();

},{"ampersand-events":99,"lodash/assign":309,"lodash/bind":312}],104:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-router"] = window.ampersand["ampersand-router"] || [];  window.ampersand["ampersand-router"].push("4.0.0");}
var classExtend = require('ampersand-class-extend');
var Events = require('ampersand-events');
var extend = require('lodash/assign');
var isRegExp = require('lodash/isRegExp');
var isFunction = require('lodash/isFunction');
var result = require('lodash/result');

var ampHistory = require('./ampersand-history');

// Routers map faux-URLs to actions, and fire events when routes are
// matched. Creating a new one sets its `routes` hash, if not set statically.
var Router = module.exports = function (options) {
    options || (options = {});
    this.history = options.history || ampHistory;
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
};

// Cached regular expressions for matching named param parts and splatted
// parts of route strings.
var optionalParam = /\((.*?)\)/g;
var namedParam    = /(\(\?)?:\w+/g;
var splatParam    = /\*\w+/g;
var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

// Set up all inheritable **Backbone.Router** properties and methods.
extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function () {},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function (query, num) {
    //       ...
    //     });
    //
    route: function (route, name, callback) {
        if (!isRegExp(route)) route = this._routeToRegExp(route);
        if (isFunction(name)) {
            callback = name;
            name = '';
        }
        if (!callback) callback = this[name];
        var router = this;
        this.history.route(route, function (fragment) {
            var args = router._extractParameters(route, fragment);
            if (router.execute(callback, args, name) !== false) {
                router.trigger.apply(router, ['route:' + name].concat(args));
                router.trigger('route', name, args);
                router.history.trigger('route', router, name, args);
            }
        });
        return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function (callback, args, name) {
        if (callback) callback.apply(this, args);
    },

    // Simple proxy to `ampHistory` to save a fragment into the history.
    navigate: function (fragment, options) {
        this.history.navigate(fragment, options);
        return this;
    },

    // Reload the current route as if it was navigated to from somewhere
    // else
    reload: function () {
        this.history.loadUrl(this.history.fragment);
        return this;
    },

    // Helper for doing `internal` redirects without adding to history
    // and thereby breaking backbutton functionality.
    redirectTo: function (newUrl) {
        this.navigate(newUrl, {replace: true});
    },

    // Bind all defined routes to `history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function () {
        if (!this.routes) return;
        this.routes = result(this, 'routes');
        var route, routes = Object.keys(this.routes);
        while ((route = routes.pop()) != null) {
            this.route(route, this.routes[route]);
        }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function (route) {
        route = route
            .replace(escapeRegExp, '\\$&')
            .replace(optionalParam, '(?:$1)?')
            .replace(namedParam, function (match, optional) {
                return optional ? match : '([^/?]+)';
            })
            .replace(splatParam, '([^?]*?)');
        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function (route, fragment) {
        var params = route.exec(fragment).slice(1);
        return params.map(function (param, i) {
            // Don't decode the search params.
            if (i === params.length - 1) return param || null;
            return param ? decodeURIComponent(param) : null;
        });
    }

});

Router.extend = classExtend;

},{"./ampersand-history":103,"ampersand-class-extend":93,"ampersand-events":99,"lodash/assign":309,"lodash/isFunction":340,"lodash/isRegExp":344,"lodash/result":360}],105:[function(require,module,exports){
'use strict';
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-state"] = window.ampersand["ampersand-state"] || [];  window.ampersand["ampersand-state"].push("5.0.2");}
var uniqueId = require('lodash/uniqueId');
var assign = require('lodash/assign');
var cloneObj = function(obj) { return assign({}, obj); };
var omit = require('lodash/omit');
var escape = require('lodash/escape');
var forOwn = require('lodash/forOwn');
var includes = require('lodash/includes');
var isString = require('lodash/isString');
var isObject = require('lodash/isObject');
var isDate = require('lodash/isDate');
var isFunction = require('lodash/isFunction');
var _isEqual = require('lodash/isEqual'); // to avoid shadowing
var has = require('lodash/has');
var result = require('lodash/result');
var bind = require('lodash/bind'); // because phantomjs doesn't have Function#bind
var union = require('lodash/union');
var Events = require('ampersand-events');
var KeyTree = require('key-tree-store');
var arrayNext = require('array-next');
var changeRE = /^change:/;
var noop = function () {};

function Base(attrs, options) {
    options || (options = {});
    this.cid || (this.cid = uniqueId('state'));
    this._events = {};
    this._values = {};
    this._eventBubblingHandlerCache = {};
    this._definition = Object.create(this._definition);
    if (options.parse) attrs = this.parse(attrs, options);
    this.parent = options.parent;
    this.collection = options.collection;
    this._keyTree = new KeyTree();
    this._initCollections();
    this._initChildren();
    this._cache = {};
    this._previousAttributes = {};
    if (attrs) this.set(attrs, assign({silent: true, initial: true}, options));
    this._changed = {};
    if (this._derived) this._initDerived();
    if (options.init !== false) this.initialize.apply(this, arguments);
}

assign(Base.prototype, Events, {
    // can be allow, ignore, reject
    extraProperties: 'ignore',

    idAttribute: 'id',

    namespaceAttribute: 'namespace',

    typeAttribute: 'modelType',

    // Stubbed out to be overwritten
    initialize: function () {
        return this;
    },

    // Get ID of model per configuration.
    // Should *always* be how ID is determined by other code.
    getId: function () {
        return this[this.idAttribute];
    },

    // Get namespace of model per configuration.
    // Should *always* be how namespace is determined by other code.
    getNamespace: function () {
        return this[this.namespaceAttribute];
    },

    // Get type of model per configuration.
    // Should *always* be how type is determined by other code.
    getType: function () {
        return this[this.typeAttribute];
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function () {
        return this.getId() == null;
    },

    // get HTML-escaped value of attribute
    escape: function (attr) {
        return escape(this.get(attr));
    },

    // Check if the model is currently in a valid state.
    isValid: function (options) {
        return this._validate({}, assign(options || {}, { validate: true }));
    },

    // Parse can be used remap/restructure/rename incoming properties
    // before they are applied to attributes.
    parse: function (resp, options) {
        //jshint unused:false
        return resp;
    },

    // Serialize is the inverse of `parse` it lets you massage data
    // on the way out. Before, sending to server, for example.
    serialize: function (options) {
        var attrOpts = assign({props: true}, options);
        var res = this.getAttributes(attrOpts, true);
        forOwn(this._children, bind(function (value, key) {
            res[key] = this[key].serialize();
        }, this));
        forOwn(this._collections, bind(function (value, key) {
            res[key] = this[key].serialize();
        }, this));
        return res;
    },

    // Main set method used by generated setters/getters and can
    // be used directly if you need to pass options or set multiple
    // properties at once.
    set: function (key, value, options) {
        var self = this;
        var extraProperties = this.extraProperties;
        var wasChanging, changeEvents, newType, newVal, def, cast, err, attr,
            attrs, dataType, silent, unset, currentVal, initial, hasChanged, isEqual, onChange;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (isObject(key) || key === null) {
            attrs = key;
            options = value;
        } else {
            attrs = {};
            attrs[key] = value;
        }

        options = options || {};

        if (!this._validate(attrs, options)) return false;

        // Extract attributes and options.
        unset = options.unset;
        silent = options.silent;
        initial = options.initial;

        // Initialize change tracking.
        wasChanging = this._changing;
        this._changing = true;
        changeEvents = [];

        // if not already changing, store previous
        if (initial) {
            this._previousAttributes = {};
        } else if (!wasChanging) {
            this._previousAttributes = this.attributes;
            this._changed = {};
        }

        // For each `set` attribute...
        for (var i = 0, keys = Object.keys(attrs), len = keys.length; i < len; i++) {
            attr = keys[i];
            newVal = attrs[attr];
            newType = typeof newVal;
            currentVal = this._values[attr];
            def = this._definition[attr];

            if (!def) {
                // if this is a child model or collection
                if (this._children[attr] || this._collections[attr]) {
                    if (!isObject(newVal)) {
                        newVal = {};
                    }

                    this[attr].set(newVal, options);
                    continue;
                } else if (extraProperties === 'ignore') {
                    continue;
                } else if (extraProperties === 'reject') {
                    throw new TypeError('No "' + attr + '" property defined on ' + (this.type || 'this') + ' model and extraProperties not set to "ignore" or "allow"');
                } else if (extraProperties === 'allow') {
                    def = this._createPropertyDefinition(attr, 'any');
                } else if (extraProperties) {
                    throw new TypeError('Invalid value for extraProperties: "' + extraProperties + '"');
                }
            }

            isEqual = this._getCompareForType(def.type);
            onChange = this._getOnChangeForType(def.type);
            dataType = this._dataTypes[def.type];

            // check type if we have one
            if (dataType && dataType.set) {
                cast = dataType.set(newVal);
                newVal = cast.val;
                newType = cast.type;
            }

            // If we've defined a test, run it
            if (def.test) {
                err = def.test.call(this, newVal, newType);
                if (err) {
                    throw new TypeError('Property \'' + attr + '\' failed validation with error: ' + err);
                }
            }

            // If we are required but undefined, throw error.
            // If we are null and are not allowing null, throw error
            // If we have a defined type and the new type doesn't match, and we are not null, throw error.
            // If we require specific value and new one is not one of them, throw error (unless it has default value or we're unsetting it with undefined).

            if (newVal === undefined && def.required) {
                throw new TypeError('Required property \'' + attr + '\' must be of type ' + def.type + '. Tried to set ' + newVal);
            }
            if (newVal === null && def.required && !def.allowNull) {
                throw new TypeError('Property \'' + attr + '\' must be of type ' + def.type + ' (cannot be null). Tried to set ' + newVal);
            }
            if ((def.type && def.type !== 'any' && def.type !== newType) && newVal !== null && newVal !== undefined) {
                throw new TypeError('Property \'' + attr + '\' must be of type ' + def.type + '. Tried to set ' + newVal);
            }
            if (def.values && !includes(def.values, newVal)) {
                var defaultValue = result(def, 'default');
                if (unset && defaultValue !== undefined) {
                    newVal = defaultValue;
                } else if (!unset || (unset && newVal !== undefined)) {
                    throw new TypeError('Property \'' + attr + '\' must be one of values: ' + def.values.join(', ') + '. Tried to set ' + newVal);
                }
            }

            // We know this has 'changed' if it's the initial set, so skip a potentially expensive isEqual check.
            hasChanged = initial || !isEqual(currentVal, newVal, attr);

            // enforce `setOnce` for properties if set
            if (def.setOnce && currentVal !== undefined && hasChanged) {
                throw new TypeError('Property \'' + attr + '\' can only be set once.');
            }

            // set/unset attributes.
            // If this is not the initial set, keep track of changed attributes
            // and push to changeEvents array so we can fire events.
            if (hasChanged) {

                // This fires no matter what, even on initial set.
                onChange(newVal, currentVal, attr);

                // If this is a change (not an initial set), mark the change.
                // Note it's impossible to unset on the initial set (it will already be unset),
                // so we only include that logic here.
                if (!initial) {
                    this._changed[attr] = newVal;
                    this._previousAttributes[attr] = currentVal;
                    if (unset) {
                        // FIXME delete is very slow. Can we get away with setting to undefined?
                        delete this._values[attr];
                    }
                    if (!silent) {
                        changeEvents.push({prev: currentVal, val: newVal, key: attr});
                    }
                }
                if (!unset) {
                    this._values[attr] = newVal;
                }
            } else {
                // Not changed
                // FIXME delete is very slow. Can we get away with setting to undefined?
                delete this._changed[attr];
            }
        }

        // Fire events. This array is not populated if we are told to be silent.
        if (changeEvents.length) this._pending = true;
        changeEvents.forEach(function (change) {
            self.trigger('change:' + change.key, self, change.val, options);
        });

        // You might be wondering why there's a `while` loop here. Changes can
        // be recursively nested within `"change"` events.
        if (wasChanging) return this;
        while (this._pending) {
            this._pending = false;
            this.trigger('change', this, options);
        }
        this._pending = false;
        this._changing = false;
        return this;
    },

    get: function (attr) {
        return this[attr];
    },

    // Toggle boolean properties or properties that have a `values`
    // array in its definition.
    toggle: function (property) {
        var def = this._definition[property];
        if (def.type === 'boolean') {
            // if it's a bool, just flip it
            this[property] = !this[property];
        } else if (def && def.values) {
            // If it's a property with an array of values
            // skip to the next one looping back if at end.
            this[property] = arrayNext(def.values, this[property]);
        } else {
            throw new TypeError('Can only toggle properties that are type `boolean` or have `values` array.');
        }
        return this;
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function () {
        return cloneObj(this._previousAttributes);
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function (attr) {
        if (attr == null) return !!Object.keys(this._changed).length;
        if (has(this._derived, attr)) {
            return this._derived[attr].depList.some(function (dep) {
                return this.hasChanged(dep);
            }, this);
        }
        return has(this._changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function (diff) {
        if (!diff) return this.hasChanged() ? cloneObj(this._changed) : false;
        var val, changed = false;
        var old = this._changing ? this._previousAttributes : this.attributes;
        var def, isEqual;
        for (var attr in diff) {
            def = this._definition[attr];
            if (!def) continue;
            isEqual = this._getCompareForType(def.type);
            if (isEqual(old[attr], (val = diff[attr]))) continue;
            (changed || (changed = {}))[attr] = val;
        }
        return changed;
    },

    toJSON: function () {
        return this.serialize();
    },

    unset: function (attrs, options) {
        var self = this;
        attrs = Array.isArray(attrs) ? attrs : [attrs];
        attrs.forEach(function (key) {
            var def = self._definition[key];
            if (!def) return;
            var val;
            if (def.required) {
                val = result(def, 'default');
                return self.set(key, val, options);
            } else {
                return self.set(key, val, assign({}, options, {unset: true}));
            }
        });
    },

    clear: function (options) {
        var self = this;
        Object.keys(this.attributes).forEach(function (key) {
            self.unset(key, options);
        });
        return this;
    },

    previous: function (attr) {
        if (attr == null || !Object.keys(this._previousAttributes).length) return null;
        return this._previousAttributes[attr];
    },

    // Get default values for a certain type
    _getDefaultForType: function (type) {
        var dataType = this._dataTypes[type];
        return dataType && dataType['default'];
    },

    // Determine which comparison algorithm to use for comparing a property
    _getCompareForType: function (type) {
        var dataType = this._dataTypes[type];
        if (dataType && dataType.compare) return bind(dataType.compare, this);
        return _isEqual; // if no compare function is defined, use _.isEqual
    },

    _getOnChangeForType : function(type){
        var dataType = this._dataTypes[type];
        if (dataType && dataType.onChange) return bind(dataType.onChange, this);
        return noop;
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function (attrs, options) {
        if (!options.validate || !this.validate) return true;
        attrs = assign({}, this.attributes, attrs);
        var error = this.validationError = this.validate(attrs, options) || null;
        if (!error) return true;
        this.trigger('invalid', this, error, assign(options || {}, {validationError: error}));
        return false;
    },

    _createPropertyDefinition: function (name, desc, isSession) {
        return createPropertyDefinition(this, name, desc, isSession);
    },

    // just makes friendlier errors when trying to define a new model
    // only used when setting up original property definitions
    _ensureValidType: function (type) {
        return includes(['string', 'number', 'boolean', 'array', 'object', 'date', 'state', 'any']
            .concat(Object.keys(this._dataTypes)), type) ? type : undefined;
    },

    getAttributes: function (options, raw) {
        options = assign({
            session: false,
            props: false,
            derived: false
        }, options || {});
        var res = {};
        var val, def;
        for (var item in this._definition) {
            def = this._definition[item];
            if ((options.session && def.session) || (options.props && !def.session)) {
                val = raw ? this._values[item] : this[item];
                if (raw && val && isFunction(val.serialize)) val = val.serialize();
                if (typeof val === 'undefined') val = result(def, 'default');
                if (typeof val !== 'undefined') res[item] = val;
            }
        }
        if (options.derived) {
            for (var derivedItem in this._derived) res[derivedItem] = this[derivedItem];
        }
        return res;
    },

    _initDerived: function () {
        var self = this;

        forOwn(this._derived, function (value, name) {
            var def = self._derived[name];
            def.deps = def.depList;

            var update = function (options) {
                options = options || {};

                var newVal = def.fn.call(self);

                if (self._cache[name] !== newVal || !def.cache) {
                    if (def.cache) {
                        self._previousAttributes[name] = self._cache[name];
                    }
                    self._cache[name] = newVal;
                    self.trigger('change:' + name, self, self._cache[name]);
                }
            };

            def.deps.forEach(function (propString) {
                self._keyTree.add(propString, update);
            });
        });

        this.on('all', function (eventName) {
            if (changeRE.test(eventName)) {
                self._keyTree.get(eventName.split(':')[1]).forEach(function (fn) {
                    fn();
                });
            }
        }, this);
    },

    _getDerivedProperty: function (name, flushCache) {
        // is this a derived property that is cached
        if (this._derived[name].cache) {
            //set if this is the first time, or flushCache is set
            if (flushCache || !this._cache.hasOwnProperty(name)) {
                this._cache[name] = this._derived[name].fn.apply(this);
            }
            return this._cache[name];
        } else {
            return this._derived[name].fn.apply(this);
        }
    },

    _initCollections: function () {
        var coll;
        if (!this._collections) return;
        for (coll in this._collections) {
            this._safeSet(coll, new this._collections[coll](null, {parent: this}));
        }
    },

    _initChildren: function () {
        var child;
        if (!this._children) return;
        for (child in this._children) {
            this._safeSet(child, new this._children[child]({}, {parent: this}));
            this.listenTo(this[child], 'all', this._getCachedEventBubblingHandler(child));
        }
    },

    // Returns a bound handler for doing event bubbling while
    // adding a name to the change string.
    _getCachedEventBubblingHandler: function (propertyName) {
        if (!this._eventBubblingHandlerCache[propertyName]) {
            this._eventBubblingHandlerCache[propertyName] = bind(function (name, model, newValue) {
                if (changeRE.test(name)) {
                    this.trigger('change:' + propertyName + '.' + name.split(':')[1], model, newValue);
                } else if (name === 'change') {
                    this.trigger('change', this);
                }
            }, this);
        }
        return this._eventBubblingHandlerCache[propertyName];
    },

    // Check that all required attributes are present
    _verifyRequired: function () {
        var attrs = this.attributes; // should include session
        for (var def in this._definition) {
            if (this._definition[def].required && typeof attrs[def] === 'undefined') {
                return false;
            }
        }
        return true;
    },

    // expose safeSet method
    _safeSet: function safeSet(property, value) {
        if (property in this) {
            throw new Error('Encountered namespace collision while setting instance property `' + property + '`');
        }
        this[property] = value;
        return this;
    }
});

// getter for attributes
Object.defineProperties(Base.prototype, {
    attributes: {
        get: function () {
            return this.getAttributes({props: true, session: true});
        }
    },
    all: {
        get: function () {
            return this.getAttributes({
                session: true,
                props: true,
                derived: true
            });
        }
    },
    isState: {
        get: function () { return true; },
        set: function () { }
    }
});

// helper for creating/storing property definitions and creating
// appropriate getters/setters
function createPropertyDefinition(object, name, desc, isSession) {
    var def = object._definition[name] = {};
    var type, descArray;

    if (isString(desc)) {
        // grab our type if all we've got is a string
        type = object._ensureValidType(desc);
        if (type) def.type = type;
    } else {
        //Transform array of ['type', required, default] to object form
        if (Array.isArray(desc)) {
            descArray = desc;
            desc = {
                type: descArray[0],
                required: descArray[1],
                'default': descArray[2]
            };
        }

        type = object._ensureValidType(desc.type);
        if (type) def.type = type;

        if (desc.required) def.required = true;

        if (desc['default'] && typeof desc['default'] === 'object') {
            throw new TypeError('The default value for ' + name + ' cannot be an object/array, must be a value or a function which returns a value/object/array');
        }

        def['default'] = desc['default'];

        def.allowNull = desc.allowNull ? desc.allowNull : false;
        if (desc.setOnce) def.setOnce = true;
        if (def.required && def['default'] === undefined && !def.setOnce) def['default'] = object._getDefaultForType(type);
        def.test = desc.test;
        def.values = desc.values;
    }
    if (isSession) def.session = true;

    if (!type) {
        type = isString(desc) ? desc : desc.type;
        // TODO: start throwing a TypeError in future major versions instead of warning
        console.warn('Invalid data type of `' + type + '` for `' + name + '` property. Use one of the default types or define your own');
    }

    // define a getter/setter on the prototype
    // but they get/set on the instance
    Object.defineProperty(object, name, {
        set: function (val) {
            this.set(name, val);
        },
        get: function () {
            if (!this._values) {
                throw Error('You may be trying to `extend` a state object with "' + name + '" which has been defined in `props` on the object being extended');
            }
            var value = this._values[name];
            var typeDef = this._dataTypes[def.type];
            if (typeof value !== 'undefined') {
                if (typeDef && typeDef.get) {
                    value = typeDef.get(value);
                }
                return value;
            }
            var defaultValue = result(def, 'default');
            this._values[name] = defaultValue;
            // If we've set a defaultValue, fire a change handler effectively marking
            // its change from undefined to the default value.
            if (typeof defaultValue !== 'undefined') {
                var onChange = this._getOnChangeForType(def.type);
                onChange(defaultValue, value, name);
            }
            return defaultValue;
        }
    });

    return def;
}

// helper for creating derived property definitions
function createDerivedProperty(modelProto, name, definition) {
    var def = modelProto._derived[name] = {
        fn: isFunction(definition) ? definition : definition.fn,
        cache: (definition.cache !== false),
        depList: definition.deps || []
    };

    // add to our shared dependency list
    def.depList.forEach(function (dep) {
        modelProto._deps[dep] = union(modelProto._deps[dep] || [], [name]);
    });

    // defined a top-level getter for derived names
    Object.defineProperty(modelProto, name, {
        get: function () {
            return this._getDerivedProperty(name);
        },
        set: function () {
            throw new TypeError("`" + name + "` is a derived property, it can't be set directly.");
        }
    });
}

var dataTypes = {
    string: {
        'default': function () {
            return '';
        }
    },
    date: {
        set: function (newVal) {
            var newType;
            if (newVal == null) {
                newType = typeof null;
            } else if (!isDate(newVal)) {
                var err = null;
                var dateVal = new Date(newVal).valueOf();
                if (isNaN(dateVal)) {
                    // If the newVal cant be parsed, then try parseInt first
                    dateVal = new Date(parseInt(newVal, 10)).valueOf();
                    if (isNaN(dateVal)) err = true;
                }
                newVal = dateVal;
                newType = 'date';
                if (err) {
                    newType = typeof newVal;
                }
            } else {
                newType = 'date';
                newVal = newVal.valueOf();
            }

            return {
                val: newVal,
                type: newType
            };
        },
        get: function (val) {
            if (val == null) { return val; }
            return new Date(val);
        },
        'default': function () {
            return new Date();
        }
    },
    array: {
        set: function (newVal) {
            return {
                val: newVal,
                type: Array.isArray(newVal) ? 'array' : typeof newVal
            };
        },
        'default': function () {
            return [];
        }
    },
    object: {
        set: function (newVal) {
            var newType = typeof newVal;
            // we have to have a way of supporting "missing" objects.
            // Null is an object, but setting a value to undefined
            // should work too, IMO. We just override it, in that case.
            if (newType !== 'object' && newVal === undefined) {
                newVal = null;
                newType = 'object';
            }
            return {
                val: newVal,
                type: newType
            };
        },
        'default': function () {
            return {};
        }
    },
    // the `state` data type is a bit special in that setting it should
    // also bubble events
    state: {
        set: function (newVal) {
            var isInstance = newVal instanceof Base || (newVal && newVal.isState);
            if (isInstance) {
                return {
                    val: newVal,
                    type: 'state'
                };
            } else {
                return {
                    val: newVal,
                    type: typeof newVal
                };
            }
        },
        compare: function (currentVal, newVal) {
            return currentVal === newVal;
        },

        onChange : function(newVal, previousVal, attributeName){
            // if this has changed we want to also handle
            // event propagation
            if (previousVal) {
                this.stopListening(previousVal, 'all', this._getCachedEventBubblingHandler(attributeName));
            }

            if (newVal != null) {
                this.listenTo(newVal, 'all', this._getCachedEventBubblingHandler(attributeName));
            }
        }
    }
};

// the extend method used to extend prototypes, maintain inheritance chains for instanceof
// and allow for additions to the model definitions.
function extend(protoProps) {
    /*jshint validthis:true*/
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
    } else {
        child = function () {
            return parent.apply(this, arguments);
        };
    }

    // Add static properties to the constructor function from parent
    assign(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function () { this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // set prototype level objects
    child.prototype._derived =  assign({}, parent.prototype._derived);
    child.prototype._deps = assign({}, parent.prototype._deps);
    child.prototype._definition = assign({}, parent.prototype._definition);
    child.prototype._collections = assign({}, parent.prototype._collections);
    child.prototype._children = assign({}, parent.prototype._children);
    child.prototype._dataTypes = assign({}, parent.prototype._dataTypes || dataTypes);

    // Mix in all prototype properties to the subclass if supplied.
    if (protoProps) {
        var omitFromExtend = [
            'dataTypes', 'props', 'session', 'derived', 'collections', 'children'
        ];
        for(var i = 0; i < arguments.length; i++) {
            var def = arguments[i];
            if (def.dataTypes) {
                forOwn(def.dataTypes, function (def, name) {
                    child.prototype._dataTypes[name] = def;
                });
            }
            if (def.props) {
                forOwn(def.props, function (def, name) {
                    createPropertyDefinition(child.prototype, name, def);
                });
            }
            if (def.session) {
                forOwn(def.session, function (def, name) {
                    createPropertyDefinition(child.prototype, name, def, true);
                });
            }
            if (def.derived) {
                forOwn(def.derived, function (def, name) {
                    createDerivedProperty(child.prototype, name, def);
                });
            }
            if (def.collections) {
                forOwn(def.collections, function (constructor, name) {
                    child.prototype._collections[name] = constructor;
                });
            }
            if (def.children) {
                forOwn(def.children, function (constructor, name) {
                    child.prototype._children[name] = constructor;
                });
            }
            assign(child.prototype, omit(def, omitFromExtend));
        }
    }

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
}

Base.extend = extend;

// Our main exports
module.exports = Base;

},{"ampersand-events":99,"array-next":110,"key-tree-store":125,"lodash/assign":309,"lodash/bind":312,"lodash/escape":319,"lodash/forOwn":325,"lodash/has":327,"lodash/includes":330,"lodash/isDate":337,"lodash/isEqual":339,"lodash/isFunction":340,"lodash/isObject":342,"lodash/isString":345,"lodash/omit":354,"lodash/result":360,"lodash/union":370,"lodash/uniqueId":371}],106:[function(require,module,exports){
var xhr = require('xhr');
module.exports = require('./core')(xhr);

},{"./core":107,"xhr":387}],107:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-sync"] = window.ampersand["ampersand-sync"] || [];  window.ampersand["ampersand-sync"].push("5.0.0");}
var result = require('lodash/result');
var defaults = require('lodash/defaults');
var includes = require('lodash/includes');
var assign = require('lodash/assign');
var qs = require('qs');
var mediaType = require('media-type');


module.exports = function (xhr) {

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function () {
      throw new Error('A "url" property or function must be specified');
  };

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
      'create': 'POST',
      'update': 'PUT',
      'patch':  'PATCH',
      'delete': 'DELETE',
      'read':   'GET'
  };

  return function (method, model, optionsInput) {
      //Copy the options object. It's using assign instead of clonedeep as an optimization.
      //The only object we could expect in options is headers, which is safely transfered below.
      var options = assign({},optionsInput);
      var type = methodMap[method];
      var headers = {};

      // Default options, unless specified.
      defaults(options || (options = {}), {
          emulateHTTP: false,
          emulateJSON: false,
          // overrideable primarily to enable testing
          xhrImplementation: xhr
      });

      // Default request options.
      var params = {type: type};


      var ajaxConfig = (result(model, 'ajaxConfig') || {});
      var key;
      // Combine generated headers with user's headers.
      if (ajaxConfig.headers) {
          for (key in ajaxConfig.headers) {
              headers[key.toLowerCase()] = ajaxConfig.headers[key];
          }
      }
      if (options.headers) {
          for (key in options.headers) {
              headers[key.toLowerCase()] = options.headers[key];
          }
          delete options.headers;
      }
      //ajaxConfig has to be merged into params before other options take effect, so it is in fact a 2lvl default
      assign(params, ajaxConfig);
      params.headers = headers;

      // Ensure that we have a URL.
      if (!options.url) {
          options.url = result(model, 'url') || urlError();
      }

      // Ensure that we have the appropriate request data.
      if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
          params.json = options.attrs || model.toJSON(options);
      }

      // If passed a data param, we add it to the URL or body depending on request type
      if (options.data && type === 'GET') {
          // make sure we've got a '?'
          options.url += includes(options.url, '?') ? '&' : '?';
          options.url += qs.stringify(options.data);
          //delete `data` so `xhr` doesn't use it as a body
          delete options.data;
      }

      // For older servers, emulate JSON by encoding the request into an HTML-form.
      if (options.emulateJSON) {
          params.headers['content-type'] = 'application/x-www-form-urlencoded';
          params.body = params.json ? {model: params.json} : {};
          delete params.json;
      }

      // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
      // And an `X-HTTP-Method-Override` header.
      if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
          params.type = 'POST';
          if (options.emulateJSON) params.body._method = type;
          params.headers['x-http-method-override'] = type;
      }

      // When emulating JSON, we turn the body into a querystring.
      // We do this later to let the emulateHTTP run its course.
      if (options.emulateJSON) {
          params.body = qs.stringify(params.body);
      }

      // Set raw XMLHttpRequest options.
      if (ajaxConfig.xhrFields) {
          var beforeSend = ajaxConfig.beforeSend;
          params.beforeSend = function (req) {
              assign(req, ajaxConfig.xhrFields);
              if (beforeSend) return beforeSend.apply(this, arguments);
          };
          params.xhrFields = ajaxConfig.xhrFields;
      }

      // Turn a jQuery.ajax formatted request into xhr compatible
      params.method = params.type;

      var ajaxSettings = assign(params, options);

      // Make the request. The callback executes functions that are compatible
      // With jQuery.ajax's syntax.
      var request = options.xhrImplementation(ajaxSettings, function (err, resp, body) {
          if (err || resp.statusCode >= 400) {
              if (options.error) {
                  try {
                      body = JSON.parse(body);
                  } catch(e){}
                  var message = (err? err.message : (body || "HTTP"+resp.statusCode));
                  options.error(resp, 'error', message);
              }
          } else {
              // Parse body as JSON
              var accept = mediaType.fromString(params.headers.accept);
              var parseJson = accept.isValid() && accept.type === 'application' && (accept.subtype === 'json' || accept.suffix === 'json');
              if (typeof body === 'string' && (!params.headers.accept || parseJson)) {
                  try {
                      body = JSON.parse(body);
                  } catch (err) {
                      if (options.error) options.error(resp, 'error', err.message);
                      if (options.always) options.always(err, resp, body);
                      return;
                  }
              }
              if (options.success) options.success(body, 'success', resp);
          }
          if (options.always) options.always(err, resp, body);
      });
      if (model) model.trigger('request', model, request, optionsInput, ajaxSettings);
      request.ajaxSettings = ajaxSettings;
      return request;
  };
};

},{"lodash/assign":309,"lodash/defaults":315,"lodash/includes":330,"lodash/result":360,"media-type":375,"qs":378}],108:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-view-switcher"] = window.ampersand["ampersand-view-switcher"] || [];  window.ampersand["ampersand-view-switcher"].push("2.1.0");}
function ViewSwitcher(el, options) {
    options || (options = {});
    this.el = el;
    this.config = {
        hide: null,
        show: null,
        empty: null,
        prepend: false,
        waitForRemove: false
    };
    for (var item in options) {
        if (this.config.hasOwnProperty(item)) {
            this.config[item] = options[item];
        }
    }
    if (options.view) {
        this._setCurrent(options.view);
        this._render(options.view);
    } else {
        // call this so the empty callback gets called
        this._onViewRemove();
    }
}

ViewSwitcher.prototype.set = function (view) {
    var self = this;
    var prev = this.previous = this.current;

    if (prev === view) {
        return;
    }

    if (this.config.waitForRemove) {
        this.next = view;
        this._hide(prev, function () {
            if (self.next === view) {
                delete self.next;
                self._show(view);
            }
        });
    } else {
        this._hide(prev);
        this._show(view);
    }
};

ViewSwitcher.prototype._setCurrent = function (view) {
    this.current = view;
    if (view) this._registerRemoveListener(view);
    var emptyCb = this.config.empty;
    if (emptyCb && !this.current) {
        emptyCb();
    }
    return view;
};

ViewSwitcher.prototype.clear = function (cb) {
    this._hide(this.current, cb);
};

// If the view switcher itself is removed, remove its child to avoid memory leaks
ViewSwitcher.prototype.remove = function () {
    if (this.current) this.current.remove();
};

ViewSwitcher.prototype._show = function (view) {
    var customShow = this.config.show;
    this._setCurrent(view);
    this._render(view);
    if (customShow) customShow(view);
};

ViewSwitcher.prototype._registerRemoveListener = function (view) {
    if (view) view.once('remove', this._onViewRemove, this);
};

ViewSwitcher.prototype._onViewRemove = function (view) {
    var emptyCb = this.config.empty;
    if (this.current === view) {
        this.current = null;
    }
    if (emptyCb && !this.current) {
        emptyCb();
    }
};

ViewSwitcher.prototype._render = function (view) {
    if (!view.rendered) view.render({containerEl: this.el});
    if (!view.insertSelf) {
        if (this.config.prepend) {
            this.el.insertBefore(view.el, this.el.firstChild);
        } else {
            this.el.appendChild(view.el);
        }
    }
};

ViewSwitcher.prototype._hide = function (view, cb) {
    var customHide = this.config.hide;
    if (!view) return cb && cb();
    if (customHide) {
        if (customHide.length === 2) {
            customHide(view, function () {
                view.remove();
                if (cb) cb();
            });
        } else {
            customHide(view);
            view.remove();
            if (cb) cb();
        }
    } else {
        view.remove();
        if (cb) cb();
    }
};


module.exports = ViewSwitcher;

},{}],109:[function(require,module,exports){
;if (typeof window !== "undefined") {  window.ampersand = window.ampersand || {};  window.ampersand["ampersand-view"] = window.ampersand["ampersand-view"] || [];  window.ampersand["ampersand-view"].push("10.0.1");}
var State = require('ampersand-state');
var CollectionView = require('ampersand-collection-view');
var domify = require('domify');
var uniqueId = require("lodash/uniqueId");
var pick = require("lodash/pick");
var assign = require("lodash/assign");
var forEach = require("lodash/forEach");
var result = require("lodash/result");
var last = require("lodash/last");
var isString = require("lodash/isString");
var bind = require("lodash/bind");
var flatten = require("lodash/flatten");
var invokeMap = require("lodash/invokeMap");
var events = require('events-mixin');
var matches = require('matches-selector');
var bindings = require('ampersand-dom-bindings');
var getPath = require('lodash/get');

function View(attrs) {
    this.cid = uniqueId('view');
    attrs || (attrs = {});
    var parent = attrs.parent;
    delete attrs.parent;
    BaseState.call(this, attrs, {init: false, parent: parent});
    this.on('change:el', this._handleElementChange, this);
    this._upsertBindings();
    this.template = attrs.template || this.template;
    this._cache.rendered = false; // prep `rendered` derived cache immediately
    this.initialize.apply(this, arguments);
    if (this.autoRender && this.template) {
        this.render();
    }
}

var BaseState = State.extend({
    dataTypes: {
        element: {
            set: function (newVal) {
                return {
                    val: newVal,
                    type: newVal instanceof Element ? 'element' : typeof newVal
                };
            },
            compare: function (el1, el2) {
                return el1 === el2;
            }
        },
        collection: {
            set: function (newVal) {
                return {
                    val: newVal,
                    type: newVal && newVal.isCollection ? 'collection' : typeof newVal
                };
            },
            compare: function (currentVal, newVal) {
                return currentVal === newVal;
            }
        }
    },
    props: {
        model: 'state',
        el: 'element',
        collection: 'collection',
    },
    session: {
        _rendered: ['boolean', true, false]
    },
    derived: {
        hasData: {
            deps: ['model'],
            fn: function () {
                return !!this.model;
            }
        },
        rendered: {
            deps: ['_rendered'],
            fn: function() {
                if (this._rendered) {
                    this.trigger('render', this);
                    return true;
                }
                this.trigger('remove', this);
                return false;
            }
        }
    }
});

// Cached regex to split keys for `delegate`.
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

View.prototype = Object.create(BaseState.prototype);

var queryNoElMsg = 'Query cannot be performed as this.el is not defined. Ensure that the view has been rendered.';

// Set up all inheritable properties and methods.
assign(View.prototype, {
    // ## query
    // Get an single element based on CSS selector scoped to this.el
    // if you pass an empty string it return `this.el`.
    // If you pass an element we just return it back.
    // This lets us use `get` to handle cases where users
    // can pass a selector or an already selected element.
    query: function (selector) {
        if (!this.el) {
            throw new Error(queryNoElMsg);
        }
        if (!selector) return this.el;
        if (typeof selector === 'string') {
            if (matches(this.el, selector)) return this.el;
            return this.el.querySelector(selector) || undefined;
        }
        return selector;
    },

    // ## queryAll
    // Returns an array of elements based on CSS selector scoped to this.el
    // if you pass an empty string it return `this.el`. Also includes root
    // element.
    queryAll: function (selector) {
        if (!this.el) {
            throw new Error(queryNoElMsg);
        }
        if (!selector) return [this.el];
        var res = [];
        if (matches(this.el, selector)) res.push(this.el);
        return res.concat(Array.prototype.slice.call(this.el.querySelectorAll(selector)));
    },

    // ## queryByHook
    // Convenience method for fetching element by it's `data-hook` attribute.
    // Also tries to match against root element.
    // Also supports matching 'one' of several space separated hooks.
    queryByHook: function (hook) {
        return this.query('[data-hook~="' + hook + '"]');
    },

    // ## queryAllByHook
    // Convenience method for fetching all elements by their's `data-hook` attribute.
    queryAllByHook: function (hook) {
        return this.queryAll('[data-hook~="' + hook + '"]');
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function () {},

    // **render** is the core function that your view can override. Its job is
    // to populate its element (`this.el`), with the appropriate HTML.
    _render: function () {
        this._upsertBindings();
        this.renderWithTemplate(this);
        this._rendered = true;
        return this;
    },

    // Removes this view by taking the element out of the DOM, and removing any
    // applicable events listeners.
    _remove: function () {
        if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
        this._rendered = false;
        this._downsertBindings();
        return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    _handleElementChange: function (element, delegate) {
        if (this.eventManager) this.eventManager.unbind();
        this.eventManager = events(this.el, this);
        this.delegateEvents();
        this._applyBindingsForKey();
        return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function (e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function (events) {
        if (!(events || (events = result(this, 'events')))) return this;
        this.undelegateEvents();
        for (var key in events) {
            this.eventManager.bind(key, events[key]);
        }
        return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function () {
        this.eventManager.unbind();
        return this;
    },

    // ## registerSubview
    // Pass it a view. This can be anything with a `remove` method
    registerSubview: function (view) {
        // Storage for our subviews.
        this._subviews = this._subviews || [];
        this._subviews.push(view);
        // set the parent reference if it has not been set
        if (!view.parent) view.parent = this;
        return view;
    },

    // ## renderSubview
    // Pass it a view instance and a container element
    // to render it in. It's `remove` method will be called
    // when the parent view is destroyed.
    renderSubview: function (view, container) {
        if (typeof container === 'string') {
            container = this.query(container);
        }
        if (!container) container = this.el;
        this.registerSubview(view);
        container.appendChild(view.render().el);
        return view;
    },

    _applyBindingsForKey: function (name) {
        if (!this.el) return;
        var fns = this._parsedBindings.getGrouped(name);
        var item;
        for (item in fns) {
            fns[item].forEach(function (fn) {
                fn(this.el, getPath(this, item), last(item.split('.')));
            }, this);
        }
    },

    _initializeBindings: function () {
        if (!this.bindings) return;
        this.on('all', function (eventName) {
            if (eventName.slice(0, 7) === 'change:') {
                this._applyBindingsForKey(eventName.split(':')[1]);
            }
        }, this);
    },

    // ## _initializeSubviews
    // this is called at setup and grabs declared subviews
    _initializeSubviews: function () {
        if (!this.subviews) return;
        for (var item in this.subviews) {
            this._parseSubview(this.subviews[item], item);
        }
    },

    // ## _parseSubview
    // helper for parsing out the subview declaration and registering
    // the `waitFor` if need be.
    _parseSubview: function (subview, name) {
        //backwards compatibility with older versions, when `container` was a valid property (#114)
        if (subview.container) {
            subview.selector = subview.container;
        }
        var opts = this._parseSubviewOpts(subview);

        function action() {
            var el, subview;
            // if not rendered or we can't find our element, stop here.
            if (!this.el || !(el = this.query(opts.selector))) return;
            if (!opts.waitFor || getPath(this, opts.waitFor)) {
                subview = this[name] = opts.prepareView.call(this, el);
                if (!subview.el) {
                    this.renderSubview(subview, el);
                } else {
                    subview.render();
                    this.registerSubview(subview);
                }
                this.off('change', action);
            }
        }
        // we listen for main `change` items
        this.on('change', action, this);
    },

    // Parses the declarative subview definition.
    // You may overload this method to create your own declarative subview style.
    // You must return an object with members 'selector', 'waitFor' and 'prepareView'.
    // waitFor is trigged on the view 'change' event and so one way to extend the deferred view
    // construction is to add an additional property (props) to the view. Then setting this property
    // will satisfy the waitFor condition. You can then extend the prepareView function to pass in
    // additional data from the parent view. This can allow you to have multi-stage rendering of
    // custom data formats and to declaratively define.
    _parseSubviewOpts: function (subview) {
        var self = this;
        var opts = {
            selector: subview.selector || '[data-hook="' + subview.hook + '"]',
            waitFor: subview.waitFor || '',
            prepareView: subview.prepareView || function () {
                return new subview.constructor({
                    parent: self
                });
            }
        };
        return opts;
    },

    // Shortcut for doing everything we need to do to
    // render and fully replace current root element.
    // Either define a `template` property of your view
    // or pass in a template directly.
    // The template can either be a string or a function.
    // If it's a function it will be passed the `context`
    // argument.
    renderWithTemplate: function (context, templateArg) {
        var template = templateArg || this.template;
        if (!template) throw new Error('Template string or function needed.');
        var newDom = isString(template) ? template : template.call(this, context || this);
        if (isString(newDom)) newDom = domify(newDom);
        var parent = this.el && this.el.parentNode;
        if (parent) parent.replaceChild(newDom, this.el);
        if (newDom.nodeName === '#document-fragment') throw new Error('Views can only have one root element, including comment nodes.');
        this.el = newDom;
        return this;
    },

    // ## cacheElements
    // This is a shortcut for adding reference to specific elements within your view for
    // access later. This avoids excessive DOM queries and makes it easier to update
    // your view if your template changes.
    //
    // In your `render` method. Use it like so:
    //
    //     render: function () {
    //       this.basicRender();
    //       this.cacheElements({
    //         pages: '#pages',
    //         chat: '#teamChat',
    //         nav: 'nav#views ul',
    //         me: '#me',
    //         cheatSheet: '#cheatSheet',
    //         omniBox: '#awesomeSauce'
    //       });
    //     }
    //
    // Then later you can access elements by reference like so: `this.pages`, or `this.chat`.
    cacheElements: function (hash) {
        for (var item in hash) {
            this[item] = this.query(hash[item]);
        }
        return this;
    },

    // ## listenToAndRun
    // Shortcut for registering a listener for a model
    // and also triggering it right away.
    listenToAndRun: function (object, events, handler) {
        var bound = bind(handler, this);
        this.listenTo(object, events, bound);
        bound();
    },

    // ## animateRemove
    // Placeholder for if you want to do something special when they're removed.
    // For example fade it out, etc.
    // Any override here should call `.remove()` when done.
    animateRemove: function () {
        this.remove();
    },

    // ## renderCollection
    // Method for rendering a collections with individual views.
    // Just pass it the collection, and the view to use for the items in the
    // collection. The collectionView is returned.
    renderCollection: function (collection, ViewClass, container, opts) {
        var containerEl = (typeof container === 'string') ? this.query(container) : container;
        var config = assign({
            collection: collection,
            el: containerEl || this.el,
            view: ViewClass,
            parent: this,
            viewOptions: {
                parent: this
            }
        }, opts);
        var collectionView = new CollectionView(config);
        collectionView.render();
        return this.registerSubview(collectionView);
    },

    _setRender: function(obj) {
        Object.defineProperty(obj, 'render', {
            get: function() {
                return this._render;
            },
            set: function(fn) {
                this._render = function() {
                    fn.apply(this, arguments);
                    this._rendered = true;
                    return this;
                };
            }
        });
    },

    _setRemove: function(obj) {
        Object.defineProperty(obj, 'remove', {
            get: function() {
                return this._remove;
            },
            set: function(fn) {
                this._remove = function() {
                    fn.apply(this, arguments);
                    this._rendered = false;
                    return this;
                };
            }
        });
    },

    _downsertBindings: function() {
        var parsedBindings = this._parsedBindings;
        if (!this.bindingsSet) return;
        if (this._subviews) invokeMap(flatten(this._subviews), 'remove');
        this.stopListening();
        // TODO: Not sure if this is actually necessary.
        // Just trying to de-reference this potentially large
        // amount of generated functions to avoid memory leaks.
        forEach(parsedBindings, function (properties, modelName) {
            forEach(properties, function (value, key) {
                delete parsedBindings[modelName][key];
            });
            delete parsedBindings[modelName];
        });
        this.bindingsSet = false;
    },

    _upsertBindings: function(attrs) {
        attrs = attrs || this;
        if (this.bindingsSet) return;
        this._parsedBindings = bindings(this.bindings, this);
        this._initializeBindings();
        if (attrs.el && !this.autoRender) {
            this._handleElementChange();
        }
        this._initializeSubviews();
        this.bindingsSet = true;
    }
});

View.prototype._setRender(View.prototype);
View.prototype._setRemove(View.prototype);
View.extend = BaseState.extend;
module.exports = View;

},{"ampersand-collection-view":95,"ampersand-dom-bindings":97,"ampersand-state":105,"domify":117,"events-mixin":120,"lodash/assign":309,"lodash/bind":312,"lodash/flatten":323,"lodash/forEach":324,"lodash/get":326,"lodash/invokeMap":331,"lodash/isString":345,"lodash/last":350,"lodash/pick":356,"lodash/result":360,"lodash/uniqueId":371,"matches-selector":374}],110:[function(require,module,exports){
module.exports = function arrayNext(array, currentItem) {
    var len = array.length;
    var newIndex = array.indexOf(currentItem) + 1;
    if (newIndex > (len - 1)) newIndex = 0;
    return array[newIndex];
};

},{}],111:[function(require,module,exports){
var matches = require('matches-selector')

module.exports = function (element, selector, checkYoSelf) {
  var parent = checkYoSelf ? element : element.parentNode

  while (parent && parent !== document) {
    if (matches(parent, selector)) return parent;
    parent = parent.parentNode
  }
}

},{"matches-selector":112}],112:[function(require,module,exports){

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}
},{}],113:[function(require,module,exports){
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};
},{}],114:[function(require,module,exports){
/*
 * Cookies.js - 1.2.3
 * https://github.com/ScottHamper/Cookies
 *
 * This is free and unencumbered software released into the public domain.
 */
(function (global, undefined) {
    'use strict';

    var factory = function (window) {
        if (typeof window.document !== 'object') {
            throw new Error('Cookies.js requires a `window` with a `document` object');
        }

        var Cookies = function (key, value, options) {
            return arguments.length === 1 ?
                Cookies.get(key) : Cookies.set(key, value, options);
        };

        // Allows for setter injection in unit tests
        Cookies._document = window.document;

        // Used to ensure cookie keys do not collide with
        // built-in `Object` properties
        Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
        
        Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

        Cookies.defaults = {
            path: '/',
            secure: false
        };

        Cookies.get = function (key) {
            if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
                Cookies._renewCache();
            }
            
            var value = Cookies._cache[Cookies._cacheKeyPrefix + key];

            return value === undefined ? undefined : decodeURIComponent(value);
        };

        Cookies.set = function (key, value, options) {
            options = Cookies._getExtendedOptions(options);
            options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);

            Cookies._document.cookie = Cookies._generateCookieString(key, value, options);

            return Cookies;
        };

        Cookies.expire = function (key, options) {
            return Cookies.set(key, undefined, options);
        };

        Cookies._getExtendedOptions = function (options) {
            return {
                path: options && options.path || Cookies.defaults.path,
                domain: options && options.domain || Cookies.defaults.domain,
                expires: options && options.expires || Cookies.defaults.expires,
                secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure
            };
        };

        Cookies._isValidDate = function (date) {
            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
        };

        Cookies._getExpiresDate = function (expires, now) {
            now = now || new Date();

            if (typeof expires === 'number') {
                expires = expires === Infinity ?
                    Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
            } else if (typeof expires === 'string') {
                expires = new Date(expires);
            }

            if (expires && !Cookies._isValidDate(expires)) {
                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
            }

            return expires;
        };

        Cookies._generateCookieString = function (key, value, options) {
            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
            options = options || {};

            var cookieString = key + '=' + value;
            cookieString += options.path ? ';path=' + options.path : '';
            cookieString += options.domain ? ';domain=' + options.domain : '';
            cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
            cookieString += options.secure ? ';secure' : '';

            return cookieString;
        };

        Cookies._getCacheFromString = function (documentCookie) {
            var cookieCache = {};
            var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

            for (var i = 0; i < cookiesArray.length; i++) {
                var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

                if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
                    cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
                }
            }

            return cookieCache;
        };

        Cookies._getKeyValuePairFromCookieString = function (cookieString) {
            // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
            var separatorIndex = cookieString.indexOf('=');

            // IE omits the "=" when the cookie value is an empty string
            separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

            var key = cookieString.substr(0, separatorIndex);
            var decodedKey;
            try {
                decodedKey = decodeURIComponent(key);
            } catch (e) {
                if (console && typeof console.error === 'function') {
                    console.error('Could not decode cookie with key "' + key + '"', e);
                }
            }
            
            return {
                key: decodedKey,
                value: cookieString.substr(separatorIndex + 1) // Defer decoding value until accessed
            };
        };

        Cookies._renewCache = function () {
            Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
            Cookies._cachedDocumentCookie = Cookies._document.cookie;
        };

        Cookies._areEnabled = function () {
            var testKey = 'cookies.js';
            var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
            Cookies.expire(testKey);
            return areEnabled;
        };

        Cookies.enabled = Cookies._areEnabled();

        return Cookies;
    };
    var cookiesExport = (global && typeof global.document === 'object') ? factory(global) : factory;

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return cookiesExport; });
    // CommonJS/Node.js support
    } else if (typeof exports === 'object') {
        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module === 'object' && typeof module.exports === 'object') {
            exports = module.exports = cookiesExport;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.Cookies = cookiesExport;
    } else {
        global.Cookies = cookiesExport;
    }
})(typeof window === 'undefined' ? this : window);
},{}],115:[function(require,module,exports){
'use strict';

var requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
}());

function decouple(node, event, fn) {
  var eve,
      tracking = false;

  function captureEvent(e) {
    eve = e;
    track();
  }

  function track() {
    if (!tracking) {
      requestAnimFrame(update);
      tracking = true;
    }
  }

  function update() {
    fn.call(node, eve);
    tracking = false;
  }

  node.addEventListener(event, captureEvent, false);

  return captureEvent;
}

/**
 * Expose decouple
 */
module.exports = decouple;

},{}],116:[function(require,module,exports){
/**
 * Module dependencies.
 */

var closest = require('closest')
  , event = require('component-event');

/**
 * Delegate event `type` to `selector`
 * and invoke `fn(e)`. A callback function
 * is returned which may be passed to `.unbind()`.
 *
 * @param {Element} el
 * @param {String} selector
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

// Some events don't bubble, so we want to bind to the capture phase instead
// when delegating.
var forceCaptureEvents = ['focus', 'blur'];

exports.bind = function(el, selector, type, fn, capture){
  if (forceCaptureEvents.indexOf(type) !== -1) capture = true;

  return event.bind(el, type, function(e){
    var target = e.target || e.srcElement;
    e.delegateTarget = closest(target, selector, true, el);
    if (e.delegateTarget) fn.call(el, e);
  }, capture);
};

/**
 * Unbind event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (forceCaptureEvents.indexOf(type) !== -1) capture = true;

  event.unbind(el, type, fn, capture);
};

},{"closest":111,"component-event":113}],117:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var innerHTMLBug = false;
var bugTestDiv;
if (typeof document !== 'undefined') {
  bugTestDiv = document.createElement('div');
  // Setup
  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
  // Make sure that link elements get serialized correctly by innerHTML
  // This requires a wrapper element in IE
  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
  bugTestDiv = undefined;
}

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

},{}],118:[function(require,module,exports){

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{"indexof":123}],119:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

exports.__esModule = true;
/**
 * Creates a new instance of Emitter.
 * @class
 * @returns {Object} Returns a new instance of Emitter.
 * @example
 * // Creates a new instance of Emitter.
 * var Emitter = require('emitter');
 *
 * var emitter = new Emitter();
 */

var Emitter = (function () {
  function Emitter() {
    _classCallCheck(this, Emitter);
  }

  /**
   * Adds a listener to the collection for the specified event.
   * @memberof! Emitter.prototype
   * @function
   * @param {String} event - The event name.
   * @param {Function} listener - A listener function to add.
   * @returns {Object} Returns an instance of Emitter.
   * @example
   * // Add an event listener to "foo" event.
   * emitter.on('foo', listener);
   */

  Emitter.prototype.on = function on(event, listener) {
    // Use the current collection or create it.
    this._eventCollection = this._eventCollection || {};

    // Use the current collection of an event or create it.
    this._eventCollection[event] = this._eventCollection[event] || [];

    // Appends the listener into the collection of the given event
    this._eventCollection[event].push(listener);

    return this;
  };

  /**
   * Adds a listener to the collection for the specified event that will be called only once.
   * @memberof! Emitter.prototype
   * @function
   * @param {String} event - The event name.
   * @param {Function} listener - A listener function to add.
   * @returns {Object} Returns an instance of Emitter.
   * @example
   * // Will add an event handler to "foo" event once.
   * emitter.once('foo', listener);
   */

  Emitter.prototype.once = function once(event, listener) {
    var self = this;

    function fn() {
      self.off(event, fn);
      listener.apply(this, arguments);
    }

    fn.listener = listener;

    this.on(event, fn);

    return this;
  };

  /**
   * Removes a listener from the collection for the specified event.
   * @memberof! Emitter.prototype
   * @function
   * @param {String} event - The event name.
   * @param {Function} listener - A listener function to remove.
   * @returns {Object} Returns an instance of Emitter.
   * @example
   * // Remove a given listener.
   * emitter.off('foo', listener);
   */

  Emitter.prototype.off = function off(event, listener) {

    var listeners = undefined;

    // Defines listeners value.
    if (!this._eventCollection || !(listeners = this._eventCollection[event])) {
      return this;
    }

    listeners.forEach(function (fn, i) {
      if (fn === listener || fn.listener === listener) {
        // Removes the given listener.
        listeners.splice(i, 1);
      }
    });

    // Removes an empty event collection.
    if (listeners.length === 0) {
      delete this._eventCollection[event];
    }

    return this;
  };

  /**
   * Execute each item in the listener collection in order with the specified data.
   * @memberof! Emitter.prototype
   * @function
   * @param {String} event - The name of the event you want to emit.
   * @param {...Object} data - Data to pass to the listeners.
   * @returns {Object} Returns an instance of Emitter.
   * @example
   * // Emits the "foo" event with 'param1' and 'param2' as arguments.
   * emitter.emit('foo', 'param1', 'param2');
   */

  Emitter.prototype.emit = function emit(event) {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var listeners = undefined;

    // Defines listeners value.
    if (!this._eventCollection || !(listeners = this._eventCollection[event])) {
      return this;
    }

    // Clone listeners
    listeners = listeners.slice(0);

    listeners.forEach(function (fn) {
      return fn.apply(_this, args);
    });

    return this;
  };

  return Emitter;
})();

/**
 * Exports Emitter
 */
exports["default"] = Emitter;
module.exports = exports["default"];
},{}],120:[function(require,module,exports){

/**
 * Module dependencies.
 */

var events = require('component-event');
var delegate = require('delegate-events');
var forceCaptureEvents = ['focus', 'blur'];

/**
 * Expose `Events`.
 */

module.exports = Events;

/**
 * Initialize an `Events` with the given
 * `el` object which events will be bound to,
 * and the `obj` which will receive method calls.
 *
 * @param {Object} el
 * @param {Object} obj
 * @api public
 */

function Events(el, obj) {
  if (!(this instanceof Events)) return new Events(el, obj);
  if (!el) throw new Error('element required');
  if (!obj) throw new Error('object required');
  this.el = el;
  this.obj = obj;
  this._events = {};
}

/**
 * Subscription helper.
 */

Events.prototype.sub = function(event, method, cb){
  this._events[event] = this._events[event] || {};
  this._events[event][method] = cb;
};

/**
 * Bind to `event` with optional `method` name.
 * When `method` is undefined it becomes `event`
 * with the "on" prefix.
 *
 * Examples:
 *
 *  Direct event handling:
 *
 *    events.bind('click') // implies "onclick"
 *    events.bind('click', 'remove')
 *    events.bind('click', 'sort', 'asc')
 *
 *  Delegated event handling:
 *
 *    events.bind('click li > a')
 *    events.bind('click li > a', 'remove')
 *    events.bind('click a.sort-ascending', 'sort', 'asc')
 *    events.bind('click a.sort-descending', 'sort', 'desc')
 *
 *  Multiple events handling:
 *
 *    events.bind({
 *      'click .remove': 'remove',
 *      'click .add': 'add'
 *    });
 *
 * @param {String|object} - object is used for multiple binding,
 *                               string for single event binding
 * @param {String|function} [arg2] - method to call (optional)
 * @param {*} [arg3] - data for single event binding (optional)
 * @return {Function} callback
 * @api public
 */

Events.prototype.bind = function(arg1, arg2){
  var bindEvent = function(event, method) {
    var e = parse(event);
    var el = this.el;
    var obj = this.obj;
    var name = e.name;
    var method = method || 'on' + name;
    var args = [].slice.call(arguments, 2);

    // callback
    function cb(){
      var a = [].slice.call(arguments).concat(args);

      if (typeof method === 'function') {
          method.apply(obj, a);
          return;
      }

      if (!obj[method]) {
          throw new Error(method + ' method is not defined');
      } else {
          obj[method].apply(obj, a);
      }
    }

    // bind
    if (e.selector) {
      cb = delegate.bind(el, e.selector, name, cb);
    } else {
      events.bind(el, name, cb);
    }

    // subscription for unbinding
    this.sub(name, method, cb);

    return cb;
  };

  if (typeof arg1 == 'string') {
    bindEvent.apply(this, arguments);
  } else {
    for(var key in arg1) {
      if (arg1.hasOwnProperty(key)) {
        bindEvent.call(this, key, arg1[key]);
      }
    }
  }
};

/**
 * Unbind a single binding, all bindings for `event`,
 * or all bindings within the manager.
 *
 * Examples:
 *
 *  Unbind direct handlers:
 *
 *     events.unbind('click', 'remove')
 *     events.unbind('click')
 *     events.unbind()
 *
 * Unbind delegate handlers:
 *
 *     events.unbind('click', 'remove')
 *     events.unbind('click')
 *     events.unbind()
 *
 * @param {String|Function} [event]
 * @param {String|Function} [method]
 * @api public
 */

Events.prototype.unbind = function(event, method){
  if (0 == arguments.length) return this.unbindAll();
  if (1 == arguments.length) return this.unbindAllOf(event);

  // no bindings for this event
  var bindings = this._events[event];
  var capture = (forceCaptureEvents.indexOf(event) !== -1);
  if (!bindings) return;

  // no bindings for this method
  var cb = bindings[method];
  if (!cb) return;

  events.unbind(this.el, event, cb, capture);
};

/**
 * Unbind all events.
 *
 * @api private
 */

Events.prototype.unbindAll = function(){
  for (var event in this._events) {
    this.unbindAllOf(event);
  }
};

/**
 * Unbind all events for `event`.
 *
 * @param {String} event
 * @api private
 */

Events.prototype.unbindAllOf = function(event){
  var bindings = this._events[event];
  if (!bindings) return;

  for (var method in bindings) {
    this.unbind(event, method);
  }
};

/**
 * Parse `event`.
 *
 * @param {String} event
 * @return {Object}
 * @api private
 */

function parse(event) {
  var parts = event.split(/ +/);
  return {
    name: parts.shift(),
    selector: parts.join(' ')
  }
}

},{"component-event":113,"delegate-events":116}],121:[function(require,module,exports){
var isFunction = require('is-function')

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}

},{"is-function":124}],122:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],123:[function(require,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],124:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],125:[function(require,module,exports){
var slice = Array.prototype.slice;

// our constructor
function KeyTreeStore(options) {
    options = options || {};
    if (typeof options !== 'object') {
        throw new TypeError('Options must be an object');
    }
    var DEFAULT_SEPARATOR = '.';

    this.storage = {};
    this.separator = options.separator || DEFAULT_SEPARATOR;
}

// add an object to the store
KeyTreeStore.prototype.add = function (keypath, obj) {
    var arr = this.storage[keypath] || (this.storage[keypath] = []);
    arr.push(obj);
};

// remove an object
KeyTreeStore.prototype.remove = function (obj) {
    var path, arr;
    for (path in this.storage) {
        arr = this.storage[path];
        arr.some(function (item, index) {
            if (item === obj) {
                arr.splice(index, 1);
                return true;
            }
        });
    }
};

// get array of all all relevant functions, without keys
KeyTreeStore.prototype.get = function (keypath) {
    var res = [];
    var key;

    for (key in this.storage) {
        if (!keypath || keypath === key || key.indexOf(keypath + this.separator) === 0) {
            res = res.concat(this.storage[key]);
        }
    }

    return res;
};

// get all results that match keypath but still grouped by key
KeyTreeStore.prototype.getGrouped = function (keypath) {
    var res = {};
    var key;

    for (key in this.storage) {
        if (!keypath || keypath === key || key.indexOf(keypath + this.separator) === 0) {
            res[key] = slice.call(this.storage[key]);
        }
    }

    return res;
};

// get all results that match keypath but still grouped by key
KeyTreeStore.prototype.getAll = function (keypath) {
    var res = {};
    var key;

    for (key in this.storage) {
        if (keypath === key || key.indexOf(keypath + this.separator) === 0) {
            res[key] = slice.call(this.storage[key]);
        }
    }

    return res;
};

// run all matches with optional context
KeyTreeStore.prototype.run = function (keypath, context) {
    var args = slice.call(arguments, 2);
    this.get(keypath).forEach(function (fn) {
        fn.apply(context || this, args);
    });
};

module.exports = KeyTreeStore;

},{}],126:[function(require,module,exports){
/**
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var root = require('lodash._root');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_BOUND_FLAG = 4,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64,
    ARY_FLAG = 128,
    FLIP_FLAG = 512;

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {...*} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  var length = args.length;
  switch (length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = -1,
      result = [];

  while (++index < length) {
    if (array[index] === placeholder) {
      array[index] = PLACEHOLDER;
      result[++resIndex] = index;
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(prototype) {
    if (isObject(prototype)) {
      object.prototype = prototype;
      var result = new object;
      object.prototype = undefined;
    }
    return result || {};
  };
}());

/**
 * Creates an array that is the composition of partially applied arguments,
 * placeholders, and provided arguments into a single array of arguments.
 *
 * @private
 * @param {Array|Object} args The provided arguments.
 * @param {Array} partials The arguments to prepend to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgs(args, partials, holders) {
  var holdersLength = holders.length,
      argsIndex = -1,
      argsLength = nativeMax(args.length - holdersLength, 0),
      leftIndex = -1,
      leftLength = partials.length,
      result = Array(leftLength + argsLength);

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    result[holders[argsIndex]] = args[argsIndex];
  }
  while (argsLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}

/**
 * This function is like `composeArgs` except that the arguments composition
 * is tailored for `_.partialRight`.
 *
 * @private
 * @param {Array|Object} args The provided arguments.
 * @param {Array} partials The arguments to append to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgsRight(args, partials, holders) {
  var holdersIndex = -1,
      holdersLength = holders.length,
      argsIndex = -1,
      argsLength = nativeMax(args.length - holdersLength, 0),
      rightIndex = -1,
      rightLength = partials.length,
      result = Array(argsLength + rightLength);

  while (++argsIndex < argsLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    result[offset + holders[holdersIndex]] = args[argsIndex++];
  }
  return result;
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Creates a function that wraps `func` to invoke it with the optional `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createBaseWrapper(func, bitmask, thisArg) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtorWrapper(func);

  function wrapper() {
    var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}

/**
 * Creates a function that produces an instance of `Ctor` regardless of
 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
 *
 * @private
 * @param {Function} Ctor The constructor to wrap.
 * @returns {Function} Returns the new wrapped function.
 */
function createCtorWrapper(Ctor) {
  return function() {
    // Use a `switch` statement to work with class constructors.
    // See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
    // for more details.
    var args = arguments;
    switch (args.length) {
      case 0: return new Ctor;
      case 1: return new Ctor(args[0]);
      case 2: return new Ctor(args[0], args[1]);
      case 3: return new Ctor(args[0], args[1], args[2]);
      case 4: return new Ctor(args[0], args[1], args[2], args[3]);
      case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
      case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    var thisBinding = baseCreate(Ctor.prototype),
        result = Ctor.apply(thisBinding, args);

    // Mimic the constructor's `return` behavior.
    // See https://es5.github.io/#x13.2.2 for more details.
    return isObject(result) ? result : thisBinding;
  };
}

/**
 * Creates a function that wraps `func` to enable currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
 * @param {number} arity The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createCurryWrapper(func, bitmask, arity) {
  var Ctor = createCtorWrapper(func);

  function wrapper() {
    var length = arguments.length,
        index = length,
        args = Array(length),
        fn = (this && this !== root && this instanceof wrapper) ? Ctor : func,
        placeholder = wrapper.placeholder;

    while (index--) {
      args[index] = arguments[index];
    }
    var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
      ? []
      : replaceHolders(args, placeholder);

    length -= holders.length;
    return length < arity
      ? createRecurryWrapper(func, bitmask, createHybridWrapper, placeholder, undefined, args, holders, undefined, undefined, arity - length)
      : apply(fn, this, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` to invoke it with optional `this`
 * binding of `thisArg`, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & ARY_FLAG,
      isBind = bitmask & BIND_FLAG,
      isBindKey = bitmask & BIND_KEY_FLAG,
      isCurry = bitmask & CURRY_FLAG,
      isCurryRight = bitmask & CURRY_RIGHT_FLAG,
      isFlip = bitmask & FLIP_FLAG,
      Ctor = isBindKey ? undefined : createCtorWrapper(func);

  function wrapper() {
    var length = arguments.length,
        index = length,
        args = Array(length);

    while (index--) {
      args[index] = arguments[index];
    }
    if (partials) {
      args = composeArgs(args, partials, holders);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight);
    }
    if (isCurry || isCurryRight) {
      var placeholder = wrapper.placeholder,
          argsHolders = replaceHolders(args, placeholder);

      length -= argsHolders.length;
      if (length < arity) {
        return createRecurryWrapper(func, bitmask, createHybridWrapper, placeholder, thisArg, args, argsHolders, argPos, ary, arity - length);
      }
    }
    var thisBinding = isBind ? thisArg : this,
        fn = isBindKey ? thisBinding[func] : func;

    if (argPos) {
      args = reorder(args, argPos);
    } else if (isFlip && args.length > 1) {
      args.reverse();
    }
    if (isAry && ary < args.length) {
      args.length = ary;
    }
    if (this && this !== root && this instanceof wrapper) {
      fn = Ctor || createCtorWrapper(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` to invoke it with the optional `this`
 * binding of `thisArg` and the `partials` prepended to those provided to
 * the wrapper.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to the new function.
 * @returns {Function} Returns the new wrapped function.
 */
function createPartialWrapper(func, bitmask, thisArg, partials) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtorWrapper(func);

  function wrapper() {
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(leftLength + argsLength),
        fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return apply(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` to continue currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
 * @param {Function} wrapFunc The function to create the `func` wrapper.
 * @param {*} placeholder The placeholder to replace.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createRecurryWrapper(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & CURRY_FLAG,
      newArgPos = argPos ? copyArray(argPos) : undefined,
      newsHolders = isCurry ? holders : undefined,
      newHoldersRight = isCurry ? undefined : holders,
      newPartials = isCurry ? partials : undefined,
      newPartialsRight = isCurry ? undefined : partials;

  bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
  bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

  if (!(bitmask & CURRY_BOUND_FLAG)) {
    bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
  }
  var result = wrapFunc(func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, arity);

  result.placeholder = placeholder;
  return result;
}

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask of wrapper flags.
 *  The bitmask may be composed of the following flags:
 *     1 - `_.bind`
 *     2 - `_.bindKey`
 *     4 - `_.curry` or `_.curryRight` of a bound function
 *     8 - `_.curry`
 *    16 - `_.curryRight`
 *    32 - `_.partial`
 *    64 - `_.partialRight`
 *   128 - `_.rearg`
 *   256 - `_.ary`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & BIND_KEY_FLAG;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
    partials = holders = undefined;
  }
  ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
  arity = arity === undefined ? arity : toInteger(arity);
  length -= holders ? holders.length : 0;

  if (bitmask & PARTIAL_RIGHT_FLAG) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = undefined;
  }
  var newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] == null
    ? (isBindKey ? 0 : func.length)
    : nativeMax(newData[9] - length, 0);

  if (!arity && bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG)) {
    bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG);
  }
  if (!bitmask || bitmask == BIND_FLAG) {
    var result = createBaseWrapper(func, bitmask, thisArg);
  } else if (bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG) {
    result = createCurryWrapper(func, bitmask, arity);
  } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !holders.length) {
    result = createPartialWrapper(func, bitmask, thisArg, partials);
  } else {
    result = createHybridWrapper.apply(undefined, newData);
  }
  return result;
}

/**
 * Reorder `array` according to the specified indexes where the element at
 * the first index is assigned as the first element, the element at
 * the second index is assigned as the second element, and so on.
 *
 * @private
 * @param {Array} array The array to reorder.
 * @param {Array} indexes The arranged array indexes.
 * @returns {Array} Returns `array`.
 */
function reorder(array, indexes) {
  var arrLength = array.length,
      length = nativeMin(indexes.length, arrLength),
      oldArray = copyArray(array);

  while (length--) {
    var index = indexes[length];
    array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
  }
  return array;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array constructors, and
  // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This function is loosely based on [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3');
 * // => 3
 */
function toInteger(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  var remainder = value % 1;
  return value === value ? (remainder ? value - remainder : value) : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3);
 * // => 3
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3');
 * // => 3
 */
function toNumber(value) {
  if (isObject(value)) {
    var other = isFunction(value.valueOf) ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = createWrapper;

},{"lodash._root":128}],127:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = -1,
      result = [];

  while (++index < length) {
    if (array[index] === placeholder) {
      array[index] = PLACEHOLDER;
      result[++resIndex] = index;
    }
  }
  return result;
}

module.exports = replaceHolders;

},{}],128:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used to determine if values are of the language type `Object`. */
var objectTypes = {
  'function': true,
  'object': true
};

/** Detect free variable `exports`. */
var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
  ? exports
  : undefined;

/** Detect free variable `module`. */
var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
  ? module
  : undefined;

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

/** Detect free variable `self`. */
var freeSelf = checkGlobal(objectTypes[typeof self] && self);

/** Detect free variable `window`. */
var freeWindow = checkGlobal(objectTypes[typeof window] && window);

/** Detect `this` as the global object. */
var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

/**
 * Used as a reference to the global object.
 *
 * The `this` value is used if it's the global object to avoid Greasemonkey's
 * restricted `window` object, otherwise the `window` object is used.
 */
var root = freeGlobal ||
  ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
    freeSelf || thisGlobal || Function('return this')();

/**
 * Checks if `value` is a global object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
 */
function checkGlobal(value) {
  return (value && value.Object === Object) ? value : null;
}

module.exports = root;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],129:[function(require,module,exports){
/**
 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var createWrapper = require('lodash._createwrapper'),
    replaceHolders = require('lodash._replaceholders'),
    restParam = require('lodash.restparam');

/** Used to compose bitmasks for wrapper metadata. */
var PARTIAL_FLAG = 32;

/**
 * Creates a `_.partial` or `_.partialRight` function.
 *
 * @private
 * @param {boolean} flag The partial bit flag.
 * @returns {Function} Returns the new partial function.
 */
function createPartial(flag) {
  var partialFunc = restParam(function(func, partials) {
    var holders = replaceHolders(partials, partialFunc.placeholder);
    return createWrapper(func, flag, undefined, partials, holders);
  });
  return partialFunc;
}

/**
 * Creates a function that invokes `func` with `partial` arguments prepended
 * to those provided to the new function. This method is like `_.bind` except
 * it does **not** alter the `this` binding.
 *
 * The `_.partial.placeholder` value, which defaults to `_` in monolithic
 * builds, may be used as a placeholder for partially applied arguments.
 *
 * **Note:** This method does not set the "length" property of partially
 * applied functions.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to partially apply arguments to.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new partially applied function.
 * @example
 *
 * var greet = function(greeting, name) {
 *   return greeting + ' ' + name;
 * };
 *
 * var sayHelloTo = _.partial(greet, 'hello');
 * sayHelloTo('fred');
 * // => 'hello fred'
 *
 * // using placeholders
 * var greetFred = _.partial(greet, _, 'fred');
 * greetFred('hi');
 * // => 'hi fred'
 */
var partial = createPartial(PARTIAL_FLAG);

// Assign default placeholders.
partial.placeholder = {};

module.exports = partial;

},{"lodash._createwrapper":126,"lodash._replaceholders":127,"lodash.restparam":130}],130:[function(require,module,exports){
/**
 * lodash 3.6.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;

},{}],131:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":246,"./_root":294}],132:[function(require,module,exports){
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":253,"./_hashDelete":254,"./_hashGet":255,"./_hashHas":256,"./_hashSet":257}],133:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    baseLodash = require('./_baseLodash');

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/**
 * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
 *
 * @private
 * @constructor
 * @param {*} value The value to wrap.
 */
function LazyWrapper(value) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__dir__ = 1;
  this.__filtered__ = false;
  this.__iteratees__ = [];
  this.__takeCount__ = MAX_ARRAY_LENGTH;
  this.__views__ = [];
}

// Ensure `LazyWrapper` is an instance of `baseLodash`.
LazyWrapper.prototype = baseCreate(baseLodash.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;

module.exports = LazyWrapper;

},{"./_baseCreate":162,"./_baseLodash":184}],134:[function(require,module,exports){
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":275,"./_listCacheDelete":276,"./_listCacheGet":277,"./_listCacheHas":278,"./_listCacheSet":279}],135:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    baseLodash = require('./_baseLodash');

/**
 * The base constructor for creating `lodash` wrapper objects.
 *
 * @private
 * @param {*} value The value to wrap.
 * @param {boolean} [chainAll] Enable explicit method chain sequences.
 */
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__chain__ = !!chainAll;
  this.__index__ = 0;
  this.__values__ = undefined;
}

LodashWrapper.prototype = baseCreate(baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;

module.exports = LodashWrapper;

},{"./_baseCreate":162,"./_baseLodash":184}],136:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":246,"./_root":294}],137:[function(require,module,exports){
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":280,"./_mapCacheDelete":281,"./_mapCacheGet":282,"./_mapCacheHas":283,"./_mapCacheSet":284}],138:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":246,"./_root":294}],139:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Reflect = root.Reflect;

module.exports = Reflect;

},{"./_root":294}],140:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":246,"./_root":294}],141:[function(require,module,exports){
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

},{"./_MapCache":137,"./_setCacheAdd":295,"./_setCacheHas":296}],142:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":134,"./_stackClear":299,"./_stackDelete":300,"./_stackGet":301,"./_stackHas":302,"./_stackSet":303}],143:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":294}],144:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":294}],145:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":246,"./_root":294}],146:[function(require,module,exports){
/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `Map#set` because it doesn't return the map instance in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

module.exports = addMapEntry;

},{}],147:[function(require,module,exports){
/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  set.add(value);
  return set;
}

module.exports = addSetEntry;

},{}],148:[function(require,module,exports){
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  var length = args.length;
  switch (length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

},{}],149:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],150:[function(require,module,exports){
/**
 * A specialized version of `_.every` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`.
 */
function arrayEvery(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (!predicate(array[index], index, array)) {
      return false;
    }
  }
  return true;
}

module.exports = arrayEvery;

},{}],151:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf');

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to search.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;

},{"./_baseIndexOf":175}],152:[function(require,module,exports){
/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to search.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;

},{}],153:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],154:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],155:[function(require,module,exports){
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;

},{}],156:[function(require,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],157:[function(require,module,exports){
var eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used by `_.defaults` to customize its `_.assignIn` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function assignInDefaults(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

module.exports = assignInDefaults;

},{"./eq":318}],158:[function(require,module,exports){
var eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

module.exports = assignValue;

},{"./eq":318}],159:[function(require,module,exports){
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":318}],160:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keys = require('./keys');

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;

},{"./_copyObject":218,"./keys":348}],161:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    getAllKeys = require('./_getAllKeys'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isHostObject = require('./_isHostObject'),
    isObject = require('./isObject'),
    keys = require('./keys');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  // Recursively populate clone (susceptible to call stack limits).
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;

},{"./_Stack":142,"./_arrayEach":149,"./_assignValue":158,"./_baseAssign":160,"./_cloneBuffer":206,"./_copyArray":217,"./_copySymbols":219,"./_getAllKeys":238,"./_getTag":250,"./_initCloneArray":260,"./_initCloneByTag":261,"./_initCloneObject":262,"./_isHostObject":265,"./isArray":333,"./isBuffer":336,"./isObject":342,"./keys":348}],162:[function(require,module,exports){
var isObject = require('./isObject');

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

module.exports = baseCreate;

},{"./isObject":342}],163:[function(require,module,exports){
/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * The base implementation of `_.delay` and `_.defer` which accepts an array
 * of `func` arguments.
 *
 * @private
 * @param {Function} func The function to delay.
 * @param {number} wait The number of milliseconds to delay invocation.
 * @param {Object} args The arguments to provide to `func`.
 * @returns {number} Returns the timer id.
 */
function baseDelay(func, wait, args) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  return setTimeout(function() { func.apply(undefined, args); }, wait);
}

module.exports = baseDelay;

},{}],164:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    arrayMap = require('./_arrayMap'),
    baseUnary = require('./_baseUnary'),
    cacheHas = require('./_cacheHas');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;

},{"./_SetCache":141,"./_arrayIncludes":151,"./_arrayIncludesWith":152,"./_arrayMap":153,"./_baseUnary":199,"./_cacheHas":202}],165:[function(require,module,exports){
var baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./_baseForOwn":170,"./_createBaseEach":223}],166:[function(require,module,exports){
var baseEach = require('./_baseEach');

/**
 * The base implementation of `_.every` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`
 */
function baseEvery(collection, predicate) {
  var result = true;
  baseEach(collection, function(value, index, collection) {
    result = !!predicate(value, index, collection);
    return result;
  });
  return result;
}

module.exports = baseEvery;

},{"./_baseEach":165}],167:[function(require,module,exports){
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],168:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isFlattenable = require('./_isFlattenable');

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"./_arrayPush":154,"./_isFlattenable":263}],169:[function(require,module,exports){
var createBaseFor = require('./_createBaseFor');

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./_createBaseFor":224}],170:[function(require,module,exports){
var baseFor = require('./_baseFor'),
    keys = require('./keys');

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"./_baseFor":169,"./keys":348}],171:[function(require,module,exports){
var castPath = require('./_castPath'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./_castPath":203,"./_isKey":268,"./_toKey":306}],172:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

},{"./_arrayPush":154,"./isArray":333}],173:[function(require,module,exports){
var getPrototype = require('./_getPrototype');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
  // that are composed entirely of index properties, return `false` for
  // `hasOwnProperty` checks of them.
  return object != null &&
    (hasOwnProperty.call(object, key) ||
      (typeof object == 'object' && key in object && getPrototype(object) === null));
}

module.exports = baseHas;

},{"./_getPrototype":247}],174:[function(require,module,exports){
/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;

},{}],175:[function(require,module,exports){
var indexOfNaN = require('./_indexOfNaN');

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return indexOfNaN(array, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{"./_indexOfNaN":259}],176:[function(require,module,exports){
var apply = require('./_apply'),
    castPath = require('./_castPath'),
    isKey = require('./_isKey'),
    last = require('./last'),
    parent = require('./_parent'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.invoke` without support for individual
 * method arguments.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the method to invoke.
 * @param {Array} args The arguments to invoke the method with.
 * @returns {*} Returns the result of the invoked method.
 */
function baseInvoke(object, path, args) {
  if (!isKey(path, object)) {
    path = castPath(path);
    object = parent(object, path);
    path = last(path);
  }
  var func = object == null ? object : object[toKey(path)];
  return func == null ? undefined : apply(func, object, args);
}

module.exports = baseInvoke;

},{"./_apply":148,"./_castPath":203,"./_isKey":268,"./_parent":290,"./_toKey":306,"./last":350}],177:[function(require,module,exports){
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObject = require('./isObject'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

module.exports = baseIsEqual;

},{"./_baseIsEqualDeep":178,"./isObject":342,"./isObjectLike":343}],178:[function(require,module,exports){
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isHostObject = require('./_isHostObject'),
    isTypedArray = require('./isTypedArray');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

module.exports = baseIsEqualDeep;

},{"./_Stack":142,"./_equalArrays":234,"./_equalByTag":235,"./_equalObjects":236,"./_getTag":250,"./_isHostObject":265,"./isArray":333,"./isTypedArray":347}],179:[function(require,module,exports){
var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./_Stack":142,"./_baseIsEqual":177}],180:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isHostObject = require('./_isHostObject'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./_isHostObject":265,"./_isMasked":271,"./_toSource":307,"./isFunction":340,"./isObject":342}],181:[function(require,module,exports){
var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;

},{"./_baseMatches":186,"./_baseMatchesProperty":187,"./identity":329,"./isArray":333,"./property":357}],182:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = Object.keys;

/**
 * The base implementation of `_.keys` which doesn't skip the constructor
 * property of prototypes or treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  return nativeKeys(Object(object));
}

module.exports = baseKeys;

},{}],183:[function(require,module,exports){
var Reflect = require('./_Reflect'),
    iteratorToArray = require('./_iteratorToArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var enumerate = Reflect ? Reflect.enumerate : undefined,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * The base implementation of `_.keysIn` which doesn't skip the constructor
 * property of prototypes or treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  object = object == null ? object : Object(object);

  var result = [];
  for (var key in object) {
    result.push(key);
  }
  return result;
}

// Fallback for IE < 9 with es6-shim.
if (enumerate && !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf')) {
  baseKeysIn = function(object) {
    return iteratorToArray(enumerate(object));
  };
}

module.exports = baseKeysIn;

},{"./_Reflect":139,"./_iteratorToArray":274}],184:[function(require,module,exports){
/**
 * The function whose prototype chain sequence wrappers inherit from.
 *
 * @private
 */
function baseLodash() {
  // No operation performed.
}

module.exports = baseLodash;

},{}],185:[function(require,module,exports){
var baseEach = require('./_baseEach'),
    isArrayLike = require('./isArrayLike');

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;

},{"./_baseEach":165,"./isArrayLike":334}],186:[function(require,module,exports){
var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData'),
    matchesStrictComparable = require('./_matchesStrictComparable');

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;

},{"./_baseIsMatch":179,"./_getMatchData":245,"./_matchesStrictComparable":286}],187:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual'),
    get = require('./get'),
    hasIn = require('./hasIn'),
    isKey = require('./_isKey'),
    isStrictComparable = require('./_isStrictComparable'),
    matchesStrictComparable = require('./_matchesStrictComparable'),
    toKey = require('./_toKey');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

module.exports = baseMatchesProperty;

},{"./_baseIsEqual":177,"./_isKey":268,"./_isStrictComparable":273,"./_matchesStrictComparable":286,"./_toKey":306,"./get":326,"./hasIn":328}],188:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    baseMap = require('./_baseMap'),
    baseSortBy = require('./_baseSortBy'),
    baseUnary = require('./_baseUnary'),
    compareMultiple = require('./_compareMultiple'),
    identity = require('./identity');

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  var index = -1;
  iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));

  var result = baseMap(collection, function(value, key, collection) {
    var criteria = arrayMap(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return baseSortBy(result, function(object, other) {
    return compareMultiple(object, other, orders);
  });
}

module.exports = baseOrderBy;

},{"./_arrayMap":153,"./_baseIteratee":181,"./_baseMap":185,"./_baseSortBy":195,"./_baseUnary":199,"./_compareMultiple":214,"./identity":329}],189:[function(require,module,exports){
var arrayReduce = require('./_arrayReduce');

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} props The property identifiers to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, props) {
  object = Object(object);
  return arrayReduce(props, function(result, key) {
    if (key in object) {
      result[key] = object[key];
    }
    return result;
  }, {});
}

module.exports = basePick;

},{"./_arrayReduce":155}],190:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],191:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;

},{"./_baseGet":171}],192:[function(require,module,exports){
/**
 * The base implementation of `_.reduce` and `_.reduceRight`, without support
 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} accumulator The initial value.
 * @param {boolean} initAccum Specify using the first or last element of
 *  `collection` as the initial value.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the accumulated value.
 */
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function(value, index, collection) {
    accumulator = initAccum
      ? (initAccum = false, value)
      : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}

module.exports = baseReduce;

},{}],193:[function(require,module,exports){
var identity = require('./identity'),
    metaMap = require('./_metaMap');

/**
 * The base implementation of `setData` without support for hot loop detection.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var baseSetData = !metaMap ? identity : function(func, data) {
  metaMap.set(func, data);
  return func;
};

module.exports = baseSetData;

},{"./_metaMap":288,"./identity":329}],194:[function(require,module,exports){
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],195:[function(require,module,exports){
/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

module.exports = baseSortBy;

},{}],196:[function(require,module,exports){
var isSymbol = require('./isSymbol');

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295,
    MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeFloor = Math.floor,
    nativeMin = Math.min;

/**
 * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
 * which invokes `iteratee` for `value` and each element of `array` to compute
 * their sort ranking. The iteratee is invoked with one argument; (value).
 *
 * @private
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @param {Function} iteratee The iteratee invoked per element.
 * @param {boolean} [retHighest] Specify returning the highest qualified index.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 */
function baseSortedIndexBy(array, value, iteratee, retHighest) {
  value = iteratee(value);

  var low = 0,
      high = array ? array.length : 0,
      valIsNaN = value !== value,
      valIsNull = value === null,
      valIsSymbol = isSymbol(value),
      valIsUndefined = value === undefined;

  while (low < high) {
    var mid = nativeFloor((low + high) / 2),
        computed = iteratee(array[mid]),
        othIsDefined = computed !== undefined,
        othIsNull = computed === null,
        othIsReflexive = computed === computed,
        othIsSymbol = isSymbol(computed);

    if (valIsNaN) {
      var setLow = retHighest || othIsReflexive;
    } else if (valIsUndefined) {
      setLow = othIsReflexive && (retHighest || othIsDefined);
    } else if (valIsNull) {
      setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
    } else if (valIsSymbol) {
      setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
    } else if (othIsNull || othIsSymbol) {
      setLow = false;
    } else {
      setLow = retHighest ? (computed <= value) : (computed < value);
    }
    if (setLow) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return nativeMin(high, MAX_ARRAY_INDEX);
}

module.exports = baseSortedIndexBy;

},{"./isSymbol":346}],197:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],198:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":143,"./isSymbol":346}],199:[function(require,module,exports){
/**
 * The base implementation of `_.unary` without support for storing wrapper metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],200:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    cacheHas = require('./_cacheHas'),
    createSet = require('./_createSet'),
    setToArray = require('./_setToArray');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;

},{"./_SetCache":141,"./_arrayIncludes":151,"./_arrayIncludesWith":152,"./_cacheHas":202,"./_createSet":232,"./_setToArray":298}],201:[function(require,module,exports){
var arrayMap = require('./_arrayMap');

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;

},{"./_arrayMap":153}],202:[function(require,module,exports){
/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;

},{}],203:[function(require,module,exports){
var isArray = require('./isArray'),
    stringToPath = require('./_stringToPath');

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

module.exports = castPath;

},{"./_stringToPath":305,"./isArray":333}],204:[function(require,module,exports){
/**
 * Checks if `value` is a global object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
 */
function checkGlobal(value) {
  return (value && value.Object === Object) ? value : null;
}

module.exports = checkGlobal;

},{}],205:[function(require,module,exports){
var Uint8Array = require('./_Uint8Array');

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;

},{"./_Uint8Array":144}],206:[function(require,module,exports){
/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

},{}],207:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;

},{"./_cloneArrayBuffer":205}],208:[function(require,module,exports){
var addMapEntry = require('./_addMapEntry'),
    arrayReduce = require('./_arrayReduce'),
    mapToArray = require('./_mapToArray');

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

module.exports = cloneMap;

},{"./_addMapEntry":146,"./_arrayReduce":155,"./_mapToArray":285}],209:[function(require,module,exports){
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;

},{}],210:[function(require,module,exports){
var addSetEntry = require('./_addSetEntry'),
    arrayReduce = require('./_arrayReduce'),
    setToArray = require('./_setToArray');

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

module.exports = cloneSet;

},{"./_addSetEntry":147,"./_arrayReduce":155,"./_setToArray":298}],211:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;

},{"./_Symbol":143}],212:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;

},{"./_cloneArrayBuffer":205}],213:[function(require,module,exports){
var isSymbol = require('./isSymbol');

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

module.exports = compareAscending;

},{"./isSymbol":346}],214:[function(require,module,exports){
var compareAscending = require('./_compareAscending');

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

module.exports = compareMultiple;

},{"./_compareAscending":213}],215:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates an array that is the composition of partially applied arguments,
 * placeholders, and provided arguments into a single array of arguments.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to prepend to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgs(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersLength = holders.length,
      leftIndex = -1,
      leftLength = partials.length,
      rangeLength = nativeMax(argsLength - holdersLength, 0),
      result = Array(leftLength + rangeLength),
      isUncurried = !isCurried;

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[holders[argsIndex]] = args[argsIndex];
    }
  }
  while (rangeLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}

module.exports = composeArgs;

},{}],216:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This function is like `composeArgs` except that the arguments composition
 * is tailored for `_.partialRight`.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to append to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgsRight(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersIndex = -1,
      holdersLength = holders.length,
      rightIndex = -1,
      rightLength = partials.length,
      rangeLength = nativeMax(argsLength - holdersLength, 0),
      result = Array(rangeLength + rightLength),
      isUncurried = !isCurried;

  while (++argsIndex < rangeLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[offset + holders[holdersIndex]] = args[argsIndex++];
    }
  }
  return result;
}

module.exports = composeArgsRight;

},{}],217:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;

},{}],218:[function(require,module,exports){
var assignValue = require('./_assignValue');

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : source[key];

    assignValue(object, key, newValue);
  }
  return object;
}

module.exports = copyObject;

},{"./_assignValue":158}],219:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;

},{"./_copyObject":218,"./_getSymbols":248}],220:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":294}],221:[function(require,module,exports){
/**
 * Gets the number of `placeholder` occurrences in `array`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} placeholder The placeholder to search for.
 * @returns {number} Returns the placeholder count.
 */
function countHolders(array, placeholder) {
  var length = array.length,
      result = 0;

  while (length--) {
    if (array[length] === placeholder) {
      result++;
    }
  }
  return result;
}

module.exports = countHolders;

},{}],222:[function(require,module,exports){
var isIterateeCall = require('./_isIterateeCall'),
    rest = require('./rest');

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return rest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"./_isIterateeCall":267,"./rest":359}],223:[function(require,module,exports){
var isArrayLike = require('./isArrayLike');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./isArrayLike":334}],224:[function(require,module,exports){
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{}],225:[function(require,module,exports){
var createCtorWrapper = require('./_createCtorWrapper'),
    root = require('./_root');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1;

/**
 * Creates a function that wraps `func` to invoke it with the optional `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
 *  for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createBaseWrapper(func, bitmask, thisArg) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtorWrapper(func);

  function wrapper() {
    var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}

module.exports = createBaseWrapper;

},{"./_createCtorWrapper":226,"./_root":294}],226:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    isObject = require('./isObject');

/**
 * Creates a function that produces an instance of `Ctor` regardless of
 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
 *
 * @private
 * @param {Function} Ctor The constructor to wrap.
 * @returns {Function} Returns the new wrapped function.
 */
function createCtorWrapper(Ctor) {
  return function() {
    // Use a `switch` statement to work with class constructors. See
    // http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
    // for more details.
    var args = arguments;
    switch (args.length) {
      case 0: return new Ctor;
      case 1: return new Ctor(args[0]);
      case 2: return new Ctor(args[0], args[1]);
      case 3: return new Ctor(args[0], args[1], args[2]);
      case 4: return new Ctor(args[0], args[1], args[2], args[3]);
      case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
      case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    var thisBinding = baseCreate(Ctor.prototype),
        result = Ctor.apply(thisBinding, args);

    // Mimic the constructor's `return` behavior.
    // See https://es5.github.io/#x13.2.2 for more details.
    return isObject(result) ? result : thisBinding;
  };
}

module.exports = createCtorWrapper;

},{"./_baseCreate":162,"./isObject":342}],227:[function(require,module,exports){
var apply = require('./_apply'),
    createCtorWrapper = require('./_createCtorWrapper'),
    createHybridWrapper = require('./_createHybridWrapper'),
    createRecurryWrapper = require('./_createRecurryWrapper'),
    getHolder = require('./_getHolder'),
    replaceHolders = require('./_replaceHolders'),
    root = require('./_root');

/**
 * Creates a function that wraps `func` to enable currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
 *  for more details.
 * @param {number} arity The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createCurryWrapper(func, bitmask, arity) {
  var Ctor = createCtorWrapper(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length,
        placeholder = getHolder(wrapper);

    while (index--) {
      args[index] = arguments[index];
    }
    var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
      ? []
      : replaceHolders(args, placeholder);

    length -= holders.length;
    if (length < arity) {
      return createRecurryWrapper(
        func, bitmask, createHybridWrapper, wrapper.placeholder, undefined,
        args, holders, undefined, undefined, arity - length);
    }
    var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return apply(fn, this, args);
  }
  return wrapper;
}

module.exports = createCurryWrapper;

},{"./_apply":148,"./_createCtorWrapper":226,"./_createHybridWrapper":229,"./_createRecurryWrapper":231,"./_getHolder":242,"./_replaceHolders":293,"./_root":294}],228:[function(require,module,exports){
var baseIteratee = require('./_baseIteratee'),
    isArrayLike = require('./isArrayLike'),
    keys = require('./keys');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    predicate = baseIteratee(predicate, 3);
    if (!isArrayLike(collection)) {
      var props = keys(collection);
    }
    var index = findIndexFunc(props || collection, function(value, key) {
      if (props) {
        key = value;
        value = iterable[key];
      }
      return predicate(value, key, iterable);
    }, fromIndex);
    return index > -1 ? collection[props ? props[index] : index] : undefined;
  };
}

module.exports = createFind;

},{"./_baseIteratee":181,"./isArrayLike":334,"./keys":348}],229:[function(require,module,exports){
var composeArgs = require('./_composeArgs'),
    composeArgsRight = require('./_composeArgsRight'),
    countHolders = require('./_countHolders'),
    createCtorWrapper = require('./_createCtorWrapper'),
    createRecurryWrapper = require('./_createRecurryWrapper'),
    getHolder = require('./_getHolder'),
    reorder = require('./_reorder'),
    replaceHolders = require('./_replaceHolders'),
    root = require('./_root');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    ARY_FLAG = 128,
    FLIP_FLAG = 512;

/**
 * Creates a function that wraps `func` to invoke it with optional `this`
 * binding of `thisArg`, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
 *  for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided
 *  to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & ARY_FLAG,
      isBind = bitmask & BIND_FLAG,
      isBindKey = bitmask & BIND_KEY_FLAG,
      isCurried = bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG),
      isFlip = bitmask & FLIP_FLAG,
      Ctor = isBindKey ? undefined : createCtorWrapper(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length;

    while (index--) {
      args[index] = arguments[index];
    }
    if (isCurried) {
      var placeholder = getHolder(wrapper),
          holdersCount = countHolders(args, placeholder);
    }
    if (partials) {
      args = composeArgs(args, partials, holders, isCurried);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
    }
    length -= holdersCount;
    if (isCurried && length < arity) {
      var newHolders = replaceHolders(args, placeholder);
      return createRecurryWrapper(
        func, bitmask, createHybridWrapper, wrapper.placeholder, thisArg,
        args, newHolders, argPos, ary, arity - length
      );
    }
    var thisBinding = isBind ? thisArg : this,
        fn = isBindKey ? thisBinding[func] : func;

    length = args.length;
    if (argPos) {
      args = reorder(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }
    if (isAry && ary < length) {
      args.length = ary;
    }
    if (this && this !== root && this instanceof wrapper) {
      fn = Ctor || createCtorWrapper(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

module.exports = createHybridWrapper;

},{"./_composeArgs":215,"./_composeArgsRight":216,"./_countHolders":221,"./_createCtorWrapper":226,"./_createRecurryWrapper":231,"./_getHolder":242,"./_reorder":292,"./_replaceHolders":293,"./_root":294}],230:[function(require,module,exports){
var apply = require('./_apply'),
    createCtorWrapper = require('./_createCtorWrapper'),
    root = require('./_root');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1;

/**
 * Creates a function that wraps `func` to invoke it with the `this` binding
 * of `thisArg` and `partials` prepended to the arguments it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
 *  for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to
 *  the new function.
 * @returns {Function} Returns the new wrapped function.
 */
function createPartialWrapper(func, bitmask, thisArg, partials) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtorWrapper(func);

  function wrapper() {
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(leftLength + argsLength),
        fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return apply(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}

module.exports = createPartialWrapper;

},{"./_apply":148,"./_createCtorWrapper":226,"./_root":294}],231:[function(require,module,exports){
var isLaziable = require('./_isLaziable'),
    setData = require('./_setData');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_BOUND_FLAG = 4,
    CURRY_FLAG = 8,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64;

/**
 * Creates a function that wraps `func` to continue currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
 *  for more details.
 * @param {Function} wrapFunc The function to create the `func` wrapper.
 * @param {*} placeholder The placeholder value.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createRecurryWrapper(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & CURRY_FLAG,
      newHolders = isCurry ? holders : undefined,
      newHoldersRight = isCurry ? undefined : holders,
      newPartials = isCurry ? partials : undefined,
      newPartialsRight = isCurry ? undefined : partials;

  bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
  bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

  if (!(bitmask & CURRY_BOUND_FLAG)) {
    bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
  }
  var newData = [
    func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
    newHoldersRight, argPos, ary, arity
  ];

  var result = wrapFunc.apply(undefined, newData);
  if (isLaziable(func)) {
    setData(result, newData);
  }
  result.placeholder = placeholder;
  return result;
}

module.exports = createRecurryWrapper;

},{"./_isLaziable":270,"./_setData":297}],232:[function(require,module,exports){
var Set = require('./_Set'),
    noop = require('./noop'),
    setToArray = require('./_setToArray');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

module.exports = createSet;

},{"./_Set":140,"./_setToArray":298,"./noop":352}],233:[function(require,module,exports){
var baseSetData = require('./_baseSetData'),
    createBaseWrapper = require('./_createBaseWrapper'),
    createCurryWrapper = require('./_createCurryWrapper'),
    createHybridWrapper = require('./_createHybridWrapper'),
    createPartialWrapper = require('./_createPartialWrapper'),
    getData = require('./_getData'),
    mergeData = require('./_mergeData'),
    setData = require('./_setData'),
    toInteger = require('./toInteger');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask of wrapper flags.
 *  The bitmask may be composed of the following flags:
 *     1 - `_.bind`
 *     2 - `_.bindKey`
 *     4 - `_.curry` or `_.curryRight` of a bound function
 *     8 - `_.curry`
 *    16 - `_.curryRight`
 *    32 - `_.partial`
 *    64 - `_.partialRight`
 *   128 - `_.rearg`
 *   256 - `_.ary`
 *   512 - `_.flip`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & BIND_KEY_FLAG;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
    partials = holders = undefined;
  }
  ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
  arity = arity === undefined ? arity : toInteger(arity);
  length -= holders ? holders.length : 0;

  if (bitmask & PARTIAL_RIGHT_FLAG) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = undefined;
  }
  var data = isBindKey ? undefined : getData(func);

  var newData = [
    func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
    argPos, ary, arity
  ];

  if (data) {
    mergeData(newData, data);
  }
  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] == null
    ? (isBindKey ? 0 : func.length)
    : nativeMax(newData[9] - length, 0);

  if (!arity && bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG)) {
    bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG);
  }
  if (!bitmask || bitmask == BIND_FLAG) {
    var result = createBaseWrapper(func, bitmask, thisArg);
  } else if (bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG) {
    result = createCurryWrapper(func, bitmask, arity);
  } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !holders.length) {
    result = createPartialWrapper(func, bitmask, thisArg, partials);
  } else {
    result = createHybridWrapper.apply(undefined, newData);
  }
  var setter = data ? baseSetData : setData;
  return setter(result, newData);
}

module.exports = createWrapper;

},{"./_baseSetData":193,"./_createBaseWrapper":225,"./_createCurryWrapper":227,"./_createHybridWrapper":229,"./_createPartialWrapper":230,"./_getData":240,"./_mergeData":287,"./_setData":297,"./toInteger":367}],234:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

  stack.set(array, other);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  return result;
}

module.exports = equalArrays;

},{"./_SetCache":141,"./_arraySome":156}],235:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
      // Coerce dates and booleans to numbers, dates to milliseconds and
      // booleans to `1` or `0` treating invalid dates coerced to `NaN` as
      // not equal.
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      // Treat `NaN` vs. `NaN` as equal.
      return (object != +object) ? other != +other : object == +other;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/6.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;
      stack.set(object, other);

      // Recursively compare objects (susceptible to call stack limits).
      return equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

},{"./_Symbol":143,"./_Uint8Array":144,"./_equalArrays":234,"./_mapToArray":285,"./_setToArray":298}],236:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    keys = require('./keys');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : baseHas(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  return result;
}

module.exports = equalObjects;

},{"./_baseHas":173,"./keys":348}],237:[function(require,module,exports){
/** Used to map characters to HTML entities. */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;'
};

/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeHtmlChar(chr) {
  return htmlEscapes[chr];
}

module.exports = escapeHtmlChar;

},{}],238:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

},{"./_baseGetAllKeys":172,"./_getSymbols":248,"./keys":348}],239:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbolsIn = require('./_getSymbolsIn'),
    keysIn = require('./keysIn');

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;

},{"./_baseGetAllKeys":172,"./_getSymbolsIn":249,"./keysIn":349}],240:[function(require,module,exports){
var metaMap = require('./_metaMap'),
    noop = require('./noop');

/**
 * Gets metadata for `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {*} Returns the metadata for `func`.
 */
var getData = !metaMap ? noop : function(func) {
  return metaMap.get(func);
};

module.exports = getData;

},{"./_metaMap":288,"./noop":352}],241:[function(require,module,exports){
var realNames = require('./_realNames');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the name of `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {string} Returns the function name.
 */
function getFuncName(func) {
  var result = (func.name + ''),
      array = realNames[result],
      length = hasOwnProperty.call(realNames, result) ? array.length : 0;

  while (length--) {
    var data = array[length],
        otherFunc = data.func;
    if (otherFunc == null || otherFunc == func) {
      return data.name;
    }
  }
  return result;
}

module.exports = getFuncName;

},{"./_realNames":291}],242:[function(require,module,exports){
/**
 * Gets the argument placeholder value for `func`.
 *
 * @private
 * @param {Function} func The function to inspect.
 * @returns {*} Returns the placeholder value.
 */
function getHolder(func) {
  var object = func;
  return object.placeholder;
}

module.exports = getHolder;

},{}],243:[function(require,module,exports){
var baseProperty = require('./_baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a
 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
 * Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./_baseProperty":190}],244:[function(require,module,exports){
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

},{"./_isKeyable":269}],245:[function(require,module,exports){
var isStrictComparable = require('./_isStrictComparable'),
    keys = require('./keys');

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;

},{"./_isStrictComparable":273,"./keys":348}],246:[function(require,module,exports){
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":180,"./_getValue":251}],247:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetPrototype = Object.getPrototypeOf;

/**
 * Gets the `[[Prototype]]` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {null|Object} Returns the `[[Prototype]]`.
 */
function getPrototype(value) {
  return nativeGetPrototype(Object(value));
}

module.exports = getPrototype;

},{}],248:[function(require,module,exports){
var stubArray = require('./stubArray');

/** Built-in value references. */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
function getSymbols(object) {
  // Coerce `object` to an object to avoid non-object errors in V8.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=3443 for more details.
  return getOwnPropertySymbols(Object(object));
}

// Fallback for IE < 11.
if (!getOwnPropertySymbols) {
  getSymbols = stubArray;
}

module.exports = getSymbols;

},{"./stubArray":363}],249:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    getPrototype = require('./_getPrototype'),
    getSymbols = require('./_getSymbols');

/** Built-in value references. */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbol properties
 * of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !getOwnPropertySymbols ? getSymbols : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;

},{"./_arrayPush":154,"./_getPrototype":247,"./_getSymbols":248}],250:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function getTag(value) {
  return objectToString.call(value);
}

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":131,"./_Map":136,"./_Promise":138,"./_Set":140,"./_WeakMap":145,"./_toSource":307}],251:[function(require,module,exports){
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],252:[function(require,module,exports){
var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isKey = require('./_isKey'),
    isLength = require('./isLength'),
    isString = require('./isString'),
    toKey = require('./_toKey');

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isString(object) || isArguments(object));
}

module.exports = hasPath;

},{"./_castPath":203,"./_isIndex":266,"./_isKey":268,"./_toKey":306,"./isArguments":332,"./isArray":333,"./isLength":341,"./isString":345}],253:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

module.exports = hashClear;

},{"./_nativeCreate":289}],254:[function(require,module,exports){
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

module.exports = hashDelete;

},{}],255:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":289}],256:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":289}],257:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":289}],258:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isLength = require('./isLength'),
    isString = require('./isString');

/**
 * Creates an array of index keys for `object` values of arrays,
 * `arguments` objects, and strings, otherwise `null` is returned.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array|null} Returns index keys, else `null`.
 */
function indexKeys(object) {
  var length = object ? object.length : undefined;
  if (isLength(length) &&
      (isArray(object) || isString(object) || isArguments(object))) {
    return baseTimes(length, String);
  }
  return null;
}

module.exports = indexKeys;

},{"./_baseTimes":197,"./isArguments":332,"./isArray":333,"./isLength":341,"./isString":345}],259:[function(require,module,exports){
/**
 * Gets the index at which the first occurrence of `NaN` is found in `array`.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
 */
function indexOfNaN(array, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    var other = array[index];
    if (other !== other) {
      return index;
    }
  }
  return -1;
}

module.exports = indexOfNaN;

},{}],260:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],261:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneMap = require('./_cloneMap'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSet = require('./_cloneSet'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;

},{"./_cloneArrayBuffer":205,"./_cloneDataView":207,"./_cloneMap":208,"./_cloneRegExp":209,"./_cloneSet":210,"./_cloneSymbol":211,"./_cloneTypedArray":212}],262:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    getPrototype = require('./_getPrototype'),
    isPrototype = require('./_isPrototype');

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;

},{"./_baseCreate":162,"./_getPrototype":247,"./_isPrototype":272}],263:[function(require,module,exports){
var isArguments = require('./isArguments'),
    isArray = require('./isArray');

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value);
}

module.exports = isFlattenable;

},{"./isArguments":332,"./isArray":333}],264:[function(require,module,exports){
var isArray = require('./isArray'),
    isFunction = require('./isFunction');

/**
 * Checks if `value` is a flattenable array and not a `_.matchesProperty`
 * iteratee shorthand.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenableIteratee(value) {
  return isArray(value) && !(value.length == 2 && !isFunction(value[0]));
}

module.exports = isFlattenableIteratee;

},{"./isArray":333,"./isFunction":340}],265:[function(require,module,exports){
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

module.exports = isHostObject;

},{}],266:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],267:[function(require,module,exports){
var eq = require('./eq'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject');

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;

},{"./_isIndex":266,"./eq":318,"./isArrayLike":334,"./isObject":342}],268:[function(require,module,exports){
var isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;

},{"./isArray":333,"./isSymbol":346}],269:[function(require,module,exports){
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],270:[function(require,module,exports){
var LazyWrapper = require('./_LazyWrapper'),
    getData = require('./_getData'),
    getFuncName = require('./_getFuncName'),
    lodash = require('./wrapperLodash');

/**
 * Checks if `func` has a lazy counterpart.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
 *  else `false`.
 */
function isLaziable(func) {
  var funcName = getFuncName(func),
      other = lodash[funcName];

  if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
    return false;
  }
  if (func === other) {
    return true;
  }
  var data = getData(other);
  return !!data && func === data[0];
}

module.exports = isLaziable;

},{"./_LazyWrapper":133,"./_getData":240,"./_getFuncName":241,"./wrapperLodash":373}],271:[function(require,module,exports){
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":220}],272:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],273:[function(require,module,exports){
var isObject = require('./isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"./isObject":342}],274:[function(require,module,exports){
/**
 * Converts `iterator` to an array.
 *
 * @private
 * @param {Object} iterator The iterator to convert.
 * @returns {Array} Returns the converted array.
 */
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

module.exports = iteratorToArray;

},{}],275:[function(require,module,exports){
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

module.exports = listCacheClear;

},{}],276:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":159}],277:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

},{"./_assocIndexOf":159}],278:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

},{"./_assocIndexOf":159}],279:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":159}],280:[function(require,module,exports){
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":132,"./_ListCache":134,"./_Map":136}],281:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

module.exports = mapCacheDelete;

},{"./_getMapData":244}],282:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

},{"./_getMapData":244}],283:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

},{"./_getMapData":244}],284:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":244}],285:[function(require,module,exports){
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

},{}],286:[function(require,module,exports){
/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;

},{}],287:[function(require,module,exports){
var composeArgs = require('./_composeArgs'),
    composeArgsRight = require('./_composeArgsRight'),
    replaceHolders = require('./_replaceHolders');

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_BOUND_FLAG = 4,
    CURRY_FLAG = 8,
    ARY_FLAG = 128,
    REARG_FLAG = 256;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Merges the function metadata of `source` into `data`.
 *
 * Merging metadata reduces the number of wrappers used to invoke a function.
 * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
 * may be applied regardless of execution order. Methods like `_.ary` and
 * `_.rearg` modify function arguments, making the order in which they are
 * executed important, preventing the merging of metadata. However, we make
 * an exception for a safe combined case where curried functions have `_.ary`
 * and or `_.rearg` applied.
 *
 * @private
 * @param {Array} data The destination metadata.
 * @param {Array} source The source metadata.
 * @returns {Array} Returns `data`.
 */
function mergeData(data, source) {
  var bitmask = data[1],
      srcBitmask = source[1],
      newBitmask = bitmask | srcBitmask,
      isCommon = newBitmask < (BIND_FLAG | BIND_KEY_FLAG | ARY_FLAG);

  var isCombo =
    ((srcBitmask == ARY_FLAG) && (bitmask == CURRY_FLAG)) ||
    ((srcBitmask == ARY_FLAG) && (bitmask == REARG_FLAG) && (data[7].length <= source[8])) ||
    ((srcBitmask == (ARY_FLAG | REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == CURRY_FLAG));

  // Exit early if metadata can't be merged.
  if (!(isCommon || isCombo)) {
    return data;
  }
  // Use source `thisArg` if available.
  if (srcBitmask & BIND_FLAG) {
    data[2] = source[2];
    // Set when currying a bound function.
    newBitmask |= bitmask & BIND_FLAG ? 0 : CURRY_BOUND_FLAG;
  }
  // Compose partial arguments.
  var value = source[3];
  if (value) {
    var partials = data[3];
    data[3] = partials ? composeArgs(partials, value, source[4]) : value;
    data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
  }
  // Compose partial right arguments.
  value = source[5];
  if (value) {
    partials = data[5];
    data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
    data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
  }
  // Use source `argPos` if available.
  value = source[7];
  if (value) {
    data[7] = value;
  }
  // Use source `ary` if it's smaller.
  if (srcBitmask & ARY_FLAG) {
    data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
  }
  // Use source `arity` if one is not provided.
  if (data[9] == null) {
    data[9] = source[9];
  }
  // Use source `func` and merge bitmasks.
  data[0] = source[0];
  data[1] = newBitmask;

  return data;
}

module.exports = mergeData;

},{"./_composeArgs":215,"./_composeArgsRight":216,"./_replaceHolders":293}],288:[function(require,module,exports){
var WeakMap = require('./_WeakMap');

/** Used to store function metadata. */
var metaMap = WeakMap && new WeakMap;

module.exports = metaMap;

},{"./_WeakMap":145}],289:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":246}],290:[function(require,module,exports){
var baseGet = require('./_baseGet'),
    baseSlice = require('./_baseSlice');

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
}

module.exports = parent;

},{"./_baseGet":171,"./_baseSlice":194}],291:[function(require,module,exports){
/** Used to lookup unminified function names. */
var realNames = {};

module.exports = realNames;

},{}],292:[function(require,module,exports){
var copyArray = require('./_copyArray'),
    isIndex = require('./_isIndex');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Reorder `array` according to the specified indexes where the element at
 * the first index is assigned as the first element, the element at
 * the second index is assigned as the second element, and so on.
 *
 * @private
 * @param {Array} array The array to reorder.
 * @param {Array} indexes The arranged array indexes.
 * @returns {Array} Returns `array`.
 */
function reorder(array, indexes) {
  var arrLength = array.length,
      length = nativeMin(indexes.length, arrLength),
      oldArray = copyArray(array);

  while (length--) {
    var index = indexes[length];
    array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
  }
  return array;
}

module.exports = reorder;

},{"./_copyArray":217,"./_isIndex":266}],293:[function(require,module,exports){
/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value === placeholder || value === PLACEHOLDER) {
      array[index] = PLACEHOLDER;
      result[resIndex++] = index;
    }
  }
  return result;
}

module.exports = replaceHolders;

},{}],294:[function(require,module,exports){
(function (global){
var checkGlobal = require('./_checkGlobal');

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal(typeof global == 'object' && global);

/** Detect free variable `self`. */
var freeSelf = checkGlobal(typeof self == 'object' && self);

/** Detect `this` as the global object. */
var thisGlobal = checkGlobal(typeof this == 'object' && this);

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

module.exports = root;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_checkGlobal":204}],295:[function(require,module,exports){
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;

},{}],296:[function(require,module,exports){
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;

},{}],297:[function(require,module,exports){
var baseSetData = require('./_baseSetData'),
    now = require('./now');

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 150,
    HOT_SPAN = 16;

/**
 * Sets metadata for `func`.
 *
 * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
 * period of time, it will trip its breaker and transition to an identity
 * function to avoid garbage collection pauses in V8. See
 * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
 * for more details.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var setData = (function() {
  var count = 0,
      lastCalled = 0;

  return function(key, value) {
    var stamp = now(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return key;
      }
    } else {
      count = 0;
    }
    return baseSetData(key, value);
  };
}());

module.exports = setData;

},{"./_baseSetData":193,"./now":353}],298:[function(require,module,exports){
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

},{}],299:[function(require,module,exports){
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

module.exports = stackClear;

},{"./_ListCache":134}],300:[function(require,module,exports){
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

module.exports = stackDelete;

},{}],301:[function(require,module,exports){
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

},{}],302:[function(require,module,exports){
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

},{}],303:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache && cache.__data__.length == LARGE_ARRAY_SIZE) {
    cache = this.__data__ = new MapCache(cache.__data__);
  }
  cache.set(key, value);
  return this;
}

module.exports = stackSet;

},{"./_ListCache":134,"./_MapCache":137}],304:[function(require,module,exports){
/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0',
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reComplexSymbol = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return string.match(reComplexSymbol);
}

module.exports = stringToArray;

},{}],305:[function(require,module,exports){
var memoize = require('./memoize'),
    toString = require('./toString');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  var result = [];
  toString(string).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;

},{"./memoize":351,"./toString":369}],306:[function(require,module,exports){
var isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;

},{"./isSymbol":346}],307:[function(require,module,exports){
/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],308:[function(require,module,exports){
var LazyWrapper = require('./_LazyWrapper'),
    LodashWrapper = require('./_LodashWrapper'),
    copyArray = require('./_copyArray');

/**
 * Creates a clone of `wrapper`.
 *
 * @private
 * @param {Object} wrapper The wrapper to clone.
 * @returns {Object} Returns the cloned wrapper.
 */
function wrapperClone(wrapper) {
  if (wrapper instanceof LazyWrapper) {
    return wrapper.clone();
  }
  var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
  result.__actions__ = copyArray(wrapper.__actions__);
  result.__index__  = wrapper.__index__;
  result.__values__ = wrapper.__values__;
  return result;
}

module.exports = wrapperClone;

},{"./_LazyWrapper":133,"./_LodashWrapper":135,"./_copyArray":217}],309:[function(require,module,exports){
var assignValue = require('./_assignValue'),
    copyObject = require('./_copyObject'),
    createAssigner = require('./_createAssigner'),
    isArrayLike = require('./isArrayLike'),
    isPrototype = require('./_isPrototype'),
    keys = require('./keys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

/**
 * Assigns own enumerable string keyed properties of source objects to the
 * destination object. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assignIn
 * @example
 *
 * function Foo() {
 *   this.c = 3;
 * }
 *
 * function Bar() {
 *   this.e = 5;
 * }
 *
 * Foo.prototype.d = 4;
 * Bar.prototype.f = 6;
 *
 * _.assign({ 'a': 1 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3, 'e': 5 }
 */
var assign = createAssigner(function(object, source) {
  if (nonEnumShadows || isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});

module.exports = assign;

},{"./_assignValue":158,"./_copyObject":218,"./_createAssigner":222,"./_isPrototype":272,"./isArrayLike":334,"./keys":348}],310:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    createAssigner = require('./_createAssigner'),
    keysIn = require('./keysIn');

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

module.exports = assignInWith;

},{"./_copyObject":218,"./_createAssigner":222,"./keysIn":349}],311:[function(require,module,exports){
var toInteger = require('./toInteger');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it's called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery(element).on('click', _.before(5, addContactToList));
 * // => allows adding up to 4 contacts to the list
 */
function before(n, func) {
  var result;
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  n = toInteger(n);
  return function() {
    if (--n > 0) {
      result = func.apply(this, arguments);
    }
    if (n <= 1) {
      func = undefined;
    }
    return result;
  };
}

module.exports = before;

},{"./toInteger":367}],312:[function(require,module,exports){
var createWrapper = require('./_createWrapper'),
    getHolder = require('./_getHolder'),
    replaceHolders = require('./_replaceHolders'),
    rest = require('./rest');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    PARTIAL_FLAG = 32;

/**
 * Creates a function that invokes `func` with the `this` binding of `thisArg`
 * and `partials` prepended to the arguments it receives.
 *
 * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for partially applied arguments.
 *
 * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
 * property of bound functions.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var greet = function(greeting, punctuation) {
 *   return greeting + ' ' + this.user + punctuation;
 * };
 *
 * var object = { 'user': 'fred' };
 *
 * var bound = _.bind(greet, object, 'hi');
 * bound('!');
 * // => 'hi fred!'
 *
 * // Bound with placeholders.
 * var bound = _.bind(greet, object, _, '!');
 * bound('hi');
 * // => 'hi fred!'
 */
var bind = rest(function(func, thisArg, partials) {
  var bitmask = BIND_FLAG;
  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bind));
    bitmask |= PARTIAL_FLAG;
  }
  return createWrapper(func, bitmask, thisArg, partials, holders);
});

// Assign default placeholders.
bind.placeholder = {};

module.exports = bind;

},{"./_createWrapper":233,"./_getHolder":242,"./_replaceHolders":293,"./rest":359}],313:[function(require,module,exports){
var baseClone = require('./_baseClone');

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, false, true);
}

module.exports = clone;

},{"./_baseClone":161}],314:[function(require,module,exports){
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide an options object to indicate whether `func` should be invoked on
 * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent calls
 * to the debounced function return the result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
 * on the trailing edge of the timeout only if the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;

},{"./isObject":342,"./now":353,"./toNumber":368}],315:[function(require,module,exports){
var apply = require('./_apply'),
    assignInDefaults = require('./_assignInDefaults'),
    assignInWith = require('./assignInWith'),
    rest = require('./rest');

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var defaults = rest(function(args) {
  args.push(undefined, assignInDefaults);
  return apply(assignInWith, undefined, args);
});

module.exports = defaults;

},{"./_apply":148,"./_assignInDefaults":157,"./assignInWith":310,"./rest":359}],316:[function(require,module,exports){
var baseDelay = require('./_baseDelay'),
    rest = require('./rest');

/**
 * Defers invoking the `func` until the current call stack has cleared. Any
 * additional arguments are provided to `func` when it's invoked.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to defer.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * _.defer(function(text) {
 *   console.log(text);
 * }, 'deferred');
 * // => Logs 'deferred' after one or more milliseconds.
 */
var defer = rest(function(func, args) {
  return baseDelay(func, 1, args);
});

module.exports = defer;

},{"./_baseDelay":163,"./rest":359}],317:[function(require,module,exports){
var baseDifference = require('./_baseDifference'),
    baseFlatten = require('./_baseFlatten'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    rest = require('./rest');

/**
 * Creates an array of unique `array` values not included in the other given
 * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons. The order of result values is determined by the
 * order they occur in the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.without, _.xor
 * @example
 *
 * _.difference([2, 1], [2, 3]);
 * // => [1]
 */
var difference = rest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
});

module.exports = difference;

},{"./_baseDifference":164,"./_baseFlatten":168,"./isArrayLikeObject":335,"./rest":359}],318:[function(require,module,exports){
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],319:[function(require,module,exports){
var escapeHtmlChar = require('./_escapeHtmlChar'),
    toString = require('./toString');

/** Used to match HTML entities and HTML characters. */
var reUnescapedHtml = /[&<>"'`]/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

/**
 * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
 * their corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional
 * characters use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't need escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value. See
 * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * Backticks are escaped because in IE < 9, they can break out of
 * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
 * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
 * [#133](https://html5sec.org/#133) of the
 * [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
 *
 * When working with HTML you should always
 * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
 * XSS vectors.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('fred, barney, & pebbles');
 * // => 'fred, barney, &amp; pebbles'
 */
function escape(string) {
  string = toString(string);
  return (string && reHasUnescapedHtml.test(string))
    ? string.replace(reUnescapedHtml, escapeHtmlChar)
    : string;
}

module.exports = escape;

},{"./_escapeHtmlChar":237,"./toString":369}],320:[function(require,module,exports){
var arrayEvery = require('./_arrayEvery'),
    baseEvery = require('./_baseEvery'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray'),
    isIterateeCall = require('./_isIterateeCall');

/**
 * Checks if `predicate` returns truthy for **all** elements of `collection`.
 * Iteration is stopped once `predicate` returns falsey. The predicate is
 * invoked with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array|Function|Object|string} [predicate=_.identity]
 *  The function invoked per iteration.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`.
 * @example
 *
 * _.every([true, 1, null, 'yes'], Boolean);
 * // => false
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': false },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.every(users, { 'user': 'barney', 'active': false });
 * // => false
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.every(users, ['active', false]);
 * // => true
 *
 * // The `_.property` iteratee shorthand.
 * _.every(users, 'active');
 * // => false
 */
function every(collection, predicate, guard) {
  var func = isArray(collection) ? arrayEvery : baseEvery;
  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = every;

},{"./_arrayEvery":150,"./_baseEvery":166,"./_baseIteratee":181,"./_isIterateeCall":267,"./isArray":333}],321:[function(require,module,exports){
var createFind = require('./_createFind'),
    findIndex = require('./findIndex');

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to search.
 * @param {Array|Function|Object|string} [predicate=_.identity]
 *  The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

module.exports = find;

},{"./_createFind":228,"./findIndex":322}],322:[function(require,module,exports){
var baseFindIndex = require('./_baseFindIndex'),
    baseIteratee = require('./_baseIteratee'),
    toInteger = require('./toInteger');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to search.
 * @param {Array|Function|Object|string} [predicate=_.identity]
 *  The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array ? array.length : 0;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;

},{"./_baseFindIndex":167,"./_baseIteratee":181,"./toInteger":367}],323:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten');

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array ? array.length : 0;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;

},{"./_baseFlatten":168}],324:[function(require,module,exports){
var arrayEach = require('./_arrayEach'),
    baseEach = require('./_baseEach'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _([1, 2]).forEach(function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = forEach;

},{"./_arrayEach":149,"./_baseEach":165,"./_baseIteratee":181,"./isArray":333}],325:[function(require,module,exports){
var baseForOwn = require('./_baseForOwn'),
    baseIteratee = require('./_baseIteratee');

/**
 * Iterates over own enumerable string keyed properties of an object and
 * invokes `iteratee` for each property. The iteratee is invoked with three
 * arguments: (value, key, object). Iteratee functions may exit iteration
 * early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 0.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forOwnRight
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forOwn(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forOwn(object, iteratee) {
  return object && baseForOwn(object, baseIteratee(iteratee, 3));
}

module.exports = forOwn;

},{"./_baseForOwn":170,"./_baseIteratee":181}],326:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is used in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

},{"./_baseGet":171}],327:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

module.exports = has;

},{"./_baseHas":173,"./_hasPath":252}],328:[function(require,module,exports){
var baseHasIn = require('./_baseHasIn'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;

},{"./_baseHasIn":174,"./_hasPath":252}],329:[function(require,module,exports){
/**
 * This method returns the first argument given to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],330:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf'),
    isArrayLike = require('./isArrayLike'),
    isString = require('./isString'),
    toInteger = require('./toInteger'),
    values = require('./values');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to search.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
 * // => true
 *
 * _.includes('pebbles', 'eb');
 * // => true
 */
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }
  return isString(collection)
    ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
    : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
}

module.exports = includes;

},{"./_baseIndexOf":175,"./isArrayLike":334,"./isString":345,"./toInteger":367,"./values":372}],331:[function(require,module,exports){
var apply = require('./_apply'),
    baseEach = require('./_baseEach'),
    baseInvoke = require('./_baseInvoke'),
    isArrayLike = require('./isArrayLike'),
    isKey = require('./_isKey'),
    rest = require('./rest');

/**
 * Invokes the method at `path` of each element in `collection`, returning
 * an array of the results of each invoked method. Any additional arguments
 * are provided to each invoked method. If `methodName` is a function, it's
 * invoked for and `this` bound to, each element in `collection`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array|Function|string} path The path of the method to invoke or
 *  the function invoked per iteration.
 * @param {...*} [args] The arguments to invoke each method with.
 * @returns {Array} Returns the array of results.
 * @example
 *
 * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
 * // => [[1, 5, 7], [1, 2, 3]]
 *
 * _.invokeMap([123, 456], String.prototype.split, '');
 * // => [['1', '2', '3'], ['4', '5', '6']]
 */
var invokeMap = rest(function(collection, path, args) {
  var index = -1,
      isFunc = typeof path == 'function',
      isProp = isKey(path),
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value) {
    var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
    result[++index] = func ? apply(func, value, args) : baseInvoke(value, path, args);
  });
  return result;
});

module.exports = invokeMap;

},{"./_apply":148,"./_baseEach":165,"./_baseInvoke":176,"./_isKey":268,"./isArrayLike":334,"./rest":359}],332:[function(require,module,exports){
var isArrayLikeObject = require('./isArrayLikeObject');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

module.exports = isArguments;

},{"./isArrayLikeObject":335}],333:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @type {Function}
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],334:[function(require,module,exports){
var getLength = require('./_getLength'),
    isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value)) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./_getLength":243,"./isFunction":340,"./isLength":341}],335:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;

},{"./isArrayLike":334,"./isObjectLike":343}],336:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = !Buffer ? stubFalse : function(value) {
  return value instanceof Buffer;
};

module.exports = isBuffer;

},{"./_root":294,"./stubFalse":364}],337:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var dateTag = '[object Date]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Date` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isDate(new Date);
 * // => true
 *
 * _.isDate('Mon April 23 2012');
 * // => false
 */
function isDate(value) {
  return isObjectLike(value) && objectToString.call(value) == dateTag;
}

module.exports = isDate;

},{"./isObjectLike":343}],338:[function(require,module,exports){
var getTag = require('./_getTag'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLike = require('./isArrayLike'),
    isBuffer = require('./isBuffer'),
    isFunction = require('./isFunction'),
    isObjectLike = require('./isObjectLike'),
    isString = require('./isString'),
    keys = require('./keys');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (isArrayLike(value) &&
      (isArray(value) || isString(value) || isFunction(value.splice) ||
        isArguments(value) || isBuffer(value))) {
    return !value.length;
  }
  if (isObjectLike(value)) {
    var tag = getTag(value);
    if (tag == mapTag || tag == setTag) {
      return !value.size;
    }
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return !(nonEnumShadows && keys(value).length);
}

module.exports = isEmpty;

},{"./_getTag":250,"./isArguments":332,"./isArray":333,"./isArrayLike":334,"./isBuffer":336,"./isFunction":340,"./isObjectLike":343,"./isString":345,"./keys":348}],339:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual');

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are **not** supported.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent,
 *  else `false`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

module.exports = isEqual;

},{"./_baseIsEqual":177}],340:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

module.exports = isFunction;

},{"./isObject":342}],341:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length,
 *  else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],342:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],343:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],344:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var regexpTag = '[object RegExp]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `RegExp` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isRegExp(/abc/);
 * // => true
 *
 * _.isRegExp('/abc/');
 * // => false
 */
function isRegExp(value) {
  return isObject(value) && objectToString.call(value) == regexpTag;
}

module.exports = isRegExp;

},{"./isObject":342}],345:[function(require,module,exports){
var isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
}

module.exports = isString;

},{"./isArray":333,"./isObjectLike":343}],346:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

module.exports = isSymbol;

},{"./isObjectLike":343}],347:[function(require,module,exports){
var isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

module.exports = isTypedArray;

},{"./isLength":341,"./isObjectLike":343}],348:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    baseKeys = require('./_baseKeys'),
    indexKeys = require('./_indexKeys'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isPrototype = require('./_isPrototype');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  var isProto = isPrototype(object);
  if (!(isProto || isArrayLike(object))) {
    return baseKeys(object);
  }
  var indexes = indexKeys(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  for (var key in object) {
    if (baseHas(object, key) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(isProto && key == 'constructor')) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;

},{"./_baseHas":173,"./_baseKeys":182,"./_indexKeys":258,"./_isIndex":266,"./_isPrototype":272,"./isArrayLike":334}],349:[function(require,module,exports){
var baseKeysIn = require('./_baseKeysIn'),
    indexKeys = require('./_indexKeys'),
    isIndex = require('./_isIndex'),
    isPrototype = require('./_isPrototype');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  var index = -1,
      isProto = isPrototype(object),
      props = baseKeysIn(object),
      propsLength = props.length,
      indexes = indexKeys(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  while (++index < propsLength) {
    var key = props[index];
    if (!(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"./_baseKeysIn":183,"./_indexKeys":258,"./_isIndex":266,"./_isPrototype":272}],350:[function(require,module,exports){
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

},{}],351:[function(require,module,exports){
var MapCache = require('./_MapCache');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

module.exports = memoize;

},{"./_MapCache":137}],352:[function(require,module,exports){
/**
 * A method that returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;

},{}],353:[function(require,module,exports){
/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
function now() {
  return Date.now();
}

module.exports = now;

},{}],354:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseDifference = require('./_baseDifference'),
    baseFlatten = require('./_baseFlatten'),
    basePick = require('./_basePick'),
    getAllKeysIn = require('./_getAllKeysIn'),
    rest = require('./rest'),
    toKey = require('./_toKey');

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable string keyed properties of `object` that are
 * not omitted.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [props] The property identifiers to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = rest(function(object, props) {
  if (object == null) {
    return {};
  }
  props = arrayMap(baseFlatten(props, 1), toKey);
  return basePick(object, baseDifference(getAllKeysIn(object), props));
});

module.exports = omit;

},{"./_arrayMap":153,"./_baseDifference":164,"./_baseFlatten":168,"./_basePick":189,"./_getAllKeysIn":239,"./_toKey":306,"./rest":359}],355:[function(require,module,exports){
var before = require('./before');

/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls
 * to the function return the value of the first invocation. The `func` is
 * invoked with the `this` binding and arguments of the created function.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // `initialize` invokes `createApplication` once
 */
function once(func) {
  return before(2, func);
}

module.exports = once;

},{"./before":311}],356:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseFlatten = require('./_baseFlatten'),
    basePick = require('./_basePick'),
    rest = require('./rest'),
    toKey = require('./_toKey');

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [props] The property identifiers to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = rest(function(object, props) {
  return object == null ? {} : basePick(object, arrayMap(baseFlatten(props, 1), toKey));
});

module.exports = pick;

},{"./_arrayMap":153,"./_baseFlatten":168,"./_basePick":189,"./_toKey":306,"./rest":359}],357:[function(require,module,exports){
var baseProperty = require('./_baseProperty'),
    basePropertyDeep = require('./_basePropertyDeep'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;

},{"./_baseProperty":190,"./_basePropertyDeep":191,"./_isKey":268,"./_toKey":306}],358:[function(require,module,exports){
var arrayReduce = require('./_arrayReduce'),
    baseEach = require('./_baseEach'),
    baseIteratee = require('./_baseIteratee'),
    baseReduce = require('./_baseReduce'),
    isArray = require('./isArray');

/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` thru `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not given, the first element of `collection` is used as the initial
 * value. The iteratee is invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
 * and `sortBy`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduceRight
 * @example
 *
 * _.reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * }, 0);
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 *   return result;
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
 */
function reduce(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduce : baseReduce,
      initAccum = arguments.length < 3;

  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}

module.exports = reduce;

},{"./_arrayReduce":155,"./_baseEach":165,"./_baseIteratee":181,"./_baseReduce":192,"./isArray":333}],359:[function(require,module,exports){
var apply = require('./_apply'),
    toInteger = require('./toInteger');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as
 * an array.
 *
 * **Note:** This method is based on the
 * [rest parameter](https://mdn.io/rest_parameters).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.rest(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function rest(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, array);
      case 1: return func.call(this, args[0], array);
      case 2: return func.call(this, args[0], args[1], array);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

module.exports = rest;

},{"./_apply":148,"./toInteger":367}],360:[function(require,module,exports){
var castPath = require('./_castPath'),
    isFunction = require('./isFunction'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * This method is like `_.get` except that if the resolved value is a
 * function it's invoked with the `this` binding of its parent object and
 * its result is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to resolve.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
 *
 * _.result(object, 'a[0].b.c1');
 * // => 3
 *
 * _.result(object, 'a[0].b.c2');
 * // => 4
 *
 * _.result(object, 'a[0].b.c3', 'default');
 * // => 'default'
 *
 * _.result(object, 'a[0].b.c3', _.constant('default'));
 * // => 'default'
 */
function result(object, path, defaultValue) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length;

  // Ensure the loop is entered when path is empty.
  if (!length) {
    object = undefined;
    length = 1;
  }
  while (++index < length) {
    var value = object == null ? undefined : object[toKey(path[index])];
    if (value === undefined) {
      index = length;
      value = defaultValue;
    }
    object = isFunction(value) ? value.call(object) : value;
  }
  return object;
}

module.exports = result;

},{"./_castPath":203,"./_isKey":268,"./_toKey":306,"./isFunction":340}],361:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten'),
    baseOrderBy = require('./_baseOrderBy'),
    isArray = require('./isArray'),
    isFlattenableIteratee = require('./_isFlattenableIteratee'),
    isIterateeCall = require('./_isIterateeCall'),
    rest = require('./rest');

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
 *  [iteratees=[_.identity]] The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, function(o) { return o.user; });
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
 *
 * _.sortBy(users, 'user', function(o) {
 *   return Math.floor(o.age / 10);
 * });
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 */
var sortBy = rest(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  iteratees = (iteratees.length == 1 && isArray(iteratees[0]))
    ? iteratees[0]
    : baseFlatten(iteratees, 1, isFlattenableIteratee);

  return baseOrderBy(collection, iteratees, []);
});

module.exports = sortBy;

},{"./_baseFlatten":168,"./_baseOrderBy":188,"./_isFlattenableIteratee":264,"./_isIterateeCall":267,"./isArray":333,"./rest":359}],362:[function(require,module,exports){
var baseIteratee = require('./_baseIteratee'),
    baseSortedIndexBy = require('./_baseSortedIndexBy');

/**
 * This method is like `_.sortedIndex` except that it accepts `iteratee`
 * which is invoked for `value` and each element of `array` to compute their
 * sort ranking. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The iteratee invoked per element.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * var objects = [{ 'x': 4 }, { 'x': 5 }];
 *
 * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
 * // => 0
 */
function sortedIndexBy(array, value, iteratee) {
  return baseSortedIndexBy(array, value, baseIteratee(iteratee));
}

module.exports = sortedIndexBy;

},{"./_baseIteratee":181,"./_baseSortedIndexBy":196}],363:[function(require,module,exports){
/**
 * A method that returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

},{}],364:[function(require,module,exports){
/**
 * A method that returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],365:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    copyArray = require('./_copyArray'),
    getTag = require('./_getTag'),
    isArrayLike = require('./isArrayLike'),
    isString = require('./isString'),
    iteratorToArray = require('./_iteratorToArray'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray'),
    stringToArray = require('./_stringToArray'),
    values = require('./values');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Built-in value references. */
var iteratorSymbol = typeof (iteratorSymbol = Symbol && Symbol.iterator) == 'symbol' ? iteratorSymbol : undefined;

/**
 * Converts `value` to an array.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Array} Returns the converted array.
 * @example
 *
 * _.toArray({ 'a': 1, 'b': 2 });
 * // => [1, 2]
 *
 * _.toArray('abc');
 * // => ['a', 'b', 'c']
 *
 * _.toArray(1);
 * // => []
 *
 * _.toArray(null);
 * // => []
 */
function toArray(value) {
  if (!value) {
    return [];
  }
  if (isArrayLike(value)) {
    return isString(value) ? stringToArray(value) : copyArray(value);
  }
  if (iteratorSymbol && value[iteratorSymbol]) {
    return iteratorToArray(value[iteratorSymbol]());
  }
  var tag = getTag(value),
      func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

  return func(value);
}

module.exports = toArray;

},{"./_Symbol":143,"./_copyArray":217,"./_getTag":250,"./_iteratorToArray":274,"./_mapToArray":285,"./_setToArray":298,"./_stringToArray":304,"./isArrayLike":334,"./isString":345,"./values":372}],366:[function(require,module,exports){
var toNumber = require('./toNumber');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;

},{"./toNumber":368}],367:[function(require,module,exports){
var toFinite = require('./toFinite');

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;

},{"./toFinite":366}],368:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = isFunction(value.valueOf) ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isFunction":340,"./isObject":342,"./isSymbol":346}],369:[function(require,module,exports){
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":198}],370:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten'),
    baseUniq = require('./_baseUniq'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    rest = require('./rest');

/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 */
var union = rest(function(arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});

module.exports = union;

},{"./_baseFlatten":168,"./_baseUniq":200,"./isArrayLikeObject":335,"./rest":359}],371:[function(require,module,exports){
var toString = require('./toString');

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}

module.exports = uniqueId;

},{"./toString":369}],372:[function(require,module,exports){
var baseValues = require('./_baseValues'),
    keys = require('./keys');

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object ? baseValues(object, keys(object)) : [];
}

module.exports = values;

},{"./_baseValues":201,"./keys":348}],373:[function(require,module,exports){
var LazyWrapper = require('./_LazyWrapper'),
    LodashWrapper = require('./_LodashWrapper'),
    baseLodash = require('./_baseLodash'),
    isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike'),
    wrapperClone = require('./_wrapperClone');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates a `lodash` object which wraps `value` to enable implicit method
 * chain sequences. Methods that operate on and return arrays, collections,
 * and functions can be chained together. Methods that retrieve a single value
 * or may return a primitive value will automatically end the chain sequence
 * and return the unwrapped value. Otherwise, the value must be unwrapped
 * with `_#value`.
 *
 * Explicit chain sequences, which must be unwrapped with `_#value`, may be
 * enabled using `_.chain`.
 *
 * The execution of chained methods is lazy, that is, it's deferred until
 * `_#value` is implicitly or explicitly called.
 *
 * Lazy evaluation allows several methods to support shortcut fusion.
 * Shortcut fusion is an optimization to merge iteratee calls; this avoids
 * the creation of intermediate arrays and can greatly reduce the number of
 * iteratee executions. Sections of a chain sequence qualify for shortcut
 * fusion if the section is applied to an array of at least `200` elements
 * and any iteratees accept only one argument. The heuristic for whether a
 * section qualifies for shortcut fusion is subject to change.
 *
 * Chaining is supported in custom builds as long as the `_#value` method is
 * directly or indirectly included in the build.
 *
 * In addition to lodash methods, wrappers have `Array` and `String` methods.
 *
 * The wrapper `Array` methods are:
 * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
 *
 * The wrapper `String` methods are:
 * `replace` and `split`
 *
 * The wrapper methods that support shortcut fusion are:
 * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
 * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
 * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
 *
 * The chainable wrapper methods are:
 * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
 * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
 * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
 * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
 * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
 * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
 * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
 * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
 * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
 * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
 * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
 * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
 * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
 * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
 * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
 * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
 * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
 * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
 * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
 * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
 * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
 * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
 * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
 * `zipObject`, `zipObjectDeep`, and `zipWith`
 *
 * The wrapper methods that are **not** chainable by default are:
 * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
 * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `deburr`, `divide`, `each`,
 * `eachRight`, `endsWith`, `eq`, `escape`, `escapeRegExp`, `every`, `find`,
 * `findIndex`, `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `first`,
 * `floor`, `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`,
 * `forOwnRight`, `get`, `gt`, `gte`, `has`, `hasIn`, `head`, `identity`,
 * `includes`, `indexOf`, `inRange`, `invoke`, `isArguments`, `isArray`,
 * `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`, `isBoolean`,
 * `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`, `isEqualWith`,
 * `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`, `isMap`,
 * `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
 * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
 * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
 * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
 * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
 * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
 * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
 * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
 * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
 * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
 * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
 * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
 * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
 * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
 * `upperFirst`, `value`, and `words`
 *
 * @name _
 * @constructor
 * @category Seq
 * @param {*} value The value to wrap in a `lodash` instance.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var wrapped = _([1, 2, 3]);
 *
 * // Returns an unwrapped value.
 * wrapped.reduce(_.add);
 * // => 6
 *
 * // Returns a wrapped value.
 * var squares = wrapped.map(square);
 *
 * _.isArray(squares);
 * // => false
 *
 * _.isArray(squares.value());
 * // => true
 */
function lodash(value) {
  if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }
    if (hasOwnProperty.call(value, '__wrapped__')) {
      return wrapperClone(value);
    }
  }
  return new LodashWrapper(value);
}

// Ensure wrappers are instances of `baseLodash`.
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;

module.exports = lodash;

},{"./_LazyWrapper":133,"./_LodashWrapper":135,"./_baseLodash":184,"./_wrapperClone":308,"./isArray":333,"./isObjectLike":343}],374:[function(require,module,exports){
'use strict';

var proto = Element.prototype;
var vendor = proto.matches
  || proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] == el) return true;
  }
  return false;
}
},{}],375:[function(require,module,exports){
/**
 * media-type
 * @author Lovell Fuller
 *
 * This code is distributed under the Apache License Version 2.0, the terms of
 * which may be found at http://www.apache.org/licenses/LICENSE-2.0.html
 */

var MediaType = function() {
  this.type = null;
  this._setSubtypeAndSuffix(null);
  this.parameters = {};
};

MediaType.prototype.isValid = function() {
  return this.type !== null && this.subtype !== null && this.subtype !== "example";
};

MediaType.prototype._setSubtypeAndSuffix = function(subtype) {
  this.subtype = subtype;
  this.subtypeFacets = [];
  this.suffix = null;
  if (subtype) {
    if (subtype.indexOf("+") > -1 && subtype.substr(-1) !== "+") {
      var fixes = subtype.split("+", 2);
      this.subtype = fixes[0];
      this.subtypeFacets = fixes[0].split(".");
      this.suffix = fixes[1];
    } else {
      this.subtypeFacets = subtype.split(".");
    }
  }
};

MediaType.prototype.hasSuffix = function() {
  return !!this.suffix;
};

MediaType.prototype._firstSubtypeFacetEquals = function(str) {
  return this.subtypeFacets.length > 0 && this.subtypeFacets[0] === str;
};

MediaType.prototype.isVendor = function() {
  return this._firstSubtypeFacetEquals("vnd");
};

MediaType.prototype.isPersonal = function() {
  return this._firstSubtypeFacetEquals("prs");
};

MediaType.prototype.isExperimental = function() {
  return this._firstSubtypeFacetEquals("x") || this.subtype.substring(0, 2).toLowerCase() === "x-";
};

MediaType.prototype.asString = function() {
  var str = "";
  if (this.isValid()) {
    str = str + this.type + "/" + this.subtype;
    if (this.hasSuffix()) {
      str = str + "+" + this.suffix;
    }
    var parameterKeys = Object.keys(this.parameters);
    if (parameterKeys.length > 0) {
      var parameters = [];
      var that = this;
      parameterKeys.sort(function(a, b) {
        return a.localeCompare(b);
      }).forEach(function(element) {
        parameters.push(element + "=" + wrapQuotes(that.parameters[element]));
      });
      str = str + ";" + parameters.join(";");
    }
  }
  return str;
};

var wrapQuotes = function(str) {
  return (str.indexOf(";") > -1) ? '"' + str + '"' : str;
};

var unwrapQuotes = function(str) {
  return (str.substr(0, 1) === '"' && str.substr(-1) === '"') ? str.substr(1, str.length - 2) : str;
};

var mediaTypeMatcher = /^(application|audio|image|message|model|multipart|text|video|\*)\/([a-zA-Z0-9!#$%^&\*_\-\+{}\|'.`~]{1,127})(;.*)?$/;

var parameterSplitter = /;(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))/;

exports.fromString = function(str) {
  var mediaType = new MediaType();
  if (str) {
    var match = str.match(mediaTypeMatcher);
    if (match && !(match[1] === '*' && match[2] !== '*')) { 
      mediaType.type = match[1];
      mediaType._setSubtypeAndSuffix(match[2]);
      if (match[3]) {
        match[3].substr(1).split(parameterSplitter).forEach(function(parameter) {
          var keyAndValue = parameter.split('=', 2);
          if (keyAndValue.length === 2) {
            mediaType.parameters[keyAndValue[0].toLowerCase().trim()] = unwrapQuotes(keyAndValue[1].trim());
          }
        });
      }
    }
  }
  return mediaType;
};

},{}],376:[function(require,module,exports){
module.exports = once

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var called = false
  return function () {
    if (called) return
    called = true
    return fn.apply(this, arguments)
  }
}

},{}],377:[function(require,module,exports){
var trim = require('trim')
  , forEach = require('for-each')
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}
},{"for-each":121,"trim":386}],378:[function(require,module,exports){
'use strict';

var Stringify = require('./stringify');
var Parse = require('./parse');

module.exports = {
    stringify: Stringify,
    parse: Parse
};

},{"./parse":379,"./stringify":380}],379:[function(require,module,exports){
'use strict';

var Utils = require('./utils');

var defaults = {
    delimiter: '&',
    depth: 5,
    arrayLimit: 20,
    parameterLimit: 1000,
    strictNullHandling: false,
    plainObjects: false,
    allowPrototypes: false,
    allowDots: false,
    decoder: Utils.decode
};

var parseValues = function parseValues(str, options) {
    var obj = {};
    var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);

    for (var i = 0; i < parts.length; ++i) {
        var part = parts[i];
        var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;

        if (pos === -1) {
            obj[options.decoder(part)] = '';

            if (options.strictNullHandling) {
                obj[options.decoder(part)] = null;
            }
        } else {
            var key = options.decoder(part.slice(0, pos));
            var val = options.decoder(part.slice(pos + 1));

            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj[key] = [].concat(obj[key]).concat(val);
            } else {
                obj[key] = val;
            }
        }
    }

    return obj;
};

var parseObject = function parseObject(chain, val, options) {
    if (!chain.length) {
        return val;
    }

    var root = chain.shift();

    var obj;
    if (root === '[]') {
        obj = [];
        obj = obj.concat(parseObject(chain, val, options));
    } else {
        obj = options.plainObjects ? Object.create(null) : {};
        var cleanRoot = root[0] === '[' && root[root.length - 1] === ']' ? root.slice(1, root.length - 1) : root;
        var index = parseInt(cleanRoot, 10);
        if (
            !isNaN(index) &&
            root !== cleanRoot &&
            String(index) === cleanRoot &&
            index >= 0 &&
            (options.parseArrays && index <= options.arrayLimit)
        ) {
            obj = [];
            obj[index] = parseObject(chain, val, options);
        } else {
            obj[cleanRoot] = parseObject(chain, val, options);
        }
    }

    return obj;
};

var parseKeys = function parseKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^\.\[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var parent = /^([^\[\]]*)/;
    var child = /(\[[^\[\]]*\])/g;

    // Get the parent

    var segment = parent.exec(key);

    // Stash the parent if it exists

    var keys = [];
    if (segment[1]) {
        // If we aren't using plain objects, optionally prefix keys
        // that would overwrite object prototype properties
        if (!options.plainObjects && Object.prototype.hasOwnProperty(segment[1])) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(segment[1]);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && Object.prototype.hasOwnProperty(segment[1].replace(/\[|\]/g, ''))) {
            if (!options.allowPrototypes) {
                continue;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

module.exports = function (str, opts) {
    var options = opts || {};

    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    options.delimiter = typeof options.delimiter === 'string' || Utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = Utils.merge(obj, newObj, options);
    }

    return Utils.compact(obj);
};

},{"./utils":381}],380:[function(require,module,exports){
'use strict';

var Utils = require('./utils');

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var defaults = {
    delimiter: '&',
    strictNullHandling: false,
    skipNulls: false,
    encode: true,
    encoder: Utils.encode
};

var stringify = function stringify(object, prefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = obj.toISOString();
    } else if (obj === null) {
        if (strictNullHandling) {
            return encoder ? encoder(prefix) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || Utils.isBuffer(obj)) {
        if (encoder) {
            return [encoder(prefix) + '=' + encoder(obj)];
        }
        return [prefix + '=' + String(obj)];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (Array.isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (Array.isArray(obj)) {
            values = values.concat(stringify(obj[key], generateArrayPrefix(prefix, key), generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots));
        } else {
            values = values.concat(stringify(obj[key], prefix + (allowDots ? '.' + key : '[' + key + ']'), generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots));
        }
    }

    return values;
};

module.exports = function (object, opts) {
    var obj = object;
    var options = opts || {};
    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
    var encoder = encode ? (typeof options.encoder === 'function' ? options.encoder : defaults.encoder) : null;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
    var objKeys;
    var filter;

    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (Array.isArray(options.filter)) {
        objKeys = filter = options.filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    } else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (sort) {
        objKeys.sort(sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        keys = keys.concat(stringify(obj[key], key, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots));
    }

    return keys.join(delimiter);
};

},{"./utils":381}],381:[function(require,module,exports){
'use strict';

var hexTable = (function () {
    var array = new Array(256);
    for (var i = 0; i < 256; ++i) {
        array[i] = '%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase();
    }

    return array;
}());

exports.arrayToObject = function (source, options) {
    var obj = options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

exports.merge = function (target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        } else if (typeof target === 'object') {
            target[source] = true;
        } else {
            return [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (Array.isArray(target) && !Array.isArray(source)) {
        mergeTarget = exports.arrayToObject(target, options);
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (Object.prototype.hasOwnProperty.call(acc, key)) {
            acc[key] = exports.merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

exports.decode = function (str) {
    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};

exports.encode = function (str) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D || // -
            c === 0x2E || // .
            c === 0x5F || // _
            c === 0x7E || // ~
            (c >= 0x30 && c <= 0x39) || // 0-9
            (c >= 0x41 && c <= 0x5A) || // a-z
            (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)] + hexTable[0x80 | ((c >> 12) & 0x3F)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

exports.compact = function (obj, references) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    var refs = references || [];
    var lookup = refs.indexOf(obj);
    if (lookup !== -1) {
        return refs[lookup];
    }

    refs.push(obj);

    if (Array.isArray(obj)) {
        var compacted = [];

        for (var i = 0; i < obj.length; ++i) {
            if (obj[i] && typeof obj[i] === 'object') {
                compacted.push(exports.compact(obj[i], refs));
            } else if (typeof obj[i] !== 'undefined') {
                compacted.push(obj[i]);
            }
        }

        return compacted;
    }

    var keys = Object.keys(obj);
    for (var j = 0; j < keys.length; ++j) {
        var key = keys[j];
        obj[key] = exports.compact(obj[key], refs);
    }

    return obj;
};

exports.isRegExp = function (obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

exports.isBuffer = function (obj) {
    if (obj === null || typeof obj === 'undefined') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

},{}],382:[function(require,module,exports){
'use strict';

/**
 * Module dependencies
 */
var decouple = require('decouple');
var Emitter = require('emitter');

/**
 * Privates
 */
var scrollTimeout;
var scrolling = false;
var doc = window.document;
var html = doc.documentElement;
var msPointerSupported = window.navigator.msPointerEnabled;
var touch = {
  'start': msPointerSupported ? 'MSPointerDown' : 'touchstart',
  'move': msPointerSupported ? 'MSPointerMove' : 'touchmove',
  'end': msPointerSupported ? 'MSPointerUp' : 'touchend'
};
var prefix = (function prefix() {
  var regex = /^(Webkit|Khtml|Moz|ms|O)(?=[A-Z])/;
  var styleDeclaration = doc.getElementsByTagName('script')[0].style;
  for (var prop in styleDeclaration) {
    if (regex.test(prop)) {
      return '-' + prop.match(regex)[0].toLowerCase() + '-';
    }
  }
  // Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
  // However (prop in style) returns the correct value, so we'll have to test for
  // the precence of a specific property
  if ('WebkitOpacity' in styleDeclaration) { return '-webkit-'; }
  if ('KhtmlOpacity' in styleDeclaration) { return '-khtml-'; }
  return '';
}());
function extend(destination, from) {
  for (var prop in from) {
    if (from[prop]) {
      destination[prop] = from[prop];
    }
  }
  return destination;
}
function inherits(child, uber) {
  child.prototype = extend(child.prototype || {}, uber.prototype);
}

/**
 * Slideout constructor
 */
function Slideout(options) {
  options = options || {};

  // Sets default values
  this._startOffsetX = 0;
  this._currentOffsetX = 0;
  this._opening = false;
  this._moved = false;
  this._opened = false;
  this._preventOpen = false;
  this._touch = options.touch === undefined ? true : options.touch && true;
  this._grabWidth = parseInt(options.grabWidth, 10) || 0;

  // Sets panel
  this.panel = options.panel;
  this.menu = options.menu;

  // Sets  classnames
  if(this.panel.className.search('slideout-panel') === -1) { this.panel.className += ' slideout-panel'; }
  if(this.menu.className.search('slideout-menu') === -1) { this.menu.className += ' slideout-menu'; }


  // Sets options
  this._fx = options.fx || 'ease';
  this._duration = parseInt(options.duration, 10) || 300;
  this._tolerance = parseInt(options.tolerance, 10) || 70;
  this._padding = this._translateTo = parseInt(options.padding, 10) || 256;
  this._orientation = options.side === 'right' ? -1 : 1;
  this._translateTo *= this._orientation;

  // Init touch events
  if (this._touch) {
    this._initTouchEvents();
  }
}

/**
 * Inherits from Emitter
 */
inherits(Slideout, Emitter);

/**
 * Opens the slideout menu.
 */
Slideout.prototype.open = function() {
  var self = this;
  this.emit('beforeopen');
  if (html.className.search('slideout-open') === -1) { html.className += ' slideout-open'; }
  this._setTransition();
  this._translateXTo(this._translateTo);
  this._opened = true;
  setTimeout(function() {
    self.panel.style.transition = self.panel.style['-webkit-transition'] = '';
    self.emit('open');
  }, this._duration + 50);
  return this;
};

/**
 * Closes slideout menu.
 */
Slideout.prototype.close = function() {
  var self = this;
  if (!this.isOpen() && !this._opening) {
    return this;
  }
  this.emit('beforeclose');
  this._setTransition();
  this._translateXTo(0);
  this._opened = false;
  setTimeout(function() {
    html.className = html.className.replace(/ slideout-open/, '');
    self.panel.style.transition = self.panel.style['-webkit-transition'] = self.panel.style[prefix + 'transform'] = self.panel.style.transform = '';
    self.emit('close');
  }, this._duration + 50);
  return this;
};

/**
 * Toggles (open/close) slideout menu.
 */
Slideout.prototype.toggle = function() {
  return this.isOpen() ? this.close() : this.open();
};

/**
 * Returns true if the slideout is currently open, and false if it is closed.
 */
Slideout.prototype.isOpen = function() {
  return this._opened;
};

/**
 * Translates panel and updates currentOffset with a given X point
 */
Slideout.prototype._translateXTo = function(translateX) {
  this._currentOffsetX = translateX;
  this.panel.style[prefix + 'transform'] = this.panel.style.transform = 'translateX(' + translateX + 'px)';
  return this;
};

/**
 * Set transition properties
 */
Slideout.prototype._setTransition = function() {
  this.panel.style[prefix + 'transition'] = this.panel.style.transition = prefix + 'transform ' + this._duration + 'ms ' + this._fx;
  return this;
};

/**
 * Initializes touch event
 */
Slideout.prototype._initTouchEvents = function() {
  var self = this;

  /**
   * Decouple scroll event
   */
  this._onScrollFn = decouple(doc, 'scroll', function() {
    if (!self._moved) {
      clearTimeout(scrollTimeout);
      scrolling = true;
      scrollTimeout = setTimeout(function() {
        scrolling = false;
      }, 250);
    }
  });

  /**
   * Prevents touchmove event if slideout is moving
   */
  this._preventMove = function(eve) {
    if (self._moved) {
      eve.preventDefault();
    }
  };

  doc.addEventListener(touch.move, this._preventMove);

  /**
   * Resets values on touchstart
   */
  this._resetTouchFn = function(eve) {
    if (typeof eve.touches === 'undefined') {
      return;
    }

    self._moved = false;
    self._opening = false;
    if (self._orientation === 1)
      var offset = eve.touches[0].pageX;
    else
      var offset = window.innerWidth - eve.touches[0].pageX;

    self._startOffsetX = offset;
    self._preventOpen = (!self._touch || (!self.isOpen() && (self.menu.clientWidth !== 0 || (self._grabWidth && offset > self._grabWidth))));
  };

  this.panel.addEventListener(touch.start, this._resetTouchFn);

  /**
   * Resets values on touchcancel
   */
  this._onTouchCancelFn = function() {
    self._moved = false;
    self._opening = false;
  };

  this.panel.addEventListener('touchcancel', this._onTouchCancelFn);

  /**
   * Toggles slideout on touchend
   */
  this._onTouchEndFn = function() {
    if (self._moved) {
      self.emit('translateend');
      (self._opening && Math.abs(self._currentOffsetX) > self._tolerance) ? self.open() : self.close();
    }
    self._moved = false;
  };

  this.panel.addEventListener(touch.end, this._onTouchEndFn);

  /**
   * Translates panel on touchmove
   */
  this._onTouchMoveFn = function(eve) {

    if (scrolling || self._preventOpen || typeof eve.touches === 'undefined') {
      return;
    }

    var dif_x = eve.touches[0].clientX - self._startOffsetX;
    var translateX = self._currentOffsetX = dif_x;

    if (Math.abs(translateX) > self._padding) {
      return;
    }

    if (Math.abs(dif_x) > 20) {

      self._opening = true;

      var oriented_dif_x = dif_x * self._orientation;

      if (self._opened && oriented_dif_x > 0 || !self._opened && oriented_dif_x < 0) {
        return;
      }

      if (!self._moved) {
        self.emit('translatestart');
      }

      if (oriented_dif_x <= 0) {
        translateX = dif_x + self._padding * self._orientation;
        self._opening = false;
      }

      if (!self._moved && html.className.search('slideout-open') === -1) {
        html.className += ' slideout-open';
      }

      self.panel.style[prefix + 'transform'] = self.panel.style.transform = 'translateX(' + translateX + 'px)';
      self.emit('translate', translateX);
      self._moved = true;
    }

  };

  this.panel.addEventListener(touch.move, this._onTouchMoveFn);

  return this;
};

/**
 * Enable opening the slideout via touch events.
 */
Slideout.prototype.enableTouch = function() {
  this._touch = true;
  return this;
};

/**
 * Disable opening the slideout via touch events.
 */
Slideout.prototype.disableTouch = function() {
  this._touch = false;
  return this;
};

/**
 * Destroy an instance of slideout.
 */
Slideout.prototype.destroy = function() {
  // Close before clean
  this.close();

  // Remove event listeners
  doc.removeEventListener(touch.move, this._preventMove);
  this.panel.removeEventListener(touch.start, this._resetTouchFn);
  this.panel.removeEventListener('touchcancel', this._onTouchCancelFn);
  this.panel.removeEventListener(touch.end, this._onTouchEndFn);
  this.panel.removeEventListener(touch.move, this._onTouchMoveFn);
  doc.removeEventListener('scroll', this._onScrollFn);

  // Remove methods
  this.open = this.close = function() {};

  // Return the instance so it can be easily dereferenced
  return this;
};

/**
 * Expose Slideout
 */
module.exports = Slideout;

},{"decouple":115,"emitter":119}],383:[function(require,module,exports){
/**
 * Module dependencies
 */

var Context = module.exports = require('./lib/context');
var Emitter = require('emitter-component');

/**
 * Mixin the emitter
 */

Emitter(Context.prototype);

},{"./lib/context":384,"emitter-component":118}],384:[function(require,module,exports){
/**
 * Module dependencies.
 */

var request = require('superagent');
var methods = require('./methods');
var protoMethods = Object.keys(request.Request.prototype);

/**
 * Expose `Context`.
 */

module.exports = Context;

/**
 * Initialize a new `Context`.
 *
 * @api public
 */

function Context(superagent) {
  if (!(this instanceof Context)) return new Context(superagent);
  this.request = superagent || request;
  this.stack = []; // store the default operation on the context
}
var proto = Context.prototype = {};

// setup methods for context

each(protoMethods, function(method) {
  // blacklist unsupported functions
  if (~['end'].indexOf(method)) return;

  proto[method] = function() {
    this.stack.push({
      method: method,
      args: arguments
    });

    return this;
  }
});

/**
 * apply the operations on the context to real Request instance
 *
 * @api private
 */

proto.applyStack = function(req) {
  this.stack.forEach(function(operation) {
    req[operation.method].apply(req, operation.args);
  });
};

// generate HTTP verb methods

each(methods, function(method) {
  var targetMethod = method == 'delete' ? 'del' : method;
  var httpMethod = method.toUpperCase();
  proto[method] = function(url, fn) {
    var r = this.request;
    var req = r instanceof Function ?
      r(httpMethod, url) :
      r[targetMethod](url);

    // Do the attaching here
    this.applyStack(req);

    // Tell the listeners we've created a new request
    this.emit('request', req);

    fn && req.end(fn);
    return req;
  };
});

proto.del = proto['delete'];

/**
 * Iterate array-ish.
 *
 * @param {Array|Object} arr
 * @param {Function} fn
 * @api private
 */

function each(arr, fn) {
  for (var i = 0; i < arr.length; ++i) {
    fn(arr[i], i);
  }
}

},{"./methods":385,"superagent":undefined}],385:[function(require,module,exports){
module.exports = [
  'get',
  'post',
  'put',
  'head',
  'delete',
  'options',
  'trace',
  'copy',
  'lock',
  'mkcol',
  'move',
  'purge',
  'propfind',
  'proppatch',
  'unlock',
  'report',
  'mkactivity',
  'checkout',
  'merge',
  'm-search',
  'notify',
  'subscribe',
  'unsubscribe',
  'patch',
  'search',
  'connect'
];

},{}],386:[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],387:[function(require,module,exports){
"use strict";
var window = require("global/window")
var once = require("once")
var isFunction = require("is-function")
var parseHeaders = require("parse-headers")
var xtend = require("xtend")

module.exports = createXHR
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest

forEachArray(["get", "put", "post", "patch", "head", "delete"], function(method) {
    createXHR[method === "delete" ? "del" : method] = function(uri, options, callback) {
        options = initParams(uri, options, callback)
        options.method = method.toUpperCase()
        return _createXHR(options)
    }
})

function forEachArray(array, iterator) {
    for (var i = 0; i < array.length; i++) {
        iterator(array[i])
    }
}

function isEmpty(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)) return false
    }
    return true
}

function initParams(uri, options, callback) {
    var params = uri

    if (isFunction(options)) {
        callback = options
        if (typeof uri === "string") {
            params = {uri:uri}
        }
    } else {
        params = xtend(options, {uri: uri})
    }

    params.callback = callback
    return params
}

function createXHR(uri, options, callback) {
    options = initParams(uri, options, callback)
    return _createXHR(options)
}

function _createXHR(options) {
    var callback = options.callback
    if(typeof callback === "undefined"){
        throw new Error("callback argument missing")
    }
    callback = once(callback)

    function readystatechange() {
        if (xhr.readyState === 4) {
            loadFunc()
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else if (xhr.responseType === "text" || !xhr.responseType) {
            body = xhr.responseText || xhr.responseXML
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    var failureResponse = {
                body: undefined,
                headers: {},
                statusCode: 0,
                method: method,
                url: uri,
                rawRequest: xhr
            }

    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error") )
        }
        evt.statusCode = 0
        callback(evt, failureResponse)
    }

    // will load the data & process the response in a special response object
    function loadFunc() {
        if (aborted) return
        var status
        clearTimeout(timeoutTimer)
        if(options.useXDR && xhr.status===undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200
        } else {
            status = (xhr.status === 1223 ? 204 : xhr.status)
        }
        var response = failureResponse
        var err = null

        if (status !== 0){
            response = {
                body: getBody(),
                statusCode: status,
                method: method,
                headers: {},
                url: uri,
                rawRequest: xhr
            }
            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
        } else {
            err = new Error("Internal XMLHttpRequest Error")
        }
        callback(err, response, response.body)

    }

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest()
        }else{
            xhr = new createXHR.XMLHttpRequest()
        }
    }

    var key
    var aborted
    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data || null
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer

    if ("json" in options) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
            body = JSON.stringify(options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.ontimeout = errorFunc
    xhr.open(method, uri, !sync, options.username, options.password)
    //has to be after open
    if(!sync) {
        xhr.withCredentials = !!options.withCredentials
    }
    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
    if (!sync && options.timeout > 0 ) {
        timeoutTimer = setTimeout(function(){
            aborted=true//IE9 may still call readystatechange
            xhr.abort("timeout")
            var e = new Error("XMLHttpRequest timeout")
            e.code = "ETIMEDOUT"
            errorFunc(e)
        }, options.timeout )
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers && !isEmpty(options.headers)) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }

    if ("beforeSend" in options &&
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    xhr.send(body)

    return xhr


}

function noop() {}

},{"global/window":122,"is-function":124,"once":376,"parse-headers":377,"xtend":388}],388:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[4]);
