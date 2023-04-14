# Web3PortfolioWallet

<img src="./assets/logo/20230408__aicon_blue_500-500.png">

## Concenpt

<img src="./assets/imgs/ETHTokyo_UX.png">

## deployed Smartcontract

| No. | Name    | address                                                                                                                            |
| :-- | :------ | :--------------------------------------------------------------------------------------------------------------------------------- |
| 1   | DNS     | [0x8eD85ab44b29286D878492da06c862770A078176](https://testnet.snowtrace.io/address/0x8eD85ab44b29286D878492da06c862770A078176#code) |
| 2   | MyToken | [0xFF6E94b43b6c52f64eDb32926ad64a59039e8353](https://testnet.snowtrace.io/address/0xFF6E94b43b6c52f64eDb32926ad64a59039e8353#code) |

## SubGraph Endpoint

[https://api.studio.thegraph.com/query/44992/subgraph4/v0.0.2](https://api.studio.thegraph.com/query/44992/subgraph4/v0.0.2)

- Sample Query

```gql
query SampleQuery {
  updateVcs {
    blockNumber
    cid
    did
    blockTimestamp
    id
    name
  }
  updateScores {
    id
    score
    to
  }
  registereds {
    did
    id
    isRegistered
    name
    to
  }
}
```

## Commands

- install

```bash
yarn
```

- Smartcontract test

```bash
yarn test:contract
```

- deploy Smartcontract to Avalanche fuji Network

```bash
yarn deploy:fuji
```

- verify Smartcontract to Avalanche fuji Network

```bash
yarn verify:fuji
```

- start API Server

```bash
yarn start:api
```

- build frontend

```bash
yarn build:frontend
```

- start frontend

```bash
yarn start:frontend
```

- subgraph codegen

```bash
yarn subgraph:codegen
```

- subgraph build

```bash
yarn subgraph:build
```

- subgraph deploy

```bash
yarn subgraph:deploy
```
