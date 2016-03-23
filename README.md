# [jQuery Scrollify](http://projects.lukehaas.me/scrollify)

A jQuery plugin that assists scrolling and snaps to sections. Touch optimised. 

## Demo

[http://projects.lukehaas.me/scrollify](http://projects.lukehaas.me/scrollify).

## Basic setup

Scrollify requires jQuery 1.6+.

The most basic setup is as follows:

```
<! doctype html>
	<html>
		<head>
			<script>
				$(function() {
					$.scrollify({
						section : ".section-class-name",
					});
				});
			</script>
		</head>
		<body>
			<div class="section-class-name"></div>
			<div class="section-class-name"></div>
		</body>
	</html>
```

## Configuration

This is the default configuration:

```
$.scrollify({
		section : ".section-class-name",
		sectionName : "section-name",
		easing: "easeOutExpo",
		scrollSpeed: 1100,
		offset : 0,
		scrollbars: true,
		standardScrollElements: "",
		setHeights: true,
		before:function() {},
		after:function() {},
		afterResize:function() {},
		afterRender:function() {}
	});
```

## Options

`section`
A CSS selector for the sections.

`sectionName`
Scrollify lets you define a hash value for each section. This makes it possible to permalink to particular sections. This is set as a data attribute on the sections. The name of the data attribute is defined by `sectionName`. Set this to `false` to disable hash values.

`easing`
Define the easing method.

`offset`
A distance in pixels to offset each sections position by.

`scrollbars`
A boolean to define whether scroll bars are visible or not.

`standardScrollElements`
A string of selectors for elements that require standard scrolling behaviour. For example `standardScrollElements: ".map, .frame"`.

`setHeights`
A boolean to define whether Scollify assigns a height to the sections. True by default.

`before`
A callback that is fired before a section is scrolled to. Arguments include the index of the section and an array of all section elements.

`after`
A callback that is fired after a new section is scrolled to. Arguments include the index of the section and an array of all section elements.

`afterResize`
A callback that is fired after the window is resized.

`afterRender`
A callback that is fired after Scrollify's initialisation.

## Methods

`$.scrollify.move("#name");`

The move method can be used to scroll to a particular section. It can be parsed the index of the section, or the name of the section preceded by a hash.

`$.scrollify.instantMove("#name");`

The instantMove method can be used to scroll to a particular section without animation. It can be parsed the index of the section, or the name of the section preceded by a hash.

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

`$.scrollify.disable()`

The disable method turns off the scroll snap behaviour so that the page scroll like normal.

`$.scrollify.enable()`

The enable method resumes the scroll snap behaviour after the disable method has been used.

`$.scrollify.isDisabled()`

The isDisabled method returns true if Scrollify is currently disabled, otherwise false.


`$.scrollify.setOptions()`

The setOptions method can be used to change any of the initialisation options. Just parse it an options object.

## Setup with SectionName

Scrollify appends a hash value to the URL for each section, this allows for permalinking to particular sections. To define the hash value for each section you need to set a data-attribute on your sections. This data attribute can be called anything you like. The default is "section-name", but if you'd like something else then you'll need to define it with the `sectionName` option.

```
<! doctype html>
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

## Behaviour

Scrollify will set a height on panels equal to the window height unless a panel is already equal to or greater than the window height. On scrolling up or down, Scrollify will snap the scoll position to a panel that is one along from the current panel, in the direction of scrolling. Scrolling can be done via the keyboards up and down arrows, the mouse wheel, a trackpad, or clicking and dragging the scroll bar. 

If you are viewing a panel with a height that is greater than the window, Scrollify will only snap to another section if you are at the top or bottom of the panel, allowing for normal scrolling behaviour inbetween these points.

## Browser Support

![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
IE 7+ ✔ | Chrome ✔ | Firefox ✔ | Opera ✔ | Safari ✔ |

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :)


## License

[MIT License](https://github.com/lukehaas/Scrollify/blob/master/LICENSE)

