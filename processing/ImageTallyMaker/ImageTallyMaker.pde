import java.util.Map;

String jsonFileLocation = "../../node/public/out/thetimeofthegame/data"; // where the json files are located
ArrayList<Country> countriesAL = new ArrayList();
HashMap<String, Country> countriesHM = new HashMap();

//
void setup() {
  OCRUtils.begin(this);

  String[] jsonFiles = OCRUtils.getFileNames(sketchPath("") + jsonFileLocation, false);
  println("total files to load: " + jsonFiles.length);
  for (String fileName : jsonFiles) {
    if (fileName.contains(".json")) {
      String fileNameSimplified = split(fileName, "/")[split(fileName, "/").length - 1];
      try {
        //println(fileNameSimplified);
        JSONObject json = loadJSONObject(fileName);
        int minute = json.getInt("timeofgame");
        long id = json.getLong("id");
        String localURL = makeImageLink(fileName);
        String location = "na";
        if (json.hasKey("location")) location = json.getString("location");
        //println(location + " -- " + localURL);
        if (!countriesHM.containsKey(location)) {
          Country newCountry = new Country(location);
          countriesHM.put(location, newCountry);
          countriesAL.add(newCountry);
        }
        Country c = (Country)countriesHM.get(location);
        Img newImg = new Img(id, fileNameSimplified, minute, localURL);
        c.addImg(newImg);
      }
      catch (Exception e) {
        println("problem reading file: " + fileNameSimplified);
      }
    }
  }


  countriesAL = OCRUtils.sortObjectArrayListSimple(countriesAL, "imgCount");
  countriesAL = OCRUtils.reverseArrayList(countriesAL);  
  //for (int i = countriesAL.size () - 1; i >= 5; i--) countriesAL.remove(i); // for testing

  for (Country c : countriesAL) {
    c.sortImgs();
    c.makeImgScore();
    println(c);
  }

  // sort and reverse
  //countriesAL = OCRUtils.sortObjectArrayListSimple(countriesAL, "imgCount");
  countriesAL = OCRUtils.sortObjectArrayListSimple(countriesAL, "imgScore");
  countriesAL = OCRUtils.reverseArrayList(countriesAL);  

  //plotCountries();
  
  plotHistogram();
  exit();
} // end setup

//
// modify the rawFile location to point to the local image location 
String makeImageLink(String rawFile) {
  String[] broken = split(rawFile, "/");
  String link = "";
  for (int i = 0; i < broken.length - 2; i++) link += broken[i] + "/";
  String end = broken[broken.length - 1];
  end = split(end, ".")[0];
  link += "images/" + end + ".jpg";
  return link;
} // end makeImageLink

//
class Country {
  String name = ""; // note: in lower case
  ArrayList<Img> imgs = new ArrayList();
  int imgCount = 0;
  float imgScore = 0f;
  HashMap<Integer, ArrayList<Img>> imgsHM = new HashMap(); // sorted by minute
  //
  Country (String name) {
    this.name = name;
  } // end constructor
  //
  void addImg(Img img) {
    imgs.add(img);
    imgCount = imgs.size();
    if (!imgsHM.containsKey(img.minute)) imgsHM.put(img.minute, new ArrayList<Img>());
    ArrayList<Img> imgTmp = (ArrayList<Img>)imgsHM.get(img.minute);
    imgTmp.add(img);
  } // end addImg
  //
  void sortImgs() {
    imgs = OCRUtils.sortObjectArrayListSimple(imgs, "minute");
  } // end sortImgs

    //
  // arbitrary way to make a score from the number of images and also the placement of them
  void makeImgScore() {
    imgScore = imgs.size();
    // weight images towards the front higher
    // never bonus more than 1??
    for (Img i : imgs) {
      imgScore += (((float)(120 - i.minute)) / (120 * imgs.size()));
    }
  } // end makeImgScore
  //
  String toString() {
    String builder = "Country: " + name + " imgCount: " + imgCount;
    builder += "\n   ";
    for (int i = 0; i <= 120; i++) {
      if (imgsHM.containsKey(i)) {
        ArrayList<Img> imgTmp = (ArrayList<Img>)imgsHM.get(i);
        builder += " " + nf(imgTmp.size(), 2);
      } else {
        builder += " __";
      }
      if (i == 60) builder += "\n   ";
    }
    return builder;
  } // end toString
} // end class Country

//
class Img {
  long id = 0l;
  String fileName = ""; // just the end file name
  int minute = 0;
  String imageLocation = "";
  //
  Img(long id, String fileName, int minute, String imageLocation) {
    this.id = id;
    this.fileName = fileName;
    this.minute = minute;
    this.imageLocation = imageLocation;
  } // end constructor
} // end class Img

//
//
//
//
//

