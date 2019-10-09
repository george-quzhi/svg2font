# svg2font

svg2font 是基于font-carrier的命令行工具，旨在由svg生成目前浏览器支持的多种字体文件。

## Install

### command line
```sh
npm install -g https://github.com/george-quzhi/svg2font.git
```
### node
```sh
npm install --save https://github.com/george-quzhi/svg2font.git
```
## Usage

### command line
```sh
svg2font ./test/svgs ./test/font/
```
### node
```js
var svg2font = require("svg2font");
svg2font.generate(svgPath, fontPath);
```

# [Licence](LICENSE)

MIT
