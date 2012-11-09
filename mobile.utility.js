(function(){

	var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	var push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    concat           = ArrayProto.concat,
	    unshift          = ArrayProto.unshift,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
    var nativeForEach      = ArrayProto.forEach,
	    nativeMap          = ArrayProto.map,
	    nativeReduce       = ArrayProto.reduce,
	    nativeReduceRight  = ArrayProto.reduceRight,
	    nativeFilter       = ArrayProto.filter,
	    nativeEvery        = ArrayProto.every,
	    nativeSome         = ArrayProto.some,
	    nativeIndexOf      = ArrayProto.indexOf,
	    nativeLastIndexOf  = ArrayProto.lastIndexOf,
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind;
	
	var $ = function(query){
		return new NodeList(query);
	}

	$.extend = function (target, obj) {
		target = target || NodeList.prototype;	// To help plugin development
		for (var prop in obj) {
			target[prop] = obj[prop];
		}
	};

	$.extend($,{		
		ready : function(fn){
			document.addEventListener('DOMContentLoaded', fn, false);	
		},
		has : function(obj,key){
			return hasOwnProperty.call(obj, key);
		},
		hasClass : function(el,className){
			return new RegExp('(^|\\s)' + className + '(\\s|$)').test(el.className);
		},
		each : function(obj, iterator, context){
			if (obj == null) return;
		    if (nativeForEach && obj.forEach === nativeForEach) {
		      	obj.forEach(iterator, context);
		    } else if (obj.length === +obj.length) {
			      for (var i = 0, l = obj.length; i < l; i++) {
			        	if (iterator.call(context, obj[i], i, obj) === breaker) {
							return;
			        	}
			      }
		    } else {
		      for (var key in obj) {
		        if ($.has(obj, key)) {
		          if (iterator.call(context, obj[key], key, obj) === breaker) return;
		        }
		      }
		    }
		}
	})


	function NodeList (query){
		var result = document.querySelectorAll(query);
		this.length = result.length;
		for (var i=0; i<this.length; i++) {
			this[i] = result[i];
		}
		
		return this;
	}

	NodeList.prototype = {
		each : function(callback){
			for(var i=0; i< this.length; i++){
				callback.call(this,this[i]);
			}
		},
		css : function(attr,value){
			if(typeof attr == "string" && !value){
				return window.getComputedStyle(this[0], null).getPropertyValue(attr);
			}
			if(typeof attr != "object"){
				attr[attr] = value;
			}

			return this.each(function(v){
				for(var i in attr){
					v.style[i] = attr[i];
				}
			})

		},

		bind: function (type, fn, capture) {
			return this.each(function (dom) {
				dom.addEventListener(type, fn, capture ? true : false);
			});
		},
		
		unbind: function (type, fn, capture) {
			return this.each(function (dom) {
				dom.removeEventListener(type, fn, capture ? true : false);
			});
		},

		parent : function(){

			var result = [], parent, i, l;
			this.each(function (dom) {
				parent = dom.parentNode;
				if (!parent._counted) {
					result[result.length] = parent;
					parent._counted = true;
				}
			});

			$.each(result,function (dom) {
				delete dom._counted;
			});

			return result;
			
		},

		hasClass: function (className) {
			return $.hasClass(this[0], className);
		},
	
		// Add one or more classes to all elements
		addClass: function () {

			var className = arguments;

			for (var i=0, l=className.length; i<l; i++) {
				this.each(function (dom) {
					if (!$.hasClass(dom, className[i])) {
						dom.className = dom.className ? dom.className + ' ' + className[i] : className[i];
					}
				});
			}
			
			return this;
		},
	
		// Remove one or more classes from all elements
		removeClass: function () {
			var className = arguments;
			
			for (var i=0, l=className.length; i<l; i++) {
				this.each(function (dom) {
					dom.className = dom.className.replace(new RegExp('(^|\\s+)' + className[i] + '(\\s+|$)'), ' ');
				});
			}
			
			return this;
		},

		width : function(value){

			if (value === undefined) {
				return this[0].clientWidth;
			}
		
			return this.each(function () {
				this.style.width = parseInt(value,10) + 'px';
			});

		},

		height : function(value){

			if (value === undefined) {
				return this[0].clientWidth;
			}
		
			return this.each(function () {
				this.style.height = parseInt(value,10) + 'px';
			});

		},
	
		html: function (value) {
			if (value === undefined) {
				return this[0].innerHTML;
			}
			
			return this.each(function (dom) {
				dom.innerHTML = value;
			});

		}

	}

	
	window.$ = $;

})();