class Selector {

  PVector[] corners;
  PVector[] ncorners;
  PVector[] dcorners;
  PVector activeCorner;
  PVector centroid = new PVector();

  PVector pos = new PVector();

  Selector() {
  }

  void init() {
    ncorners = new PVector[4];
    dcorners = new PVector[4];
    corners = new PVector[4];
    corners[0] = new PVector(width/2 - distorter.focusBox.x/2, height/2 - distorter.focusBox.y/2);
    corners[1] = new PVector(width/2 + distorter.focusBox.x/2, height/2 - distorter.focusBox.y/2);
    corners[2] = new PVector(width/2 + distorter.focusBox.x/2, height/2 + distorter.focusBox.y/2);
    corners[3] = new PVector(width/2 - distorter.focusBox.x/2, height/2 + distorter.focusBox.y/2);
    
    pos = new PVector(width/2,height/2);

    for (int i = 0; i < 4; i++) {
      ncorners[i] = new PVector();
    }
    for (int i = 0; i < 4; i++) {
      dcorners[i] = new PVector();
    }
  }

  void update() {
    PVector mouse = new PVector(mouseX, mouseY);
    if (mousePressed && activeCorner == null) {
      //Is the mouse near a corner?
      for (PVector p:corners) {
        if (mouse.dist(p) < 10) activeCorner = p;
      }
    } 
    else if (!mousePressed) {
      activeCorner = null;
    }

    if (activeCorner != null) {
      activeCorner.set(mouseX, mouseY);
      distorter.doTexture();
    }

    if (mousePressed && mouseX < corners[2].x && mouseX > corners[0].x && mouseY > corners[0].y && mouseY < corners[2].y) {
      pos.x -= (pmouseX - mouseX);
      pos.y -= (pmouseY - mouseY);
      for (PVector p:corners) {
        p.x -= (pmouseX - mouseX);
        p.y -= (pmouseY - mouseY);
      }
      distorter.doTexture();
    }

    centroid = new PVector();
    for (PVector p:corners) {
      centroid.add(p);
    }

    for (int i = 0; i < corners.length; i++) {
      ncorners[i].set(corners[i].x / currentImage.width, corners[i].y / currentImage.height);
    }

    for (int i = 0; i < corners.length; i++) {
      float x = map(corners[i].x, 0, currentImage.width, 200, 300);
      float y = map(corners[i].y, 0, currentImage.height, 200, 300);
      dcorners[i].set(x, y);
    }

    centroid.x /= 4;
    centroid.y /= 4;
  }

  void render() {

    for (PVector p:corners) {
      noStroke();
      fill(0,255,0);
      ellipse(p.x, p.y, 10, 10);
    }
    fill(255, 150);
    beginShape();
    for (PVector p:corners) {
      vertex(p.x, p.y);
    }
    endShape();
    
    fill(255,0,0);
    ellipse(centroid.x,centroid.y,10,10);
    
    fill(0,0,255);
    ellipse(pos.x,pos.y,10,10);
  }
}

