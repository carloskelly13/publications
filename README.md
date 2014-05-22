### Publications

Publications 2.x is an Angular-based page layout and screen design web application. It uses ExpressJS, AngularJS, MongooseJS, MongoDB, Grunt and Bower.

#### Getting Started

Install required Node modules:
```
$ npm install
```

Install required Bower packages for front-end JS app:
```
$ bower install
```

Compile resources for development:
```
$ grunt development
```

Run the application:
```
$ node app
```

Seed the database with a sample user "user@email.com" and password "password"
```
$ mongoimport --db pub-ng --collection users --type json --file user-seed.json
```
