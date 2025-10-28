'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Wallet = { id:string; name:string; currency:'CRC'; budget:number; unlimited:boolean; icon?:string };
const WKEY='trackin.wallets.v1';

export default function NewWallet(){
  const r = useRouter();
  const [name,setName]=useState('');
  const [budget,setBudget]=useState<string>('');
  const [unlimited,setUnlimited]=useState(false);

  const save=()=>{
    if(!name.trim()) return alert('Nombre requerido.');
    const wallets:Wallet[]=JSON.parse(localStorage.getItem(WKEY)||'[]');
    const w:Wallet={ id:crypto.randomUUID(), name:name.trim(), currency:'CRC', budget:unlimited?0:parseFloat(budget||'0'), unlimited };
    wallets.push(w);
    localStorage.setItem(WKEY,JSON.stringify(wallets));
    r.push('/');
  };

  return (
    <main>
      <h1 className="h1">New Wallet</h1>
      <div className="card grid grid-2">
        <div>
          <label className="muted">Name</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g., Groceries"/>
        </div>
        <div>
          <label className="muted">Currency</label>
          <select className="input" defaultValue="CRC" disabled><option value="CRC">₡ - CRC</option></select>
        </div>
        <div>
          <label className="muted">Wallet budget</label>
          <input className="input" inputMode="decimal" placeholder="₡0.00" value={budget} onChange={e=>setBudget(e.target.value)} disabled={unlimited}/>
        </div>
        <div>
          <label className="muted">Unlimited</label>
          <div className="row">
            <input type="checkbox" checked={unlimited} onChange={e=>setUnlimited(e.target.checked)}/>
            <span className="muted" style={{fontSize:13}}>This will create the wallet without a maximum budget</span>
          </div>
        </div>
        <div className="row" style={{gridColumn:'1/-1',justifyContent:'flex-end'}}>
          <button className="btn btn-primary" onClick={save}>Save</button>
        </div>
      </div>
    </main>
  );
}