import java.awt.Robot;
Robot robot;
void setup() {
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

