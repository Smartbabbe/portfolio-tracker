import { useState } from 'react'

// Mock wallet data
const WALLETS = [
  { address: '0x742d...f44e', label: 'Main Wallet',   ens: 'esther.eth' },
  { address: '0xA4c9...b21c', label: 'Trading Wallet', ens: null },
]

const HOLDINGS = [
  { symbol:'ETH',  name:'Ethereum',        amount:2.45,   price:3284.50, value:8047.02, change24h: 1.8, chain:'Ethereum', img:'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { symbol:'SOL',  name:'Solana',          amount:24.8,   price: 184.20, value:4568.16, change24h: 3.2, chain:'Solana',   img:'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { symbol:'USDC', name:'USD Coin',        amount:2841.5, price:   1.00, value:2841.50, change24h: 0.0, chain:'Ethereum', img:'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
  { symbol:'UNI',  name:'Uniswap',         amount:48.2,   price:  12.84, value: 618.88, change24h:-1.2, chain:'Ethereum', img:'https://assets.coingecko.com/coins/images/12504/small/uni.jpg' },
  { symbol:'AAVE', name:'Aave',            amount:3.6,    price: 195.40, value: 703.44, change24h: 2.4, chain:'Ethereum', img:'https://assets.coingecko.com/coins/images/12645/small/AAVE.png' },
  { symbol:'LINK', name:'Chainlink',       amount:31.4,   price:  18.92, value: 594.08, change24h:-0.8, chain:'Ethereum', img:'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
]

const LP_POSITIONS = [
  { pair:'ETH/USDC', protocol:'Uniswap V3', value:1842.50, apy:12.4, chain:'Ethereum', token0:'ETH', token1:'USDC', fee:'0.3%' },
  { pair:'SOL/USDC', protocol:'Raydium',    value: 920.00, apy:18.2, chain:'Solana',   token0:'SOL', token1:'USDC', fee:'0.25%' },
]

const STAKING = [
  { protocol:'Lido',        asset:'stETH',   amount:1.2,  apy:3.8,  rewards:0.0456,  rewardValue:149.70 },
  { protocol:'Rocket Pool', asset:'rETH',    amount:0.5,  apy:3.4,  rewards:0.017,   rewardValue: 55.84 },
  { protocol:'Aave V3',     asset:'aUSDC',   amount:1500, apy:5.2,  rewards:78.0,    rewardValue: 78.00 },
]

const TRANSACTIONS = [
  { type:'swap',    desc:'ETH → USDC',    amount:'+$1,284.50', time:'2h ago',   hash:'0x4f2a...' },
  { type:'deposit', desc:'USDC → Aave',  amount:'+$500.00',   time:'1d ago',   hash:'0x9c1b...' },
  { type:'receive', desc:'SOL received', amount:'+$184.20',   time:'2d ago',   hash:'0x3e7f...' },
  { type:'swap',    desc:'UNI → ETH',    amount:'-$256.80',   time:'3d ago',   hash:'0x8a2c...' },
  { type:'send',    desc:'ETH sent',     amount:'-$328.45',   time:'5d ago',   hash:'0x5d9e...' },
]

const totalValue  = HOLDINGS.reduce((s, h) => s + h.value, 0)
  + LP_POSITIONS.reduce((s, p) => s + p.value, 0)
  + STAKING.reduce((s, s2) => s + s2.rewardValue, 0)

const fmt = (n: number, decimals = 2) => `$${n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
const pct = (v: number) => <span className={v >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{v >= 0 ? '+' : ''}{v.toFixed(2)}%</span>

const TX_ICON: Record<string, string> = { swap:'⇄', deposit:'↓', receive:'↙', send:'↗' }
const TX_COLOR: Record<string, string> = { swap:'text-blue-400', deposit:'text-emerald-400', receive:'text-emerald-400', send:'text-rose-400' }

export default function App() {
  const [tab,     setTab]     = useState<'holdings'|'lp'|'staking'|'activity'>('holdings')
  const [wallet,  setWallet]  = useState(0)

  return (
    <div className="min-h-screen bg-[#070810] text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>

      {/* Sidebar */}
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-zinc-800/50 p-6 flex-shrink-0 hidden lg:flex flex-col gap-6">
          <div>
            <p style={{ fontFamily:'Syne,sans-serif' }} className="font-black text-xl text-white tracking-tight">ChainVault</p>
            <p className="text-zinc-500 text-xs mt-0.5">Portfolio Tracker</p>
          </div>

          {/* Wallets */}
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-600 mb-3">Wallets</p>
            {WALLETS.map((w, i) => (
              <button key={w.address} onClick={() => setWallet(i)}
                className={`w-full text-left px-3 py-2.5 rounded-xl mb-1.5 transition-colors ${wallet===i ? 'bg-zinc-800 border border-zinc-700' : 'hover:bg-zinc-900'}`}>
                <p className="font-semibold text-sm text-white">{w.label}</p>
                <p className="text-zinc-500 text-[10px] font-mono">{w.ens || w.address}</p>
              </button>
            ))}
          </div>

          {/* Nav */}
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-600 mb-3">Overview</p>
            {(['holdings','lp','staking','activity'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 text-sm font-medium capitalize transition-colors ${tab===t ? 'bg-violet-500/10 text-violet-400 border border-violet-800/30' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}>
                {t === 'lp' ? 'LP Positions' : t}
              </button>
            ))}
          </div>

          <div className="mt-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <p className="text-zinc-500 text-xs mb-1">Net Worth</p>
              <p className="font-black text-white text-xl" style={{ fontFamily:'JetBrains Mono,monospace' }}>{fmt(totalValue)}</p>
              <p className="text-emerald-400 text-xs mt-0.5">+2.4% today</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-zinc-500 text-sm">{WALLETS[wallet].ens || WALLETS[wallet].address}</p>
              <p className="font-black text-4xl text-white mt-1" style={{ fontFamily:'JetBrains Mono,monospace' }}>{fmt(totalValue)}</p>
              <p className="text-emerald-400 text-sm mt-1">▲ $284.50 (2.4%) today</p>
            </div>
            <div className="flex gap-3">
              {(['holdings','lp','staking','activity'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} className={`lg:hidden px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${tab===t ? 'bg-violet-600 text-white' : 'bg-zinc-900 text-zinc-400'}`}>
                  {t==='lp'?'LP':t}
                </button>
              ))}
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label:'Tokens',    value: fmt(HOLDINGS.reduce((s,h)=>s+h.value,0)),  sub:`${HOLDINGS.length} assets` },
              { label:'LP Value',  value: fmt(LP_POSITIONS.reduce((s,p)=>s+p.value,0)), sub:`${LP_POSITIONS.length} positions` },
              { label:'Staking',   value: fmt(STAKING.reduce((s,s2)=>s+s2.rewardValue,0)), sub:`${STAKING.length} protocols` },
              { label:'24h Change',value: '+$284.50', sub:'+2.4% portfolio', green:true },
            ].map(c => (
              <div key={c.label} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
                <p className="text-zinc-500 text-xs mb-1">{c.label}</p>
                <p className={`font-bold text-lg ${(c as any).green ? 'text-emerald-400' : 'text-white'}`} style={{ fontFamily:'JetBrains Mono,monospace' }}>{c.value}</p>
                <p className="text-zinc-600 text-[10px] mt-0.5">{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Token Holdings */}
          {tab === 'holdings' && (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800">
                <p className="font-semibold text-white">Token Holdings</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {['Asset','Amount','Price','Value','24h','Chain'].map(h => (
                        <th key={h} className={`py-3 px-5 text-[10px] uppercase tracking-wider text-zinc-600 ${h==='Amount'||h==='Price'||h==='Value'||h==='24h' ? 'text-right' : 'text-left'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HOLDINGS.map(h => (
                      <tr key={h.symbol} className="border-b border-zinc-900 hover:bg-zinc-800/30 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <img src={h.img} alt={h.symbol} className="w-8 h-8 rounded-full" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                            <div>
                              <p className="font-semibold text-white">{h.symbol}</p>
                              <p className="text-zinc-500 text-xs">{h.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-right font-mono text-zinc-300">{h.amount.toLocaleString()}</td>
                        <td className="py-4 px-5 text-right font-mono text-zinc-300">{fmt(h.price)}</td>
                        <td className="py-4 px-5 text-right font-mono font-semibold text-white">{fmt(h.value)}</td>
                        <td className="py-4 px-5 text-right font-mono">{pct(h.change24h)}</td>
                        <td className="py-4 px-5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{h.chain}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LP Positions */}
          {tab === 'lp' && (
            <div className="grid md:grid-cols-2 gap-4">
              {LP_POSITIONS.map(p => (
                <div key={p.pair} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold text-white text-lg">{p.pair}</p>
                      <p className="text-zinc-500 text-xs">{p.protocol} · {p.fee} fee · {p.chain}</p>
                    </div>
                    <span className="text-emerald-400 font-bold text-xl font-mono">{p.apy}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-800 rounded-xl p-3">
                      <p className="text-zinc-500 text-xs">Position Value</p>
                      <p className="font-bold text-white font-mono">{fmt(p.value)}</p>
                    </div>
                    <div className="bg-zinc-800 rounded-xl p-3">
                      <p className="text-zinc-500 text-xs">APY</p>
                      <p className="font-bold text-emerald-400 font-mono">{p.apy}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Staking */}
          {tab === 'staking' && (
            <div className="space-y-3">
              {STAKING.map(s => (
                <div key={s.protocol} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-white">{s.protocol}</p>
                    <p className="text-zinc-500 text-xs">{s.amount} {s.asset} staked</p>
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-400 font-bold font-mono">{s.apy}%</p>
                    <p className="text-zinc-600 text-xs">APY</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold font-mono">{fmt(s.rewardValue)}</p>
                    <p className="text-zinc-500 text-xs">{s.rewards} {s.asset} earned</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-800/30 text-xs font-semibold hover:bg-violet-600/20 transition-colors">
                    Claim
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Activity */}
          {tab === 'activity' && (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
              {TRANSACTIONS.map((tx, i) => (
                <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i < TRANSACTIONS.length-1 ? 'border-b border-zinc-900' : ''} hover:bg-zinc-800/30 transition-colors`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800 text-sm ${TX_COLOR[tx.type]}`}>
                    {TX_ICON[tx.type]}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{tx.desc}</p>
                    <p className="text-zinc-500 text-xs font-mono">{tx.hash}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-semibold text-sm ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{tx.amount}</p>
                    <p className="text-zinc-600 text-xs">{tx.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
