# Istanbul Reporter HTML Internal CSS

This is a custom [istanbuljs](https://github.com/istanbuljs/istanbuljs) reporter to generate an HTML code coverage report with internal CSS. It is intended for use with the VSTS build code coverage tab which doesn't load external files for security reasons. It is a hacked copy of the HTML reporter from [istanbuljs/packages/istanbul-reports/lib/html](https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib/html).

## Installing

In your project:
```
npm install -i istanbul-reporter-html-internal-css --save-dev
```

Then run `nyc` with this custom reporter from the command line:

```
nyc --reporter=istanbul-reporter-html-internal-css
```

Or, change your npm scripts for your project in package.json:

```json
  (...)
  "scripts": {
    "test": "nyc --reporter=istanbul-reporter-html-internal-css"
  },
  (...)
```

## Getting Started

Run nyc with this custom reporter and your HTML coverage report will be generated. The entry point is `coverage/index.html`.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process
for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
