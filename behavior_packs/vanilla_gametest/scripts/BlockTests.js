import * as GameTest from "GameTest";
import { BlockLocation, Blocks, ItemStack } from "Minecraft";

const TicksPerSecond = 20;
const FiveSecondsInTicks = 5 * TicksPerSecond;

///
// Concrete Tests
///
GameTest.register(
  "BlockTests",
  "concrete_solidifies_in_shallow_water",
  (test) => {
    test.setBlock(Blocks.concretepowder(), new BlockLocation(1, 3, 1));

    test.succeedWhen(() => {
      test.assertBlockPresent(Blocks.concrete(), new BlockLocation(1, 2, 1));
    });
  }
)
  .maxTicks(FiveSecondsInTicks)
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("BlockTests", "concrete_solidifies_in_deep_water", (test) => {
  test.setBlock(Blocks.concretepowder(), new BlockLocation(1, 4, 1));

  test.succeedWhen(() => {
    test.assertBlockPresent(Blocks.concrete(), new BlockLocation(1, 2, 1));
  });
})
  .maxTicks(FiveSecondsInTicks)
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("BlockTests", "concrete_solidifies_next_to_water", (test) => {
  test.setBlock(Blocks.concretepowder(), new BlockLocation(1, 3, 1));

  test.succeedWhen(() => {
    test.assertBlockPresent(Blocks.concrete(), new BlockLocation(1, 2, 1));
  });
})
  .maxTicks(FiveSecondsInTicks)
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("BlockTests", "sand_fall_boats", (test) => {
  test.setBlock(Blocks.sand(), new BlockLocation(1, 4, 1));

  test.succeedWhen(() => {
    test.assertBlockPresent(Blocks.sand(), new BlockLocation(1, 2, 1));
  });
})
  .maxTicks(FiveSecondsInTicks)
  .tag(GameTest.Tags.suiteDefault);

///
// Turtle Egg Tests
///

GameTest.register("BlockTests", "turtle_eggs_survive_xp", (test) => {
  const xpOrb = "minecraft:xp_orb";
  const spawnPos = new BlockLocation(1, 3, 1);
  test.spawn(xpOrb, spawnPos);
  test.spawn(xpOrb, spawnPos);
  test.spawn(xpOrb, spawnPos);
  test.spawn(xpOrb, spawnPos);
  test.spawn(xpOrb, spawnPos);
  test.spawn(xpOrb, spawnPos);
  test.spawn(xpOrb, spawnPos);
  test.spawn(xpOrb, spawnPos);

  // Fail if the turtle egg dies
  test.failIf(() => {
    test.assertBlockPresent(Blocks.air(), new BlockLocation(1, 2, 1));
  });

  // Succeed after 4 seconds
  test.startSequence().thenIdle(80).thenSucceed();
})
  .maxTicks(FiveSecondsInTicks)
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("BlockTests", "turtle_eggs_survive_item", (test) => {
  test.pressButton(new BlockLocation(2, 4, 0));

  // Fail if the turtle egg dies
  test.failIf(() => {
    test.assertBlockPresent(Blocks.air(), new BlockLocation(1, 2, 1));
  });

  // Succeed after 4 seconds
  test.startSequence().thenIdle(80).thenSucceed();
})
  .maxTicks(FiveSecondsInTicks)
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("BlockTests", "explosion_drop_location", (test) => {
  test.pressButton(new BlockLocation(4, 3, 4));

  test.succeedWhen(() => {
    const redSandstonePos = new BlockLocation(6, 2, 4);
    const sandstonePos = new BlockLocation(2, 2, 4);

    test.assertBlockNotPresent(Blocks.redSandstone(), redSandstonePos);
    test.assertBlockNotPresent(Blocks.sandstone(), sandstonePos);
    test.assertItemEntityPresent(
      new ItemStack(Blocks.redSandstone()),
      redSandstonePos,
      2.0
    );
    test.assertItemEntityPresent(
      new ItemStack(Blocks.sandstone()),
      sandstonePos,
      2.0
    );
  });
})
  .maxTicks(TicksPerSecond * 10)
  .tag(GameTest.Tags.suiteBroken)
  .maxAttempts(3);

GameTest.register(
  "BlockTests",
  "concrete_pops_off_waterlogged_chest",
  (test) => {
    test.setBlock(Blocks.concretepowder(), new BlockLocation(1, 4, 1));
    test.succeedWhen(() => {
      const chestPos = new BlockLocation(1, 2, 1);
      test.assertBlockPresent(Blocks.chest(), chestPos);
      test.assertItemEntityPresent(
        new ItemStack(Blocks.concretepowder()),
        chestPos,
        2
      );
      test.assertEntityNotPresent("falling_block");
    });
  }
).maxTicks(TicksPerSecond * 5);
