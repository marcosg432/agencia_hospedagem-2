'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import api from '@/lib/api';
import { Reserva } from '@/lib/types';
import { format, isAfter } from 'date-fns';
import Link from 'next/link';

export default function QuartosReservados() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [filtroQuarto, setFiltroQuarto] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);
  const isMountedRef = useRef(true);

  const carregarReservas = useCallback(async () => {
    if (isLoadingRef.current) {
      return;
    }

    try {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);

      let url = '/reservas';
      const params = new URLSearchParams();
      
      if (filtroStatus) {
        params.append('status', filtroStatus);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url);
      let reservasData = Array.isArray(response.data) ? response.data : [];
      
      // Ordenar por data de check-in
      reservasData = reservasData.sort((a: Reserva, b: Reserva) => {
        const dateA = new Date(a.checkIn).getTime();
        const dateB = new Date(b.checkIn).getTime();
        return dateA - dateB;
      });

      // Filtrar por quarto se necessário
      if (filtroQuarto) {
        reservasData = reservasData.filter((r: Reserva) => 
          (r.quarto || 'Quarto 1').toLowerCase().includes(filtroQuarto.toLowerCase())
        );
      }

      // Liberar automaticamente quartos com checkout passado
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      reservasData = reservasData.map((reserva: Reserva) => {
        const checkOut = new Date(reserva.checkOut);
        checkOut.setHours(0, 0, 0, 0);
        
        // Se checkout passou e está confirmada, pode ser marcada como concluída
        if (isAfter(hoje, checkOut) && reserva.status === 'confirmada') {
          // Quarto já foi liberado automaticamente (checkout passou)
        }
        
        return reserva;
      });

      setReservas(reservasData);
      setError(null);
    } catch (error: any) {
      console.error('[QUARTOS] Erro ao carregar reservas:', error);
      
      if (!isMountedRef.current) return;

      if (error.response?.status === 401) {
        // Removido redirecionamento - acesso público
        console.warn('[QUARTOS] Erro 401 - mas continuando (acesso público)');
      }

      setError(error.response?.data?.error || error.message || 'Erro ao carregar reservas');
      setReservas([]);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      isLoadingRef.current = false;
    }
  }, [filtroStatus, filtroQuarto]);

  useEffect(() => {
    isMountedRef.current = true;
    carregarReservas();

    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      if (isMountedRef.current && !isLoadingRef.current) {
        carregarReservas();
      }
    }, 30000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [carregarReservas]);

  const atualizarStatus = async (id: number, novoStatus: string) => {
    try {
      await api.put(`/reservas/${id}/status`, { status: novoStatus });
      await carregarReservas();
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      alert(error.response?.data?.error || 'Erro ao atualizar status');
    }
  };

  const deletarReserva = async (id: number) => {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) {
      return;
    }

    try {
      await api.delete(`/reservas/${id}`);
      await carregarReservas();
    } catch (error: any) {
      console.error('Erro ao deletar reserva:', error);
      alert(error.response?.data?.error || 'Erro ao cancelar reserva');
    }
  };

  const gerarMensagemWhatsApp = async (id: number) => {
    try {
      const response = await api.get(`/reservas/${id}/whatsapp`);
      const { mensagem, telefone } = response.data;
      
      if (telefone) {
        const numeroLimpo = telefone.replace(/\D/g, '');
        const url = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
      } else {
        // Copiar mensagem para clipboard
        navigator.clipboard.writeText(mensagem);
        alert('Mensagem copiada para a área de transferência!');
      }
    } catch (error: any) {
      console.error('Erro ao gerar mensagem WhatsApp:', error);
      alert(error.response?.data?.error || 'Erro ao gerar mensagem WhatsApp');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      pendente: { label: '⏳ Pendente', color: 'bg-yellow-100 text-yellow-800' },
      confirmada: { label: '✓ Confirmada', color: 'bg-green-100 text-green-800' },
      cancelada: { label: '✗ Cancelada', color: 'bg-red-100 text-red-800' },
    };
    
    const statusInfo = statusMap[status] || statusMap.pendente;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const quartosUnicos = Array.from(
    new Set(reservas.map((r: Reserva) => r.quarto || 'Quarto 1'))
  ).sort();

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quartos Reservados</h1>
          <Link
            href="/admin/reservas/nova"
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            + Nova Reserva
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Status
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Quarto
              </label>
              <select
                value={filtroQuarto}
                onChange={(e) => setFiltroQuarto(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todos os quartos</option>
                {quartosUnicos.map((quarto) => (
                  <option key={quarto} value={quarto}>
                    {quarto}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : reservas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Nenhuma reserva encontrada</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Quarto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Hóspede
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Pessoas
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservas.map((reserva) => {
                    const checkOut = new Date(reserva.checkOut);
                    const hoje = new Date();
                    hoje.setHours(0, 0, 0, 0);
                    checkOut.setHours(0, 0, 0, 0);
                    const checkoutPassou = isAfter(hoje, checkOut);
                    
                    return (
                      <tr key={reserva.id} className={checkoutPassou && reserva.status === 'confirmada' ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reserva.quarto || 'Quarto 1'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reserva.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reserva.telefone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reserva.qtdPessoas}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(reserva.checkIn), 'dd/MM/yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(reserva.checkOut), 'dd/MM/yyyy')}
                          {checkoutPassou && reserva.status === 'confirmada' && (
                            <span className="ml-2 text-xs text-green-600">(Liberado)</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ {reserva.valorTotal.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(reserva.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {reserva.status === 'pendente' && (
                              <button
                                onClick={() => atualizarStatus(reserva.id, 'confirmada')}
                                className="text-green-600 hover:text-green-900"
                                title="Confirmar"
                              >
                                ✓
                              </button>
                            )}
                            {reserva.status === 'confirmada' && (
                              <button
                                onClick={() => atualizarStatus(reserva.id, 'pendente')}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Voltar para Pendente"
                              >
                                ↻
                              </button>
                            )}
                            {reserva.status !== 'cancelada' && (
                              <button
                                onClick={() => atualizarStatus(reserva.id, 'cancelada')}
                                className="text-red-600 hover:text-red-900"
                                title="Cancelar"
                              >
                                ✗
                              </button>
                            )}
                            <button
                              onClick={() => gerarMensagemWhatsApp(reserva.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Enviar WhatsApp"
                            >
                              📱
                            </button>
                            <button
                              onClick={() => deletarReserva(reserva.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Excluir"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Observações expandidas */}
        {reservas.some((r) => r.observacoes) && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Observações</h2>
            <div className="space-y-2">
              {reservas
                .filter((r) => r.observacoes)
                .map((reserva) => (
                  <div key={reserva.id} className="border-l-4 border-primary-500 pl-4">
                    <p className="font-semibold text-gray-700">
                      {reserva.quarto || 'Quarto 1'} - {reserva.nome}
                    </p>
                    <p className="text-gray-600">{reserva.observacoes}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

