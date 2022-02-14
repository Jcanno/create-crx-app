<h1 align="center"><img height="300" src="https://raw.githubusercontent.com/Jcanno/images/master/create-crx-app/create-crx-app.png" /><br> </h1>

<h3 align="center">CLI for create Chrome extension app</h3>

[English](https://github.com/Jcanno/create-crx-app)|简体中文

如果你的 npm 版本大于 5.2，推荐在终端这样使用 create-crx-app：

```js
npx create-crx-app my-crx-app
cd my-crx-app
npm run dev
```

通过 create-crx-app， 我们可以一步步生成谷歌插件项目

选择你的项目框架:

<img height="150" width="400" src="https://raw.githubusercontent.com/Jcanno/images/master/create-crx-app/framework.png" />

选择你的项目语言:

<img height="150" width="400" src="https://raw.githubusercontent.com/Jcanno/images/master/create-crx-app/lang.png" />

create-crx-app 将会按照你的所有配置生成项目

## 启动插件

1. 运行 `yarn run dev(React)` 或者 `yarn run serve(Vue)` 来开发 Chrome 插件.
2. 在 Chrome 浏览器打开`chrome://extensions/` 扩展管理面板.
3. 在扩展管理面板右上角开启`开发者模式`.
4. 点击`加载已解压的扩展程序`，选择项目打包好的`dist`文件夹

## 插件样品

插件实例将会在每个页面的右下角生成一个可拖拽移动的紫色按钮.

<img src="https://raw.githubusercontent.com/Jcanno/images/master/create-crx-app/content.png" />

点击插件图标可以看到插件弹出页，在这里可以跳转到插件配置页.

<img src="https://raw.githubusercontent.com/Jcanno/images/master/create-crx-app/popup.png" />

配置页意味着你在这里可以做任何事.

<img src="https://raw.githubusercontent.com/Jcanno/images/master/create-crx-app/options.png" />

这就是样品插件所提供的功能.
