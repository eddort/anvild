# Anvild — simple Anvil Nodejs binding

Anvil requires a local installation to work with Anvil. It is also not possible to manage from nodejs.
Anvild solves all these problems:

- does not require local installation of Anvil
- easy to use interface from Nodejs
- good type support

<hr>
<br>
<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/anvild">
    <img alt="" src="https://img.shields.io/npm/v/anvild.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="License" href="https://github.com/eddort/anvild/blob/main/license.md">
    <img alt="" src="https://img.shields.io/npm/l/anvild.svg?style=for-the-badge&labelColor=000000">
  </a>
</p>

## Installation

To install Anvil Docker Manager, follow these steps:

1. Ensure you have Node.js and Docker installed.

2. Install `anvild` using npm/yarn/pnpm

```bash
yarn add anvild
```

3. Create Anvil node using Nodejs

```ts
import { cleanAll, createAnvil } from "anvild";

(async () => {
  // clean all Anvil instances
  await cleanAll();
  // run anvil node with default config
  const node = await createAnvil({});
})();
```

## Api reference

### Anvil Options

##### computeUnitsPerSecond (Optional)

- Type: `number`
- Default: `350`
- Description: Sets the number of assumed available compute units per second for this fork provider.

#### forkUrl (Optional)

- Type: `string`
- Description: Fetch state over a remote endpoint instead of starting from an empty state. If you want to fetch state from a specific block number, add a block number like `http://localhost:8545@1400000` or use the `forkBlockNumber` option.

#### forkBlockNumber (Optional)

- Type: `number` or `bigint`
- Description: Fetch state from a specific block number over a remote endpoint. Requires `forkUrl` to be set.

#### forkChainId (Optional)

- Type: `number`
- Description: Specify chain id to skip fetching it from the remote endpoint. This enables offline-start mode. You still must pass both `forkUrl` and `forkBlockNumber`, and already have your required state cached on disk, anything missing locally would be fetched from the remote.

#### forkRetryBackoff (Optional)

- Type: `number`
- Description: Initial retry backoff on encountering errors.

#### noRateLimit (Optional)

- Type: `boolean`
- Default: `false`
- Description: Disables rate limiting for this node's provider. See [here](https://github.com/alchemyplatform/alchemy-docs/blob/master/documentation/compute-units.md#rate-limits-cups).

#### noStorageCaching (Optional)

- Type: `boolean`
- Description: Explicitly disables the use of RPC caching. All storage slots are read entirely from the endpoint.

#### retries (Optional)

- Type: `number`
- Default: `5`
- Description: Number of retry requests for spurious networks (timed out requests).

#### timeout (Optional)

- Type: `number`
- Default: `45000`
- Description: Timeout in ms for requests sent to remote JSON-RPC server in forking mode.

#### blockBaseFeePerGas (Optional)

- Type: `bigint`
- Description: The base fee in a block.

#### chainId (Optional)

- Type: `number`
- Description: The chain id.

#### codeSizeLimit (Optional)

- Type: `number`
- Default: `0x6000` (~25kb)
- Description: EIP-170: Contract code size limit in bytes. Useful to increase this because of tests.

#### disableBlockGasLimit (Optional)

- Type: `boolean`
- Description: Disable the `call.gas_limit <= block.gas_limit` constraint.

#### gasLimit (Optional)

- Type: `bigint`
- Description: The block gas limit.

#### gasPrice (Optional)

- Type: `bigint`
- Description: The gas price.

#### accounts (Optional)

- Type: `number`
- Default: `10`
- Description: Number of dev accounts to generate and configure.

#### balance (Optional)

- Type: `bigint`
- Default: `10000`
- Description: The balance of every dev account in Ether.

#### derivationPath (Optional)

- Type: `string`
- Default: `m/44'/60'/0'/0/`
- Description: Sets the derivation path of the child key to be derived.

#### mnemonic (Optional)

- Type: `string`
- Description: BIP39 mnemonic phrase used for generating accounts.

#### port (Optional)

- Type: `number`
- Default: `8545`
- Description: Port number to listen on.

#### stepsTracing (Optional)

- Type: `boolean`
- Description: Enable steps tracing used for debug calls returning geth-style traces.

#### timestamp (Optional)

- Type: `bigint`
- Description: The timestamp of the genesis block.

#### allowOrigin (Optional)

- Type: `string`
- Default: `*`
- Description: Set the Access-Control-Allow-Origin response header (CORS).

#### blockTime (Optional)

- Type: `number`
- Description: Block time in seconds for interval mining.

#### configOut (Optional)

- Type: `string`
- Description: Writes output of `anvil` as JSON to user-specified file.

#### dumpState (Optional)

- Type: `string`
- Description: Dump the state of the chain on exit to the given file. If the value is a directory, the state will be written to `<VALUE>/state.json`.

#### hardfork (Optional)

- Type: `enum` (`chainstart`, `berlin`, `london`)
- Description: The EVM hardfork to use.

#### host (Optional)

- Type: `string`
- Default: `0.0.0.0`
- Description: The host the server will listen on.

#### init (Optional)

- Type: `string`
- Description: Initialize the genesis block with the given `genesis.json` file.

#### ipc (Optional)

- Type: `string`
- Description: Launch an IPC server at the given path or default path = `/tmp/anvil.ipc`.

#### loadState (Optional)

- Type: `string`
- Description: Initialize the chain from a previously saved state snapshot.

#### noCors (Optional)

- Type: `boolean`
- Description: Disable CORS.

#### noMining (Optional)

- Type: `boolean`
- Description: Disable auto and interval mining, and mine on demand instead.

#### order (Optional)

- Type: `string`
- Default: `fees`
- Description: How transactions are sorted in the mempool.

#### pruneHistory (Optional)

- Type: `number` or `boolean`
- Description: Don't keep full chain history.

#### stateInterval (Optional)

- Type: `number`
- Description: Interval in seconds at which the status is to be dumped to disk.

#### silent (Optional)

- Type: `boolean`
- Description: Don't print anything on startup and don't print logs.

#### state (Optional)

- Type: `string`
- Description: This is an alias for both `loadState` and `dumpState`.

#### transactionBlockKeeper (Optional)

- Type: `number`
- Description: Number of blocks with transactions to keep in memory.

## Instance Options

#### socketPath (Optional)

- Type: `string`
- Description: Docker socket path.

#### attachLogs (Optional)

- Type: `boolean`
- Default: `true`
- Description: Attach Anvil logs to the current process.

#### forceRecreate (Optional)

- Type: `boolean`
- Default: `true`
- Description: Force re-create the instance with the same configuration.
