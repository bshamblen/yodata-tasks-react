# yodata-tasks-react

**Yodata Tasks React** is a sample task manager website, written with React.js, which accesses the [Yodata](https://yodata.io) platform to perform CRUD operations against the `yodata.task` and `files` models. This project uses the ES6 version of JavaScript for the React components, Babel to transform to standard JavaScript, and Browserify to package the React components into one distributable bundle.

## Install

This project uses node.js to provide a simple web server. Although the content of this website it completely static, the static content needs to be hosted on a website to process the OAuth2 login responses that are returned by Yodata. If you would prefer, you can simply copy/paste the contents of the `dist` folder into an existing website. 

1. Install node 5.0 or above.
3. At the command line, in the root folder of the project, type `npm install` to install the project dependencies. 

## Configure

1. Log into [Yodata](https://yodata.io) to create a new application. 
2. Copy/paste your client ID into the `clientId` property in the `/react_components/globals.jsx` file.
3. For added security only authorized domain names can submit login requests using your client ID. Add `localhost` to the list of authorized domain names for your app in the Application management section of the Yodata website.

## Use

1. Once you've set your client ID, at the command line, go to the root folder of this project.
2. Type `grunt` to build the app.
3. Type `node app` to run the app.
4. Open your browser to `http://localhost:3000` to view the app.
5. Click the **Log In** button to start using Yodata!