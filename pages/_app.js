import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue, update, get } from "firebase/database";
import { QrScanner } from "react-qr-scanner"; 
import logo from "./logo.png";

const firebaseConfig = {
  apiKey: "AIzaSyAWGQyP2eQAqCU6n0fgO6Duq1V7oOE5B2I",
  authDomain: "app-de-presenca-85a94.firebaseapp.com",
  databaseURL: "https://app-de-presenca-85a94-default-rtdb.firebaseio.com",
  projectId: "app-de-presenca-85a94",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const pegarIniciais = (nome) => {
  if (!nome) return "??";
  try {
    const partes = nome.replace(/ e /gi, " & ").split("&").map(p => p.trim());
    if (partes.length > 1 && partes[0].length > 0 && partes[1].length > 0) return (partes[0][0] + "&" + partes[1][0]).toUpperCase();
    return nome.substring(0, 2).toUpperCase();
  } catch (error) { return "??"; }
};

// --- 1. PAINEL ADMIN ---
function PainelAdmin() {
  const [nomeCasal, setNomeCasal] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [casamentos, setCasamentos] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("proximos"); 
  const navigate = useNavigate();

  useEffect(() => {
    onValue(ref(database, "casamentos_cadastrados"), (snapshot) => {
      const dados = snapshot.val();
      setCasamentos(dados ? Object.keys(dados).map(key => ({ id: key, ...dados[key] })) : []);
    });
  }, []);

  const criarNovoCasamento = (e) => {
    e.preventDefault();
    const idUrl = nomeCasal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    if (!idUrl) return alert("Digite um nome!");
    set(ref(database, `casamentos_cadastrados/${idUrl}`), { nomeExibicao: nomeCasal, idUrl, data: dataEvento || "", tipo: "Casamento" })
      .then(() => { setNomeCasal(""); setDataEvento(""); })
      .catch(err => alert("Erro: " + err.message));
  };

  const deletarEvento = (e, idUrl, nome) => {
    e.stopPropagation(); 
    if (window.confirm(`⚠️ Excluir "${nome}" apagará toda a lista. Continuar?`)) {
      set(ref(database, `casamentos_cadastrados/${idUrl}`), null); 
      set(ref(database, `convidados_por_casal/${idUrl}`), null); 
    }
  };

  const hoje = new Date().toISOString().split("T")[0]; 
  const eventosFiltrados = casamentos.filter(c => abaAtiva === "proximos" ? !c.data || c.data >= hoje : c.data && c.data < hoje);
  const estiloAba = (nomeAba) => ({ flex: 1, padding: "12px", textAlign: "center", backgroundColor: abaAtiva === nomeAba ? "#2cbdbd" : "white", color: abaAtiva === nomeAba ? "white" : "#666", fontWeight: "bold", cursor: "pointer", borderBottom: abaAtiva === nomeAba ? "3px solid #1a8b8b" : "1px solid #eee" });

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#2cbdbd", padding: "40px 20px", borderBottomLeftRadius: "30px", borderBottomRightRadius: "30px", color: "white" }}><h1 style={{ margin: 0, fontSize: "28px" }}>Meus eventos</h1></div>
      <div style={{ padding: "20px", maxWidth: "600px", margin: "-20px auto 0" }}>
        <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "10px", marginBottom: "30px" }}>
          <form onSubmit={criarNovoCasamento} style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <input type="text" placeholder="Noivos" value={nomeCasal} onChange={e => setNomeCasal(e.target.value)} required style={{ flex: "1 1 100%", padding: "12px", borderRadius: "5px", border: "1px solid #ddd" }} />
            <input type="date" value={dataEvento} onChange={e => setDataEvento(e.target.value)} required style={{ flex: "1 1 calc(50% - 5px)", padding: "12px", borderRadius: "5px", border: "1px solid #ddd" }} />
            <button type="submit" style={{ flex: "1 1 calc(50% - 5px)", padding: "12px", backgroundColor: "#2cbdbd", color: "white", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}>+ Cadastrar</button>
          </form>
        </div>
        <div style={{ display: "flex", backgroundColor: "white", borderRadius: "10px", overflow: "hidden", marginBottom: "20px" }}>
          <div onClick={() => setAbaAtiva("proximos")} style={estiloAba("proximos")}>Próximos</div>
          <div onClick={() => setAbaAtiva("anteriores")} style={estiloAba("anteriores")}>Concluídos</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {eventosFiltrados.map((casal) => (
            <div key={casal.id} onClick={() => navigate(`/evento/${casal.idUrl}`)} style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "15px", cursor: "pointer" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#f0f0f0", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px", fontWeight: "bold", color: "#666" }}>{pegarIniciais(casal.nomeExibicao)}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 5px 0", fontSize: "13px", color: "#888", fontWeight: "bold" }}>{casal.data ? casal.data.split("-").reverse().join("/") : "Sem data"}</p>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#333", textTransform: "capitalize" }}>{casal.nomeExibicao}</h3>
              </div>
              <div onClick={(e) => deletarEvento(e, casal.idUrl, casal.nomeExibicao)} style={{ padding: "10px", fontSize: "20px", cursor: "pointer" }}>🗑️</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 2. DASHBOARD DO EVENTO ---
function DashboardEvento() {
  const { idCasal } = useParams();
  const navigate = useNavigate();
  const linkConvite = `${window.location.origin}/convite/${idCasal}`;

  const importarPlanilha = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const snapshot = await get(ref(database, `convidados_por_casal/${idCasal}`));
      const atuais = snapshot.exists() ? Object.keys(snapshot.val()).map(k => ({ id: k, ...snapshot.val()[k] })) : [];
      const reader = new FileReader();
      reader.onload = (event) => {
        const linhas = event.target.result.split("\n");
        linhas.forEach((linha, idx) => {
          if (idx === 0 || !linha.trim()) return;
          const col = linha.split(/;|,/);
          const nome = col[0]?.trim();
          if (nome) {
            const ex = atuais.find(c => c.nome.toLowerCase() === nome.toLowerCase());
            const dados = { nome, telefone: col[1]?.trim() || "", mesa: col[2]?.trim() || "", familia: col[3]?.trim() || nome, status: "pendente", checkin: false };
            if (ex) update(ref(database, `convidados_por_casal/${idCasal}/${ex.id}`), dados);
            else push(ref(database, `convidados_por_casal/${idCasal}`), dados);
          }
        });
        alert("Lista processada!"); e.target.value = "";
      }; reader.readAsText(file, "UTF-8");
    } catch (err) { alert(err.message); }
  };

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#2cbdbd", padding: "40px 20px", borderBottomLeftRadius: "30px", borderBottomRightRadius: "30px", color: "white" }}><button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "white", fontSize: "22px", cursor: "pointer" }}>⬅ Voltar</button></div>
      <div style={{ padding: "20px", maxWidth: "600px", margin: "-20px auto 0", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h2 style={{ textAlign: "center", color: "#333", textTransform: "capitalize" }}>Gestão: {idCasal.replace(/-/g, " ")}</h2>
        
        {/* BOTÃO DA FICHA TÉCNICA */}
        <button onClick={() => navigate(`/evento/${idCasal}/ficha`)} style={{ padding: "15px", backgroundColor: "#333", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <span>📝</span> Ficha Técnica Digital
        </button>

        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "15px" }}>
          <h3 style={{ margin: "0 0 15px" }}>📊 Importar Convidados</h3>
          <input type="file" accept=".csv" onChange={importarPlanilha} style={{ width: "100%", padding: "10px", border: "1px dashed #2cbdbd", borderRadius: "8px" }} />
        </div>
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "15px" }}>
          <h3 style={{ margin: "0 0 15px" }}>💌 Link Geral</h3>
          <input type="text" readOnly value={linkConvite} style={{ width: "100%", padding: "12px", backgroundColor: "#f9f9f9", border: "1px solid #eee", borderRadius: "8px", marginBottom: "15px" }} />
          <button onClick={() => navigator.clipboard.writeText(linkConvite).then(() => alert("Copiado!"))} style={{ width: "100%", padding: "12px", backgroundColor: "#2cbdbd", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold" }}>Copiar Link</button>
        </div>
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <h3 style={{ margin: 0 }}>📋 Recepção VIP</h3>
          <Link to={`/portaria/${idCasal}`} style={{ display: "block", padding: "12px", backgroundColor: "#2cbdbd", color: "white", textDecoration: "none", borderRadius: "8px", textAlign: "center", fontWeight: "bold" }}>Acessar Check-in</Link>
          <Link to={`/portaria/${idCasal}/leitor`} style={{ display: "block", padding: "12px", backgroundColor: "#f0f2f5", color: "#333", textDecoration: "none", borderRadius: "8px", textAlign: "center", fontWeight: "bold" }}>📸 Escanear QR Code</Link>
        </div>
      </div>
    </div>
  );
}

// --- 3. FICHA TÉCNICA (NOVA FUNCIONALIDADE!) ---
function FichaTecnica() {
  const { idCasal } = useParams();
  const navigate = useNavigate();
  const [aba, setAba] = useState("fornecedores");
  const [dados, setDados] = useState({});

  useEffect(() => {
    onValue(ref(database, `fichas_tecnicas/${idCasal}`), (snap) => {
      setDados(snap.val() || {});
    });
  }, [idCasal]);

  const salvar = (campo, valor) => {
    update(ref(database, `fichas_tecnicas/${idCasal}`), { [campo]: valor });
  };

  const ItemCheck = ({ label, id }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", backgroundColor: "#fff", borderBottom: "1px solid #eee" }}>
      <input type="checkbox" checked={dados[id + "_check"] || false} onChange={(e) => salvar(id + "_check", e.target.checked)} style={{ width: "20px", height: "20px" }} />
      <div style={{ flex: 1 }}>
        <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555", display: "block" }}>{label}</label>
        <input type="text" placeholder="Nome / Detalhes..." value={dados[id] || ""} onChange={(e) => salvar(id, e.target.value)} style={{ width: "100%", border: "none", borderBottom: "1px solid #ddd", padding: "5px 0", outline: "none", fontSize: "14px", color: "#333" }} />
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#333", padding: "20px", color: "white", display: "flex", alignItems: "center", gap: "15px" }}>
        <button onClick={() => navigate(`/evento/${idCasal}`)} style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>⬅</button>
        <h2 style={{ margin: 0, fontSize: "18px" }}>Ficha Técnica</h2>
      </div>

      <div style={{ display: "flex", backgroundColor: "white", borderBottom: "2px solid #eee" }}>
        <div onClick={() => setAba("fornecedores")} style={{ flex: 1, padding: "15px", textAlign: "center", fontWeight: "bold", color: aba === "fornecedores" ? "#2cbdbd" : "#999", borderBottom: aba === "fornecedores" ? "3px solid #2cbdbd" : "none", cursor: "pointer" }}>Fornecedores</div>
        <div onClick={() => setAba("cerimonia")} style={{ flex: 1, padding: "15px", textAlign: "center", fontWeight: "bold", color: aba === "cerimonia" ? "#2cbdbd" : "#999", borderBottom: aba === "cerimonia" ? "3px solid #2cbdbd" : "none", cursor: "pointer" }}>Cerimônia</div>
      </div>

      <div style={{ padding: "15px", maxWidth: "600px", margin: "0 auto" }}>
        {aba === "fornecedores" ? (
          <div style={{ borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <ItemCheck label="Cerimônia (Local)" id="f_local_cerimonia" />
            <ItemCheck label="Recepção (Local)" id="f_local_recepcao" />
            <ItemCheck label="Buffet" id="f_buffet" />
            <ItemCheck label="Decoração Igreja" id="f_decor_igreja" />
            <ItemCheck label="Decoração Recepção" id="f_decor_recepcao" />
            <ItemCheck label="Iluminação Decorativa" id="f_iluminacao" />
            <ItemCheck label="DJ / Estrutura" id="f_dj" />
            <ItemCheck label="Banda 1" id="f_banda1" />
            <ItemCheck label="Banda 2" id="f_banda2" />
            <ItemCheck label="Músicos da Cerimônia" id="f_musicos" />
            <ItemCheck label="Fotografia" id="f_foto" />
            <ItemCheck label="Filmagem" id="f_video" />
            <ItemCheck label="Storymaker" id="f_story" />
            <ItemCheck label="Bartender" id="f_bar" />
            <ItemCheck label="Doces" id="f_doces" />
            <ItemCheck label="Bolo / Bolo Fake" id="f_bolo" />
            <ItemCheck label="Bem Casados" id="f_bemcasados" />
            <ItemCheck label="Vestido" id="f_vestido" />
            <ItemCheck label="Terno" id="f_terno" />
            <ItemCheck label="Dia da Noiva / Noivo" id="f_dia_noivos" />
          </div>
        ) : (
          <div style={{ borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <ItemCheck label="Quant. Cadeiras / Bancos" id="c_cadeiras" />
            <ItemCheck label="Lágrimas de Alegria" id="c_lagrimas" />
            <ItemCheck label="Leques" id="c_leques" />
            <ItemCheck label="Água Aromatizada" id="c_agua" />
            <ItemCheck label="Tapete / Passarela" id="c_tapete" />
            <ItemCheck label="Aparador do Celebrante" id="c_aparador" />
            <ItemCheck label="Votos dos Noivos" id="c_votos" />
            <ItemCheck label="Placas" id="c_placas" />
            <ItemCheck label="Corsages / Noivo" id="c_corsages" />
            <ItemCheck label="Bouquet (Noiva/Jogar)" id="c_bouquet" />
            <ItemCheck label="Bouquet Dama / Cestinha" id="c_dama" />
            <ItemCheck label="Sparkles / Bolhas Sabão" id="c_saida" />
            <ItemCheck label="Welcome Drinks" id="c_welcome" />
            <ItemCheck label="Cadeiras Pais / Padrinhos" id="c_pais" />
          </div>
        )}
      </div>
    </div>
  );
}

// --- 4. TELA DOS CONVIDADOS ---
function TelaConvidados() {
  const { idCasal, telefoneUrl } = useParams(); 
  const [membros, setMembros] = useState([]);
  const [fam, setFam] = useState("");
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null); 

  useEffect(() => {
    if (!telefoneUrl) { setLoading(false); return; }
    onValue(ref(database, `convidados_por_casal/${idCasal}`), (snap) => {
      if (snap.exists()) {
        const todos = Object.keys(snap.val()).map(k => ({ id: k, ...snap.val()[k] }));
        const dono = todos.find(c => {
          let n = c.telefone?.replace(/\D/g, '');
          if (n?.length === 10 || n?.length === 11) n = '55' + n;
          return n === telefoneUrl;
        });
        if (dono) {
          setMembros(todos.filter(c => c.familia === dono.familia));
          setFam(dono.familia);
        }
      } setLoading(false);
    });
  }, [idCasal, telefoneUrl]);

  const salvar = async (e) => {
    e.preventDefault(); setLoading(true);
    for (let m of membros) await update(ref(database, `convidados_por_casal/${idCasal}/${m.id}`), { status: m.status, data_confirmacao: new Date().toISOString() });
    setTicket({ nome: fam, id: `FAM-${idCasal}-${fam.replace(/\s+/g, '')}` }); setLoading(false);
  };

  if (ticket) return (
    <div style={{ backgroundColor: "#f9f6f0", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px" }}>
      <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "15px", textAlign: "center", border: "1px solid #eee", maxWidth: "400px" }}>
        <h2 style={{ color: "#2cbdbd", marginBottom: "10px" }}>Presença Registrada!</h2>
        <p style={{ color: "#666", marginBottom: "30px" }}>Agradecemos a Confirmação.</p>
        <div style={{ border: "2px dashed #2cbdbd", padding: "20px", borderRadius: "10px", backgroundColor: "#fffcf5", marginBottom: "20px" }}>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.id}`} alt="QR" style={{ width: "180px" }} />
        </div>
        <p style={{ color: "#888", fontSize: "14px" }}>Apresente na portaria para entrada rápida.</p>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#f9f6f0", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px" }}>
      <div style={{ backgroundColor: "white", padding: "40px 20px", borderRadius: "15px", width: "100%", maxWidth: "450px", border: "1px solid #eee" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <span style={{ fontSize: "40px" }}>💍</span>
          <h1 style={{ margin: "10px 0 5px", color: "#333", textTransform: "capitalize" }}>{idCasal.replace(/-/g, " ")}</h1>
          <p style={{ color: "#2cbdbd", fontSize: "22px", fontWeight: "bold" }}>Bem-vindos!</p>
        </div>
        <form onSubmit={salvar} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {membros.map((m, i) => (
            <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", backgroundColor: "#fcfcfc", border: "1px solid #ddd", borderRadius: "8px" }}>
              <span style={{ fontWeight: "bold", color: "#555" }}>{m.nome}</span>
              <select value={m.status} onChange={e => {const n=[...membros]; n[i].status=e.target.value; setMembros(n);}} style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}>
                <option value="pendente">...</option><option value="confirmado">Sim!</option><option value="nao_vou">Não!</option>
              </select>
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ marginTop: "20px", padding: "18px", backgroundColor: "#2cbdbd", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>{loading ? "Salvando..." : "Salvar Confirmações"}</button>
        </form>
      </div>
    </div>
  );
}

// --- 5. TELA DA PORTARIA ---
function TelaPortaria() {
  const { idCasal } = useParams();
  const navigate = useNavigate();
  const [convidados, setConvidados] = useState([]);
  const [busca, setBusca] = useState("");
  const [aba, setAba] = useState("confirmado"); 

  useEffect(() => {
    onValue(ref(database, `convidados_por_casal/${idCasal}`), (snapshot) => {
      const d = snapshot.val();
      setConvidados(d ? Object.keys(d).map(k => ({ id: k, ...d[k] })) : []);
    });
  }, [idCasal]);

  const enviarWA = (tel, nome) => {
    let n = tel.replace(/\D/g, ''); if (n.length === 10 || n.length === 11) n = '55' + n;
    const msg = `Olá, ${nome}! Segue o link para confirmar a presença da sua família:\n🔗 ${window.location.origin}/convite/${idCasal}/${n}`;
    window.open(`https://wa.me/${n}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filtrados = convidados.filter(c => (aba === "pendente" ? c.status === "pendente" || c.status === "talvez" : c.status === aba)).filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()) || c.familia?.toLowerCase().includes(busca.toLowerCase()));
  const estiloAba = (n) => ({ flex: 1, padding: "12px", textAlign: "center", backgroundColor: aba === n ? "#2cbdbd" : "white", color: aba === n ? "white" : "#666", fontWeight: "bold", cursor: "pointer", borderBottom: aba === n ? "3px solid #1a8b8b" : "1px solid #eee" });

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#2cbdbd", padding: "20px", color: "white" }}><button onClick={() => navigate(`/evento/${idCasal}`)} style={{ background: "none", border: "none", color: "white", fontSize: "22px", cursor: "pointer" }}>⬅ Voltar</button></div>
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📋 Recepção VIP</h2>
        <div style={{ display: "flex", backgroundColor: "white", borderRadius: "10px", overflow: "hidden", marginBottom: "20px" }}>
          <div onClick={() => setAba("confirmado")} style={estiloAba("confirmado")}>Confirmados</div>
          <div onClick={() => setAba("pendente")} style={estiloAba("pendente")}>Pendentes</div>
          <div onClick={() => setAba("nao_vou")} style={estiloAba("nao_vou")}>Não Vão</div>
        </div>
        <input type="text" placeholder="🔍 Buscar..." value={busca} onChange={e => setBusca(e.target.value)} style={{ width: "100%", padding: "16px", borderRadius: "10px", border: "1px solid #ddd", marginBottom: "20px" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtrados.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", backgroundColor: "white", padding: "15px", borderRadius: "12px", borderLeft: c.checkin ? "5px solid #2cbdbd" : "5px solid transparent" }}>
              <div style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: "16px", fontWeight: "bold", textDecoration: c.checkin ? "line-through" : "none" }}>{c.nome}</span>
                {c.familia && <span style={{ display: "block", fontSize: "12px", color: "#888" }}>👨‍👩‍👧 {c.familia}</span>}
                <span onClick={() => { const m = window.prompt("Mesa:", c.mesa || ""); if(m !== null) update(ref(database, `convidados_por_casal/${idCasal}/${c.id}`), {mesa: m}); }} style={{ fontSize: "13px", color: "#2cbdbd", cursor: "pointer" }}>Mesa: {c.mesa || "Não definida"} ✎</span>
                {aba === "pendente" && c.telefone && <button onClick={() => enviarWA(c.telefone, c.nome)} style={{ display: "block", marginTop: "8px", backgroundColor: "#25D366", color: "white", border: "none", borderRadius: "6px", padding: "6px 12px" }}>💬 WhatsApp</button>}
              </div>
              <div onClick={() => update(ref(database, `convidados_por_casal/${idCasal}/${c.id}`), { checkin: !c.checkin, status: "confirmado" })} style={{ width: "28px", height: "28px", borderRadius: "8px", border: "2px solid #2cbdbd", backgroundColor: c.checkin ? "#2cbdbd" : "transparent", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {c.checkin && <span style={{ color: "white", fontWeight: "bold" }}>✓</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeitorPortaria() {
  const { idCasal } = useParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState(null);
  const aoEscanear = async (data) => {
    if (!data) return;
    const lido = data.text;
    if (!lido.startsWith("FAM-")) return;
    const partes = lido.split("-");
    const famLida = partes[3].replace(/\s+/g, '');
    const snap = await get(ref(database, `convidados_por_casal/${idCasal}`));
    if (snap.exists()) {
      const ms = Object.keys(snap.val()).map(k => ({ id: k, ...snap.val()[k] })).filter(c => c.familia?.replace(/\s+/g, '') === famLida);
      if (ms.length > 0) {
        for (let m of ms) update(ref(database, `convidados_por_casal/${idCasal}/${m.id}`), { checkin: true, status: "confirmado" });
        setMsg({ fam: ms[0].familia, mesa: ms[0].mesa || "Não definida" });
      }
    }
  };
  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#2cbdbd", padding: "20px", color: "white" }}><button onClick={() => navigate(`/evento/${idCasal}`)} style={{ background: "none", border: "none", color: "white", fontSize: "22px" }}>⬅ Voltar</button></div>
      <div style={{ padding: "20px", maxWidth: "450px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ marginBottom: "20px" }}>📸 Escaneamento Rápido</h2>
        {!msg ? (
          <div style={{ border: "4px solid #2cbdbd", borderRadius: "10px", overflow: "hidden" }}>
            <QrScanner delay={300} onError={() => {}} onScan={aoEscanear} style={{ width: "100%" }} />
          </div>
        ) : (
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "15px", border: "2px solid #2cbdbd" }}>
            <h1 style={{ color: "#2cbdbd" }}>Check-in OK!</h1>
            <p>Família: {msg.fam}</p>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>Mesa: {msg.mesa}</p>
            <button onClick={() => setMsg(null)} style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#2cbdbd", color: "white", border: "none", borderRadius: "8px" }}>Próximo</button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 6. ROTAS ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PainelAdmin />} />
        <Route path="/evento/:idCasal" element={<DashboardEvento />} />
        <Route path="/evento/:idCasal/ficha" element={<FichaTecnica />} />
        <Route path="/convite/:idCasal" element={<TelaConvidados />} />
        <Route path="/convite/:idCasal/:telefoneUrl" element={<TelaConvidados />} />
        <Route path="/portaria/:idCasal" element={<TelaPortaria />} />
        <Route path="/portaria/:idCasal/leitor" element={<LeitorPortaria />} />
        <Route path="*" element={<PainelAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}
