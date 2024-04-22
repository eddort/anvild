import { createAnvil } from ".";

describe(
  "base",
  async () => {
    it("works", async () => {
      const node = await createAnvil({
        anvil: { forkUrl: "https://cloudflare-eth.com" },
      });

      console.log(node.host, node.port, node.containerId);

      await node.stop();
    });
  }
);
