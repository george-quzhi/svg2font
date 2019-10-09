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
```markdown
Positional arguments:
  svgPath               Input svg path
  fontPath              Output font path

Optional arguments:
  -h, --help                                Show this help message and exit.
  -v, --version                             Show program's version number and exit.
  -u UNICODENUM, --unicodeNum UNICODENUM    unicodeNum, 指定font的unicode起始值。default 60000（默认加1）&#xEA61;。 
  -n FILENAME, --fileName FILENAME          fileName, 指定生成字体文件的名字。default iconfont。
  

  iconfont.ttf ...

  -f FONTFAMILY, --fontFamily FONTFAMILY    fontFamily, 指定字体的font-family。default iconfont
  

  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  -c FONTCLASS, --fontClass FONTCLASS       fontClass, 指定图标class的前缀。default icon-。
  

  .icon-test-1:before {
    content: "\ea61";
  }

```
### node
```js
var svg2font = require("svg2font");
svg2font.generate(svgPath, fontPath);
```

# [Licence](LICENSE)

MIT
