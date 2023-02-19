---
title: "Express Application Generator"
publishDate: "2021-03-03"
tags:
  - code-series
  - "expressjs"
  - "generator"
---

Use the application generator tool, `express-generator`, to quickly create an application skeleton.

Install the application generator by:

```
npm install -g express-generator
mkdir app-directory
cd app-directory
express
```

Or by running `npx` command

```
mkdir app-directory
cd app-directory
npx express-generator
```

then, install dependencies:

```
npm install
```

The directory structure of generated app:

```
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.pug
    ├── index.pug
    └── layout.pug

7 directories, 9 files
```

By default, you can run your application by:

```
npm start
```

and open [http://localhost:3000](http://localhost:3000) to see the result.
