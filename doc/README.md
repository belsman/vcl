# Visual Component Library

[![Join the chat at https://gitter.im/vcl](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vcl?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**Modular** and **extensible** CSS for the era of component-based
Web application development.

- Browse **[vcl.github.io](https://vcl.github.io/)** for the docs and demos.
- Check **[the presentation](https://vcl.github.io/presentation/index.html)**
introducing the VCL.

## Status

The current modules are released in the **2.x.x version series** and adhere to
[semver](http://semver.org/).
All modules with version level `>= 0.1.0` are ready for production use.

## Features

- Designed to style [Web Components](http://webcomponents.org/).
- JS framework agnostic ‒ use it with Angular, React and the like.
- For ambitious mobile and desktop applications.
- Theming through modules which can inherit from each other.
- [Default theme](https://github.com/vcl/vcl/packages/vcl/theme)
  for core modules with ~500 variables.
- Extensible through custom modules or just project local styles.
- Integrates seamlessly with any sass based build process.
- As lightweight as you want ‒ include only what you need.
- Quick rendering through simple, low specificity selectors.
- Maintainable & readable code with unabstracted, obvious naming conventions.
- Relative units like `em` (Elements) are used wherever feasible.
- Powered by sass [sass](https://sass-lang.com/)
  and [npm](https://www.npmjs.org/) eco systems.
- Mostly independent of HTML structure and element names.
- Generation of interactive documentations like [vcl.github.io](https://vcl.github.io/) only for modules **you** use.
- Embrace flex, no more float.

## Getting Started

### Example Project

See [the tutorial](https://github.com/vcl/vcl/tree/master/doc/tutorial) for
how to use VCL modules in a Web project and how to make it part of its
build process.

### Run a Module's Demos

```sh
git clone https://github.com/vcl/vcl.git
npm install
npm run demo [module name] -- watch
e.g.
npm run demo button -- watch
```

### Missing a Module?

If you are a developer, see below how to create one.
We are willed to add new modules to the VCL org's range of modules
if they fit.
Otherwise [create an issue](https://vcl.github.io/issues).

### Development

See [DEVELOPMENT.md](DEVELOPMENT.md)
for the mechanics and philosophy behind VCL modules.

## Creating Releases

After your changes have been merged into master, run
```sh
npm run tag
npm run publish
```
