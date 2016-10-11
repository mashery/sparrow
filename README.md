# Theme Source Files

Documentation on how to make modifications to your Portal theme.



## File Structure

Compiled and production-ready code can be found in the `dist` directory. The `src` directory contains development code.

```
portal-theme
|—— dist/
|   |—— css/
|   |—— docs/
|   |—— img/
|   |—— js/
|   |—— svg/
|—— src/
|   |—— docs/
|   |   |—— _templates
|   |   |   |—— _header.html
|   |   |   |—— _footer.html
|   |   |—— pattern-library.md
|   |—— js/
|   |   |—— header
|   |   |   |—— # Your feature detection and header scripts
|   |   |—— main
|   |   |   |—— # Your main scripts and JavaScript plugins
|   |—— sass/
|   |   |—— components/
|   |   |   |—— # Your Sass components (compiled in main.scss)
|   |   |—— _config.scss
|   |   |—— _mixins.scss
|   |   |—— main.scss
|   |—— static/
|   |   |—— img/
|   |   |   |—— # Your images
|   |   |—— # Your other non-compiling files
|   |—— svg/
|   |   |—— # Your SVG icons
|—— README.md
|—— gulpfile.js
|—— package.json
```



## Working with the Source Files

Working with the development code in the `src` directory allows you to take advantage of the powerful features included in your theme's [Gulp.js](http://gulpjs.com) build system.

### Dependencies

Make sure these are installed first.

* [Node.js](http://nodejs.org/)
* [Ruby Sass](http://sass-lang.com/install)
* [Gulp](http://gulpjs.com/)</a> `sudo npm install -g gulp`


### Quick Start

1. Open up `package.json`. Change the `name`, `description`, and `author` values as needed.
	```bash
	"name": "CLIENT-NAME-WITHOUT-SPACES",
	"description": "Portal theme for CLIENT",
	"author": {
	    "name": "YOUR NAME"
	}
	```
2. In terminal, navigate into the directory.
	```bash
	cd ~/path/to/portal-theme
	```
3. Use NPM to install the required files.
	```bash
	sudo npm install
	```
4. When it's done installing, run one of the task runners to get going:
	```bash
	gulp # manually compile files
	gulp watch  # automatically compiles files and applies changes using LiveReload
	```


### Working with Sass

Your theme's Sass files are located in `src` > `sass`. Your theme's build system generates minified and unminified CSS files. It also includes [autoprefixer](https://github.com/postcss/autoprefixer), which adds vendor prefixes for you if required by the last two versions of a browser (you can configure browser support in `gulpfile.js`).

#### _config.scss

The `_config.scss` file contains variables for all of the colors, font stacks, breakpoints, and sizing used in your theme. It also contains settings for the grid.

#### _mixins.scss

The `_mixins.scss` file contains just a handful of mixins and functions to speed up development.

* `@include font-face()` - Add the `@font-face` property with all required settings and fields.
* `@include strip-unit()` - Remove the units (px, em, etc.) from numbers.
* `@include calc-em()` - Converts pixels into ems.


#### Components

The `components` folder contains all of the theme components: the grid, button and form styling, and so on. The `main.scss` file imports `_config.scss`, `_mixins.scss`, and the components for processing into a CSS file.

Mashery-specific styles (IO-Docs, Login, etc.) can be found in the `_mashery-*.scss` prefixed files.


### Working with SVG

SVG files placed in the `src` > `svg` directory will be compiled into a single SVG sprite called `icons.svg` in the `dist` > `svg` directory. SVG files placed in a subdirectory of `src` > `svg` will be compiled into a single SVG sprite named after the subdirectory. For example, `svg` > `portfolio` with compile into `portfolio.svg` in the `dist` > `svg` directory.


### Working with JavaScript

Your theme's JavaScript files are located in the `src` > `js` directory.

Files placed directly in the `js` folder will compile directly to `dist` > `js` as both minified and unminified files. Files placed in subdirectories will also be concatenated into a single file.

For example, `header` > `detectSVG.js` and `header` > `merlin.js`compile into `header.js` in the `dist` > `js` directory.

#### Noteworthy Files

<dl>
	<dt><code>header</code> > <code>setup.js</code></dt>
	<dd>Methods to remove default stylesheets and add custom classes to each page for page-specific CSS.</dd>
</dl>
<dl>
	<dt><code>main</code> > <code>dom.js</code>.</dt>
	<dd>DOM manipulation methods, including injecting custom navigation and removing empty paragraph elements.</dd>
</dl>
<dl>
	<dt><code>main</code> > <code>zzz_inits.js</code></dt>
	<dd>Where you should initialize any of the interactive components used in your theme.</dd>
</dl>


### Working with Static Files

Place static files (like images, PDFs, and fonts) in the `static` directory, either directly or in sub-directories. They will be compliled as-is into the the `dist` directory.