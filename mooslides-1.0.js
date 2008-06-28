/*
	mooslides-1.0.js by Jean-Nicolas Jolivet (http://www.silverscripting.com)
	Licenced under the MIT license: http://www.opensource.org/licenses/mit-license.php
*/

/**
	Construct a new mooslides object. Make sure that your outterdiv already exists
	and has been inserted in the DOM. (i.e. create a new mooslide in the window.domready
	event.
    @class Represents a mooslides object
	@param {String} outterdiv Your main div
	@param {Object} options A set of options (described below)
	
	<dt class="heading">Options</dt>
	@param {bool} [options.customToolbar='false'] Set to true if you plan on using your 
	own toolbar. If you do, you will have to come up with your own Next, Previous, ...,
	buttons. You can use the slideTo(), slideNext(), slidePrevious(), slideFirst() and
	slideLast() functions to help you out.
	
	@param {Fx.Transitions} [options.transitionEffect='Fx.Transitions.Expo.easeOut'] An 
	Fx.Transitions object that will be used when switching panels.
	
	@params {Int} [options.animationDuration='1000'] The duration of the panel switching
	effect.
	
	@param {Int} [options.animationDelay='4000'] Number of milliseconds to wait between 
	panel switching in animation mode.
	
	@param {bool} [options.autoStart='false'] Set to true if you want the animation to 
	start when the page is loaded.
	
	@param {String} [options.buttonClass='toolbar-button'] If you want to use the default toolbar, 
	you can specify a custom class that will be applied to the toolbar's buttons. This is
	only so you can control the styles of the toolbar. Checkout the example abouve, it
	contains a basic style that should get you started.
	
	@example 
	// Creating a new mooslides with those styles.
	var myslides = new mooslides('mydiv', {
		customToolbar: false,
		toolbarStyles: myStyles
	});
	
	// an example CSS style that makes a pretty toolbar
	li.toolbar-button {
		display: inline;
		background-color: #262626;
		padding: 2px 5px;
		color: #ddd;
		cursor: pointer;
	}
	
 */ 

var mooslides = new Class({
	/** @lends mooslides.prototype */
	
	Implements: Options,
	options: {
		customToolbar: false,
		transitionEffect: Fx.Transitions.Expo.easeOut,
		animationDelay: 4000,
		animationDuration: 1000,
		autoStart: false,
		buttonClass: 'toolbar-button'
	},
	/**
	@private
	@constructor
	*/
	initialize: function(outterdiv, options) {
		
		this.setOptions(options);
		this.outterdiv = $(outterdiv);
		this.innerdiv = new Element('div', {
			id: 'innerdiv'
		});
		
		$extend(this.toolbarStyles, this.options.toolbarStyles);
		this.panels = this.outterdiv.getChildren().filter(".panels");
		if(this.options.customToolbar == false) {
			this.toolbar = this.buildToolbar();
			this.toolbar.inject(this.outterdiv, 'before');
		}
		else {
			this.toolbar = this.options.customToolbar;
		}
		
		this.panels.setStyles({
			float: 'left'
		});
		this.size = this.panels[0].getSize();
		this.totalWidth = this.size.x * this.panels.length;
		this.outterdiv.setStyle('width', this.size.x);
		this.innerdiv.setStyle('width', this.totalWidth);
		this.panels.dispose();
		this.panels.inject(this.innerdiv);
		this.innerdiv.inject(this.outterdiv);
		
		this.outterdiv.setStyle('overflow', 'hidden');
		this.activePanelId = 0;
		
		this.slideTo(0);

		if(this.options.autoStart) {
			this.loopStart();
		}
		
	},
	/**
	Builds the toolbar if the user wants to use the default toolbar. *INTERNAL USE*.
	@private
	*/
	buildToolbar: function() {
		var newToolbarDiv = new Element('div', {});
		
		var newToolbarUl = new Element('ul', {
			'styles': {
				'margin': 0,
				'padding': 0
			}
		});
		this.previousButton = new Element('li', {
			'class': this.options.buttonClass,
			'html' : '<<',
			'events': {
				'click': function() {
					this.slidePrevious();
				}.bind(this)
			}
		});
		this.previousButton.inject(newToolbarUl);
		var cnt = 1;
		this.buttons = [];
		this.panels.each(function(aPanel) {
			
			this.buttons[cnt-1] = new Element('li', {
				'html': cnt + "",
				'class': this.options.buttonClass,
				'title': cnt + ""
			});
			this.buttons[cnt-1].addEvent('click', function(aButton) {
				this.slideTo(aButton.get('title') - 1);
			}.bind(this, this.buttons[cnt-1]));
			this.buttons[cnt-1].inject(newToolbarUl);
			cnt = cnt + 1;
		
		}.bind(this));
		this.nextButton = new Element('li', {
			'class': this.options.buttonClass,
				'html' : '>>',
				'events': {
					'click': function() {
						this.slideNext();
					}.bind(this)
				}
		});
		this.nextButton.inject(newToolbarUl);
		
		newToolbarUl.inject(newToolbarDiv);
		return newToolbarDiv;
	},
	
	/**
	Slides to the specified panel
	@param {Int} panelId The id of the panel to scroll to. (zero-based)
	@example
	myslides.slideTo(0) // slides to the first panel
	*/
	slideTo: function(panelId) {
		panelId = (panelId < 0) ? 0 : panelId;
		panelId = (panelId > this.panels.length - 1) ? this.panels.length - 1 : panelId;
		var toX = (panelId ) * this.size.x;
		var myFx = new Fx.Scroll(this.outterdiv, {duration: this.options.animationDuration, transition: this.options.transitionEffect}).start(toX, 0);
		this.changed(panelId);
	},
	
	/**
	Slides to the next panel
	@example
	myslides.slideNext();
	*/
	slideNext: function() {
		nextPanel =	(this.activePanelId == this.panels.length -1) ? this.activePanelId : this.activePanelId  + 1;
		this.slideTo(nextPanel);

	},
	/**
	Slides to the preview panel
	@example
	myslides.slidePrevious();
	*/
	slidePrevious: function() {
		prevPanel =	(this.activePanelId == 0) ? this.activePanelId : this.activePanelId  - 1;
		this.slideTo(prevPanel);
	},
	
	/**
	Slides to the first panel
	@example
	myslides.slideFirst();
	*/
	slideFirst: function() {
		this.slideTo(0);
	},
	
	/**
	Slides to the last panel
	@example
	myslides.slideLast();
	*/
	slideLast: function() {
		this.slideTo(this.panels.length - 1);
	},
	
	/**
	Starts the animation. Panels will change at the interval specified
	in options. When it reaches the last panel, it will quickly go back
	to the first panel.
	@example
	myslides.loopStart();
	*/
	loopStart:function () {
		this.timer = this.loopNext.periodical(this.options.animationDelay, this);
	},
	
	/**
	Stops the animation
	@example
	myslides.loopStop();
	*/
	loopStop: function() {
		$clear(this.timer);
	},
	
	/**
	Do the actual loop. *INTERNAL USE*
	@private
	*/
	loopNext: function() {
		if(this.activePanelId == this.panels.length -1) {
			var myFx = new Fx.Scroll(this.outterdiv, {duration: 200, transition: this.options.transitionEffect}).start(0, 0);
			this.changed(0);
		}
		else {
			this.slideNext();
		}
	},
	
	
	/**
	Similar to slideTo but does it without an animation. This means you will move
	instantly to the specified panelId
	@param {Int} panelId The id of the panel to warp to. Zero-based.
	*/
	warpTo: function(panelId) {
		panelId = (panelId < 0) ? 0 : panelId;
		panelId = (panelId > this.panels.length - 1) ? this.panels.length - 1 : panelId;
		var toX = (panelId ) * this.size.x;
		var myFx = new Fx.Scroll(this.outterdiv).set(toX, 0);
		this.changed(panelId);
	},
	
	/**
	Changed event. This is mostly for internal use. Note that it fires a "changed" event
	on the main div. You can catch this event. The id of the newly selected panel
	will be passed as an argument to your callback function.
	@event
	@returns {Int} The id of the newly selected panel.
	*/
	changed: function(newPanel) {
		if(this.options.customToolbar == false)
		{
			
			this.buttons[this.activePanelId].removeClass('active');
			this.buttons[newPanel].addClass('active');
		}
		this.activePanelId = newPanel;
		this.outterdiv.fireEvent('changed', newPanel);
	}
});
