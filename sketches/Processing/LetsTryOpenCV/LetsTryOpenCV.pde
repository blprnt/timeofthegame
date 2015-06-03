import gab.opencv.*;
import java.awt.Rectangle;
import java.awt.Polygon;
import java.awt.Point;
import java.util.Collections;
import org.opencv.imgproc.Imgproc;

OpenCV opencv;
ArrayList<Line> lines;
String imagePath = "../../images";
File[] filenames;

PImage src;

int index = 0;

ArrayList<Contour> contours;
Contour bestContour;
ArrayList<Contour> polygons;

ArrayList<PVector> greenPixels = new ArrayList();

int thresh = 70;

int gthresh = 50;

void setup() {

  size(1200, 1000);
  getFiles(sketchPath(imagePath));

  loadImg();
  initCV();
  //colorMode(HSB);
}

void draw() {
  background(0);
  tint(255, 120);
  image(src, 0, 0);
  noTint();
  //image(opencv.getOutput(), 0, 0);
  strokeWeight(3);
  noFill();

  stroke(0, 255, 0);
  //contour.draw();


  stroke(255, 0, 0);
  beginShape();
  fill(255, 60);

  for (PVector point : bestContour.getPolygonApproximation().getPoints()) {
    vertex(point.x, point.y);
  }
  endShape();




  /*
  for (Line line : lines) {
   // lines include angle in radians, measured in double precision
   // so we can select out vertical and horizontal lines
   // They also include "start" and "end" PVectors with the position
   
   stroke(map((float)line.angle, 0, TAU, 0, 255), 255,255,50);
   line(line.start.x, line.start.y, line.end.x, line.end.y);
   }
   //*/

  for (PVector v:greenPixels) {
    stroke(255);
    point(v.x, v.y);
  }

  fill(255);
  text(thresh, 50, 50);
}

int scoreContour(Contour c) {
  Contour approx = c.getConvexHull();
  Rectangle rect = approx.getBoundingBox();
  float ratio = (float) rect.width / rect.height;
  float area = approx.area();

  int gscore = 0;
  Polygon poly = contourToPoly(approx);
  for (PVector p:greenPixels) {
    if (poly.contains(new Point(int(p.x), int(p.y)))) gscore ++;
  }

  return(gscore);
}

Polygon contourToPoly(Contour c) {
  Polygon poly = new Polygon();
  for (PVector p:c.getPoints()) {
    poly.addPoint(int(p.x), int(p.y));
  }
  return(poly);
}

void loadImg() {
  src = loadImage(filenames[index].toString());
  src.resize(0, 800);

  greenPixels = new ArrayList();
  setGreen();
}

void initCV() {
  background(0);

  opencv = new OpenCV(this, src);
  opencv.gray();
  
  // Use built-in OpenCV function to conver the color image from BGR to LAB color space.
  Imgproc.cvtColor(opencv.getColor(), opencv.getColor(), Imgproc.COLOR_BGR2Lab);
  // Since the channels start out in the order BGRA,
  // Converting to LAB will put the Luma in the B channel
  opencv.setGray(opencv.getB());
  
  
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

  pickBestContour();
}

void pickBestContour() {
  //Collections.sort(contours);
  int bestScore = 0;
  for(Contour c:contours) {
   int sc = scoreContour(c);
   if (sc > bestScore) {
    bestScore = sc;
    bestContour = c;
   } 
  }

}

void setGreen() {
  loadPixels();
  for (int x = 0; x < src.width; x++) {
    for (int y = 0; y < src.height; y++) {
      color c = src.get(x, y); 
      if (green(c) > gthresh && green(c) > red(c) && green(c) > blue(c) && random(100) < 10) greenPixels.add(new PVector(x, y));
    }
  }
}

void getFiles(String url) {
  println("Listing all filenames in a directory: ");
  filenames = listFiles(url);
  println(filenames);
}

void keyPressed() {
  if (keyCode == RIGHT) {
    index ++;
    loadImg();
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

