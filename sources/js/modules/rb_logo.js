( function() {
	'use strict';
	/* jshint eqnull: true */
	var rb = window.rb;
	var $ = rb.$;

	return rb.life.Widget.extend('logo', {
		defaults: {
			debug: true,
		},

		/* use init to construct/prepare/create your widget, but organize your read/write cycles (start layout reads in init and write to DOM using _writeLayout)*/
		init: function(element){
			this._super(element);

			this.log(this.element, this.$element, this.options, this);

			//this._writeLayout = rb.rAF(this._writeLayout, this, true);
		},

		/*
		onceAttached is invoked in the same cycle as init, but after all other current widgets are also initialized
		use for tight dependencies between different widgets
		*/
		onceAttached: function(){

		},

		setOption: function(name, value){
			this._super(name, value);
		},

		/*
		 attached/detached are invoked every time the widget element is inserted or removed from the document.
		 use to bind/unbind global events (resize/scroll) or timers.
		 but only use if really needed (+ not suitable for widgets, that have a lot of instances (50+) on one page at the same time):
		 the pure existence of one of this callback methods can slow down 'remove' performance
		 */
		//attached: function(){
		//
		//},

		//detached: function(){
		//
		//},
		/* you can use getters/setters */
		//get yourGetter(){
		//
		//},
		//set yourSetter(value){
		//
		//}
	});
})();
