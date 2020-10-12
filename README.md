# axios-handle-error

Handles axios errors in a convenient way

## Installation

Install using npm:

```sh
npm install --save axios-handle-error
```

Install using yarn:

```sh
yarn add axios-handle-error
```

## Usage Example

```ts
import handleAxiosErrorOrThrow from "axios-handle-error";
axios.get('/your-api-call').then(response => response.data).catch(e => handleAxiosErrorOrThrow(e, {
    404: () => {
        throw new Error("Element could not be found.");
    },
    '*': () => {
        throw new Error("Unknown error occured.");
    },
    'NO_RESPONSE': () => {
        throw new Error("Server is not responding. Please try again.");
    }
}));
```

## Built With

* [Typescript](https://www.typescriptlang.org/) - TypeScript is a typed superset of JavaScript that compiles to plain JavaScript

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.