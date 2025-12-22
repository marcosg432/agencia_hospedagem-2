'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import api from '@/lib/api';
import { Reserva, RelatorioMes } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';

export default function Painel() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [relatorio, setRelatorio] = useState<RelatorioMes | null>(null);
  const [loading, setLoading] = useState(true);
  const hoje = new Date();

  useEffect(() => {
    carregarDados();
    
    // Atualizar dados a cada 10 segundos para sincronização
    const interval = setInterval(() => {
      carregarDados();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const carregarDados = async () => {
    try {
      console.log('[PAINEL] Carregando dados do painel...');
      const ano = hoje.getFullYear();
      const mes = hoje.getMonth() + 1;
      console.log('[PAINEL] Ano:', ano, 'Mês:', mes);

      const [reservasRes, relatorioRes] = await Promise.all([
        api.get('/reservas?status=pendente').catch(err => {
          console.warn('[PAINEL] Erro ao carregar reservas pendentes:', err);
          return { data: [] };
        }),
        api.get(`/relatorios?ano=${ano}&mes=${mes}`).catch(err => {
          console.error('[PAINEL] Erro ao carregar relatório:', err);
          console.error('[PAINEL] Status:', err.response?.status);
          console.error('[PAINEL] Data:', err.response?.data);
          return { data: null };
        }),
      ]);

      console.log('[PAINEL] Reservas pendentes:', reservasRes.data.length);
      console.log('[PAINEL] Relatório recebido:', relatorioRes.data);

      if (relatorioRes.data) {
        console.log('[PAINEL] Reservas confirmadas:', relatorioRes.data.reservasConfirmadas);
        console.log('[PAINEL] Total faturado:', relatorioRes.data.totalFaturado);
        console.log('[PAINEL] Taxa de ocupação:', relatorioRes.data.taxaOcupacao);
      }

      setReservas(reservasRes.data.slice(0, 5));
      setRelatorio(relatorioRes.data);
    } catch (error: any) {
      console.error('[PAINEL] Erro ao carregar dados:', error);
      // Removido redirecionamento para login - acesso público
      if (error.response?.status === 401) {
        console.warn('[PAINEL] Erro 401 - mas continuando (acesso público)');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Painel Administrativo</h1>

        {loading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : (
          <>
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-primary-600">
                  {relatorio?.reservasConfirmadas ?? 0}
                </div>
                <div className="text-sm text-gray-600">Reservas Confirmadas</div>
                {relatorio && (
                  <div className="text-xs text-gray-400 mt-1">
                    de {relatorio.totalReservas} total
                  </div>
                )}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-green-600">
                  R$ {relatorio?.totalFaturado ? relatorio.totalFaturado.toFixed(2) : '0.00'}
                </div>
                <div className="text-sm text-gray-600">Total Faturado</div>
                {relatorio && relatorio.reservasConfirmadas > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    {relatorio.reservasConfirmadas} reserva(s)
                  </div>
                )}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-blue-600">
                  {relatorio?.taxaOcupacao ? relatorio.taxaOcupacao.toFixed(1) : '0.0'}%
                </div>
                <div className="text-sm text-gray-600">Taxa de Ocupação</div>
                {relatorio && (
                  <div className="text-xs text-gray-400 mt-1">
                    {relatorio.diasOcupados} ocupados + {relatorio.diasBloqueados} bloqueados
                  </div>
                )}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-yellow-600">
                  {reservas.length}
                </div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
            </div>

            {/* Reservas Pendentes */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Reservas Pendentes</h2>
                <Link
                  href="/admin/reservas"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Ver todas →
                </Link>
              </div>
              {reservas.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhuma reserva pendente</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Check-in
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Check-out
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Valor
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservas.map((reserva) => (
                        <tr key={reserva.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {reserva.nome}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(new Date(reserva.checkIn), 'dd/MM/yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(new Date(reserva.checkOut), 'dd/MM/yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {reserva.valorTotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Ações Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/admin/calendario"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-2">📅</div>
                <h3 className="font-semibold text-gray-800 mb-2">Ver Calendário</h3>
                <p className="text-sm text-gray-600">Visualize todas as reservas no calendário</p>
              </Link>
              <Link
                href="/admin/reservas"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-2">📋</div>
                <h3 className="font-semibold text-gray-800 mb-2">Gerenciar Reservas</h3>
                <p className="text-sm text-gray-600">Criar, editar e gerenciar reservas</p>
              </Link>
              <Link
                href="/admin/relatorios"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-semibold text-gray-800 mb-2">Relatórios</h3>
                <p className="text-sm text-gray-600">Ver relatórios detalhados</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}


