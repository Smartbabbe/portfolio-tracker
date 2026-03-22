# ChainVault — DeFi Portfolio Tracker

A premium DeFi portfolio tracking interface with a wealth-management aesthetic. View token holdings, LP positions, staking rewards, and transaction history across multiple wallets — all in one clean dark dashboard.

**🔗 Live Demo:** https://portfolio-tracker-lac-delta.vercel.app/

---

## Features

- **Multi-wallet sidebar** — switch between wallets with ENS name support
- **Token holdings** — full table of assets with price, amount, value, 24h change, and chain label
- **LP positions** — view active liquidity pool positions with value and current APY
- **Staking rewards** — track staked assets, earned rewards, and claim buttons across protocols
- **Activity feed** — chronological transaction history with type icons and value display
- **Portfolio summary** — total net worth with 24h change, broken down by tokens, LP, and staking
- **Tab navigation** — clean section switching between Holdings, LP Positions, Staking, and Activity

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Vite | Build tool |

> Wallet and portfolio data is mock/static for portfolio demonstration. Real wallet reads would require wagmi + Alchemy/Infura integration.

---

## Mock Data Included

- **2 wallets** — Main Wallet (esther.eth) and Trading Wallet
- **6 token holdings** — ETH, SOL, USDC, UNI, AAVE, LINK
- **2 LP positions** — ETH/USDC on Uniswap V3, SOL/USDC on Raydium
- **3 staking positions** — Lido (stETH), Rocket Pool (rETH), Aave V3 (aUSDC)
- **5 recent transactions** — swaps, deposits, receives, and sends

---

## Connecting Real Wallet Data

To upgrade from mock data to live wallet reads, integrate wagmi:

```ts
import { useBalance, useAccount } from 'wagmi'

const { address } = useAccount()
const { data: balance } = useBalance({ address })
```

---

## Built By

**Esther Okon** — Web3 Developer, DeFi Educator & Community Builder  
🌐 Portfolio: https://personal-portfolio-site-ten-rouge.vercel.app/  
🐦 Twitter: [@thesmarrtEsther](https://twitter.com/thesmarrtEsther)
