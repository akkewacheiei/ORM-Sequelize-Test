#How to run this project
yarn start

yarn global add tsc typescript ts-node ts-node-dev
tsc --init
update tsconfig.json (allowjavascript, rootDir, outDir)

npm init --y
yarn add express
yarn add @types/express --dev

ts-node-dev server.ts 

# express types
https://javascript.plainenglish.io/typed-express-request-and-response-with-typescript-7277aea028c


# what is tsc?
typescript compiler to compilete ts to js
tsc --init : to create tsconfig.json

# what is ts-node?
allow to compite .ts with tsc and run the output (js) with node, 
In short, ts-node server.ts == tsc && node dist/server.js

# what is ts-node-dev? 
it works like nodemon for typescript