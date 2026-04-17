<div className="grid grid-cols-2 gap-4">
  {/* Forma de Pagamento */}
  <select 
    className="bg-transparent border-b border-white/10 py-3 text-white text-[10px] outline-none"
    onChange={e => setForm({...form, forma_pagamento: e.target.value})}
  >
    <option value="Pix">Pix</option>
    <option value="Boleto">Boleto</option>
    <option value="Parcelado">Parcelado</option>
  </select>

  {/* Quantidade de Parcelas */}
  <input 
    type="number" 
    placeholder="Nº Parcelas" 
    className="bg-transparent border-b border-white/10 py-3 text-white text-[10px] outline-none"
    onChange={e => setForm({...form, parcelas: e.target.value})}
  />
</div>
