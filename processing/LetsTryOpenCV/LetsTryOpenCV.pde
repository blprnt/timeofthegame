import gab.opencv.*;

OpenCV opencv;
ArrayList<Line> lines;
String imagePath = "../../images";
File[] filenames;

PImage src;

int index = 0;

ArrayList<Contour> contours;
ArrayList<Contour> polygons;

int thresh = 70;

void setup() {

  size(1200, 1000);
  getFiles(sketchPath(imagePath));
  initCV();
  //colorMode(HSB);
}

void draw() {
  background(0);
  tint(255,90);
  image(src,0,0);
  noTint();
  //image(opencv.getOutput(), 0, 0);
  strokeWeight(3);
  noFill();
  
  for (Contour contour : contours) {
    stroke(0, 255, 0);
    contour.draw();
    
    stroke(255, 0, 0);
    beginShape();
    fill(255,60);
    println(contour.getPolygonApproximation());
    for (PVector point : contour.getConvexHull().getPoints()) {
      vertex(point.x, point.y);
    }
    endShape();
  }


  /*
  for (Line line : lines) {
    // lines include angle in radians, measured in double precision
    // so we can select out vertical and horizontal lines
    // They also include "start" and "end" PVectors with the position
      
    stroke(map((float)line.angle, 0, TAU, 0, 255), 255,255,50);
    line(line.start.x, line.start.y, line.end.x, line.end.y);
  }
  //*/
}

void initCV() {
  background(0);
  src = loadImage(filenames[index].toString());
  src.resize(0, 800);
  
  opencv = new OpenCV(this, src);
  opencv.gray();
  opencv.threshold(thresh);
  
  //Edges
  /*
  opencv.findCannyEdges(20, 75);
  // Find lines with Hough line detection
  // Arguments are: threshold, minLengthLength, maxLineGap
  lines = opencv.findLines(100, 30, 20);
  //*/
  
  //Contours
  contours = opencv.findContours();
  println("found " + contours.size() + " contours");
  

  
}

void getFiles(String url) {
  println("Listing all filenames in a directory: ");
  filenames = listFiles(url);
  println(filenames);
}

void keyPressed() {
 if (keyCode == RIGHT) {
  index ++;
  initCV();
 } 
 if (keyCode == DOWN) {
  thresh -= 5;
  initCV(); 
 } 
 if (keyCode == UP) {
  thresh += 5;
  initCV(); 
 } 
}
