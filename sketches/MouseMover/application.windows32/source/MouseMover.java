import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.awt.Robot; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class MouseMover extends PApplet {


Robot robot;
public void setup() {
  try {
    robot = new Robot();
    robot.mouseMove(displayWidth - 2, 0);
    //robot.mouseMove(displayWidth/2, displayHeight/2);
    //delay(1000);
    for (int i = 0; i < 10; i++) {
      robot.mouseMove(displayWidth, i);
      delay(500);
    }
    delay(1000);
    robot.mouseMove(displayWidth, displayHeight/2);
  }
  catch (Exception e) {
    println("problem moving mouse");
  }
  delay(3000);
  exit();
} // end setup

  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "MouseMover" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
