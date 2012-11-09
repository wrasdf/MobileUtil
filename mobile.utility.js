(function(){
	var $ = function(query){
		return new NodeList(query);
	}
	$.extend = function (target, obj) {
		target = target || NodeList.prototype;
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
			var nativeForEach = Array.prototype.forEach;
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
		          if (iterator.call(context, obj[key], key, obj) === breaker) {
		          	return;
		          }
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
			});
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
		trigger:function(name){
			var event = document.createEvent("HTMLEvents");
    		event.initEvent(name, true, true);
    		this.each(function(dom){
    			dom.dispatchEvent(event);
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
		addClass: function () {// Add one or more classes to all elements
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
		removeClass: function () {// Remove one or more classes from all elements
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