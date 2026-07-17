# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

##How to update your website in the future


Now that all the hard setup is completely finished, updating this website is incredibly easy.

Open src/App.jsx in code editor.

Scroll to the top and change the placeholder text in the PERSONAL_INFO, EXPERIENCE, and PROJECTS sections to  actual real-life information.

Save the file.

Open  terminal in /mnt/PROJECTS/my-portfolio and run these commands to push  updates live:

Bash
git add .
git commit -m "Updated my personal info"
git push
npm run deploy

Enjoy your brand new portfolio!
