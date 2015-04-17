//
// just a simple plot of images by minute
void plotHistogram() {
  long startTime = millis();
  PImage loadImg = null;

  PFont font = createFont("Helvetica", 14);
  textFont(font);


  float imageSize = 100f;
  float overallPadding = 2 * imageSize;
  float imagePadding = 2f;
  float countryPadding = imageSize * .5;

  int totalMinutes = 120;
  int tempOverallImageCount = 0;
  // find the overall height
  float maxOverallHeight = 2 * overallPadding + (countriesAL.size() - 1) * countryPadding;
  int maxImageCount = 0;
  for (int i = 0; i <= totalMinutes; i++) {
    int thisImageCount = 0;
    for (Country c : countriesAL) {
      if (c.imgsHM.containsKey(i)) {
        ArrayList<Img> imgsTmp = c.imgsHM.get(i);
        thisImageCount += imgsTmp.size();
        tempOverallImageCount += imgsTmp.size();
      }
    }
    maxImageCount = (maxImageCount > thisImageCount ? maxImageCount : thisImageCount);
  }

  maxOverallHeight = (maxImageCount * imageSize) + ((maxImageCount - 1) * imagePadding) + 2 * overallPadding;

  println("maxImageCount: " + maxImageCount);
  println("maxOverallHeight: " + maxOverallHeight);
  println("overallImageCount: " + tempOverallImageCount);

  PGraphics pg = createGraphics((int)(2 * overallPadding + imageSize * (1 + totalMinutes) +  totalMinutes * imagePadding), (int)(maxOverallHeight));
  println("pg.width: " + pg.width);
  println("pg.height: " + pg.height);
  pg.beginDraw();
  pg.background(0);
  pg.textFont(font);
  pg.smooth(3);


  float yStarter = pg.height - overallPadding;
  float x = overallPadding;
  pg.textAlign(CENTER, CENTER);
  pg.textSize(imageSize);

  // draw overall counter lines
  for (int i = 0; i < maxImageCount; i+=10) {
    float y = yStarter - i * (imageSize + imagePadding);
    pg.stroke(50);
    pg.line(overallPadding, y, pg.width / 2 - imageSize, y);
    pg.line(pg.width / 2 + imageSize, y, pg.width - overallPadding, y);
    pg.fill(50);
    pg.text(i, pg.width/2, y);
  }



  for (int i = 0; i <= totalMinutes; i++) {
    float y = yStarter;
    int imageCount = 0;
    for (int j = 0; j < countriesAL.size (); j++) {
      Country c = countriesAL.get(j);
      if (c.imgsHM.containsKey(i)) {
        ArrayList<Img> imgsTmp = c.imgsHM.get(i);
        for (int k = 0; k < imgsTmp.size (); k++) {
          // draw images
          try {
            loadImg = loadImage(imgsTmp.get(k).imageLocation);
            //if (i == 54) println(imgsTmp.get(k).imageLocation);
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
            print(".");
          }
          catch (Exception aa) {
            println("could not load image for Img: " + imgsTmp.get(k).imageLocation);
          }          

          y -= (imageSize + imagePadding);
          imageCount++;
        }
      }
    }
    if (i % 10 == 0) print(i);

    pg.noFill();
    pg.stroke(0);
    //pg.rect(x, y - imageSize, imageSize, imageSize);
    pg.fill(127);
    pg.textSize(imageSize * .5);
    pg.textAlign(CENTER, TOP);
    if (i % 5 == 0) pg.text(i, x + imageSize/2, yStarter + 2 * imagePadding);    

    x += imageSize + imagePadding;
  }
  println("_");
  /*
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
   */

  pg.endDraw();
  pg.save("plot/histogram.jpg");
  println("done plotting image in " + nf((((float)millis() - startTime) / 1000), 0, 2) + " seconds");
} // end plotCountries

//
//
//
//
//
//

