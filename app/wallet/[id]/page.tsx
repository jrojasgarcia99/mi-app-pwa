'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { formatCRC } from '../../lib/format';

type Wallet = { id:string; name:string; currency:'CRC'; budget:number; unlimited:boolean };
type Expense = { id:string; walletId:string; amount:number; note?:string; date:string; method?:string };

const WKEY='trackin.wallets.v1';
const EKEY='trackin.expenses.v1';

export default function WalletDetail(){
  const { id } = useParams<{id:string}>();
  const r = useRouter();
  const [wallet,setWallet]=useState<Wallet|null>(null);
  const [expenses,setExpenses]=useState<Expense[]>([]);
  useEffect(()=>{
    const ws:Wallet[]=JSON.parse(localStorage.getItem(WKEY)||'[]');
    setWallet(ws.find(w=>w.id===id) || null);
    const es:Expense[]=JSON.parse(localStorage.getItem(EKEY)||'[]');
    setExpenses(es.filter(e=>e.walletId===id));
  },[id]);

  const budget = wallet?.unlimited? null : wallet?.budget ?? 0;
  const spent = useMemo(()=>expenses.reduce((a,e)=>a+e.amount,0),[expenses]);
  const available = wallet?.unlimited ? -spent : ( (wallet?.budget ?? 0) - spent );

  const removeExpense=(eid:string)=>{
    const all:Expense[]=JSON.parse(localStorage.getItem(EKEY)||'[]');
    const next = all.filter(e=>e.id!==eid);
    localStorage.setItem(EKEY, JSON.stringify(next));
    setExpenses(prev=>prev.filter(e=>e.id!==eid));
  };

  if(!wallet) return <main><div className="card">Wallet no encontrada.</div></main>;

  return (
    <main>
      <div className="row" style={{marginBottom:12}}>
        <button className="btn btn-link" onClick={()=>r.push('/')}>← Back</button>
        <h1 className="h1" style={{margin:'0 auto 0 0'}}>{wallet.name}</h1>
      </div>

      <div className="card headerCard" style={{marginBottom:16}}>
        <div className="row">
          <div>
            <div className="muted">{budget!==null ? `${formatCRC(budget)} budgeted` : 'Unlimited budget'}</div>
            <div className="muted">{formatCRC(spent)} spent</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div className="ok mono" style={{fontSize:26}}>{formatCRC(available)}</div>
            <div className="muted" style={{fontSize:13}}>available</div>
          </div>
        </div>
      </div>

      <h2 className="h2">Latest transactions</h2>
      <div className="card">
        {expenses.length===0 ? <div className="muted">No expenses yet.</div> : (
          <ul className="list">
            {expenses.map(e=>(
              <li key={e.id} className="item">
                <div>
                  <div style={{fontWeight:700}}>{e.note || '(Sin descripción)'}</div>
                  <div className="muted" style={{fontSize:13}}>
                    {new Date(e.date).toLocaleDateString('es-CR')} · {e.method || '—'}
                  </div>
                </div>
                <div className="mono" style={{color:'var(--danger)',fontWeight:700}}>{formatCRC(e.amount)}</div>
                <button className="btn btn-link" onClick={()=>removeExpense(e.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link href={`/wallet/${wallet.id}/expense/new`} className="fab">＋ Add transaction</Link>
    </main>
  );
}