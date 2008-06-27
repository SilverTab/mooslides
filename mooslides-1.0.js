var mooslides = new Class({
	Implements: Options,
	options: {
		customToolbar: null
	},
	
	initialize: function(outterdiv, options) {
		this.setOptions(options);
		this.outterdiv = $(outterdiv);
		this.innerdiv = new Element('div', {
			id: 'innerdiv'
		});
		
		
		this.panels = this.outterdiv.getChildren().filter(".panels");
		if(this.options.customToolbar == null) {
			this.toolbar = this.buildToolbar();
			console.log(this.toolbar);
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
	
	slideTo: function(panelId) {
		panelId = (panelId < 0) ? 0 : panelId;
		panelId = (panelId > this.panels.length - 1) ? this.panels.length - 1 : panelId;
		var toX = (panelId ) * this.size.x;
		var myFx = new Fx.Scroll(this.outterdiv, {duration: 1000, transition: Fx.Transitions.Expo.easeOut}).start(toX, 0);
		this.activePanelId = panelId;
	},
	
	slideNext: function() {
		nextPanel =	(this.activePanelId == this.panels.length -1) ? this.activePanelId : this.activePanelId  + 1;
		this.slideTo(nextPanel);

	},
	slidePrevious: function() {
		prevPanel =	(this.activePanelId == 0) ? this.activePanelId : this.activePanelId  - 1;
		this.slideTo(prevPanel);
	},
	loopStart:function () {
		this.timer = this.loopNext.periodical(4000, this);
	},
	
	loopStop: function() {
		$clear(this.timer);
	},
	
	loopNext: function() {
		if(this.activePanelId == this.panels.length -1) {
			var myFx = new Fx.Scroll(this.outterdiv, {duration: 200, transition: Fx.Transitions.Expo.easeOut}).start(0, 0);
			this.activePanelId = 0;
		}
		else {
			this.slideNext();
		}
	},
	
	warpTo: function(panelId) {
		panelId = (panelId < 0) ? 0 : panelId;
		panelId = (panelId > this.panels.length - 1) ? this.panels.length - 1 : panelId;
		var toX = (panelId ) * this.size.x;
		var myFx = new Fx.Scroll(this.outterdiv).set(toX, 0);
		this.activePanelId = panelId;
	}
});
