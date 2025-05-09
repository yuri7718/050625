# 050625-coding-test
This project presents a Wordle game developed in React, using the [provded API endpoint](https://wordle-apis.vercel.app/api/validate). 

It is implemented based on the requirements, with the following additional conditions:

- If the user presses Enter but the current guess is not 5 letters long, the program displays a warning: "The word must be exactly 5 letters long." The game continues.

- If the user presses Enter but the guess is not a valid word, the program displays a warning: "Invalid word." The game continues.

- If the current guess matches the target word, the program displays a message with animation: "Congratulations — you won!" The game ends.

- If the current guess is incorrect and all six attempts have been used, the program displays a message: "Game over — all six guesses have been used." The game ends.

## Project Setup
```
yarn install
yarn run dev
```

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
