/*!
 * Smooth scroll to top with CSS transitions
 *
 * Author: Corina Rudel @friccaW
 * Version: 1.02
 * Source: http://github.com/fricca/smooth-scroll-to-top-with-transition
 */

var scrollToTop = (function(w, d) {
	var // changable settings
		settings = {
			// Name of link(s) that trigger(s) scrolling
			// as selector: #id or .class
			linkName: '',
			// distance to scroll (in pixels) until scroll link is visible
			// only used if there's only ONE toplink
			hiddenDistance: '100',
			// content of topLink if created by script
			topLinkContent: 'To Top'
		},
		// unchangable settings
		data = {
			// class to be attached to toplink
			linkClass: 'sstt',
			// class for single link
			singleClass: 'is-single',
			// class to be set when toplink is hidden
			hiddenClass: 'is-hidden',
			// class to be set when toplink is visible
			visibleClass: 'is-visible',
			// class to be set on root element to trigger transition
			animationClass: 'is-animated'
		},
		root = d.documentElement,
		body = d.body,
		topLink = [],
		target,
		distance,
		startedAnim,
		scrollTimer,

		/**
		 * HELPER
		 */
		MCC = {
			test: {
				// Tests for transitionend event
				transitionEnd: (function transitionEvent() {
					var el = d.documentElement,
						transitions = {
							'transition': 'transitionend',
							'OTransition':'otransitionend',
							'MozTransition':'transitionend',
							'WebkitTransition': 'webkitTransitionEnd'
						},
						type,
						prefix;

					for(type in transitions) {
						if(typeof transitions[type] !== 'undefined' && typeof el.style[type] !== 'undefined') {
							return transitions[type];
						}
					}
				}())
			},

			// Return replacement pattern for certain class (cls)
			classPattern: function(cls) {
				var pattern = new RegExp("(^| )" + cls + "( |$)");
				return pattern;
			},

			// Check if element (el) has certain class (cls)
			hasClass: function(el, cls) {
				var pattern;
				if(el && cls) {
					if(typeof el.classList !== 'undefined') {
						return el.classList.contains(cls);
					} else {
						pattern = this.classPattern(cls);
						return pattern.test(el.className);
					}
				}
			},

			// Get all elements that have certain class
			getElementsByClass: function(cls) {
				var foundEls = [],
					allEls,
					i,
					ii,
					elem;

				if(d.getElementsByClassName) {
					foundEls = d.getElementsByClassName(cls);
				} else {
					if(d.all) {
						allEls = d.all;
					} else {
						allEls = d.getElementsByTagName('*');
					}
					for (i = 0, ii = allEls.length; i < ii; i++) {
						elem = allEls[i];
						if(MCC.hasClass(elem, cls)) {
							foundEls[foundEls.length] = elem;
						}
					}
				}
				return foundEls;
			},

			// Add class to element
			addClass: function(el, cls) {
				var classes;

				if(el && cls) {
					if(typeof el.classList !== 'undefined') {
						el.classList.add(cls);
					} else if(el && cls && !this.hasClass(el, cls)) {
						if(el.className !== '') {
							classes = el.className + ' ' + cls;
						} else {
							classes = cls;
						}
						el.className = classes;
					}
				}
			},

			// Remove class from element
			removeClass: function(el, cls) {
				var pattern;
				if(el && cls) {
					if(typeof el.classList !== 'undefined') {
						el.classList.remove(cls);
					} else {
						pattern = this.classPattern(cls);
						// replace matching classname (with potential leading whitespace); $1 is backreference to (^| )
						el.className = el.className.replace(pattern, "$1");
						// replace potential trailing whitespace
						el.className = el.className.replace(/ $/, "");
					}
				}
			},

			// Add eventListener to element
			// @sources
			// http://ejohn.org/blog/flexible-javascript-events/
			// http://www.quirksmode.org/blog/archives/2005/10/_and_the_winner_1.html
			addEvent: function(obj, type, fn) {
				if(obj && type && fn) {
					// Add event
					if(obj.addEventListener) {
						obj.addEventListener(type, fn, false);
					} else if(obj.attachEvent) {
						obj["e" + type + fn] = fn;
						obj[type + fn] = function() {
							obj["e" + type + fn](w.event);
						};
						obj.attachEvent("on" + type, obj[type + fn]);
					}
				}
			},

			// Nomalize preventDefault
			stopDefault: function(evt) {
				if(evt && evt.preventDefault) {
					evt.preventDefault();
				} else if(w.event && w.event.returnValue) {
					w.event.returnValue = false;
				}
			}
		};

	/**
	 * SPECIFIC FUNCTIONS
	 */

	function check(config) {
		var item;
		for(item in config) {
			// set defaults to custom settings if valid values are passed in
			if(config.hasOwnProperty(item) && settings.hasOwnProperty(item)) {
				settings[item] = config[item];
			}
		}
	}

	function getNameFromSelector(selector) {
		var name = {};
		if(selector.indexOf('#') !== -1) {
			// The Id is everything after the #
			name.id = selector.substr(selector.indexOf('#') + 1);
		} else if (selector.indexOf('.') !== -1) {
			// The class is everything after the .
			name.className = selector.substr(selector.indexOf('.') + 1);
		}
		return name;
	}

	function clearAnimation() {
		root.removeEventListener(MCC.test.transitionEnd, endListener, false);
		MCC.removeClass(root, data.animationClass);

		// Reset margin and move window to top
		root.style.marginTop = root._marginTop || '';
		delete(root._marginTop);

		startedAnim = false;
	}

	function cancelAnimation() {
		var currentPos = w.pageYOffset || root.scrollTop,
			marginTop = parseInt(w.getComputedStyle(root, null).getPropertyValue("margin-top"), 10) || 0,
			newPos;

		if(startedAnim) {
			newPos = currentPos - marginTop;
			clearAnimation();
			w.scrollTo(0, newPos);
		}
	}

	function endListener(event) {
		if(event.propertyName === 'margin-top') {
			clearAnimation();
			w.scrollTo(0, 0);
		}
	}

	function scrollIt() {
		var rootTop;

		// clean up if something went wrong before
		if(startedAnim) {
			clearAnimation();
		}

		distance = w.pageYOffset || root.scrollTop;

		if(distance) {
			// smooth scrolling if browser supports transitionend event
			if(MCC.test.transitionEnd) {
				// check if root element has own top margin
				if(w.getComputedStyle) {
					rootTop = parseInt(w.getComputedStyle(root, null).getPropertyValue("margin-top"), 10);
					if(rootTop) {
						distance = distance + rootTop;
					}
				}

				// Store style.marginTop for later re-set
				root._marginTop = root.style.marginTop;

				// add eventListener for transitionend
				root.addEventListener(MCC.test.transitionEnd, endListener, false);

				// add is-animated class to root element
				MCC.addClass(root, data.animationClass);

				root.style.marginTop = distance + 'px';
				// Set indicator for started transition
				// used to clean up if something went wrong
				startedAnim = true;
			} else {
				// Move window to top
				w.scrollTo(0, 0);
			}
		}
	}

	function listener(event) {
		var evTarget = event.target || event.srcElement; // normal || IE <= 8;
		MCC.stopDefault(event);

		scrollIt();
	}

	function checkScroll(link) {

		// check if there's an unfinished transition left
		// might happen if the transionend event didn't fire
		// p.e. if the transition is set for the wrong properties or
		// left out completely
		// OR if the transition is disturbed by manual scrolling
		if(startedAnim) {
			cancelAnimation();
		}

		// Check if toplink should be visible or hidden
		if(link && settings.hiddenDistance) {
			// check for scroll position every 100ms
			if(scrollTimer) {
				clearTimeout(scrollTimer);
			}
			scrollTimer = setTimeout(function() {
				var top = w.pageYOffset || root.scrollTop;
				if(top >= settings.hiddenDistance) {
					MCC.removeClass(link, data.hiddenClass);
					MCC.addClass(link, data.visibleClass);
				} else {
					MCC.addClass(link, data.hiddenClass);
					MCC.removeClass(link, data.visibleClass);
				}
			}, 100);
		}
	}

	function createLink() {
		var link;

		link = d.createElement('a');
		link.href="#";

		if(typeof link.textContent !== 'undefined') {
			link.textContent = settings.topLinkContent;
		} else {
			link.innerText = settings.topLinkContent;
		}
		body.appendChild(link);

		return link;
	}

	function prepareLinks(links) {
		var i,
			ii,
			top,
			oneLink;

		// for all links
		for (i = 0, ii = links.length; i < ii; i++) {
			MCC.addClass(links[i], data.linkClass);
			MCC.addEvent(links[i], 'click', listener);
		}

		// If only one link and hiddenDistance is set
		if(links.length === 1) {
			MCC.addClass(links[0], data.singleClass);

			top = w.pageYOffset || root.scrollTop;
			if(settings.hiddenDistance > 0) {
				oneLink = links[0];
			}
			// Inital hidden/visible class
			if(top < settings.hiddenDistance) {
				MCC.addClass(links[0], data.hiddenClass);
			} else {
				MCC.addClass(links[0], data.visibleClass);
			}
		}

		// Listener for scrolling
		// used to show/hide toplink (oneLink) on hiddenDistance
		// and to cancel Animation if something went wrong
		// ony needed if either there's only one top link or
		// if transitions are supported
		if(oneLink || MCC.test.transitionEnd) {
			MCC.addEvent(w, 'scroll',
				function() {
					checkScroll(oneLink);
				}
			);
		}
	}

	function init(config) {
		var topLinkName;

		// Check for user defined configuration
		if(config) {
			check(config);
		}

		// Check for custom link selector
		if(settings.linkName) {
			// Get link name, returns either .id or .className
			topLinkName = getNameFromSelector(settings.linkName);

			if(topLinkName.hasOwnProperty('className')) {
				// Try to get link(s) from className
				topLink = MCC.getElementsByClass(topLinkName.className);
			} else if(topLinkName.hasOwnProperty('id')) {
				// Try to get link from ID
				topLink[0] = d.getElementById(topLinkName.id);
			}

			// If neither a useful class or ID are given: the end
			if(!topLink[0]) {
				return;
			}
		} else {
			// If no custom selector set: create link
			topLink[0] = createLink();
		}

		// Prepare link
		if(topLink.length > 0) {
			prepareLinks(topLink);
		}
	}

	return init;
}(window, document));
