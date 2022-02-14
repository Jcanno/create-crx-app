<h1 align="center"><img height="300" src="https://raw.githubusercontent.com/Jcanno/images/master/create-crx-app/create-crx-app.png" /><br> </h1>

<h3 align="center">CLI for create Chrome extension app</h3>

English|[简体中文](https://github.com/Jcanno/create-crx-app/blob/main/README.zh-CN.md)

we recommend to type code below in terminal with npm 5.2+ and higher:

```js
npx create-crx-app my-crx-app
cd my-crx-app
npm run dev
```

We can easily generate a Chrome extension project by using create-crx-app step by step.

Select your project framework:

<img height="150" width="400" src="https://raw.githubusercontent.com/Jcanno/images/master/create-crx-app/framework.png" />

Select your project language:

<img height="150" width="400" src="https://raw.githubusercontent.com/Jcanno/images/master/create-crx-app/lang.png" />

After that, create-crx-app will generate project by your setting.

## Start Extension

1. run `yarn run dev(React)` or `yarn run serve(Vue)` for developing Chrome Extension.
2. input and open `chrome://extensions/` in your Chrome search bar.
3. open `developer mode` in the top right corner in Extensions Page.
4. click `load unpacked extension project`, select the `dist` folder.

## Sample

Sample Extension will generate a purple button which can be moved in the bottom right corner in every page.

<img src="https://raw.githubusercontent.com/Jcanno/images/master/create-crx-app/content.png" />

Click the extension icon and get the popup page, you can turn to options page here

<img src="https://raw.githubusercontent.com/Jcanno/images/master/create-crx-app/popup.png" />

Options page shows you can do everything here.

<img src="https://raw.githubusercontent.com/Jcanno/images/master/create-crx-app/options.png" />

That's all Sample Extension do.
