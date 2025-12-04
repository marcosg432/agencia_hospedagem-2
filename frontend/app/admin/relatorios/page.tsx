'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import api from '@/lib/api';
import { RelatorioMes } from '@/lib/types';

export default function Relatorios() {
  const [relatorio, setRelatorio] = useState<RelatorioMes | null>(null);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarRelatorio();
  }, [ano, mes]);

  const carregarRelatorio = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/relatorios?ano=${ano}&mes=${mes}`);
      setRelatorio(response.data);
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Relatórios</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano
              </label>
              <input
                type="number"
                value={ano}
                onChange={(e) => setAno(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mês
              </label>
              <select
                value={mes}
                onChange={(e) => setMes(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(2000, m - 1).toLocaleString('pt-BR', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : relatorio ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl font-bold text-primary-600 mb-2">
                {relatorio.totalReservas}
              </div>
              <div className="text-sm text-gray-600">Total de Reservas</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {relatorio.reservasConfirmadas}
              </div>
              <div className="text-sm text-gray-600">Reservas Confirmadas</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                R$ {relatorio.totalFaturado.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Faturado</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {relatorio.taxaOcupacao.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Taxa de Ocupação</div>
            </div>
          </div>
        ) : null}

        {relatorio && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Detalhamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {relatorio.diasLivres}
                </div>
                <div className="text-sm text-gray-600">Dias Livres</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {relatorio.diasOcupados}
                </div>
                <div className="text-sm text-gray-600">Dias Ocupados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {relatorio.diasBloqueados}
                </div>
                <div className="text-sm text-gray-600">Dias Bloqueados</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}




