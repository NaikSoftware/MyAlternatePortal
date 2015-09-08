#!/bin/env node
//  OpenShift Node application
var express = require('express');
var fs = require('fs');
var ejs = require('ejs');
var mongoose = require('mongoose');

var Auth = require('./auth');


/**
 *  Define the application.
 */
var App = function () {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function () {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
        self.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
        self.mongo_str = (process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_GEAR_NAME)
            || 'mongodb://localhost:27017/my';
        self.templDir = './templates/';
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function () {
        self.zcache = {};
        //  Local cache for static content.
        ['index.html', 'admin_panel.html'].forEach(function (page) {
            self.zcache[page] = ejs.compile(fs.readFileSync(self.templDir + page, 'utf-8'),
                {filename: self.templDir + page});
        });
    };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function (sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () {
            self.terminator();
        });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element, index, array) {
                process.on(element, function () {
                    self.terminator(element);
                });
            });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.getRoutes = function () {
        var routes = [];

        routes.push(new Route('GET', '*', [function (req, res, next) {
            res.setHeader('Content-Type', 'text/html');
            next();
        }]));

        routes.push(new Route('GET', '/', [function (req, res) {
            res.send(self.zcache['index.html']({schedule: true}));
        }]));

        routes.push(new Route('POST', '/login', [function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            if (self.auth.check(req.body.name, req.body.password)) {
                res.send('{}');
            } else {
                res.sendStatus(403);
            }
        }]));

        routes.push(new Route('GET', '/admin', [function (req, res) {
            if (typeof req.session.logined != 'undefined') {
                res.send(self.zcache['admin_panel.html']({logined: true}));
            } else {
                res.sendStatus(403);
            }
        }]));

        return routes;
    };


    var Route = function (method, path, handlers) {
        this.path = path;
        this.method = method;
        this.handlers = handlers;
    };


    /**
     *  Initialize the server (express) and create the routes and register the handlers.
     */
    self.initializeServer = function () {
        self.app = express();
        self.app.use(express.static('public'));
        self.app.use(require('body-parser').json());

        // Setup connection to MongoDB
        self.mongo = mongoose.createConnection(self.mongo_str);
        console.log('Connected to ' + self.mongo_str);

        // Setup auth
        self.auth = new Auth(self);

        //  Add handlers for the app (from the routes).
        self.getRoutes().forEach(function (route) {
            if (route.method === 'GET') self.app.get(route.path, route.handlers);
            else if (route.method === 'POST') self.app.post(route.path, route.handlers);
            else self.app.all(route.path, route.handlers);
        });
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function () {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes_get.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function () {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now()), self.ipaddress, self.port);
        });
    };

};
/*  App  */


/**
 *  main():  Main code.
 */
var zapp = new App();
zapp.initialize();
zapp.start();

