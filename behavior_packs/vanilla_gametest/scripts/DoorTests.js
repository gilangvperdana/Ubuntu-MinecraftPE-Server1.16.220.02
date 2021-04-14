import * as GameTest from "GameTest";
import { BlockLocation } from "Minecraft";

GameTest.register("DoorTests", "four_villagers_one_door", (test) => {
  const villagerEntityType = "minecraft:villager_v2";
  const villagerEntitySpawnType =
    "minecraft:villager_v2<minecraft:spawn_farmer>"; // Attempt to spawn the villagers as farmers

  test.spawn(villagerEntitySpawnType, new BlockLocation(5, 2, 4));
  test.spawn(villagerEntitySpawnType, new BlockLocation(4, 2, 5));
  test.spawn(villagerEntitySpawnType, new BlockLocation(2, 2, 5));
  test.spawn(villagerEntitySpawnType, new BlockLocation(1, 2, 4));

  test.succeedWhen(() => {
    test.assertEntityPresent(villagerEntityType, new BlockLocation(5, 2, 2));
    test.assertEntityPresent(villagerEntityType, new BlockLocation(5, 2, 1));
    test.assertEntityPresent(villagerEntityType, new BlockLocation(1, 2, 2));
    test.assertEntityPresent(villagerEntityType, new BlockLocation(1, 2, 1));
  });
})
  .tag(GameTest.Tags.suiteBroken) // Villagers can get stuck on the door or on sleeping villagers
  .padding(50) // Space out villager tests to stop them from confusing each other
  .batch("night") // This should be a constant at some point
  .maxTicks(600);
