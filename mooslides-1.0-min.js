var mooslides=new Class({Implements:Options,options:{customToolbar:false,transitionEffect:Fx.Transitions.Expo.easeOut,animationDelay:4000,animationDuration:1000,autoStart:false,buttonClass:'toolbar-button'},initialize:function(outterdiv,options){this.setOptions(options);this.outterdiv=$(outterdiv);this.innerdiv=new Element('div',{id:'innerdiv'});$extend(this.toolbarStyles,this.options.toolbarStyles);this.panels=this.outterdiv.getChildren().filter(".panels");if(this.options.customToolbar==false){this.toolbar=this.buildToolbar();this.toolbar.inject(this.outterdiv,'before');}
else{this.toolbar=this.options.customToolbar;}
this.panels.setStyles({float:'left'});this.size=this.panels[0].getSize();this.totalWidth=this.size.x*this.panels.length;this.outterdiv.setStyle('width',this.size.x);this.innerdiv.setStyle('width',this.totalWidth);this.panels.dispose();this.panels.inject(this.innerdiv);this.innerdiv.inject(this.outterdiv);this.outterdiv.setStyle('overflow','hidden');this.activePanelId=0;this.slideTo(0);if(this.options.autoStart){this.loopStart();}},buildToolbar:function(){var newToolbarDiv=new Element('div',{});var newToolbarUl=new Element('ul',{'styles':{'margin':0,'padding':0}});this.previousButton=new Element('li',{'class':this.options.buttonClass,'html':'<<','events':{'click':function(){this.slidePrevious();}.bind(this)}});this.previousButton.inject(newToolbarUl);var cnt=1;this.buttons=[];this.panels.each(function(aPanel){this.buttons[cnt-1]=new Element('li',{'html':cnt+"",'class':this.options.buttonClass,'title':cnt+""});this.buttons[cnt-1].addEvent('click',function(aButton){this.slideTo(aButton.get('title')-1);}.bind(this,this.buttons[cnt-1]));this.buttons[cnt-1].inject(newToolbarUl);cnt=cnt+1;}.bind(this));this.nextButton=new Element('li',{'class':this.options.buttonClass,'html':'>>','events':{'click':function(){this.slideNext();}.bind(this)}});this.nextButton.inject(newToolbarUl);newToolbarUl.inject(newToolbarDiv);return newToolbarDiv;},slideTo:function(panelId){panelId=(panelId<0)?0:panelId;panelId=(panelId>this.panels.length-1)?this.panels.length-1:panelId;var toX=(panelId)*this.size.x;var myFx=new Fx.Scroll(this.outterdiv,{duration:this.options.animationDuration,transition:this.options.transitionEffect}).start(toX,0);this.changed(panelId);},slideNext:function(){nextPanel=(this.activePanelId==this.panels.length-1)?this.activePanelId:this.activePanelId+1;this.slideTo(nextPanel);},slidePrevious:function(){prevPanel=(this.activePanelId==0)?this.activePanelId:this.activePanelId-1;this.slideTo(prevPanel);},slideFirst:function(){this.slideTo(0);},slideLast:function(){this.slideTo(this.panels.length-1);},loopStart:function(){this.timer=this.loopNext.periodical(this.options.animationDelay,this);},loopStop:function(){$clear(this.timer);},loopNext:function(){if(this.activePanelId==this.panels.length-1){var myFx=new Fx.Scroll(this.outterdiv,{duration:200,transition:this.options.transitionEffect}).start(0,0);this.changed(0);}
else{this.slideNext();}},warpTo:function(panelId){panelId=(panelId<0)?0:panelId;panelId=(panelId>this.panels.length-1)?this.panels.length-1:panelId;var toX=(panelId)*this.size.x;var myFx=new Fx.Scroll(this.outterdiv).set(toX,0);this.changed(panelId);},changed:function(newPanel){if(this.options.customToolbar==false)
{this.buttons[this.activePanelId].removeClass('active');this.buttons[newPanel].addClass('active');}
this.activePanelId=newPanel;this.outterdiv.fireEvent('changed',newPanel);}});
