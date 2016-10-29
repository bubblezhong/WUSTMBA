;(function($){
	var Carousel = function(poster){
		var self=this;
		//保存单个旋转木马对象
		this.poster=poster;
		this.posterItemMain=poster.find("ul.poster-list");
		this.nextBtn=poster.find("div.poster-next-btn");
		this.prevBtn=poster.find("div.poster-prev-btn");
		this.posterItems=poster.find("li.poster-item");
		if(this.posterItems.size()%2==0){
			this.posterItemMain.append(this.posterItems.eq(0).clone());
			this.posterItems=this.posterItemMain.children();
		}
		this.posterFirstItem=this.posterItems.first();
		this.posterLastItem=this.posterItems.last();
		this.rotateFlag=true;
		//默认配置参数
		this.setting={
			   "width":1000,			//幻灯片的宽度
			   "height":270,				//幻灯片的高度
			   "posterWidth":640,	//幻灯片第一帧的宽度
			   "posterHeight":270,	//幻灯片第一帧的高度
			   "scale":0.9,					//记录显示比例关系
			   "speed":500,
			   "autoPlay":true,
			   "delay":5000,
			   "verticalAlign":"middle" //top bottom
		}
		//有的话 就替换为人工配置参数，没有的话 就追加一条新的人工配置参数
		// $.extend(this.setting,{"width":900});
		$.extend(this.setting,this.getSetting());
		console.log(this.getSetting());
		//设置配置参数数值
		this.setSettingValue();
		this.setPosterPos();
		this.nextBtn.click(function(){
			if(self.rotateFlag){
				 self.rotateFlag=false;
                 self.carouseRotate("left");
			}
			
		});
		this.prevBtn.click(function(){
			if(self.rotateFlag){
				 self.rotateFlag=false;
                 self.carouseRotate("right");
			}
		});
		// 是否开起自动播放
		if(this.setting.autoPlay){
			this.autoPlay();
			this.poster.hover(function(){
				window.clearInterval(self.timer);
			},function(){
				self.autoPlay()
			});
		};
	};
	Carousel.prototype = {
		   autoPlay:function(){
		   	var self = this;
		   	this.timer=setInterval(function(){
                self.nextBtn.click();
		   	},this.setting.delay);
		   },
		   // 旋转 
		   carouseRotate:function(dir){
		   	   var _this_=this;  //_this_表示carousel
		   	   var zIndexArr=[];
               if(dir==="left"){
               	 this.posterItems.each(function(){
	               		var self=$(this),          //self表示当前posterItem,会不会与第3行this矛盾
	               		    prev=self.prev().get(0)?self.prev():_this_.posterLastItem,
	               		    width=prev.width(),
	               		    height=prev.height(),
	               		    zIndex=prev.css("zIndex"),
	               		    opacity=prev.css("opacity"),
	               		    left=prev.css("left"),
	               		    top=prev.css("top");
	               		    zIndexArr.push(zIndex);	
		               		 self.animate({
		               		 	width:width,
		               		 	height:height,
		               		 	// zIndex:zIndex,
		               		 	opacity:opacity,
		               		 	left:left,
		               		 	top:top
		               		 },_this_.setting.speed,function(){
		               		 	_this_.rotateFlag=true;
		               		 }); 
               		});
               		  this.posterItems.each(function(i){
					$(this).css("zIndex",zIndexArr[i]);
				
               	  });
               }else if(dir=="right"){
                 	this.posterItems.each(function(){
	               		var self=$(this),          //self表示当前posterItem,会不会与第3行this矛盾
	               		    next=self.next().get(0)?self.next():_this_.posterFirstItem,
	               		    width=next.width(),
	               		    height=next.height(),
	               		    zIndex=next.css("zIndex"),
	               		    opacity=next.css("opacity"),
	               		    left=next.css("left"),
	               		    top=next.css("top");
	               		     zIndexArr.push(zIndex);
	               		 self.animate({
	               		 	width:width,
	               		 	height:height,
	               		 	// zIndex:zIndex,
	               		 	opacity:opacity,
	               		 	left:left,
	               		 	top:top
	               		    },_this_.setting.speed,function(){
		               		 	_this_.rotateFlag=true;
		               		 });  
	               	}); 	 
               		  this.posterItems.each(function(i){
					$(this).css("zIndex",zIndexArr[i]); 
                     });
                };
		   },
		  //设置剩余的帧的位置关系
		    setPosterPos:function(){
                var self=this;
		    	var sliceItems=this.posterItems.slice(1),
		    	    sliceSize=sliceItems.size()/2,
		    	    rightSlice=sliceItems.slice(0,sliceSize),
                    level=Math.floor(this.posterItems.size()/2);
		            leftSlice=sliceItems.slice(sliceSize);

		    //设置右边帧的位置关系和宽度高度top
		        var rw=this.setting.posterWidth,
		            rh=this.setting.posterHeight,
		            gap=((this.setting.width-this.setting.posterWidth)/2)/level;
		            var firstLeft=(this.setting.width-this.setting.posterWidth)/2;
		            var fixOffsetLeft=firstLeft+rw;
		      rightSlice.each(function(i){
		      	level--;
		      	rw=rw*self.setting.scale;
		      	rh=rh*self.setting.scale;
                var j=i;
		      	$(this).css({
		      		zIndex:level,
		      		width:rw,
		      		height:rh,
		      		opacity:1/(++j),
		      		left:fixOffsetLeft+(++i)*gap-rw,
		      		top: self.setVertucalAlign(rh),
		      	})
		      });
		      //设置左边的位置关系
		        var lw=rightSlice.last().width(),
		            lh=rightSlice.last().height(),
		            oloop=Math.floor(this.posterItems.size()/2);
		            leftSlice.each(function(i){
		      	 
		      	$(this).css({
		      		zIndex:i,
		      		width:lw,
		      		height:lh,
		      		opacity:1/oloop,
		      		left:i*gap,
		      		top: self.setVertucalAlign(lh),
		      	});
		      	lw=lw/self.setting.scale;
		      	lh=lh/self.setting.scale;
		      	oloop--;
		      });
		       },
		    //设置垂直排列对齐
		    setVertucalAlign:function(height){
		    	var verticalType=this.setting.verticalAlign,
		    	    top=0;
		    	if(verticalType==="middle"){
		    		top=(this.setting.height-height)/2;
		    	}else if(verticalType==="top"){
		    		top=0;
		    	}else if(verticalType==="bottom"){
                    top=this.setting-height;
		    	}else{
		    		top=this.setting-height;
		    	} ;
		    	return top;   
		    },
		   //设置配置参数去控制基本的宽度和高度
		   	setSettingValue:function(){
		   		//设置整个幻灯片区域
		   		this.poster.css({
		   			width:this.setting.width,
		   			height:this.setting.height
		   			});
		   		//ul和上面相同
		   		this.posterItemMain.css({
		   			width:this.setting.width,
		   			height:this.setting.height
		   		});
		   			
		   			
		   		//计算切换按钮宽度
		   		 var w=(this.setting.width-this.setting.posterWidth)/2;
		   		 this.nextBtn.css({
		   		 	width:w,
		   		 	height:this.setting.height,
		   		 	zindex:Math.ceil(this.posterItems.size()/2)
		   		 });
		   		 this.prevBtn.css({
		   		 	width:w,
		   		 	height:this.setting.height,
		   		 	zindex:Math.ceil(this.posterItems.size()/2)
		   		 });
		   		 //设置第一帧图片参数
		   		 this.posterFirstItem.css({
		   		 	width:this.setting.posterWidth,
					height:this.setting.posterHeight,
					left:w,
					top:0,
				    zIndex:Math.floor(this.posterItems.size()/2)
		   		 });
		   	},
		   	
		//获取人工配置参数
		   getSetting:function(){
                var setting=this.poster.attr("data-setting");
                if(setting&&setting!=""){
                    return $.parseJSON(setting);
                }else{
                    return {};
                }
            }

	};
	//创建类中初始化的方法，用来处理页面中传进来的结合。
	Carousel.init=function(posters){
		var _this_ = this;   //this代表当前的Carousel(),传递当前的方法
		posters.each(function(){
			new _this_ ($(this));    //相当于调用函数 new Carousel($(this));
		});                          //即this指的是当前的一个poster
	}
	window["Carousel"] = Carousel;
})(jQuery);

       