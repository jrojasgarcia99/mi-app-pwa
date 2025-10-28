'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { formatCRC } from './lib/format';

type Wallet = { id:string; name:string; currency:'CRC'; budget:number; unlimited:boolean; icon?:string };
type Expense = { id:string; walletId:string; amount:number; note?:string; date:string; method?:string };

const WKEY='trackin.wallets.v1';
const EKEY='trackin.expenses.v1';

export default function Page(){
  const [wallets,setWallets]=useState<Wallet[]>([]);
  const [expenses,setExpenses]=useState<Expense[]>([]);
  useEffect(()=>{ setWallets(JSON.parse(localStorage.getItem(WKEY)||'[]')); setExpenses(JSON.parse(localStorage.getItem(EKEY)||'[]')); },[]);
  const totals = useMemo(()=> {
    const map:Record<string,{spent:number}> = {};
    for(const e of expenses){ map[e.walletId] ??= {spent:0}; map[e.walletId].spent += e.amount; }
    return map;
  },[expenses]);

  const overall = useMemo(()=>{
    let available=0;
    for(const w of wallets){
      const spent = totals[w.id]?.spent ?? 0;
      available += w.unlimited ? -spent : (w.budget - spent);
    }
    return available;
  },[wallets,totals]);

  return (
    <main>
      <h1 className="h1">Wallets</h1>

      <div className="card headerCard" style={{marginBottom:16}}>
        <div className="row">
          <div>
            <div className="muted">Total available</div>
            <div className="big ok">{formatCRC(overall)}</div>
          </div>
          <div className="badge">CRC</div>
        </div>
      </div>

      <ul className="list">
        {wallets.map(w=>{
          const spent = totals[w.id]?.spent ?? 0;
          const available = w.unlimited ? -spent : (w.budget - spent);
          return (
            <li key={w.id} className="item">
              <Link href={`/wallet/${w.id}`} className="link" style={{flex:1}}>
                <div className="wallet">
                  <div className="walletIcon">₡</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700}}>{w.name}</div>
                    <div className="muted" style={{fontSize:13}}>
                      {w.unlimited ? 'Unlimited' : `${formatCRC(w.budget)} budget`}
                    </div>
                  </div>
                </div>
              </Link>
              <div className="mono" style={{fontWeight:700,color:'var(--success)'}}>{formatCRC(available)}</div>
            </li>
          );
        })}
        {wallets.length===0 && <div className="card">Aún no tienes wallets. Crea la primera con el botón verde.</div>}
      </ul>

      <Link href="/wallet/new" className="fab">＋ New Wallet</Link>
    </main>
  );
}