/* author sam */
//canvas chained mode
$.E(window.CanvasRenderingContext2D
	? CanvasRenderingContext2D.prototype
	: {}, new function(){
	var fun1 = function(fun){
		return function(){
			this[fun].apply(this, arguments);
			return this;
		}	
	};
	var fun2 = function(fun){
		return function(a){
			this[fun] = a;
			return this;
		}	
	};
	var result = {};
	var obj = {
		A : 'arc',
		B : 'beginPath',
		BC: 'bezierCurveTo',
		C : 'closePath',
		CL: 'clip',
		//CR: 'clearRect',
		DI: 'drawImage',
		FR: 'fillRect',
		FT: 'fillText',
		L : 'lineTo',
		M : 'moveTo',
		QC: 'quadraticCurveTo',
		R : 'rect',
		RS: 'restore',
		RT: 'rotate',
		SR: 'strokeRect',
		SV: 'save',
		TL: 'translate'
	};
	for(var i in obj){
		result[i] = fun1(obj[i]);
	}	
	
	obj = {
		FO: 'font',
		FS: 'fillStyle',
		GC: 'globalCompositeOperation',
		LC: 'lineCap',
		LJ: 'lineJoin',
		LW: 'lineWidth',
		ML: 'miterLimit',
		SS: 'strokeStyle',
		TA: 'textAlign'
	};
	for(var i in obj){
		result[i] = fun2(obj[i]);
	}
	
	$.E(result, {
		  AS: function(a, b){
			$.EACH(b, function(z){
				a.addColorStop(z[0], z[1]);
			})
		}
		, F : function(a){if(a){this.FS(a) } this.fill(); return this; }
		, CR : function(l, t, w, h){
			this.clearRect(l||0, t||0, w||this.canvas.width, h||this.canvas.height);
			return this;
		}
		, I : function(){
			return this
			.LC('round')
			.LJ('round')
			.ML(5)
			//.b()
		}
		, LN: function(a, b, c, d){
			return this.M(a, b).L(c, d);
		}
		, LG: function(a, b, c, d, e, f){
			var grad = this.createLinearGradient(a, b, c, d);
			this.AS(grad, e);
			if (f) {
				this.SS(grad);
			}
			else {
				this.FS(grad);
			}
			return this;
		}
		, RG: function(a, b, c, d, e, f, g, h){
			var grad = this.createRadialGradient(a, b, c, d, e, f);
			this.AS(grad, g);
			if (h) {
				this.SS(grad);
			}
			else {
				this.FS(grad);
			}
			return this;
		}
		, S : function(a){ if (a){this.SS(a) } this.stroke(); return this; }
		, SD: function(a, b, c, d){
			if(a){
				this.shadowOffsetX = a;
			}
			if(b){
				this.shadowOffsetY = b;
			}
			if(c){
				this.shadowColor = c;
			}
			if(d){
				this.shadowBlur = d;
			}
			return this;
		}
		, TS: function(a, b, c){this.font = a; this.textBaseline = b || 'top'; this.textAlign = c || 'left'; return this; }
	});
	return result;
});

//扩充canvas
$.E(window.CanvasRenderingContext2D
	? CanvasRenderingContext2D.prototype
	: {}, {
		CB: function(b, c, d, e, f){ //x, y, w, h, curv//1,2 // curvBorder
			b = b + .5;
			c = c + .5;
			d = d + b - 1;
			e = e + c - 1;
			f = f;
			return this.LW()
			.B()
			.M(b + f, c)			//左上
			.L(d - f, c)			//右上
			.QC(d, c, d, c + f)
			.L(d, e - f)			//右下
			.QC(d, e, d - f, e)
			.L(b + f, e)			//左下
			.QC(b, e, b, e - f)
			.L(b, c + f)			//左上
			.QC(b, c, b + f, c)
			.C();
		}
	}
);