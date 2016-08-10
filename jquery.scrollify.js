/*!
 * jQuery Scrollify
 * Version 1.0.4
 *
 * Requires:
 * - jQuery 1.6 or higher
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



 If section being scrolled to is an interstitialSection and the last section on page

 then value to scroll to is current position plus height of interstitialSection

 */
(function (global,factory) {
	"use strict";
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], function($) {
        	return factory($, global, global.document);
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery, global, global.document);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery, global, global.document);
    }
}(typeof window !== 'undefined' ? window : this, function ($, window, document, undefined) {
	"use strict";
	var heights = [],
		names = [],
		elements = [],
		overflow = [],
		index = 0,
		currentIndex = 0,
		previousIndex = 0,
		interstitialIndex = 1,
		hasLocation = false,
		timeoutId,
		timeoutId2,
		$window = $(window),
		top = $window.scrollTop(),
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
		wheelEvent = 'onwheel' in document ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll',
		settings = {
			//section should be an identifier that is the same for each section
			section: ".section",
			sectionName: "section-name",
			interstitialSection: "",
			easing: "easeOutExpo",
			scrollSpeed: 1100,
			offset : 0,
			scrollbars: true,
			axis:"y",
			target:"html,body",
			standardScrollElements: false,
			setHeights: true,
			overflowScroll:true,
			before:function() {},
			after:function() {},
			afterResize:function() {},
			afterRender:function() {}
		};
	function animateScroll(index,instant,callbacks) {
		if(currentIndex===index) {
			callbacks = false;
		}
		if(disabled===true) {
			return true;
		}
		if(names[index]) {
			scrollable = false;
			if(callbacks) {
				settings.before(index,elements);
			}
			interstitialIndex = 1;
			if(settings.sectionName && !(firstLoad===true && index===0)) {
				if(history.pushState) {
				    try {
							history.replaceState(null, null, names[index]);
				    } catch (e) {
				    	if(window.console) {
				    		console.warn("Scrollify warning: This needs to be hosted on a server to manipulate the hash value.");
				    	}
				    }

				} else {
					window.location.hash = names[index];
				}
			}
			if(instant) {
				$(settings.target).stop().scrollTop(heights[index]);
				if(callbacks) {
					settings.after(index,elements);
				}
			} else {
				locked = true;
				if( $().velocity ) {
					$(settings.target).stop().velocity('scroll', {
	          duration: settings.scrollSpeed,
	          easing: settings.easing,
	          offset: heights[index],
	          mobileHA: false
          });
				} else {
					$(settings.target).stop().animate({
						scrollTop: heights[index]
					}, settings.scrollSpeed,settings.easing);
				}

				if(window.location.hash.length && settings.sectionName && window.console) {
					try {
						if($(window.location.hash).length) {
							console.warn("Scrollify warning: There are IDs on the page that match the hash value - this will cause the page to anchor.");
						}
					} catch (e) {
						console.warn("Scrollify warning:", window.location.hash, "is not a valid jQuery expression.");
					}
				}
				$(settings.target).promise().done(function(){
					currentIndex = index;
					locked = false;
					firstLoad = false;
					if(callbacks) {
						settings.after(index,elements);
					}
				});
			}

		}
	}

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
	$.scrollify = function(options) {
		initialised = true;

		$.easing['easeOutExpo'] = function(x, t, b, c, d) {
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
					manualScroll.calculateNearest();
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
					manualScroll.calculateNearest();

				}, 200);
			},
			calculateNearest:function() {
				top = $window.scrollTop();
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
				if(atBottom() || atTop()) {
					index = closest;
					animateScroll(closest,false,true);
				}
			},
			wheelHandler:function(e,delta) {
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
				var value = e.originalEvent.wheelDelta || -e.originalEvent.deltaY || -e.originalEvent.detail;
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
								previousIndex = index++;
								locked = true;
								animateScroll(index,false,true);
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
								previousIndex = index--;
								locked = true;
								animateScroll(index,false,true);
							} else {
								return false
							}
						}
					}
				}

			},
			keyHandler:function(e) {
				if(disabled===true) {
					return true;
				}
				if(locked===true) {
					return false;
				}
				if(e.keyCode==38) {
					if(index>0) {
						if(atTop()) {
							previousIndex = index--;
							animateScroll(index,false,true);
						}
					}
				} else if(e.keyCode==40) {
					if(index<heights.length-1) {
						if(atBottom()) {
							previousIndex = index++;
							animateScroll(index,false,true);
						}
					}
				}
			},
			init:function() {
				if(settings.scrollbars) {
					$window.bind('mousedown', manualScroll.handleMousedown);
					$window.bind('mouseup', manualScroll.handleMouseup);
					$window.bind('scroll', manualScroll.handleScroll);
				} else {
					$("body").css({"overflow":"hidden"});
				}

				$(document).bind(wheelEvent,manualScroll.wheelHandler);
				$(document).bind('keydown', manualScroll.keyHandler);
			}
		};

		swipeScroll = {
			touches : {
				"touchstart": {"y":-1,"x":-1},
				"touchmove" : {"y":-1,"x":-1},
				"touchend"  : false,
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
				if(index<=heights.length-1) {

					if(atBottom() && index<heights.length-1) {

						previousIndex = index++;
						animateScroll(index,false,true);
					} else {
						if(Math.floor(elements[index].height()/$window.height())>interstitialIndex) {

							interstitialScroll(parseInt(heights[index])+($window.height()*interstitialIndex));
							interstitialIndex += 1;

						} else {
							interstitialScroll(parseInt(heights[index])+(elements[index].height()-$window.height()));
						}

					}
				}
			},
			up: function() {
				if(index>=0) {
					if(atTop() && index>0) {

						previousIndex = index--;
						animateScroll(index,false,true);
					} else {

						if(interstitialIndex>2) {

							interstitialIndex -= 1;
							interstitialScroll(parseInt(heights[index])+($window.height()*interstitialIndex));

						} else {

							interstitialIndex = 1;
							interstitialScroll(parseInt(heights[index]));
						}
					}

				}
			},
			init: function() {
				if (document.addEventListener) {
					document.addEventListener('touchstart', swipeScroll.touchHandler, false);
					document.addEventListener('touchmove', swipeScroll.touchHandler, false);
					document.addEventListener('touchend', swipeScroll.touchHandler, false);
				}
			}
		};


		util = {
			refresh:function(withCallback) {
				clearTimeout(timeoutId2);
				timeoutId2 = setTimeout(function() {
					sizePanels();
					calculatePositions(true);
					if(withCallback) {
							settings.afterResize();
					}
				},400);
			},
			handleUpdate:function() {
				util.refresh(false);
			},
			handleResize:function() {
				util.refresh(true);
			}
		};
		settings = $.extend(settings, options);

		sizePanels();

		calculatePositions(false);

		if(true===hasLocation) {
			animateScroll(index,false,true);
		} else {
			setTimeout(function() {
				animateScroll(0,false,true);
			},200);
		}
		if(heights.length) {
			manualScroll.init();
			swipeScroll.init();

			$window.bind("resize",util.handleResize);
			if (document.addEventListener) {
				window.addEventListener("orientationchange", util.handleResize, false);
			}
		}
		function interstitialScroll(pos) {
			if( $().velocity ) {
				$(settings.target).stop().velocity('scroll', {
					duration: settings.scrollSpeed,
					easing: settings.easing,
					offset: pos,
					mobileHA: false
				});
			} else {
				$(settings.target).stop().animate({
					scrollTop: pos
				}, settings.scrollSpeed,settings.easing);
			}
		}

		function sizePanels() {
			var selector = settings.section;
			overflow = [];
			if(settings.interstitialSection.length) {
				selector += "," + settings.interstitialSection;
			}
			$(selector).each(function(i) {

				if(settings.setHeights) {
					if($(this).is(settings.interstitialSection)) {
						overflow[i] = false;
					} else {

						if(($(this).css("height","auto").outerHeight()<$window.height()) || $(this).css("overflow")==="hidden") {
							$(this).css({"height":$window.height()});

							overflow[i] = false;
						} else {

							$(this).css({"height":$(this).height()});

							if(settings.overflowScroll) {
									overflow[i] = true;
							} else {
								overflow[i] = false;
							}
						}

					}

				} else {

					if(($(this).outerHeight()<$window.height()) || (settings.overflowScroll===false)) {
						overflow[i] = false;
					} else {
						overflow[i] = true;
					}
				}
			});
		}
		function calculatePositions(resize) {
			var selector = settings.section;
			if(settings.interstitialSection.length) {
				selector += "," + settings.interstitialSection;
			}
			heights = [];
			names = [];
			elements = [];
			$(selector).each(function(i){
					if(i>0) {
						heights[i] = parseInt($(this).offset().top) + settings.offset;
					} else {
						heights[i] = parseInt($(this).offset().top);
					}
					if(settings.sectionName && $(this).data(settings.sectionName)) {
						names[i] = "#" + $(this).data(settings.sectionName).replace(/ /g,"-");
					} else {
						if($(this).is(settings.interstitialSection)===false) {
							names[i] = "#" + (i + 1);
						} else {
							names[i] = "#";
							if(i===$(selector).length-1 && i>1) {
								heights[i] = heights[i-1]+parseInt($(this).height());
							}
						}
					}
					elements[i] = $(this);
					try {
						if($(names[i]).length && window.console) {
							console.warn("Scrollify warning: Section names can't match IDs on the page - this will cause the browser to anchor.");
						}
					} catch (e) {}

					if(window.location.hash===names[i]) {
						index = i;
						hasLocation = true;
					}

			});

			if(true===resize) {
				animateScroll(index,false,false);
			} else {
				settings.afterRender();
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

			if(top<parseInt(heights[index])+(elements[index].outerHeight()-$window.height())-28) {

				return false;

			} else {
				return true;
			}
		}
	}

	function move(panel,instant) {
		var z = names.length;
		for(;z>=0;z--) {
			if(typeof panel === 'string') {
				if (names[z]===panel) {
					index = z;
					animateScroll(z,instant,true);
				}
			} else {
				if(z===panel) {
					index = z;
					animateScroll(z,instant,true);
				}
			}
		}
	}
	$.scrollify.move = function(panel) {
		if(panel===undefined) {
			return false;
		}
		if(panel.originalEvent) {
			panel = $(this).attr("href");
		}
		move(panel,false);
	};
	$.scrollify.instantMove = function(panel) {
		if(panel===undefined) {
			return false;
		}
		move(panel,true);
	};
	$.scrollify.next = function() {
		if(index<names.length) {
			index += 1;
			animateScroll(index,false,true);
		}
	};
	$.scrollify.previous = function() {
		if(index>0) {
			index -= 1;
			animateScroll(index,false,true);
		}
	};
	$.scrollify.instantNext = function() {
		if(index<names.length) {
			index += 1;
			animateScroll(index,true,true);
		}
	};
	$.scrollify.instantPrevious = function() {
		if(index>0) {
			index -= 1;
			animateScroll(index,true,true);
		}
	};
	$.scrollify.destroy = function() {
		if(!initialised) {
			return false;
		}
		if(settings.setHeights) {
			$(settings.section).each(function() {
				$(this).css("height","auto");
			});
		}
		$window.unbind("resize",util.handleResize);
		if(settings.scrollbars) {
			$window.unbind('mousedown', manualScroll.handleMousedown);
			$window.unbind('mouseup', manualScroll.handleMouseup);
			$window.unbind('scroll', manualScroll.handleScroll);
		}
		$(document).unbind(wheelEvent,manualScroll.wheelHandler);
		$(document).unbind('keydown', manualScroll.keyHandler);

		if (document.addEventListener) {
			document.removeEventListener('touchstart', swipeScroll.touchHandler, false);
			document.removeEventListener('touchmove', swipeScroll.touchHandler, false);
			document.removeEventListener('touchend', swipeScroll.touchHandler, false);
		}
		heights = [];
		names = [];
		elements = [];
		overflow = [];
	};
	$.scrollify.update = function() {
		if(!initialised) {
			return false;
		}
		util.handleUpdate();
	};
	$.scrollify.getCurrent = function() {
		return elements[index];
	};
	$.scrollify.getPrevious = function() {
		return elements[previousIndex];
	};
	$.scrollify.disable = function() {
		disabled = true;
	};
	$.scrollify.enable = function() {
		disabled = false;
	};
	$.scrollify.isDisabled = function() {
		return disabled;
	};
	$.scrollify.setOptions = function(updatedOptions) {
		if(!initialised) {
			return false;
		}
		if(typeof updatedOptions === "object") {
			settings = $.extend(settings, updatedOptions);
			util.handleUpdate();
		} else if(window.console) {
			console.warn("Scrollify warning: Options need to be in an object.");
		}
	};
}));
