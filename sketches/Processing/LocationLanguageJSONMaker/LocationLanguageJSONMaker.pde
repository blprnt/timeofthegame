String baseMainFile = "../../../NFM/out/thetimeofthegame/main.json";

//
void setup() {
  IntDict counts = new IntDict();
  JSONObject json = loadJSONObject(baseMainFile);
  JSONArray images = json.getJSONArray("images");
  for (int i = 0; i < images.size (); i++) {
    JSONObject jj = images.getJSONObject(i);
    String location = "none";
    if (jj.hasKey("location"))  location = jj.getString("location").toLowerCase().trim().replace(".", "");
    if (!counts.hasKey(location)) counts.set(location, 0);
    counts.increment(location);
  }
  counts.sortValuesReverse();
  
  // output a new json
  json = new JSONObject();
  JSONArray jar = new JSONArray();
  for (String key : counts.keyArray ()) {
    int value = counts.get(key);
    //println(key + " -- " + value);
    JSONObject jj = new JSONObject();
    jj.setString("location", key);
    jj.setInt("count", value);
    jj.setString("languagePreference", "british");
    jar.setJSONObject(jar.size(), jj);
  }
  json.setJSONArray("languagePreferences", jar);
  json.setInt("totalCount", jar.size());
  saveJSONObject(json, "output/" +nf(year(), 4)+"-"+nf(month(), 2)+ "-" + nf(day(), 2) + "_"+nf(hour(),2)+"-"+nf(minute(),2) + ".json");
  exit();
} // end setup

//
//
//
//
//
//

