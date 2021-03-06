
    var canvas;
    var stage;
    var bmd;
    var currentImage;
    var invMat;
    var corners_in;
    var corners_out;

    console.log("loaded mario code.")
    
    function init(){
      
      canvas = document.getElementById('uiCanvas'); //document.createElement("canvas"); ;
      width = canvas.width;
      height = canvas.height;
       
      stage = new createjs.Stage(canvas);

      createjs.Touch.enable(stage);
      stage.enableMouseOver(10);
      stage.mouseMoveOutside = true;
      
      
      bmd = document.getElementById('imageHolder').bitmapData;
      output = document.getElementById('output');
      
      shp = new createjs.Shape();
      stage.addChild(shp);
      
      corners_in = [new qlib.Vector2( 50,50 ), new qlib.Vector2( 300,50 ),  new qlib.Vector2( 300,300 ),new qlib.Vector2( 50,300 ) ];
      b_top = new qlib.LineSegment( corners_in[0], corners_in[1] );
      b_right = new qlib.LineSegment( corners_in[2], b_top.p2);
      b_bottom = new qlib.LineSegment(corners_in[3],  b_right.p1);
      b_left = new qlib.LineSegment( b_top.p1,  b_bottom.p1);
      
      corners_out = [new qlib.Vector2( 800+50,50 ), new qlib.Vector2( 800+300,50 ),  new qlib.Vector2( 800+300,300 ),new qlib.Vector2( 800+50,300 ) ];
      b_top_out = new qlib.LineSegment( corners_out[0], corners_out[1] );
      b_right_out = new qlib.LineSegment( corners_out[2], b_top_out.p2);
      b_bottom_out = new qlib.LineSegment(corners_out[3],  b_right_out.p1);
      b_left_out = new qlib.LineSegment( b_top_out.p1,  b_bottom_out.p1);
      
      handles = [new qlib.Handle(b_top.p1),new qlib.Handle(b_top.p2),
            new qlib.Handle(b_bottom.p1),new qlib.Handle(b_bottom.p2)
            ];
      
      
      handleHolder = new createjs.Container()
      stage.addChild(handleHolder);
      for ( var i = 0; i < handles.length; i++ )
      {
        handleHolder.addChild(handles[i]);
        handles[i].setActive(true);
        handles[i].addEventListener("change", render );
      }
      helperHandles = [];
      for ( var i = 0; i < 8; i++ )
      {
        helperHandles.push( new qlib.Handle() );
        handleHolder.addChild(helperHandles[i]);
      }
      render();
    }
    
    function processImage()
    {
      var scale = 800 / Math.max(currentImage.width,currentImage.height) ;
      var m =  new qlib.Matrix(scale,0,0,scale,(800 -currentImage.width*scale)*0.5, (800 -currentImage.height*scale)*0.5);
      helperHandles[0].x = m.tx;
      helperHandles[0].y = m.ty;
      helperHandles[1].x = m.tx+currentImage.width*scale;
      helperHandles[1].y = m.ty;
      helperHandles[2].x = m.tx+currentImage.width*scale;
      helperHandles[2].y = m.ty+currentImage.height*scale;
      helperHandles[3].x = m.tx;
      helperHandles[3].y = m.ty+currentImage.height*scale;
      
      bmd.draw(currentImage,m);
      invMat = m.invert();
      render();
    }
    
    
    function getBarycentric(p,p1,p2,p3)
    {
      var l = 1 / ((p2.y-p3.y)*(p1.x-p3.x)+(p3.x-p2.x)*(p1.y-p3.y));
      var l1 = ((p2.y-p3.y)*(p.x-p3.x) + (p3.x-p2.x)*(p.y-p3.y) ) * l;
      var l2 = ((p3.y-p1.y)*(p.x-p3.x) + (p1.x-p3.x)*(p.y-p3.y) )* l;;
      return [l1,l2,1-l1-l2];
    }
    
    function setProjectedCorner(p1,p2,p3,bary,target)
    {
      target.x = bary[0]*p1.x+bary[1]*p2.x+bary[2]*p3.x;
      target.y = bary[0]*p1.y+bary[1]*p2.y+bary[2]*p3.y;
    }
    
    function render() 
    {
      if ( currentImage != null )
      {
      
        var b = getBarycentric(helperHandles[0],corners_in[0],corners_in[1],corners_in[3]);
        setProjectedCorner(corners_out[0],corners_out[1],corners_out[3],b,helperHandles[4]);
        
        b = getBarycentric(helperHandles[1],corners_in[1],corners_in[2],corners_in[0]);
        setProjectedCorner(corners_out[1],corners_out[2],corners_out[0],b,helperHandles[5]);
        
        b = getBarycentric(helperHandles[2],corners_in[2],corners_in[3],corners_in[1]);
        setProjectedCorner(corners_out[2],corners_out[3],corners_out[1],b,helperHandles[6]);
        
        b = getBarycentric(helperHandles[3],corners_in[3],corners_in[0],corners_in[2]);
        setProjectedCorner(corners_out[3],corners_out[0],corners_out[2],b,helperHandles[7]);
        
        
        var w = currentImage.width;
        var h = currentImage.height;
        
        var v = [helperHandles[4].x-800,helperHandles[4].y,
             helperHandles[5].x-800,helperHandles[5].y,
             helperHandles[6].x-800,helperHandles[6].y,
             helperHandles[7].x-800,helperHandles[7].y,
             b_top_out.p1.x-800,b_top_out.p1.y,
             b_top_out.p2.x-800,b_top_out.p2.y,
             b_bottom_out.p2.x-800,b_bottom_out.p2.y,
             b_bottom_out.p1.x-800,b_bottom_out.p1.y
             ];
        
        v.push( (v[0]+v[2])*0.5, (v[1]+v[3])*0.5);
        v.push( (v[2]+v[4])*0.5, (v[3]+v[5])*0.5);
        v.push( (v[4]+v[6])*0.5, (v[5]+v[7])*0.5);
        v.push( (v[6]+v[0])*0.5, (v[7]+v[1])*0.5);
        
        v.push( (v[8]+v[10]+v[12]+v[14])*0.25, (v[9]+v[11]+v[13]+v[15])*0.25);
        
        
        var uv = [(helperHandles[0].x * invMat.a + invMat.tx) / w,(helperHandles[0].y * invMat.d + invMat.ty) / h,
              (helperHandles[1].x *invMat.a + invMat.tx) / w,(helperHandles[1].y * invMat.d + invMat.ty) / h,
              (helperHandles[2].x *invMat.a + invMat.tx) / w,(helperHandles[2].y * invMat.d + invMat.ty) / h,
              (helperHandles[3].x *invMat.a + invMat.tx) / w,(helperHandles[3].y * invMat.d + invMat.ty) / h,
              (b_top.p1.x * invMat.a + invMat.tx) / w,(b_top.p1.y * invMat.d + invMat.ty) / h,
              (b_top.p2.x *invMat.a + invMat.tx) / w,(b_top.p2.y * invMat.d + invMat.ty) / h,
              (b_bottom.p2.x *invMat.a + invMat.tx) / w,(b_bottom.p2.y * invMat.d + invMat.ty) / h,
              (b_bottom.p1.x *invMat.a + invMat.tx) / w,(b_bottom.p1.y * invMat.d + invMat.ty) / h];
        
        uv.push( (uv[0]+uv[2])*0.5, (uv[1]+uv[3])*0.5);
        uv.push( (uv[2]+uv[4])*0.5, (uv[3]+uv[5])*0.5);
        uv.push( (uv[4]+uv[6])*0.5, (uv[5]+uv[7])*0.5);
        uv.push( (uv[6]+uv[8])*0.5, (uv[7]+uv[9])*0.5);
        uv.push( (uv[8]+uv[10]+uv[12]+uv[14])*0.25, (uv[9]+uv[11]+uv[13]+uv[15])*0.25);
        
        var idc = [0,8,4,
        8,5,4,
        1,5,8,
        9,5,1,
        6,5,9,
        2,6,9,
        10,6,2,
        7,6,10,
        3,7,10,
        11,7,3,
        4,7,11,
        0,4,11,
        4,5,12,
        5,6,12,
        6,7,12,
        7,4,12];
      
        
        var context = output.getContext('2d');
        context.clearRect( 0, 0, output.width, output.height );

        for (var t=0; t < idc.length; t+=3) 
        {
          var i0 = idc[t]<<1;
          var i1 = idc[t+1]<<1;
          var i2 = idc[t+2]<<1;
          
          var x0 = v[i0], x1 = v[i1], x2 =v[i2];
          var y0 = v[i0+1], y1 =v[i1+1], y2 = v[i2+1];
          
          var u0 = uv[i0] * w, u1 = uv[i1] * w, u2 = uv[i2] * w;
          var v0 = uv[i0+1] *h, v1 =uv[i1+1]*h, v2 = uv[i2+1]*h;

          var delta = 1 / (u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2);
          var delta_a = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2;
          var delta_b = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2;
          var delta_c = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2 - v0*u1*x2 - u0*x1*v2;
          var delta_d = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2;
          var delta_e = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2;
          var delta_f = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2 - v0*u1*y2 - u0*y1*v2;

          var ctx = (x0 + x1 + x2) * 0.3333;
          var cty = (y0 + y1 + y2) * 0.3333;
          x0 = ctx + (x0-ctx)*1.01;
          x1 = ctx + (x1-ctx)*1.01;
          x2 = ctx + (x2-ctx)*1.01;
          
          y0 = cty + (y0-cty)*1.01;
          y1 = cty + (y1-cty)*1.01;
          y2 = cty + (y2-cty)*1.01;
          
          context.save();
          
          context.beginPath(); context.moveTo(x0, y0 ); context.lineTo(x1, y1);
          context.lineTo(x2, y2); context.closePath();context.clip();
          
          context.transform(delta_a*delta, delta_d*delta,
                    delta_b*delta, delta_e*delta,
                    delta_c*delta, delta_f*delta);
                
          context.drawImage(currentImage, 0, 0);
          context.restore();
        }
    
      }
    
      //rect drawing;
      
      var g = shp.graphics;
      g.clear();
      g.setStrokeStyle(1, 'round', 'round');
      g.beginStroke("#ff8000");
      
      b_top.draw(g);
      b_right.draw(g);
      b_bottom.draw(g);
      b_left.draw(g);
      
      g.beginStroke("#0000FF");
      b_top_out.draw(g);
      b_right_out.draw(g);
      b_bottom_out.draw(g);
      b_left_out.draw(g);
      stage.update();
    }
    
    
    //image drag and drop for testing:  

    if(window.FileReader) 
    { 
      addEventHandler(window, 'load', function() 
      {
        function cancel(e) {
          if (e.preventDefault) { e.preventDefault(); }
          return false;
        }

        // Tells the browser that we *can* drop on this target
        addEventHandler(window, 'dragover', cancel);
        addEventHandler(window, 'dragenter', cancel);
        addEventHandler(window, 'drop', function(e) 
        {
          
          e = e || window.event; // get window.event if e argument missing (in IE)   
          if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.
          var centerx = e.pageX;
          var centery = e.pageY;
          
          var dt    = e.dataTransfer;
          var file = dt.files[0];

          var reader = new FileReader();
          reader.readAsDataURL(file);

          addEventHandler(reader, 'loadend', function(e, file) 
          {
            var bin = this.result; 
            currentImage = document.createElement("img"); 
            currentImage.file = file;   
            currentImage.src = bin;
            currentImage.onload = processImage;
            imageDropX = centerx;
            imageDropY = centery;
            
          }.bindToEventHandler(file));

          return false;
        });
        
        
        Function.prototype.bindToEventHandler = function bindToEventHandler() 
        {
          var handler = this;
          var boundParameters = Array.prototype.slice.call(arguments);
          //create closure
          return function(e) {
            e = e || window.event; // get window.event if e argument missing (in IE)   
            boundParameters.unshift(e);
            handler.apply(this, boundParameters);
          }
        };
      });
    } 
    
    
    function addEventHandler(obj, evt, handler) {
      if(obj.addEventListener) {
        // W3C method
        obj.addEventListener(evt, handler, false);
      } else if(obj.attachEvent) {
        // IE method.
        obj.attachEvent('on'+evt, handler);
      } else {
        // Old school method.
        obj['on'+evt] = handler;
      }
    }