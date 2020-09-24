# 🥃 Whiskey Whiskey Whiskey _WWW_
Website boilerplate to create static webpages for the World Wide Web.

## Stack
- **[Twig](https://twig.symfony.com/)** Flexible template engine
- **[SASS](https://sass-lang.com/)** Build stylesheets quickly
- **[Babel](https://babeljs.io/)** Take advantage of modern Javascript
- **[Gulp](https://gulpjs.com/)** As a task runner to compile everything

## Libraries incluided
- **[Bulma](https://bulma.io/)** As a CSS Framework
- **[Swiper](https://swiperjs.com/)** Javascript Slider

## File Structure
```bash
src
+-- fonts
+-- html # Here we create our website structure
|   +-- _resources # Files here are merely for template purposes
+-- images
+-- js
|   +-- app.js # This file will become the final .js file
+-- scss # SCSS Style folder
|   +-- main.scss # This file will become the final .css stylsheet
+-- gulpfile.js # Gulp file with the required tasks
```

## Important Gulp tasks
To build the required files just run
```bash
gulp
# or
gulp default
```

To watch the files while working locally
```bash
gulp watch
```