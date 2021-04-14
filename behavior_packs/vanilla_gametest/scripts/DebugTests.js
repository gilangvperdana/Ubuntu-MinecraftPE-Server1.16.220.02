import * as GameTest from "GameTest";

GameTest.register("DebugTests", "always_fail", (test) => {
  // Do nothing, let the test time out
})
  .maxTicks(50)
  .tag(GameTest.Tags.suiteDebug);

GameTest.register("DebugTests", "always_succeed", (test) => {
  test.runAfterDelay(40, () => {
    test.succeed();
  });
})
  .maxTicks(50)
  .tag(GameTest.Tags.suiteDebug);
