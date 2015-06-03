class Distorter {

  PVector pos = new PVector();
  PImage img;
  PShape shp;

  PVector focusBox = new PVector(160, 90);
  PVector canvasBox;

  PGraphics canvas;

  Distorter() {
    canvasBox = new PVector(width/2, height);
    canvas = createGraphics(int(canvasBox.x), int(canvasBox.y), P3D);
  }

  void init(PImage _img) {
    img = _img;
    
    doTexture();
  }

  void update() {
    //updateFactors();
    
  }

  void render() {
    /*
    
     translate(selector.centroid.x, selector.centroid.y);
     
     shape(shp);
     
     */
    canvas.beginDraw();
    canvas.background(255, 50);
    canvas.pushMatrix();


    canvas.translate(canvas.width/2, canvas.height/2);
    //Image
    canvas.pushMatrix();
    canvas.translate(-selector.centroid.x, -selector.centroid.y);
    canvas.shape(shp);
    canvas.popMatrix();

    //Focus box
    canvas.fill(255, 100);
    canvas.rectMode(CENTER);
    canvas.rect(0, 0, focusBox.x, focusBox.y);
    canvas.popMatrix();

    canvas.endDraw();

    pushMatrix();
    translate(pos.x, pos.y);
    image(canvas, 0, 0);
    popMatrix();
  }

  void doTexture() {
    
    shp = createShape();
    shp.beginShape();
    shp.texture(currentImage);
    //shp.textureMode(NORMAL);
    shp.endShape();
    
    shp.beginShape();
    
    /*
    shp.vertex(0, 0, 0, 0);
    shp.vertex(img.width, 0, img.width, 0);
    shp.vertex(img.width, img.height, img.width, img.height);
    shp.vertex(0, img.height, 0, img.height);
    */
    
    // Distort by changing normals
    /*
    float wf = 0;
    float hf = 0;
    
    shp.vertex(-wf, -hf, selector.corners[0].x, selector.corners[0].y);
    shp.vertex(img.width + wf, -hf, selector.corners[1].x, selector.corners[1].y);
    shp.vertex(img.width + wf, img.height + hf, selector.corners[2].x, selector.corners[2].y);
    shp.vertex(-wf, img.height + hf, selector.corners[3].x, selector.corners[3].y);
    */
    
    //Distort by changing anchors
    PVector corner1skew = new PVector(abs((selector.corners[0].x - selector.centroid.x)/(focusBox.x/2)), abs((selector.corners[0].y - selector.centroid.y)/(focusBox.y/2)));
    PVector corner2skew = new PVector(abs((selector.corners[1].x - selector.centroid.x)/(focusBox.x/2)), abs((selector.corners[1].y - selector.centroid.y)/(focusBox.y/2)));
    PVector corner3skew = new PVector(abs((selector.corners[2].x - selector.centroid.x)/(focusBox.x/2)), abs((selector.corners[2].y - selector.centroid.y)/(focusBox.y/2)));
    PVector corner4skew = new PVector(abs((selector.corners[3].x - selector.centroid.x)/(focusBox.x/2)), abs((selector.corners[3].y - selector.centroid.y)/(focusBox.y/2)));
    
    println(corner1skew);
    
    shp.vertex(-img.width/2 * (1.0/corner1skew.x), -img.height/2 * (1.0/corner1skew.y), 0, 0);
    shp.vertex(img.width/2 * (1.0/corner2skew.x), -img.height/2 * (1.0/corner2skew.y), img.width, 0);
    shp.vertex(img.width/2 * (1.0/corner3skew.x), img.height/2 * (1.0/corner3skew.y), img.width, img.height);
    shp.vertex(-img.width/2* (1.0/corner4skew.x), img.height/2 * (1.0/corner4skew.y), 0, img.height);
    
    shp.endShape();
  }

  void updateFactors()
  {

    float dx1 = selector.ncorners[1].x - selector.ncorners[2].x;
    float dx2 = selector.ncorners[3].x - selector.ncorners[2].x;
    float dy1 = selector.ncorners[1].y - selector.ncorners[2].y;
    float dy2 = selector.ncorners[3].y - selector.ncorners[2].y;

    float sx = (selector.ncorners[0].x - selector.ncorners[1].x)+(selector.ncorners[2].x - selector.ncorners[3].x);
    float sy = (selector.ncorners[0].y - selector.ncorners[1].y)+(selector.ncorners[2].y - selector.ncorners[3].y);

    float z = dx1 * dy2 - dy1 * dx2;
    float g = ((sx*dy2)-(sy*dx2))/z;
    float h = ((sy*dx1)-(sx*dy1))/z;

    PVector factors1  = new PVector(selector.ncorners[1].x-selector.ncorners[0].x+g*selector.ncorners[1].x, selector.ncorners[3].x-selector.ncorners[0].x+h*selector.ncorners[3].x, selector.ncorners[0].x);
    PVector factors2 = new PVector(selector.ncorners[1].y-selector.ncorners[0].y+g*selector.ncorners[1].y, selector.ncorners[3].y-selector.ncorners[0].y+h*selector.ncorners[3].y, selector.ncorners[0].y);
    PVector factors3  = new PVector( g, h );
    
  }
}

