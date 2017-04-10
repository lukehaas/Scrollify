# [jQuery Scrollify](https://projects.lukehaas.me/scrollify)

A jQuery plugin that assists scrolling and snaps to sections. Touch optimised.

## Demo

[http://projects.lukehaas.me/scrollify](https://projects.lukehaas.me/scrollify).

## More examples

[Scroll animations](https://projects.lukehaas.me/scrollify/examples/apple)

[Layered scrolling](https://projects.lukehaas.me/scrollify/examples/layered-scrolling)

[Pagination](https://projects.lukehaas.me/scrollify/examples/pagination)

[Full page video](https://projects.lukehaas.me/scrollify/examples/full-page-video)

[Header and footer](https://projects.lukehaas.me/scrollify/examples/header-footer)

[Dynamic content](https://projects.lukehaas.me/scrollify/examples/dynamic-content)

## Basic setup

Scrollify requires jQuery 1.7+.

The most basic setup is as follows:

```html
<!doctype html>
  <html>
    <head>
      <script>
        $(function() {
          $.scrollify({
            section : ".example-classname",
          });
        });
      </script>
    </head>
    <body>
      <div class="example-classname"></div>
      <div class="example-classname"></div>
    </body>
  </html>
```

## Configuration

This is the default configuration:

```javascript
$.scrollify({
    section : ".example-classname",
    sectionName : "section-name",
    interstitialSection : "",
    easing: "easeOutExpo",
    scrollSpeed: 1100,
    offset : 0,
    scrollbars: true,
    standardScrollElements: "",
    setHeights: true,
    overflowScroll: true,
    updateHash: true,
    touchScroll:true,
    before:function() {},
    after:function() {},
    afterResize:function() {},
    afterRender:function() {}
  });
```

## Options

`section`
A CSS selector for the sections of the page.

`sectionName`
Scrollify lets you define a hash value for each section. This makes it possible to permalink to particular sections. This is set as a data attribute on the sections. The name of the data attribute is defined by `sectionName`.

`interstitialSection`
A CSS selector for non-full-height sections, such as a header and footer.

`easing`
Define the easing method.

`offset`
A distance in pixels to offset each sections position by.

`scrollbars`
A boolean to define whether scroll bars are visible or not.

`standardScrollElements`
A CSS selector for elements within sections that require standard scrolling behaviour. For example `standardScrollElements: ".map, .frame"`.

`setHeights`
A boolean to define whether Scollify assigns a height to the sections. True by default.

`overflowScroll`
A boolean to define whether Scrollify will allow scrolling over overflowing content within sections. True by default.

`updateHash`
A boolean to define whether Scrollify updates the browser location hash when scrolling through sections. True by default.

`touchScroll`
A boolean to define whether Scrollify handles touch scroll events. True by default.

`before(index, sections)`
A callback that is fired before a section is scrolled to. Arguments include the index of the section and an array of all section elements.

`after(index, sections)`
A callback that is fired after a new section is scrolled to. Arguments include the index of the section and an array of all section elements.

`afterResize()`
A callback that is fired after the window is resized.

`afterRender()`
A callback that is fired after Scrollify's initialisation.

## Methods

`$.scrollify.move("#name");`

The move method can be used to scroll to a particular section. It can be passed the index of the section, or the name of the section preceded by a hash.

`$.scrollify.instantMove("#name");`

The instantMove method can be used to scroll to a particular section without animation. It can be passed the index of the section, or the name of the section preceded by a hash.

`$.scrollify.next()`

The next method can be used to scroll to a panel that immediately follows the current panel.

`$.scrollify.previous()`

The previous method can be used to scroll to a panel that immediately precedes the current panel.

`$.scrollify.instantNext()`

The instantNext method can be used to scroll to a panel that immediately follows the current panel, without animation.

`$.scrollify.instantPrevious()`

The instantPrevious method can be used to scroll to a panel that immediately precedes the current panel.

`$.scrollify.destroy()`

The destroy method removes all Scrollify events and removes set heights from the panels.

`$.scrollify.update()`

The update method recalculates the heights and positions of the panels.

`$.scrollify.current()`

The current method returns the current section as a jQuery object.

`$.scrollify.currentIndex()`

The currentIndex method returns the current section index, starting at 0.

`$.scrollify.disable()`

The disable method turns off the scroll snap behaviour so that the page scroll like normal.

`$.scrollify.enable()`

The enable method resumes the scroll snap behaviour after the disable method has been used.

`$.scrollify.isDisabled()`

The isDisabled method returns true if Scrollify is currently disabled, otherwise false.


`$.scrollify.setOptions()`

The setOptions method can be used to change any of the initialisation options. Just parse it an options object.

## Issues

If you're working with Scrollify and having issues, please post your questions to [Stackoverflow](http://stackoverflow.com) and tag it with 'jquery-scrollify'.

If you think the issue is with Scrollify itself, please check the [open issues](https://github.com/lukehaas/Scrollify/issues) to see if it has already been logged. If it hasn't, please open a ticket with a detailed description of what you're seeing and details of the device and browser version you're seeing it on.

## FAQ

- Do I have to use the section element for Scrollify sections?

No, Scrollify sections have no relation to the section element. Scrollify sections can be any element you want.

- Can sections receive an active class when they are scrolled to?

Yes, this is something you can easily implement in either the `before` or `after` callbacks (which ever suites you best).

- Can Scrollify be used for horizontal scrolling?

No, this is not currently supported.

- Can I disable Scrollify on mobile?

Yes. Scrollify works well on mobile but if you need to disable it you can use the disable method. `$.scrollify.disable()`.

- Why am I not able to scroll to the bottom of a section?

You must ensure that there is no collapsed content within your sections. This often happens when you have floated content within a container that isn't cleared. All content must be properly contained in order for an accurate section height to be calculated.

- Why are section heights increasing on resize?

This happens when your browser is running in Quirks Mode, usually as the result of an incorrect doctype.

## Setup with SectionName

Scrollify appends a hash value to the URL for each section, this allows for permalinking to particular sections. To define the hash value for each section you need to set a data-attribute on your sections. This data attribute can be called anything you like. The default is "section-name", but if you'd like something else then you'll need to define it with the `sectionName` option.

```html
<!doctype html>
  <html>
    <head>
      <script>
        $(function() {
          $.scrollify({
            section : ".section-class-name",
            sectionName : "section-name"
          });
        });
      </script>
    </head>
    <body>
      <div class="section-class-name" data-section-name="home"></div>
      <div class="section-class-name" data-section-name="about"></div>
    </body>
  </html>
```
## Installation

-	[bower](http://bower.io/) - bower install Scrollify
-	[npm](https://www.npmjs.com/) - npm install jquery-scrollify


## Browser Support

![IE](https://github.com/alrra/browser-logos/raw/master/src/archive/internet-explorer_7-8/internet-explorer_7-8_48x48.png) | ![Chrome](https://github.com/alrra/browser-logos/raw/master/src/chrome/chrome_48x48.png) | ![Firefox](https://github.com/alrra/browser-logos/raw/master/src/firefox/firefox_48x48.png) | ![Opera](https://github.com/alrra/browser-logos/raw/master/src/opera/opera_48x48.png) | ![Safari](https://github.com/alrra/browser-logos/raw/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
IE 7+ ✔ | Chrome ✔ | Firefox ✔ | Opera ✔ | Safari ✔ |


[![Browserstack](http://projects.lukehaas.me/scrollify/images/browserstack2.png)](http://www.browserstack.com/)

Special thanks to [Browserstack](http://www.browserstack.com/) for supporting Scrollify.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :)


## License

[MIT License](https://github.com/lukehaas/Scrollify/blob/master/LICENSE)
