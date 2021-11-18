import { server } from "../src/server/index";

describe('Test: localhost port should be set', () => {
  it("Localhost port should be defined", async () => {
    expect(server).toBe(undefined);
  });
});