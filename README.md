# [jQuery Scrollify](http://projects.lukehaas.me/scrollify)

A jQuery plugin that assists scrolling and snaps to sections. Touch compatible.

## Demo

[http://projects.lukehaas.me/scrollify](http://projects.lukehaas.me/scrollify).

## Basic setup

Scrollify requires jQuery 1.6+ and an easing library such as jquery.easing.js.

The most basic setup is as follows:

```
<! doctype html>
	<html>
		<head>
			<script>
				$(function() {
					$.scrollify({
						section : "section",
					});
				});
			</script>
		</head>
		<body>
			<section></section>
			<section></section>
		</body>
	</html>
```

## Configuration

This is the default configuration:

```
$.scrollify({
		section : "section",
		sectionName : "section-name",
		easing: "easeOutExpo",
		scrollSpeed: 1100,
		offset : 0,
		scrollbars: true,
		before:function() {},
		after:function() {}
	});
```

## Options

`section`
A selector for the sections.

`sectionName`
Scrollify lets you define a hash value for each section. This makes it possible to permalink to particular sections. This is set as a data attribute on the sections. The name of the data attribute is defined by `sectionName`.

`easing`
Define the easing method.

`offset`
A distance in pixels to offset each sections position by.

`scrollbars`
A boolean to define whether scroll bars are visible or not.

`before`
A callback that is called before a section is scrolled to via the move method. Arguments include the index of the section and an array of all section elements.

`after`
A callback that is called after a new section is scrolled to. Arguments include the index of the section and an array of all section elements.

## Methods

The move method can be used to scroll to a particular section. This can take the index of the section, or the name of the section preceded by a hash.

`$.scrollify("move","#name");`

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

