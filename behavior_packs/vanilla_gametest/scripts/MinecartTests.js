import * as GameTest from "GameTest";
import { BlockLocation } from "Minecraft";

GameTest.register("MinecartTests", "turn", (test) => {
  const minecartEntityType = "minecart";

  const endPos = new BlockLocation(1, 2, 2);
  const startPos = new BlockLocation(1, 2, 0);

  test.assertEntityPresent(minecartEntityType, startPos);
  test.assertEntityNotPresent(minecartEntityType, endPos);

  test.pressButton(new BlockLocation(0, 3, 0));

  test.succeedWhenEntityPresent(minecartEntityType, endPos);
}).tag(GameTest.Tags.suiteDefault);
