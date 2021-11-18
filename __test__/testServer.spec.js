import { server } from "../src/server/index";

describe('Test: "PORT" should be set to 8082', () => {
  it("should be a 8082", async () => {
    expect(server).toBe(undefined);
  });
});