import * as GameTest from "GameTest";
import { Blocks, BlockStates, BlockLocation } from "Minecraft";

///
// Setup constants
///
const VERTICAL_TEST_TEMPLATE_NAME = "PathFindingTests:veritcal_template";
const VERTICAL_TEST_MAX_TICKS = 900; // This value may need to be increased if additional villager tests are added since village POI search is time sliced across all villagers
const VERTICAL_TEST_STARTUP_TICKS = 0;
const VERTICAL_TEST_PADDING = 50; // Space these tests apart so that villagers aren't assigned beds from nearby tests. Villages need to be kept separate.

// Here we can define small vertical obstacle courses. Villager moves from left to right.
const VERTICAL_TEST_PLACEMENT_MAP = [
  ["^^##  ", "  ^^  ", "    ^^", "######"],
  ["  ^^^^", "      ", "  ^^  ", "######"],
  ["  ####", "      ", "      ", "____##", "######"],
];

function placeBottomSlab(test, pos) {
  const blockType = Blocks.stoneSlab();
  blockType.setState(BlockStates.stoneSlabType("stoneBrick"));
  test.setBlock(blockType, pos);
}

function placeTopSlab(test, pos) {
  const blockType = Blocks.stoneSlab();
  blockType.setState(BlockStates.stoneSlabType("stoneBrick"));
  blockType.setState(BlockStates.topSlotBit(true));
  test.setBlock(blockType, pos);
}

function placeBlock(test, pos) {
  const blockType = Blocks.stonebrick();
  test.setBlock(blockType, pos);
}

/*
  Places out blocks matching the given pattern (viewed from the side).
  The bottom row (last string in the array) will match the floor level in the structure.
  Sample blockMap:

  "######",
  "      ",
  "  __^^",
  "######"
*/
function placeBlocksFromMap(test, blockMap) {
  const floorY = 1;

  // we start where the villager spawns (left side of the block map)
  const spawnX = 5;
  const spawnZ = 4;

  let currentY = floorY;

  //We'll start from the bottom layer (last row in the blockMap), and work our way up
  for (let mapRowIndex = blockMap.length - 1; mapRowIndex >= 0; --mapRowIndex) {
    const mapRow = blockMap[mapRowIndex]; // one row, for example ##__##
    let currentX = spawnX;
    for (let mapColIndex = 0; mapColIndex < mapRow.length; mapColIndex += 2) {
      // one block, for example __ (2 chars wide)

      // Figure out which type of block to place (full block, bottom slab, or top slab)
      const mapChar = mapRow[mapColIndex];
      if (mapChar != " ") {
        const block = getBlockStateForMapChar(mapChar);

        // Place two next to each other
        for (let currentZ = spawnZ; currentZ >= spawnZ - 1; --currentZ) {
          test.setBlock(block, new BlockLocation(currentX, currentY, currentZ));
        }
      }
      --currentX;
    }
    ++currentY;
  }
}

/*
  Places blocks on the villager spawn position + the next position to the right.
  The first string (floor1) is about where the floor height should be in the start position.
  The next 3 strings define the next position's floor height, mid block, and ceiling height.
  Here's what the strings mean.

  block: ##
  top slab: ""
  bottom slab: __

  --------------------------------------------------------------------

            |         |__       |##
            |####     |####     |####
  floor1:    none      0.5       1
  --------------------------------------------------------------------

            |         |  __     |  ##
            |####     |####     |####
  floor2:    none      0.5       1
  --------------------------------------------------------------------

            |         |         |  __     |  ^^     |  ##
            |         |  ^^     |         |         |
            |####     |####     |####     |####     |####
  mid2:      none      0.5 slab  1 slab    1.5 slab  1 full
  --------------------------------------------------------------------

            |         |  ##     |  ##     |  ##     |  ##     |  ^^
            |         |  ##     |  ##     |  ^^     |         |
            |         |  ^^     |         |         |         |
            |####     |####     |####     |####     |####     |####
  ceiling:   none      0.5       1         1.5       2         2.5
  --------------------------------------------------------------------
*/
function placeBlocks(test, floor1, floor2, mid2, ceiling2) {
  const spawnPos = new BlockLocation(5, 2, 4);

  // we place two of each block, at z and z-1.
  for (let zOffset = 0; zOffset >= -1; --zOffset) {
    // floor1 defines how high the block is where the villager spawns
    if (floor1 == "0.5") {
      placeBottomSlab(test, spawnPos.offset(0, 0, zOffset));
    } else if (floor1 == "1") {
      placeBlock(test, spawnPos.offset(0, 0, zOffset));
    }

    // floor2 defines the height of the position to the right of the villager spawn
    if (floor2 == "0.5") {
      placeBottomSlab(test, spawnPos.offset(-1, 0, zOffset));
    } else if (floor2 == "1") {
      placeBlock(test, spawnPos.offset(-1, 0, zOffset));
    }

    // mid2 defines any mid-level block in the position to the right of the villager spawn
    if (mid2 == "0.5 slab") {
      placeTopSlab(test, spawnPos.offset(-1, 0, zOffset));
    } else if (mid2 == "1 slab") {
      placeBottomSlab(test, spawnPos.offset(-1, 1, zOffset));
    } else if (mid2 == "1.5 slab") {
      placeTopSlab(test, spawnPos.offset(-1, 1, zOffset));
    } else if (mid2 == "1 full") {
      placeBlock(test, spawnPos.offset(-1, 1, zOffset));
    }

    // ceiling2 defines the ceiling height in the position to the right of the villager spawn
    if (ceiling2 == "0.5") {
      placeBlock(test, spawnPos.offset(-1, 2, zOffset));
      placeBlock(test, spawnPos.offset(-1, 1, zOffset));
      placeTopSlab(test, spawnPos.offset(-1, 0, zOffset));
    } else if (ceiling2 == "1") {
      placeBlock(test, spawnPos.offset(-1, 2, zOffset));
      placeBlock(test, spawnPos.offset(-1, 1, zOffset));
    } else if (ceiling2 == "1.5") {
      placeBlock(test, spawnPos.offset(-1, 2, zOffset));
      placeTopSlab(test, spawnPos.offset(-1, 1, zOffset));
    } else if (ceiling2 == "2") {
      placeBlock(test, spawnPos.offset(-1, 2, zOffset));
    } else if (ceiling2 == "2.5") {
      placeTopSlab(test, spawnPos.offset(-1, 2, zOffset));
    }
  }
}

function getBlockStateForMapChar(mapChar) {
  if (mapChar == "#") {
    return Blocks.stonebrick();
  } else if (mapChar == "_") {
    let result = Blocks.stoneSlab();
    result.setState(BlockStates.stoneSlabType("stoneBrick"));
    return result;
  } else if (mapChar == "^") {
    let result = Blocks.stoneSlab();
    result.setState(BlockStates.stoneSlabType("stoneBrick"));
    result.setState(BlockStates.topSlotBit(true));
    return result;
  } else {
    return Blocks.air();
  }
}

function createVerticalTestFunctionWithPlacementMap(
  counter,
  placementMap,
  tag
) {
  if (tag == null) {
    tag = GameTest.Tags.suiteDefault;
  }

  const testName = "Vertical" + counter;
  GameTest.register("PathFindingTests", testName, (test) => {
    const villagerEntityType = "minecraft:villager_v2";
    const villagerEntitySpawnType =
      villagerEntityType + "<minecraft:become_farmer>"; // Attempt to spawn the villagers as farmers

    // Prepare the map
    placeBlocksFromMap(test, placementMap);
    const bedPos = new BlockLocation(1, 2, 4);
    const aboveBedPos = bedPos.above().above(); // Check 2 blocks above the bed because under rare circumstances the villager hit box may stick out above the bed block when lying down.
    const spawnPos = new BlockLocation(5, 3, 4);

    // Do the test
    test.assertEntityNotPresent(villagerEntityType, bedPos);
    test.spawn(villagerEntitySpawnType, spawnPos);

    test.succeedWhen(() => {
      test.assertEntityNotPresent(villagerEntityType, aboveBedPos);
      test.assertEntityPresent(villagerEntityType, bedPos);

      test.killAllEntities(); // Clean up villagers so the VillageManager doesn't waste time looking for points of interest (POIs)
    });
  })
    .structureName(VERTICAL_TEST_TEMPLATE_NAME)
    .maxTicks(VERTICAL_TEST_MAX_TICKS)
    .setupTicks(VERTICAL_TEST_STARTUP_TICKS)
    .padding(VERTICAL_TEST_PADDING)
    .batch("night")
    .tag(tag);
}

function createVerticalTestFunctionWithCustomBlocks(
  testName,
  floor1,
  floor2,
  mid2,
  ceiling2,
  tag
) {
  if (tag == null) {
    tag = GameTest.Tags.suiteDefault;
  }

  GameTest.register("PathFindingTests", testName, (test) => {
    const villagerEntityType = "minecraft:villager_v2";
    const villagerEntitySpawnType =
      villagerEntityType + "<minecraft:become_farmer>"; // Attempt to spawn the villagers as farmers

    // Prepare the map
    placeBlocks(test, floor1, floor2, mid2, ceiling2);
    const bedPos = new BlockLocation(1, 2, 4);
    const aboveBedPos = bedPos.above().above(); // Check 2 blocks above the bed because under rare circumstances the villager hit box may stick out above the bed block when lying down.
    const spawnPos = new BlockLocation(5, 3, 4);

    // Do the test
    test.assertEntityNotPresent(villagerEntityType, bedPos);
    test.spawn(villagerEntitySpawnType, spawnPos);
    test.succeedWhen(() => {
      test.assertEntityNotPresent(villagerEntityType, aboveBedPos);
      test.assertEntityPresent(villagerEntityType, bedPos);

      test.killAllEntities(); // Clean up villagers so the VillageManager doesn't waste time looking for points of interest (POIs)
    });
  })
    .structureName(VERTICAL_TEST_TEMPLATE_NAME)
    .maxTicks(VERTICAL_TEST_MAX_TICKS)
    .setupTicks(VERTICAL_TEST_STARTUP_TICKS)
    .padding(VERTICAL_TEST_PADDING)
    .batch("night")
    .tag(tag);
}

function addVerticalTest(counter, floor1, floor2, mid2, ceiling2, tag) {
  const testName = "Vertical" + counter;
  createVerticalTestFunctionWithCustomBlocks(
    testName,
    floor1,
    floor2,
    mid2,
    ceiling2,
    tag
  );
}

///
// Register tests
///
createVerticalTestFunctionWithPlacementMap(0, VERTICAL_TEST_PLACEMENT_MAP[0]);
createVerticalTestFunctionWithPlacementMap(1, VERTICAL_TEST_PLACEMENT_MAP[1]);
createVerticalTestFunctionWithPlacementMap(2, VERTICAL_TEST_PLACEMENT_MAP[2]);

addVerticalTest(3, "0", "0", "0.5 slab", "1.5");
addVerticalTest(4, "0", "0", "0.5 slab", "2");
addVerticalTest(5, "0", "0", "1 slab", "2");
addVerticalTest(6, "0", "0", "1 slab", "2.5");
addVerticalTest(7, "0", "0", "1.5 slab", "2.5");
addVerticalTest(8, "0", "0", "1 full", "2.5");
addVerticalTest(9, "0", "0", "none", "0.5");
addVerticalTest(10, "0", "0", "none", "1");
addVerticalTest(11, "0", "0", "none", "1.5");
addVerticalTest(12, "0", "0.5", "1 slab", "2");
addVerticalTest(13, "0", "0.5", "1 slab", "2.5");
addVerticalTest(14, "0", "0.5", "1.5 slab", "2.5");
addVerticalTest(15, "0", "0.5", "1 full", "2.5");
addVerticalTest(16, "0", "0.5", "none", "1");
addVerticalTest(17, "0", "0.5", "none", "1.5");
addVerticalTest(18, "0", "0.5", "none", "2", GameTest.Tags.suiteBroken); // Villager attempts to jump over slab with single block gap above it
addVerticalTest(19, "0", "0.5", "none", "2.5");
addVerticalTest(20, "0", "1", "1.5 slab", "2.5");
addVerticalTest(21, "0", "1", "none", "1.5");
addVerticalTest(22, "0", "1", "none", "2");
addVerticalTest(23, "0", "1", "none", "2.5");
addVerticalTest(24, "0.5", "0", "0.5 slab", "1.5");
addVerticalTest(25, "0.5", "0", "0.5 slab", "2");
addVerticalTest(26, "0.5", "0", "0.5 slab", "2.5");
addVerticalTest(27, "0.5", "0", "1 slab", "2");
addVerticalTest(28, "0.5", "0", "1 slab", "2.5");
addVerticalTest(29, "0.5", "0", "1 slab", "none", GameTest.Tags.suiteBroken); // Villager attempts to walk through floating slab while standing on slab
addVerticalTest(30, "0.5", "0", "1.5 slab", "2.5");
addVerticalTest(31, "0.5", "0", "1.5 slab", "none");
addVerticalTest(32, "0.5", "0", "1 full", "2.5");
addVerticalTest(33, "0.5", "0", "1 full", "none");
addVerticalTest(34, "0.5", "0", "none", "1.5");
addVerticalTest(35, "0.5", "0", "none", "2", GameTest.Tags.suiteBroken); // Villager attempts to jump down from a slab to a 1.5 block gap but hits head on block
addVerticalTest(36, "0.5", "0", "none", "2.5");
addVerticalTest(37, "0.5", "0.5", "1 slab", "2");
addVerticalTest(38, "0.5", "0.5", "1 slab", "2.5");
addVerticalTest(39, "0.5", "0.5", "1 slab", "none");
addVerticalTest(40, "0.5", "0.5", "1.5 slab", "2.5");
addVerticalTest(41, "0.5", "0.5", "1.5 slab", "none");
addVerticalTest(42, "0.5", "0.5", "1 full", "2.5");
addVerticalTest(43, "0.5", "0.5", "1 full", "none");
addVerticalTest(44, "0.5", "0.5", "none", "1.5");
addVerticalTest(45, "0.5", "0.5", "none", "2", GameTest.Tags.suiteBroken); // Villager attempts to walk through 1 block gap while standing on slab
addVerticalTest(46, "0.5", "0.5", "none", "2.5");
addVerticalTest(47, "0.5", "1", "1.5 slab", "2.5");
addVerticalTest(48, "0.5", "1", "1.5 slab", "none");
addVerticalTest(49, "0.5", "1", "none", "1.5");
addVerticalTest(50, "0.5", "1", "none", "2");
addVerticalTest(51, "0.5", "1", "none", "2.5");
addVerticalTest(52, "0.5", "1", "none", "none");
addVerticalTest(53, "1", "0", "none", "1.5");
addVerticalTest(54, "1", "0", "none", "2"); // flaky
addVerticalTest(55, "1", "0", "none", "2.5"); // flaky
addVerticalTest(56, "1", "0", "none", "none");
addVerticalTest(57, "1", "0.5", "none", "1.5");
addVerticalTest(58, "1", "0.5", "none", "2", GameTest.Tags.suiteBroken); // Villager constantly attempts to jump into 1 block gap
addVerticalTest(59, "1", "0.5", "none", "2.5");
addVerticalTest(60, "1", "0.5", "none", "none");
