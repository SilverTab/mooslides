/**
	Construct a new mooslides object. Make sure that your outterdiv already exists
	and has been inserted in the DOM. (i.e. create a new mooslide in the window.domready
	event.
    @class Represents a mooslides object
	@param {String} outterdiv Your main div
	@param {Object} options A set of options (described below)
	@param {options} customToolbar
	@param {options}
	@example
	var myslides = new mooslides('mydiv', { options });
 */ 

var mooslides = new Class({
	/** @lends mooslides.prototype */
	
	Implements: Options,
	options: {
		customToolbar: false
		
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
	},
	/**
	Builds the toolbar if the user wants to use the default toolbar. *INTERNAL USE*.
	@private
	*/
	buildToolbar: function() {
		var newToolbarDiv = new Element('div', {
			'styles': {
				'height': '24px'	
			}
		});
		
		var newToolbarUl = new Element('ul', {
			'styles': {
				'margin': 0,
				'padding': 0
			}
		});
		this.previousButton = new Element('li', {
			'styles': {
					'display': 'inline',
					'padding': '2px 10px',
					'background-color': '#262626',
					'color': '#eee',
					'cursor': 'pointer'
				},
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
				'styles': {
					'display': 'inline',
					'padding': '2px 10px',
					'background-color': '#262626',
					'color': '#eee',
					'cursor': 'pointer'
				},
				'title': cnt + ""
			});
			this.buttons[cnt-1].addEvent('click', function(aButton) {
				this.slideTo(aButton.get('title') - 1);
			}.bind(this, this.buttons[cnt-1]));
			this.buttons[cnt-1].inject(newToolbarUl);
			cnt = cnt + 1;
		
		}.bind(this));
		this.nextButton = new Element('li', {
			'styles': {
					'display': 'inline',
					'padding': '2px 10px',
					'background-color': '#262626',
					'color': '#eee',
					'cursor': 'pointer'
				},
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
		var myFx = new Fx.Scroll(this.outterdiv, {duration: 1000, transition: Fx.Transitions.Expo.easeOut}).start(toX, 0);
		this.activePanelId = panelId;
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
		this.timer = this.loopNext.periodical(4000, this);
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
			var myFx = new Fx.Scroll(this.outterdiv, {duration: 200, transition: Fx.Transitions.Expo.easeOut}).start(0, 0);
			this.activePanelId = 0;
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
		this.activePanelId = panelId;
	}
});
