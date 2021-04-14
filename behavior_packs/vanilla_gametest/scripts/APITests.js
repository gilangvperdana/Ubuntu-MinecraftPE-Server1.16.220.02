import * as GameTest from "GameTest";
import { BlockLocation, World } from "Minecraft";

GameTest.register("APITests", "on_entity_created", (test) => {
  World.attachEvent("onEntityCreated", (entity) => {
    test.succeed();
  });
  test.spawn("minecraft:horse<minecraft:ageable_grow_up>", new BlockLocation(1, 2, 1));
});
