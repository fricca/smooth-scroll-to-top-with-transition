# Smooth Scroll-to-top with CSS transitions

## Description

Source: [http://github.com/fricca/smooth-scroll-to-top-with-transition](http://github.com/fricca/smooth-scroll-to-top-with-transition)

When clicking on the "to top" link the browser smoothly scrolls to the top of the document by using CSS transitions. Older browsers just jump to the top (no, there's no animation fallback).

Test it yourself by scrolling down and clicking on the appearing "to top" link on the right bottom :) For small viewports (below 35em width) the link is always at the page bottom.

### How it's done

When the "to top" link is clicked, a top margin is applied to the html element that smoothly moves the top of the document to the desired position. When the transition finished the new window position is applied and the margin is removed. *Note: I tried it the other way round: first move to window position, then apply transitioned margin, but: slower machines and iOS show visible jump to the new position before starting the transition.*

Flaws: The scrollbar behaviour seems a bit ... odd.

## Test Results

###Working in:

* Desktop
	* Chrome 25 (Win 7)
	* Chrome 26 (OSX Lion)
	* Chrome 27 (Canary) (Win 7)
	* Firefox 19 (Win 7)
	* Firefox 9 (Win 7)
	* Firefox 5 (Win 7)
	* IE 10 (Win 8 - Metro &amp; Desktop)
	* Opera 12.12 (Win 7)
	* Safari 5.1.7 (Win 7)
	* Safari 6.0.2 (OSX Lion)


* Mobile
	* iOS 4.3 Safari (iPod touch 2)
	* iOS 5 Safari (iPod touch 4)
	* iOS 5 Chrome 25 (iPod touch 4)
	* iOS 6.1 Safari (iPad 2) - little flicker when reaching the top position
	* iOS 6.1 Chrome (iPad 2)  - little flicker when reaching the top position
	* Android 2.3 native (Samsung Galaxy S)
	* Android 2.3 Firefox (Samsung Galaxy S)
	* Android 2.3 Opera Mobile(Samsung Galaxy S)
	* Android 2.3 Opera Mobile Beta on (Samsung Galaxy S)
	* Android 4.0.4 native (Nokia XPeria U)
	* Android 4.0.4 Firefox 19.0.2 (Nokia XPeria U)
	* Android 4.0.4 Chrome 25 (Nokia XPeria U)
	* Android 4.0.4 Chrome 26 beta (Nokia XPeria U)
	* Android 4.0.4 Opera Mobile 12.10 (Nokia XPeria U)

### Without transitions:

* Desktop
    * IE 7/8/9
    * Firefox 2 - 3.6


* Mobile
    * Windows Phone 7.8 (Nokia Lumia 800) uses native smooth scrolling

##Usage

### A. With defaults

#### Basic Example ([Demo](http://demos.corina-rudel.de/sst/sstt/basic))

1. Add the base stylesheet to your document, p.e. put the following in the `head`:
```html
	<link rel="stylesheet" href="scrolltotop.css" />
```
... or simply copy its contents to your own stylesheet.

2. Add the `scrolltotop.min.js` to your document and initialize the script, p.e. put the following lines before the closing `</body>` tag:
```html
	<script src="scrolltotop.min.js"></script>
	<script>scrollToTop();</script>
```

With this setup the "link-to-top" will be created by the script and appended at the bottom of your document.

### B. With customized options

Options that can be passed to the `scrollToTop` function as an object (the following code shows the defaults):
```javascript
	{
		// Name of link(s) that trigger(s) scrolling
		// as selector: #id or .class
		linkName: '',
		// distance to scroll (in pixels)
		// while link is invisible
		// only used if there's only ONE toplink
		hiddenDistance: '100',
		// content of topLink if created by script
		topLinkContent: 'To Top'
	}
```

#### Customized Example 1 ([Demo](http://demos.corina-rudel.de/sst/sstt/custom-1))

Use existing custom link for smooth scrolling, p.e. a link that has <code>id="topscroller"</code> and show the link as soon as the user has scrolled 50px from the top:
```html
	<script>
		scrollToTop({
			linkName: '#topscroller',
			hiddenDistance: '50'
		});
	</script>
```
Note that the option `topLinkContent` will have no effect; the original content of the custom link is always used.

#### Customized Example 2 ([Demo](http://demos.corina-rudel.de/sst/sstt/custom-2))

Use several custom links, p.e. links that have <code>class="toplink"</code>
```html
	<script>
		scrollToTop({
			linkName: '.toplink'
		});
	</script>
```
Note that neither the option `hiddenDistance` nor `topLinkContent` will have any effect and the default stylesheet `scrolltotop.css` will only affect the smooth scrolling of the page, not any of the links.

#### Customized Example 3 ([Demo](http://demos.corina-rudel.de/sst/sstt/custom-3))

Let the script create the link but change the default link text and make it always visible:
```html
	<script>
		scrollToTop({
			hiddenDistance: '0',
			topLinkContent: 'Scroll to top'
		});
	</script>
```

## Q &amp; A (<small>to myself</small>)

<dl>
	<dt>Why use margin-top for transition, not transform (that would have better performance)?</dt>
	<dd>
		Because fixed elements on the page will move along with the transformed root element, despite being fixed. I couldn't come up with a reliable solution to kind of "revert" the root transformation on the fixed element(s).
	</dd>
	<dt>Can this be used for smooth scrolling anywhere, p.e. on one page sites?</dt>
	<dd>
		Yes, example soon to come.
	</dd>
</dl>

## License

Licensed under the MIT license.

Copyright (c) 2013 [Corina Rudel](http://corina-rudel.de)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
