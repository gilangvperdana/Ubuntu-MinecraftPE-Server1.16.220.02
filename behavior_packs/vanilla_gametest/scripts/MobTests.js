import * as GameTest from "GameTest";
import { BlockLocation, BlockStates, Blocks } from "Minecraft";

const TicksPerSecond = 20;

GameTest.register("MobTests", "zombie_burn", (test) => {
  const zombieEntityType = "minecraft:zombie";
  const zombiePosition = new BlockLocation(1, 2, 1);

  test.succeedWhenEntityNotPresent(zombieEntityType, zombiePosition);
})
  .maxTicks(TicksPerSecond * 30)
  .tag(GameTest.Tags.suiteDefault)
  .batch("day");
