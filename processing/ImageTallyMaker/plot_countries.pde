

//
// simple linear plot
void plotCountries() {
  long startTime = millis();
  PImage loadImg = null;

  PFont font = createFont("Helvetica", 14);
  textFont(font);


  float imageSize = 30f;
  float overallPadding = 2 * imageSize;
  float imagePadding = 2f;
  float countryPadding = imageSize * .5;
  float namePadding = 0f;
  for (Country c : countriesAL) namePadding = (namePadding > (overallPadding + textWidth(c.name)) ? namePadding : (overallPadding + textWidth(c.name))); 


  int totalMinutes = 120;
  // find the overall height
  float maxOverallHeight = 2 * overallPadding + (countriesAL.size() - 1) * countryPadding;
  for (Country c : countriesAL) {
    int maxImageCount = 0;
    for (int i = 0; i < totalMinutes; i++) {
      if (c.imgsHM.containsKey(i)) {
        ArrayList<Img> imgsTmp = c.imgsHM.get(i);
        maxImageCount = (maxImageCount > imgsTmp.size() ? maxImageCount : imgsTmp.size());
      }
    }
    maxOverallHeight += (maxImageCount * imageSize) + ((maxImageCount - 1) * imagePadding);
  }


  PGraphics pg = createGraphics((int)(namePadding + 2 * overallPadding + imageSize * (1 + totalMinutes) +  totalMinutes * imagePadding), (int)(maxOverallHeight));
  println("pg.width: " + pg.width);
  println("pg.height: " + pg.height);
  pg.beginDraw();
  pg.background(0);
  pg.textFont(font);
  pg.smooth(3);

  float yTracker = overallPadding;

  for (int j = 0; j < countriesAL.size (); j++) {
    Country c = countriesAL.get(j);
    // find height of this country
    float countryHeight = 0f;
    for (int i = 0; i <= totalMinutes; i++) {
      float thisHeight = 0;      
      int tempImageCount = 0;
      if (c.imgsHM.containsKey(i)) {
        ArrayList<Img> imgsTmp = c.imgsHM.get(i);
        thisHeight += imgsTmp.size() * imageSize;
        thisHeight += (imgsTmp.size() - 1) * imagePadding;
        tempImageCount = imgsTmp.size();
      }
      countryHeight = (countryHeight > thisHeight ? countryHeight : thisHeight);
    }

    float x = namePadding + overallPadding;
    for (int i = 0; i <= totalMinutes; i++) {

      float y = yTracker + countryHeight;
      //println("countryHeight as: " + countryHeight + " with y starting at: " + y + " and ytracker: "+ yTracker);
      if (c.imgsHM.containsKey(i)) {
        ArrayList<Img> imgsTmp = c.imgsHM.get(i);
        for (Img img : imgsTmp) {
          /*
          // temp draw rect
           pg.fill(0, 255, 0);
           pg.stroke(0);
           pg.rect(x, y - imageSize, imageSize, imageSize);
           */
          // draw images
          try {
            loadImg = loadImage(img.imageLocation);
            // figure out size?
            if (loadImg.width == loadImg.height) {
              pg.image(loadImg, x, y - imageSize, imageSize, imageSize);
            } else if (loadImg.width > loadImg.height) {
              float newHeight = ((float)loadImg.height / loadImg.width) * imageSize;
              pg.image(loadImg, x, y - imageSize, imageSize, newHeight);
            } else {
              float newWidth = ((float)loadImg.width / loadImg.height) * imageSize;
              pg.image(loadImg, x, y - imageSize, newWidth, imageSize);
            }
          }
          catch (Exception aa) {
            println("could not load image for Img: " + img.imageLocation);
          }
          y -= (imageSize + imagePadding);
        }
      }
      x += imageSize + imagePadding;
    }
    pg.textAlign(RIGHT, BASELINE);
    pg.fill(255);
    pg.text(c.name + " - " + nfc(c.imgs.size()), namePadding, yTracker + countryHeight);
    pg.stroke(127);
    pg.line(namePadding, yTracker + countryHeight + imagePadding, pg.width - overallPadding, yTracker + countryHeight + imagePadding);

    yTracker += countryHeight + countryPadding;
  }


  pg.endDraw();
  pg.save("plot/linear.jpg");
  println("done plotting image in " + nf((((float)millis() - startTime) / 1000), 0, 2) + " seconds");
} // end plotCountries

//
//
//
//
//
//

