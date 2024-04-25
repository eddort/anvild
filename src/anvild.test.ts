import { createAnvil } from ".";
import { JsonRpcProvider } from "../test/provider";

const BLOCK_NUMBER = 19701098;

describe("base", async () => {
  it("works", async () => {
    const node = await createAnvil({
      anvil: { forkUrl: "https://cloudflare-eth.com" },
    });

    console.log(node.host, node.port, node.containerId);

    const provider = new JsonRpcProvider(node.url);
    const block = await provider.getBlock("latest");

    expect(block?.number).greaterThan(BLOCK_NUMBER);

    await node.stop();
  });
});
