'use client';

import { useState, useEffect } from 'react';
import MapView, { MarkerData } from '../components/MapView';
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../lib/firebase';
import { Parser } from "json2csv";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/auth";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const UF_TO_NAME: Record<string, string> = {
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapá',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondônia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins',
};

export default function Home() {
  const [cep, setCep] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [dataEnvio, setDataEnvio] = useState('');
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [coloredStates, setColoredStates] = useState<string[]>([]);
  const [user] = useAuthState(auth);

  // Login
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loginError, setLoginError] = useState('');

  // Filtros
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [dataFiltro, setDataFiltro] = useState('');

  useEffect(() => {
    async function loadMarkers() {
      const querySnapshot = await getDocs(collection(db, "envios"));
      const loadedMarkers: MarkerData[] = [];
      const loadedStates: string[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loadedMarkers.push({
          lat: data.lat,
          lng: data.lng,
          info: data.info,
          createdAt: data.createdAt,
          id: docSnap.id,
          quantidade: data.quantidade,
          dataEnvio: data.dataEnvio,
        });

        if (data.stateName && !loadedStates.includes(data.stateName)) {
          loadedStates.push(data.stateName);
        }
      });

      setMarkers(loadedMarkers);
      setColoredStates(loadedStates);
    }

    loadMarkers();
  }, []);

  async function handleAddMarker(e: React.FormEvent) {
    e.preventDefault();

    if (!quantidade || !dataEnvio) {
      alert('Preencha quantidade e data do envio!');
      return;
    }

    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();

    if (data.erro) {
      alert('CEP não encontrado!');
      return;
    }

    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${cep}&country=Brazil&format=json`);
    const geoData = await geoRes.json();

    if (geoData.length === 0) {
      alert('Localização não encontrada!');
      return;
    }

    const lat = parseFloat(geoData[0].lat);
    const lng = parseFloat(geoData[0].lon);

    const newMarker: MarkerData = {
      lat,
      lng,
      info: `Enviado para: ${data.localidade} - ${data.uf}`,
      createdAt: new Date().toISOString(),
      quantidade,
      dataEnvio,
    };

    const stateName = UF_TO_NAME[data.uf];
    if (stateName && !coloredStates.includes(stateName)) {
      setColoredStates((prev) => [...prev, stateName]);
    }

    const docRef = await addDoc(collection(db, "envios"), {
      lat,
      lng,
      info: newMarker.info,
      stateName,
      createdAt: newMarker.createdAt,
      quantidade,
      dataEnvio,
    });

    newMarker.id = docRef.id;

    setMarkers((prev) => [...prev, newMarker]);
    setCep('');
    setQuantidade('');
    setDataEnvio('');
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-xl font-bold mb-4">Login — Café Nepré</h1>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded mb-2 w-64"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="border p-2 rounded mb-4 w-64"
        />

        <button
          onClick={async () => {
            setLoginError('');
            try {
              await signInWithEmailAndPassword(auth, email, senha);
            } catch (error: any) {
              setLoginError(error.message);
            }
          }}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition duration-300"
        >
          Entrar
        </button>

        {loginError && (
          <p className="text-red-600 mt-2 text-sm">{loginError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <button
        onClick={() => signOut(auth)}
        className="text-sm text-red-600 hover:underline mb-2 self-end"
      >
        Sair
      </button>

      <h1 className="text-3xl font-bold text-green-700 mb-4">Café Nepré — Mapa de Envios</h1>

      <form onSubmit={handleAddMarker} className="mb-4 flex flex-col gap-2 w-full max-w-xs">
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="Digite o CEP"
          className="border p-2 rounded"
        />
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          placeholder="Quantidade (kg)"
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={dataEnvio}
          onChange={(e) => setDataEnvio(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition duration-300"
        >
          Adicionar
        </button>
      </form>

      <MapView markers={markers} coloredStates={coloredStates} />

      <p className="mt-2 text-sm text-gray-600">
        <span className="inline-block w-4 h-4 bg-green-300 mr-1 animate-pulse"></span>
        Estados já atendidos
      </p>

      <div className="w-full max-w-2xl mb-4 mt-6">
        <h2 className="text-lg font-bold text-green-700">Dashboard</h2>
        <p>Total de envios: {markers.length}</p>
        <p>Estados atendidos: {coloredStates.length}</p>
      </div>

      <div className="mt-2 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-2 text-green-700">Lista de envios</h2>

        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="border p-2 rounded mb-2"
        >
          <option value="">Todos os estados</option>
          {Object.keys(UF_TO_NAME).map((uf) => (
            <option key={uf} value={uf}>{uf}</option>
          ))}
        </select>

        <input
          type="date"
          value={dataFiltro}
          onChange={(e) => setDataFiltro(e.target.value)}
          className="border p-2 rounded mb-2"
        />

        <button
          onClick={() => {
            const parser = new Parser();
            const csv = parser.parse(markers.map((m) => ({
              info: m.info,
              quantidade: m.quantidade,
              dataEnvio: m.dataEnvio,
              lat: m.lat,
              lng: m.lng,
              createdAt: new Date(m.createdAt!).toLocaleString('pt-BR'),
            })));

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "envios.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="bg-green-600 text-white px-3 py-1 rounded mb-2 hover:bg-green-700 transition duration-300"
        >
          Exportar CSV
        </button>

        <ul className="space-y-2">
          {markers
            .filter((marker) => {
              if (!estadoFiltro) return true;
              const parts = marker.info.split(' - ');
              if (parts.length === 2) {
                return parts[1] === estadoFiltro;
              }
              return true;
            })
            .filter((marker) => {
              if (!dataFiltro) return true;
              const dataMarker = new Date(marker.createdAt!).toISOString().split('T')[0];
              return dataMarker === dataFiltro;
            })
            .map((marker) => (
              <li key={marker.id} className="border p-2 rounded shadow flex justify-between items-center">
                <div>
                  <div>{marker.info}</div>
                  <div>Quantidade: {marker.quantidade} kg</div>
                  {marker.dataEnvio && (
                    <div className="text-xs text-gray-500">
                      Data do envio: {new Date(marker.dataEnvio).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  {marker.createdAt && (
                    <div className="text-xs text-gray-500">
                      Registrado em: {new Date(marker.createdAt).toLocaleString('pt-BR')}
                    </div>
                  )}
                </div>
                <button
                  onClick={async () => {
                    if (marker.id) {
                      await deleteDoc(doc(db, "envios", marker.id));
                      setMarkers((prev) => prev.filter((m) => m.id !== marker.id));

                      const updatedStates = new Set<string>();
                      prev.filter((m) => m.id !== marker.id).forEach((m) => {
                        const parts = m.info.split(' - ');
                        if (parts.length === 2) {
                          const uf = parts[1];
                          const stateName = UF_TO_NAME[uf];
                          if (stateName) updatedStates.add(stateName);
                        }
                      });
                      setColoredStates(Array.from(updatedStates));
                    }
                  }}
                  className="text-red-600 text-sm hover:underline"
                >
                  Excluir
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
