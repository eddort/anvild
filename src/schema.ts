import * as z from "zod";

export const AnvilOptionsSchema = z.object({
  computeUnitsPerSecond: z
    .number()
    .optional()
    .describe(
      "Sets the number of assumed available compute units per second for this fork provider. Default: 350. See https://github.com/alchemyplatform/alchemy-docs/blob/master/documentation/compute-units.md#rate-limits-cups"
    ),
  forkUrl: z
    .string()
    .url()
    .optional()
    .describe(
      "Fetch state over a remote endpoint instead of starting from an empty state. If you want to fetch state from a specific block number, add a block number like http://localhost:8545@1400000 or use the forkBlockNumber option."
    ),
  forkBlockNumber: z
    .union([z.number(), z.bigint()])
    .optional()
    .describe(
      "Fetch state from a specific block number over a remote endpoint. Requires forkUrl to be set."
    ),
  forkChainId: z
    .number()
    .optional()
    .describe(
      "Specify chain id to skip fetching it from remote endpoint. This enables offline-start mode. You still must pass both forkUrl and forkBlockNumber, and already have your required state cached on disk, anything missing locally would be fetched from the remote."
    ),
  forkRetryBackoff: z
    .number()
    .optional()
    .describe("Initial retry backoff on encountering errors."),
  noRateLimit: z
    .boolean()
    .optional()
    .describe(
      "Disables rate limiting for this node's provider. Default: false. See https://github.com/alchemyplatform/alchemy-docs/blob/master/documentation/compute-units.md#rate-limits-cups"
    ),
  noStorageCaching: z
    .boolean()
    .optional()
    .describe(
      "Explicitly disables the use of RPC caching. All storage slots are read entirely from the endpoint."
    ),
  retries: z
    .number()
    .optional()
    .describe(
      "Number of retry requests for spurious networks (timed out requests). Default: 5"
    ),
  timeout: z
    .number()
    .optional()
    .describe(
      "Timeout in ms for requests sent to remote JSON-RPC server in forking mode. Default: 45000"
    ),
  blockBaseFeePerGas: z
    .bigint()
    .optional()
    .describe("The base fee in a block."),
  chainId: z.number().optional().describe("The chain id."),
  codeSizeLimit: z
    .number()
    .optional()
    .describe(
      "EIP-170: Contract code size limit in bytes. Useful to increase this because of tests. Default: 0x6000 (~25kb)"
    ),
  disableBlockGasLimit: z
    .boolean()
    .optional()
    .describe("Disable the call.gas_limit <= block.gas_limit constraint."),
  gasLimit: z.bigint().optional().describe("The block gas limit."),
  gasPrice: z.bigint().optional().describe("The gas price."),
  accounts: z
    .number()
    .optional()
    .describe("Number of dev accounts to generate and configure. Default: 10"),
  balance: z
    .bigint()
    .optional()
    .describe("The balance of every dev account in Ether. Default: 10000"),
  derivationPath: z
    .string()
    .optional()
    .describe(
      "Sets the derivation path of the child key to be derived. Default: m/44'/60'/0'/0/"
    ),
  mnemonic: z
    .string()
    .optional()
    .describe("BIP39 mnemonic phrase used for generating accounts."),
  port: z
    .number()
    .optional()
    .default(8545)
    .describe("Port number to listen on. Default: 8545"),
  stepsTracing: z
    .boolean()
    .optional()
    .describe(
      "Enable steps tracing used for debug calls returning geth-style traces."
    ),
  timestamp: z
    .bigint()
    .optional()
    .describe("The timestamp of the genesis block."),
  allowOrigin: z
    .string()
    .optional()
    .describe(
      "Set the Access-Control-Allow-Origin response header (CORS). Default: *"
    ),
  blockTime: z
    .number()
    .optional()
    .describe("Block time in seconds for interval mining."),
  configOut: z
    .string()
    .optional()
    .describe("Writes output of `anvil` as json to user-specified file."),
  dumpState: z
    .string()
    .optional()
    .describe(
      "Dump the state of chain on exit to the given file. If the value is a directory, the state will be written to <VALUE>/state.json."
    ),
  hardfork: z
    .enum(["chainstart", "berlin", "london"])
    .optional()
    .describe("The EVM hardfork to use."),
  host: z
    .string()
    .optional()
    .default("0.0.0.0")
    .describe("The host the server will listen on."),
  init: z
    .string()
    .optional()
    .describe("Initialize the genesis block with the given genesis.json file."),
  ipc: z
    .string()
    .optional()
    .describe(
      "Launch an ipc server at the given path or default path = /tmp/anvil.ipc."
    ),
  loadState: z
    .string()
    .optional()
    .describe("Initialize the chain from a previously saved state snapshot."),
  noCors: z.boolean().optional().describe("Disable CORS."),
  noMining: z
    .boolean()
    .optional()
    .describe("Disable auto and interval mining, and mine on demand instead."),
  order: z
    .string()
    .optional()
    .describe("How transactions are sorted in the mempool. Default: fees"),
  pruneHistory: z
    .union([z.number(), z.boolean()])
    .optional()
    .describe("Don't keep full chain history."),
  stateInterval: z
    .number()
    .optional()
    .describe(
      "Interval in seconds at which the status is to be dumped to disk."
    ),
  silent: z
    .boolean()
    .optional()
    .describe("Don't print anything on startup and don't print logs."),
  state: z
    .string()
    .optional()
    .describe("This is an alias for both loadState and dumpState."),
  transactionBlockKeeper: z
    .number()
    .optional()
    .describe("Number of blocks with transactions to keep in memory."),
});

export type AnvilOptions = z.infer<typeof AnvilOptionsSchema>;
