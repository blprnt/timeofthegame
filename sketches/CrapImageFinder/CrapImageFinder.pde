import ocrUtils.maths.*;
import ocrUtils.*;
import ocrUtils.ocr3D.*;

String sourceCrapImageDirectory = "../../NFM/out/thetimeofthegame/images/";
String sourceCrapImageFile = sourceCrapImageDirectory + "488401572192202750.jpg";

PImage[] crapImages = new PImage[0];
String[] crapImageStrings = new String[0];

//
void setup() {
  PImage main = loadImage(sourceCrapImageFile);
  main.loadPixels();
  image(main, 0, 0, width, height);
  size(main.width, main.height);


  OCRUtils.begin(this);
  String[] fileNames = OCRUtils.getFileNames(sketchPath("") + sourceCrapImageDirectory, false);
  //for (String s : fileNames) println(getFileName(s));
  int tolerance = 30; // pixles diff
  int diff = 0;
  int same = 0;
  for (String s : fileNames) {
    String fileName = getFileName(s);
    PImage img = loadImage(s);
    img.loadPixels();
    if (img.pixels.length != main.pixels.length) {
      continue;
    } else {
      for (int i = 0; i < img.pixels.length; i++) {
        if (img.pixels[i] == main.pixels[i]) same++;
        else diff++;
      }
      println("comparing to " + fileName + " same: " + same + " diff: " + diff);
      if (diff == 0) {
        crapImages = (PImage[])append(crapImages, img);
        crapImageStrings = (String[])append(crapImageStrings, fileName);
      }
    }
  }
  int rows = 10;
  int cols = 10;
  float x = 0;
  float y = 0;
  image(main, 0, 0, (float)width/cols, (float)height/rows);
  y += (float)height/rows;
  for (PImage pi : crapImages) {
    image(pi, x, y, (float)width/cols, (float)height/rows);
    x += (float)width/cols;
    if (x >= width) {
      x = 0;
      y += (float)height/rows;
    }
  } 


  JSONObject json = new JSONObject();
  JSONArray jar = new JSONArray();
  for (String s : crapImageStrings) {
    JSONObject jj = new JSONObject();
    jj.setString("id", s);
    jar.setJSONObject(jar.size(), jj);
  }
  json.setJSONArray("skip", jar);
  saveJSONObject(json, "output/imageSkip.json");
} // end setup

String getFileName (String s) {
  String[] broken = splitTokens(s, "./");
  return broken[broken.length - 2];
} // end getFileName

//
//
//
//

