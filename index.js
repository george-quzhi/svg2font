#!/usr/bin/env node
var fs = require('fs');
var fontCarrier = require('font-carrier')
var path = require('path');
var pinyin = require("pinyin");
var DOMParser = require('xmldom').DOMParser
var svgPathify = require('svg_pathify');

var unicodeNum = 60000;
var fileName = 'iconfont';
var fontFamily = 'iconfont';
var fontClass = 'icon-';


var Svg2Font = (function () {
  return {
    generate: function (inputPath, outputPath, options) {
      var cssItems = [];
      var symbols = [];
      var demoUnicodeList = [];
      var demoClassList = [];
      var demoSymbolList = [];
      if (options.unicodeNum) unicodeNum = options.unicodeNum;

      if (options.fileName) fileName = options.fileName;

      if (options.fontFamily) fontFamily = options.fontFamily;

      if (options.fontClass) fontClass = options.fontClass;

      const font = fontCarrier.create();
      font.setFontface({
        fontFamily: fontFamily
      });

      try {
        var travel = function (dir) {
          if (!fs.statSync(dir).isDirectory()) {
            readSvg(dir);
          } else {
            fs.readdirSync(dir).forEach(function (file) {

              var pathname = path.join(dir, file);
              if (fs.statSync(pathname).isDirectory()) {
                travel(pathname);
              } else {
                readSvg(pathname);
              }
            });
          }
        }

        var readSvg = function (dir) {
          const unicode = '&#' + ++unicodeNum + ';';
          const glyph = fs.readFileSync(dir).toString();
          const svgDocNode = (new DOMParser()).parseFromString(svgPathify(glyph), 'application/xml');
          const pathNode = svgDocNode.getElementsByTagName('path').toString();
          const glyphName = path.basename(dir).split('.')[0];
          const pinyinStr = pinyin(glyphName, { style: pinyin.STYLE_NORMAL }).join("");
          const className = fontClass + pinyinStr;
          const content = '\\' + unicodeNum.toString(16);

          demoUnicodeList.push([
            `<li class="dib">`,
            `  <span class="icon ${fontFamily}">&#x${unicodeNum.toString(16)};</span>`,
            `  <div class="name">${glyphName}</div>`,
            `  <div class="code-name">&amp;#x${unicodeNum.toString(16)};</div>`,
            `</li>`
          ].join('\n'));

          demoClassList.push([
            `<li class="dib">`,
            `  <span class="icon ${fontFamily} ${className}"></span>`,
            `  <div class="name">${glyphName}</div>`,
            `  <div class="code-name">.${className}</div>`,
            `</li>`
          ].join('\n'));

          demoSymbolList.push([
            `<li class="dib">`,
            `  <svg class="icon svg-icon" aria-hidden="true">`,
            `    <use xlink:href="#${className}"></use>`,
            `  </svg>`,
            `  <div class="name">${glyphName}</div>`,
            `  <div class="code-name">#${className}</div>`,
            `</li>`
          ].join('\n'));

          symbols.push(`<symbol id="${className}" viewBox="0 0 1024 1024">${pathNode}</symbol>`);
          const items = [
            `.${className}:before {`,
            `  content: "${content}";`,
            `}`
          ];
          cssItems.push(items.join('\n'));

          font.setGlyph(unicode, {
            svg: glyph,
            glyphName: pinyinStr
          });
        }

        travel(inputPath);

        if (!fs.existsSync(outputPath)) {
          fs.mkdirSync(outputPath);
        }
        //输出字体文件
        font.output({
          path: path.join(outputPath, fileName)
        });

        //输出css文件
        const woff2 = fs.readFileSync(path.join(outputPath, fileName) + '.woff2').toString()
        const base64 = Buffer.from(woff2).toString('base64')
        const timestamp = new Date().getTime();
        const cssStr = [
          `@font-face {`,
          `  font-family: "${fontFamily}";`,
          `  src: url('${fileName}.eot?t=${timestamp}'); /* IE9 */`,
          `  src: url('${fileName}.eot?t=${timestamp}#iefix') format('embedded-opentype'), /* IE6-IE8 */`,
          `  url('data:application/x-font-woff2;charset=utf-8;base64,${base64}') format('woff2'),`,
          `  url('${fileName}.woff?t=${timestamp}') format('woff'),`,
          `  url('${fileName}.ttf?t=${timestamp}') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */`,
          `  url('${fileName}.svg?t=${timestamp}#${fontFamily}') format('svg'); /* iOS 4.1- */`,
          `}\n`,
          `.${fontFamily} {`,
          `  font-family: "${fontFamily}" !important;`,
          `  font-size: 16px;`,
          `  font-style: normal;`,
          `  -webkit-font-smoothing: antialiased;`,
          `  -moz-osx-font-smoothing: grayscale;`,
          `}\n\n`
        ].join('\n') + cssItems.join('\n\n');

        fs.writeFileSync(path.join(outputPath, fileName + '.css'), cssStr);

        //输出js文件
        const jsStr = `!function (a) { var t, c = '<svg>${symbols.join('')}</svg>', e = (t = document.getElementsByTagName("script"))[t.length - 1].getAttribute("data-injectcss"); if (e && !a.__iconfont__svg__cssinject__) { a.__iconfont__svg__cssinject__ = !0; try { document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>") } catch (t) { console && console.log(t) } } !function (t) { if (document.addEventListener) if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) setTimeout(t, 0); else { var e = function () { document.removeEventListener("DOMContentLoaded", e, !1), t() }; document.addEventListener("DOMContentLoaded", e, !1) } else document.attachEvent && (n = t, l = a.document, o = !1, (i = function () { try { l.documentElement.doScroll("left") } catch (t) { return void setTimeout(i, 50) } c() })(), l.onreadystatechange = function () { "complete" == l.readyState && (l.onreadystatechange = null, c()) }); function c() { o || (o = !0, n()) } var n, l, o, i }(function () { var t, e; (t = document.createElement("div")).innerHTML = c, c = null, (e = t.getElementsByTagName("svg")[0]) && (e.setAttribute("aria-hidden", "true"), e.style.position = "absolute", e.style.width = 0, e.style.height = 0, e.style.overflow = "hidden", function (t, e) { e.firstChild ? function (t, e) { e.parentNode.insertBefore(t, e) }(t, e.firstChild) : e.appendChild(t) }(e, document.body)) }) }(window);`
        fs.writeFileSync(path.join(outputPath, fileName + '.js'), jsStr);

        //输出demo-html
        let demoHtmlStr = fs.readFileSync(path.join(__dirname, 'template', 'demo_index.html')).toString();
        demoHtmlStr = demoHtmlStr.replace('<div id="unicode-list"></div>', demoUnicodeList.join('\n\n'));
        demoHtmlStr = demoHtmlStr.replace('<div id="class-list"></div>', demoClassList.join('\n\n'));
        demoHtmlStr = demoHtmlStr.replace('<div id="symbol-list"></div>', demoSymbolList.join('\n\n'));
        demoHtmlStr = demoHtmlStr.replace('iconfont.css', `${fileName}.css`);
        demoHtmlStr = demoHtmlStr.replace('iconfont.js', `${fileName}.js`);
        fs.writeFileSync(path.join(outputPath, 'demo_index.html'), demoHtmlStr);

        //输出demo-css
        fs.copyFileSync(path.join(__dirname, 'template', 'demo.css'), path.join(outputPath, 'demo.css'));

      } catch (e) {
        console.error(e);
        console.error("Can't open input file (%s)", inputPath);
        process.exit(1);
      }
    },
    reverse: function (inputPath, outputPath) {
      try {
        if (!fs.existsSync(outputPath)) {
          fs.mkdirSync(outputPath);
        }

        var glyphs = fontCarrier.transfer(inputPath).allGlyph();

        const svgs = [];
        for (key in glyphs) {
          if (key == "&#x78;") {
            continue;
          }
          var svg = glyphs[key].toSvg();
          var glyphName = glyphs[key].options.name || glyphs[key].options.glyphName || key.slice(1);
          svgs.push([
            `<li class="dib">`,
            `  <img class="icon svg-icon" src="data:image/svg+xml;base64,${new Buffer(svg).toString('base64')}" alt=""></img>`,
            `  <div class="name">${glyphName}</div>`,
            `  <div class="code-name">${key.slice(1)}</div>`,
            `</li>`
          ].join('\n'));
          fs.writeFileSync(path.join(outputPath, glyphName + '.svg'), svg);
        }

        let template = fs.readFileSync(path.join(__dirname, 'template', 'demo_svg.html')).toString();
        template = template.replace('<div id="svg-list"></div>', svgs.join('\n\n'));
        fs.writeFileSync(path.join(outputPath, 'demo_svg.html'), template);
      } catch (e) {
        console.error(e);
        console.error("Can't open input file (%s)", inputPath);
      }
    }
  }
})()

module.exports = Svg2Font
