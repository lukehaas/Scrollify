/*!
 * jQuery Scrollify
 * Version 1.0.20
 *
 * Requires:
 * - jQuery 1.7 or higher
 *
 * https://github.com/lukehaas/Scrollify
 *
 * Copyright 2016, Luke Haas
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



if touchScroll is false - update index

 */

/*jshint esversion: 6 */

(function (global,factory) {
	"use strict";
	"esversion: 6";
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		return factory(document.querySelector, global, global.document);
	} else if (typeof module === 'object' && module.exports) {
		// Node/CommonJS
		module.exports = factory(document.querySelector, global, global.document);
	} else {
		// Browser globals
		factory(document.querySelector, global, global.document);
	}
	}(typeof window !== 'undefined' ? window : this, function ($, window, document, undefined) {
	"use strict";
	var heights = [],
		names = [],
		elements = [],
		overflow = [],
		index = 0,
		currentIndex = 0,
		interstitialIndex = 1,
		hasLocation = false,
		timeoutId,
		timeoutId2,
		$window = window,
		portHeight,
		top = window.scrollY,
		scrollable = false,
		locked = false,
		scrolled = false,
		manualScroll,
		swipeScroll,
		util,
		disabled = false,
		scrollSamples = [],
		scrollTime = new Date().getTime(),
		firstLoad = true,
		initialised = false,
		destination = 0,
		wheelEvent = 'onwheel' in document ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll',
		settings = {
			//section should be an identifier that is the same for each section
			section: ".section",
			sectionName: "section-name",
			interstitialSection: "",
			easing: "easeOutExpo",
			scrollSpeed: 1100,
			offset: 0,
			scrollbars: true,
			target:"html,body",
			standardScrollElements: false,
			setHeights: true,
			overflowScroll:true,
			updateHash: true,
			touchScroll:true,
			before:function() {},
			after:function() {},
			afterResize:function() {},
			afterRender:function() {}
		};
	
	// Smooth page scrolling in vanilla js (Thanks https://pawelgrzybek.com/page-scroll-in-vanilla-javascript/)
	function scrollIt(destination, duration = 200, easing = 'linear', callback) {
		const easings = {
		  linear(t) {
			return t;
		  },
		  easeInQuad(t) {
			return t * t;
		  },
		  // Duplicate of ^
		  easeInExpo(t) {
			return t * (2 - t);
		  },
		  easeOutQuad(t) {
			return t * (2 - t);
		  },
		  // Duplicate of ^
		  easeOutExpo(t) {
			return t * (2 - t);
		  },
		  easeInOutQuad(t) {
			return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
		  },
		  easeInCubic(t) {
			return t * t * t;
		  },
		  easeOutCubic(t) {
			return (--t) * t * t + 1;
		  },
		  easeInOutCubic(t) {
			return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
		  },
		  easeInQuart(t) {
			return t * t * t * t;
		  },
		  easeOutQuart(t) {
			return 1 - (--t) * t * t * t;
		  },
		  easeInOutQuart(t) {
			return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
		  },
		  easeInQuint(t) {
			return t * t * t * t * t;
		  },
		  easeOutQuint(t) {
			return 1 + (--t) * t * t * t * t;
		  },
		  easeInOutQuint(t) {
			return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
		  }
		};
	  
		const start = window.pageYOffset;
		const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
	  
		const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
		const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
		const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
		const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
	  
		if ('requestAnimationFrame' in window === false) {
		  window.scroll(0, destinationOffsetToScroll);
		  if (callback) {
			callback();
		  }
		  return;
		}
	  
		function scroll() {
		  const now = 'now' in window.performance ? performance.now() : new Date().getTime();
		  const time = Math.min(1, ((now - startTime) / duration));
		  const timeFunction = easings[easing](time);
		  window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));
	  
		  if (window.pageYOffset === destinationOffsetToScroll) {
			if (callback) {
			  callback();
			}
			return;
		  }
	  
		  requestAnimationFrame(scroll);
		}
	  
		scroll();
	}

	function getportHeight() {
		return ($window.innerHeight + settings.offset);
	}

	function animateScroll(index,instant,callbacks,toTop) {
		if(currentIndex===index) {
		callbacks = false;
		}
		if(disabled===true) {
		return true;
		}
		if(names[index]) {
		scrollable = false;
		if(firstLoad===true) {
			firstLoad = false;
			settings.afterRender();
		}
		if(callbacks) {
			if( typeof settings.before == 'function' && settings.before(index,elements) === false ){
			return true;
			}
		}
		interstitialIndex = 1;
		destination = (!index) ? 0 : heights[index];
		if(firstLoad===false && currentIndex>index && toTop===false) {
			//We're going backwards
			if(overflow[index]) {
			portHeight = getportHeight();
	
			interstitialIndex = parseInt(elements[index].outerHeight()/portHeight);
	
			destination = parseInt(heights[index])+(elements[index].outerHeight()-portHeight);
			}
		}
	
	
		if(settings.updateHash && settings.sectionName && !(firstLoad===true && index===0)) {
			if(history.pushState) {
				try {
				history.replaceState(null, null, names[index]);
				} catch (e) {
				if(window.console) {
					console.warn("Scrollify warning: Page must be hosted to manipulate the hash value.");
				}
				}
	
			} else {
			window.location.hash = names[index];
			}
		}
	
		currentIndex = index;
		if(instant)
		{
			document.body.scrollTop = destination;

			if(callbacks)
			{
				settings.after(index,elements);
			}
		}
		else
		{
			locked = true;

			// Scroll to section
			scrollIt(
				destination,
				settings.scrollSpeed,
				settings.easing,
				() =>
				{
					locked = false;
					firstLoad = false;
					if(callbacks) {
						settings.after(index,elements);
					}
				}
			);
	
			if(window.location.hash.length && settings.sectionName && window.console)
			{
				try {
					if(window.location.hash.length) {
						console.warn("Scrollify warning: ID matches hash value - this will cause the page to anchor.");
					}
				} catch (e) {}
			}
		}
	
		}
	}

	console.dir(animateScroll);
	
	function isAccelerating(samples) {
		function average(num) {
			var sum = 0;
		
			var lastElements = samples.slice(Math.max(samples.length - num, 1));
		
			for(var i = 0; i < lastElements.length; i++){
				sum += lastElements[i];
			}
		
			return Math.ceil(sum/num);
		}
	
		var avEnd = average(10);
		var avMiddle = average(70);
	
		if(avEnd >= avMiddle) {
			return true;
		} else {
			return false;
		}
	}
	var scrollify = function(options) {
		initialised = true;
		scrollify.easing = [];
		scrollify.easing.easeOutExpo = function(x, t, b, c, d) {
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		};
	
			manualScroll = {
			handleMousedown:function() {
				if(disabled===true) {
				return true;
				}
				scrollable = false;
				scrolled = false;
			},
			handleMouseup:function() {
				if(disabled===true) {
				return true;
				}
				scrollable = true;
				if(scrolled) {
				//instant,callbacks
				manualScroll.calculateNearest(false,true);
				}
			},
			handleScroll:function() {
				if(disabled===true) {
				return true;
				}
				if(timeoutId){
				clearTimeout(timeoutId);
				}
		
				timeoutId = setTimeout(function(){
				scrolled = true;
				if(scrollable===false) {
					return false;
				}
				scrollable = false;
				//instant,callbacks
				manualScroll.calculateNearest(false,true);
				}, 200);
			},
			calculateNearest:function(instant,callbacks) {
				top = window.pageYOffset | document.body.scrollTop;
				var i =1,
				max = heights.length,
				closest = 0,
				prev = Math.abs(heights[0] - top),
				diff;
				for(;i<max;i++) {
				diff = Math.abs(heights[i] - top);
		
				if(diff < prev) {
					prev = diff;
					closest = i;
				}
				}
				if((atBottom() && closest>index) || atTop()) {
				index = closest;
				//index, instant, callbacks, toTop
				animateScroll(closest,instant,callbacks,false);
				}
			},
			wheelHandler:function(e) {
				if(disabled===true) {
				return true;
				} else if(settings.standardScrollElements) {
				if($(e.target).is(settings.standardScrollElements) || $(e.target).closest(settings.standardScrollElements).length) {
					return true;
				}
				}
				if(!overflow[index]) {
				e.preventDefault();
				}
				var currentScrollTime = new Date().getTime();
		
		
				e = e || window.event;
				var value;
				if (e.originalEvent) {
					value = e.originalEvent.wheelDelta || -e.originalEvent.deltaY || -e.originalEvent.detail;
				} else {
					value = e.wheelDelta || -e.deltaY || -e.detail;
				}
				var delta = Math.max(-1, Math.min(1, value));
		
				//delta = delta || -e.originalEvent.detail / 3 || e.originalEvent.wheelDelta / 120;
		
				if(scrollSamples.length > 149){
				scrollSamples.shift();
				}
				//scrollSamples.push(Math.abs(delta*10));
				scrollSamples.push(Math.abs(value));
		
				if((currentScrollTime-scrollTime) > 200){
				scrollSamples = [];
				}
				scrollTime = currentScrollTime;
		
		
				if(locked) {
				return false;
				}
				if(delta<0) {
				if(index<heights.length-1) {
					if(atBottom()) {
					if(isAccelerating(scrollSamples)) {
						e.preventDefault();
						index++;
						locked = true;
						//index, instant, callbacks, toTop
						animateScroll(index,false,true, false);
					} else {
						return false;
					}
					}
				}
				} else if(delta>0) {
				if(index>0) {
					if(atTop()) {
					if(isAccelerating(scrollSamples)) {
						e.preventDefault();
						index--;
						locked = true;
						//index, instant, callbacks, toTop
						animateScroll(index,false,true, false);
					} else {
						return false;
					}
					}
				}
				}
		
			},
			keyHandler:function(e) {
				if(disabled===true || document.activeElement.readOnly===false) {
				return true;
				} else if(settings.standardScrollElements) {
				if($(e.target).is(settings.standardScrollElements) || $(e.target).closest(settings.standardScrollElements).length) {
					return true;
				}
				}
				if(locked===true) {
				return false;
				}
				if(e.keyCode==38 || e.keyCode==33) {
				if(index>0) {
					if(atTop()) {
					e.preventDefault();
					index--;
					//index, instant, callbacks, toTop
					animateScroll(index,false,true,false);
					}
				}
				} else if(e.keyCode==40 || e.keyCode==34) {
				if(index<heights.length-1) {
					if(atBottom()) {
					e.preventDefault();
					index++;
					//index, instant, callbacks, toTop
					animateScroll(index,false,true,false);
					}
				}
				}
			},
			init: () =>
			{
				if(settings.scrollbars)
				{
					$window.addEventListener('mousedown', manualScroll.handleMousedown);
					$window.addEventListener('mouseup', manualScroll.handleMouseup);
					$window.addEventListener('scroll', manualScroll.handleScroll);
				}
				else
				{
					$("body").css({"overflow":"hidden"});
				}
				window.addEventListener(wheelEvent, manualScroll.wheelHandler, { passive: false });
				//$(document).bind(wheelEvent,manualScroll.wheelHandler);
				$window.addEventListener('keydown', manualScroll.keyHandler);
			}
		};
	
		swipeScroll = {
		touches : {
			"touchstart": {"y":-1,"x":-1},
			"touchmove" : {"y":-1,"x":-1},
			"touchend"	: false,
			"direction" : "undetermined"
		},
		options:{
			"distance" : 30,
			"timeGap" : 800,
			"timeStamp" : new Date().getTime()
		},
		touchHandler: function(event) {
			if(disabled===true) {
			return true;
			} else if(settings.standardScrollElements) {
			if($(event.target).is(settings.standardScrollElements) || $(event.target).closest(settings.standardScrollElements).length) {
				return true;
			}
			}
			var touch;
			if (typeof event !== 'undefined'){
			if (typeof event.touches !== 'undefined') {
				touch = event.touches[0];
				switch (event.type) {
				case 'touchstart':
					swipeScroll.touches.touchstart.y = touch.pageY;
					swipeScroll.touches.touchmove.y = -1;
	
					swipeScroll.touches.touchstart.x = touch.pageX;
					swipeScroll.touches.touchmove.x = -1;
	
					swipeScroll.options.timeStamp = new Date().getTime();
					swipeScroll.touches.touchend = false;
				case 'touchmove':
					swipeScroll.touches.touchmove.y = touch.pageY;
					swipeScroll.touches.touchmove.x = touch.pageX;
					if(swipeScroll.touches.touchstart.y!==swipeScroll.touches.touchmove.y && (Math.abs(swipeScroll.touches.touchstart.y-swipeScroll.touches.touchmove.y)>Math.abs(swipeScroll.touches.touchstart.x-swipeScroll.touches.touchmove.x))) {
					//if(!overflow[index]) {
						event.preventDefault();
					//}
					swipeScroll.touches.direction = "y";
					if((swipeScroll.options.timeStamp+swipeScroll.options.timeGap)<(new Date().getTime()) && swipeScroll.touches.touchend == false) {
	
						swipeScroll.touches.touchend = true;
						if (swipeScroll.touches.touchstart.y > -1) {
	
						if(Math.abs(swipeScroll.touches.touchmove.y-swipeScroll.touches.touchstart.y)>swipeScroll.options.distance) {
							if(swipeScroll.touches.touchstart.y < swipeScroll.touches.touchmove.y) {
	
							swipeScroll.up();
	
							} else {
							swipeScroll.down();
	
							}
						}
						}
					}
					}
					break;
				case 'touchend':
					if(swipeScroll.touches[event.type]===false) {
					swipeScroll.touches[event.type] = true;
					if (swipeScroll.touches.touchstart.y > -1 && swipeScroll.touches.touchmove.y > -1 && swipeScroll.touches.direction==="y") {
	
						if(Math.abs(swipeScroll.touches.touchmove.y-swipeScroll.touches.touchstart.y)>swipeScroll.options.distance) {
						if(swipeScroll.touches.touchstart.y < swipeScroll.touches.touchmove.y) {
							swipeScroll.up();
	
						} else {
							swipeScroll.down();
	
						}
						}
						swipeScroll.touches.touchstart.y = -1;
						swipeScroll.touches.touchstart.x = -1;
						swipeScroll.touches.direction = "undetermined";
					}
					}
				default:
					break;
				}
			}
			}
		},
		down: function() {
	
			if(index<heights.length) {
	
			if(atBottom() && index<heights.length-1) {
	
				index++;
				//index, instant, callbacks, toTop
				animateScroll(index,false,true,false);
			} else {
				portHeight = getportHeight();
				if(Math.floor(elements[index].height()/portHeight)>interstitialIndex) {
	
				interstitialScroll(parseInt(heights[index])+(portHeight*interstitialIndex));
				interstitialIndex += 1;
	
				} else {
				interstitialScroll(parseInt(heights[index])+(elements[index].outerHeight()-portHeight));
				}
	
			}
			}
		},
		up: function() {
			if(index>=0) {
			if(atTop() && index>0) {
	
				index--;
				//index, instant, callbacks, toTop
				animateScroll(index,false,true,false);
			} else {
	
				if(interstitialIndex>2) {
				portHeight = getportHeight();
	
				interstitialIndex -= 1;
				interstitialScroll(parseInt(heights[index])+(portHeight*interstitialIndex));
	
				} else {
	
				interstitialIndex = 1;
				interstitialScroll(parseInt(heights[index]));
				}
			}
	
			}
		},
		init: function() {
			if (document.addEventListener && settings.touchScroll) {
			var eventListenerOptions = {
				passive: false
			};
			document.addEventListener('touchstart', swipeScroll.touchHandler, eventListenerOptions);
			document.addEventListener('touchmove', swipeScroll.touchHandler, eventListenerOptions);
			document.addEventListener('touchend', swipeScroll.touchHandler, eventListenerOptions);
			}
		}
		};
	
	
		util = {
		refresh:function(withCallback,scroll) {
			clearTimeout(timeoutId2);
			timeoutId2 = setTimeout(function() {
			//retain position
			sizePanels(true);
			//scroll, firstLoad
			calculatePositions(scroll,false);
			if(withCallback) {
				settings.afterResize();
			}
			},400);
		},
		handleUpdate:function() {
			//callbacks, scroll
			//changed from false,true to false,false
			util.refresh(false,false);
		},
		handleResize:function() {
			//callbacks, scroll
			util.refresh(true,false);
		},
		handleOrientation:function() {
			//callbacks, scroll
			util.refresh(true,true);
		}
		};

		{
			// Thanks https://plainjs.com/javascript/utilities/merge-two-javascript-objects-19/! (Vanilla JS version of $.extend)
			let extend = (obj, src) => {
				for (var key in src) {
					if (src.hasOwnProperty(key)) obj[key] = src[key];
				}
				return obj;
			};
			
			settings = extend(settings, options);
		}
	
		//retain position
		sizePanels(false);
	
		calculatePositions(false,true);
	
		if(true===hasLocation) {
		//index, instant, callbacks, toTop
		animateScroll(index,false,true,true);
		} else {
		setTimeout(function() {
			//instant,callbacks
			manualScroll.calculateNearest(true,false);
		},200);
		}
		if(heights.length)
		{
			manualScroll.init();
			swipeScroll.init();
		
			$window.addEventListener("resize",util.handleResize);

			if (document.addEventListener)
			{
				window.addEventListener("orientationchange", util.handleOrientation, false);
			}
		}

		function interstitialScroll(pos)
		{
			// Scroll to section
			scrollIt(
				pos,
				settings.scrollSpeed,
				settings.easing,
				() => {}
			);
		}
	
		function sizePanels(keepPosition) {
			if(keepPosition) {
				top = $window.scrollTop();
			}
		
			var selector = settings.section;
			overflow = [];
			
			if(settings.interstitialSection.length) {
				selector += "," + settings.interstitialSection;
			}
			if(settings.scrollbars===false) {
				settings.overflowScroll = false;
			}
			portHeight = getportHeight();
			document.querySelectorAll(selector).forEach((val, i) =>
			{
				if(settings.setHeights)
				{
					if(settings.interstitialSection ? val.matches(settings.interstitialSection) : false)
					{
						overflow[i] = false;
					}
					else
					{
						val.style.height = "auto";
						if(val.offsetHeight < portHeight || val.style.overflow === "hidden")
						{
							console.log(portHeight);
							val.style.height = portHeight.toString() + "px";
							console.dir(val);
				
							overflow[i] = false;
						}
						else
						{
							val.style.height = val.offsetHeight.toString() + "px";
				
							if(settings.overflowScroll) {
								overflow[i] = true;
							}
							else
							{
								overflow[i] = false;
							}
						}
			
					}
				}
				else
				{
					if(val.offsetHeight < portHeight || settings.overflowScroll === false)
					{
						overflow[i] = false;
					}
					else
					{
						overflow[i] = true;
					}
				}
			});
			if(keepPosition) {
				$window.scrollTop(top);
			}
		}
		function calculatePositions (scroll,firstLoad)
		{
			var selector = settings.section;

			var offset = (elem) =>
			{
				// Thanks http://youmightnotneedjquery.com/
				var rect = elem.getBoundingClientRect();

				return {
				  top: rect.top + document.body.scrollTop,
				  left: rect.left + document.body.scrollLeft
				};
			};

			if(settings.interstitialSection.length)
			{
				selector += "," + settings.interstitialSection;
			}

			heights = [];
			names = [];
			elements = [];

			document.querySelectorAll(selector).forEach((val,i) =>
			{
				var $this = val;

				if(i > 0)
				{
					heights[i] = parseInt(offset($this).top) + settings.offset;
				}
				else
				{
					heights[i] = parseInt(offset($this).top);
				}

				if(settings.sectionName && $this.getAttribute(settings.sectionName))
				{
					names[i] = "#" + $this.getAttribute(settings.sectionName).toString().replace(/ /g,"-");
				}
				else
				{
					if(settings.interstitialSection ? ($this.matches(settings.interstitialSection) === false) : false)
					{
						names[i] = "#" + (i + 1);
					}
					else
					{
						names[i] = "#";

						if(i === document.querySelectorAll(selector).length-1 && i>1)
						{
							heights[i] = heights[i-1] + (parseInt($($(selector)[i-1]).outerHeight()) - parseInt($(window).height())) + parseInt($this.outerHeight());
						}
					}
				}
				elements[i] = $this;
				try {
					if($(names[i]).length && window.console) {
					console.warn("Scrollify warning: Section names can't match IDs - this will cause the browser to anchor.");
					}
				} catch (e) {}
		
				if(window.location.hash===names[i]) {
					index = i;
					hasLocation = true;
				}
		
			});
		
			if(true===scroll) {
				//index, instant, callbacks, toTop
				animateScroll(index,false,false,false);
			}
		}
	
		function atTop() {
		if(!overflow[index]) {
			return true;
		}
		top = $window.scrollTop();
		if(top>parseInt(heights[index])) {
			return false;
		} else {
			return true;
		}
		}
		function atBottom() {
		if(!overflow[index]) {
			return true;
		}
		top = $window.scrollTop();
		portHeight = getportHeight();
	
		if(top<parseInt(heights[index])+(elements[index].outerHeight()-portHeight)-28) {
	
			return false;
	
		} else {
			return true;
		}
		}
	};
	
	function move(panel,instant)
	{
		var z = names.length;
		for(;z>=0;z--)
		{
			if(typeof panel === 'string')
			{
				if (names[z]===panel)
				{
					index = z;
					//index, instant, callbacks, toTop
					animateScroll(z,instant,true,true);
				}
			}
			else
			{
				if(z===panel)
				{
					index = z;
					//index, instant, callbacks, toTop
					animateScroll(z,instant,true,true);
				}
			}
		}
	}
	scrollify.move = function(panel) {
		if(panel===undefined)
		{
			return false;
		}
		if(panel.originalEvent)
		{
			panel = panel.getAttribute("href");
		}
		move(panel,false);
	};
	scrollify.instantMove = function(panel) {
		if(panel===undefined)
		{
			return false;
		}
		move(panel,true);
	};
	scrollify.next = () => 
	{
		if(index < names.length)
		{
			index += 1;
			//index, instant, callbacks, toTop
			animateScroll(index,false,true,true);
		}
	};
	scrollify.previous = () =>
	{
		if(index>0) {
		index -= 1;
		//index, instant, callbacks, toTop
		animateScroll(index,false,true,true);
		}
	};
	scrollify.instantNext = () =>
	{
		if(index<names.length)
		{
		index += 1;
		//index, instant, callbacks, toTop
		animateScroll(index,true,true,true);
		}
	};
	scrollify.instantPrevious = () => {
		if(index>0) {
		index -= 1;
		//index, instant, callbacks, toTop
		animateScroll(index,true,true,true);
		}
	};
	scrollify.destroy = () => {
		if(!initialised) {
		return false;
		}
		if(settings.setHeights) {
		$(settings.section).each(function() {
			$(this).css("height","auto");
		});
		}
		$window.off("resize",util.handleResize);
		if(settings.scrollbars) {
		$window.off('mousedown', manualScroll.handleMousedown);
		$window.off('mouseup', manualScroll.handleMouseup);
		$window.off('scroll', manualScroll.handleScroll);
		}
		// $window.off(wheelEvent,manualScroll.wheelHandler);
		window.removeEventListener(wheelEvent,manualScroll.wheelHandler);
		$window.off('keydown', manualScroll.keyHandler);
	
		if (document.addEventListener && settings.touchScroll) {
		document.removeEventListener('touchstart', swipeScroll.touchHandler, false);
		document.removeEventListener('touchmove', swipeScroll.touchHandler, false);
		document.removeEventListener('touchend', swipeScroll.touchHandler, false);
		}
		heights = [];
		names = [];
		elements = [];
		overflow = [];
	};
	scrollify.update = () => {
		if(!initialised) {
		return false;
		}
		util.handleUpdate();
	};
	scrollify.current = () => {
		return elements[index];
	};
	scrollify.currentIndex = () => {
		return index;
	};
	scrollify.disable = () => {
		disabled = true;
	};
	scrollify.enable = () => {
		disabled = false;
		if (initialised) {
		//instant,callbacks
		manualScroll.calculateNearest(false,false);
		}
	};
	scrollify.isDisabled = () => {
		return disabled;
	};
	scrollify.setOptions = function(updatedOptions)
	{
		if(!initialised)
		{
			return false;
		}

		if(typeof updatedOptions === "object")
		{
			settings = $.extend(settings, updatedOptions);
			util.handleUpdate();
		}
		else if(window.console)
		{
			console.warn("Scrollify warning: setOptions expects an object.");
		}
	};
	window.scrollify = scrollify;
	return scrollify;
	}));