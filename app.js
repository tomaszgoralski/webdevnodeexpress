/* jshint -W097 */
/*global require, console,__dirname, process */
'use strict';
var express = require('express');
var app = express();
app.disable('x-powered-by');
var handlebars = require('express3-handlebars')
    .create({
        defaultLayout: 'main',
        helpers: {
            section: function (name, options) {
                if (!this._sections) {
                    this._sections = {};
                }
                this._sections[name] = options.fn(this);
                return null;
            }
        }
    });
app.engine('handlebars', handlebars.engine);
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
// hook for partials - so called middleware
app.use(function (req, res, next) {
    if (!res.locals.partials) {
        res.locals.partials = {};
    }
    res.locals.partials.weather = getWeatherData();
    next();
});
var tours = [
    {id: 0, name: 'Hood River', price: 99.99},
    {id: 1, name: 'Oregon Coast', price: 149.95},
];

// routes
app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/api/tours', function (req, res) {
    res.json(tours);
});

app.get('/tours/hood-river', function (req, res) {
    res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function (req, res) {
    res.render('tours/request-group-rate');
});

app.get('/about', function (req, res) {
    res.render('about', {
        fortune: getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});
// no handlebar template
app.get('/foo', function (req, res) {
    res.render('foo', {layout: null});
});
// custom handlebar template
app.get('/sectiontest', function (req, res) {
    res.render('sectiontest', {layout: 'section'});
});
// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
    res.status(404);
    res.render('404');
});
// 500 error handler (middleware)
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


//app.get('/', function (req, res) {
//    res.type('text/plain');
//    res.send('Meadowlark Travel');
//});
//app.get('/about', function (req, res) {
//    res.type('text/plain');
//    res.send('About Meadowlark Travel');
//});
//// custom 404 page
//app.use(function (req, res, next) {
//    res.type('text/plain');
//    res.status(404);
//    res.send('404 - Not Found');
//});
//// custom 500 page
//app.use(function (err, req, res, next) {
//    console.error(err.stack);
//    res.type('text/plain');
//    res.status(500);
//    res.send('500 - Server Error');
//});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});

// functions
function getFortune() {
    var fortunes = [
        "Conquer your fears or they will conquer you.",
        "Rivers need springs.",
        "Do not fear what you don't know.",
        "You will have a pleasant surprise.",
        "Whenever possible, keep it simple."
    ];
    return fortunes[Math.floor(Math.random() * fortunes.length)];
}
function getWeatherData() {
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}