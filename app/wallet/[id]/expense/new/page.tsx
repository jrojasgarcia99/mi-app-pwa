'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

type Expense = { id:string; walletId:string; amount:number; note?:string; date:string; method?:string };
const EKEY='trackin.expenses.v1';

export default function NewExpense(){
  const { id } = useParams<{id:string}>();
  const r = useRouter();
  const [note,setNote]=useState('');
  const [amount,setAmount]=useState('');
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const [method,setMethod]=useState('BCT Cash Back');

  const save=()=>{
    const val = parseFloat(amount.replace(',','.'));
    if(isNaN(val) || val<=0) return alert('Monto inválido.');
    const all:Expense[]=JSON.parse(localStorage.getItem(EKEY)||'[]');
    all.unshift({ id:crypto.randomUUID(), walletId:id, amount:Math.round(val*100)/100, note:note.trim()||undefined, date, method });
    localStorage.setItem(EKEY, JSON.stringify(all));
    r.push(`/wallet/${id}`);
  };

  return (
    <main>
      <h1 className="h1">New expense</h1>
      <div className="card grid grid-2">
        <div style={{gridColumn:'1/-1'}}>
          <label className="muted">Description</label>
          <input className="input" placeholder="Burgers" value={note} onChange={e=>setNote(e.target.value)} />
        </div>
        <div>
          <label className="muted">Amount</label>
          <input className="input" inputMode="decimal" placeholder="₡0.00" value={amount} onChange={e=>setAmount(e.target.value)} />
        </div>
        <div>
          <label className="muted">Date</label>
          <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
        </div>
        <div style={{gridColumn:'1/-1'}}>
          <label className="muted">Payment Method</label>
          <select className="input" value={method} onChange={e=>setMethod(e.target.value)}>
            <option>BCT Cash Back</option>
            <option>Debit</option>
            <option>Credit</option>
            <option>Cash</option>
            <option>Sinpe Móvil</option>
          </select>
        </div>
        <div className="row" style={{gridColumn:'1/-1',justifyContent:'flex-end'}}>
          <button className="btn btn-primary" onClick={save}>Save</button>
        </div>
      </div>
    </main>
  );
}