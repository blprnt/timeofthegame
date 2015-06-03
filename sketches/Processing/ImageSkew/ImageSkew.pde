String searchQuery = "selfie";
File[] fileQueue;
File currentFile;
long currentId;

PImage currentImage;

Selector selector;

Distorter distorter;



void setup() {
  size(1500, 1000, P3D); 
  
  distorter = new Distorter();
  distorter.pos.x = width/2;
  
  selector = new Selector();
  selector.init();
  
  getFileListing();
  loadTweet();
  
}

void draw() {
  background(0);
  image(currentImage,0,0);
  selector.update();
  selector.render();
  distorter.update();
  distorter.render();
}

void getFileListing() {
  println("../../node/out/" + searchQuery + "/data");
  fileQueue = listFiles(sketchPath("../../node/out/" + searchQuery + "/data/"));
}

void loadTweet() {
  if (fileQueue.length > 0) {
    //Get JSON
    currentFile = fileQueue[0];
    JSONObject j = loadJSONObject(currentFile.getPath());
    currentId = j.getLong("id");
    
    //Load image
    currentImage = loadImage("test3.jpg");//loadImage("../../node/out/" + searchQuery + "/images/" + currentId + ".jpg");
    selector.init();
    distorter.init(currentImage);
  }
}

void moveData() {
  String pdir = sketchPath("../../node/out/" + searchQuery + "/processed/");
  currentFile.renameTo(new File(pdir + "data/" + currentId + ".json"));
}

void keyPressed() {
 if (keyCode == RIGHT) {
   moveData();
   getFileListing();
   loadTweet();
 } 
 if (key == ' ') {
  distorter.doTexture(); 
 }
}

