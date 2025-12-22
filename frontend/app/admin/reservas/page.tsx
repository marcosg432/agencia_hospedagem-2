'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import api from '@/lib/api';
import { Reserva } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';

export default function Reservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref para controlar se já está carregando (evitar múltiplas chamadas simultâneas)
  const isLoadingRef = useRef(false);
  // Ref para controlar se o componente está montado
  const isMountedRef = useRef(true);

  // Memoizar a função carregarReservas para evitar recriações
  const carregarReservas = useCallback(async () => {
    // Prevenir múltiplas chamadas simultâneas
    if (isLoadingRef.current) {
      console.log('[RESERVAS] Já está carregando, ignorando chamada duplicada');
      return;
    }

    try {
      console.log('[RESERVAS] Iniciando fetch de reservas...');
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);

      const url = filtroStatus ? `/reservas?status=${filtroStatus}` : '/reservas';
      console.log('[RESERVAS] URL:', url);
      console.log('[RESERVAS] Filtro status:', filtroStatus || 'nenhum');

      const response = await api.get(url);
      
      console.log('[RESERVAS] Resposta recebida:', response.status);
      console.log('[RESERVAS] Dados:', response.data);
      console.log('[RESERVAS] Tipo de dados:', Array.isArray(response.data) ? 'Array' : typeof response.data);
      console.log('[RESERVAS] Quantidade:', Array.isArray(response.data) ? response.data.length : 'N/A');

      // Verificar se a resposta é válida
      if (!response.data) {
        console.error('[RESERVAS] ✗ Resposta vazia ou nula');
        setError('Resposta inválida do servidor');
        setReservas([]);
        return;
      }

      // Garantir que é um array
      const reservasData = Array.isArray(response.data) ? response.data : [];
      
      console.log('[RESERVAS] ✓ Reservas carregadas com sucesso:', reservasData.length);
      setReservas(reservasData);
      setError(null);
    } catch (error: any) {
      console.error('[RESERVAS] ✗ Erro ao carregar reservas:', error);
      console.error('[RESERVAS] Status:', error.response?.status);
      console.error('[RESERVAS] Data:', error.response?.data);
      console.error('[RESERVAS] Message:', error.message);

      // Verificar se o componente ainda está montado antes de atualizar state
      if (!isMountedRef.current) {
        console.log('[RESERVAS] Componente desmontado, ignorando atualização de state');
        return;
      }

      if (error.response?.status === 401) {
        // Removido redirecionamento - acesso público
        console.warn('[RESERVAS] Erro 401 - mas continuando (acesso público)');
      }

      const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar reservas';
      setError(errorMessage);
      setReservas([]);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      isLoadingRef.current = false;
      console.log('[RESERVAS] Fetch finalizado, loading = false');
    }
  }, [filtroStatus]);

  // useEffect para carregar inicialmente e quando filtroStatus mudar
  useEffect(() => {
    console.log('[RESERVAS] useEffect executado, filtroStatus:', filtroStatus);
    isMountedRef.current = true;
    
    // Carregar reservas apenas uma vez ao montar ou quando filtroStatus mudar
    carregarReservas();

    // Cleanup quando componente desmontar ou filtroStatus mudar
    return () => {
      console.log('[RESERVAS] Cleanup do useEffect');
      isMountedRef.current = false;
    };
  }, [filtroStatus, carregarReservas]);

  // useEffect separado para o intervalo de atualização (apenas quando componente está montado)
  useEffect(() => {
    console.log('[RESERVAS] Configurando intervalo de atualização (30 segundos)');
    
    // Intervalo mais longo para evitar sobrecarga (30 segundos em vez de 5)
    const interval = setInterval(() => {
      if (isMountedRef.current && !isLoadingRef.current) {
        console.log('[RESERVAS] Atualização automática via intervalo');
        carregarReservas();
      } else {
        console.log('[RESERVAS] Ignorando atualização automática (já carregando ou desmontado)');
      }
    }, 30000); // 30 segundos

    return () => {
      console.log('[RESERVAS] Limpando intervalo');
      clearInterval(interval);
    };
  }, [carregarReservas]);

  const atualizarStatus = async (id: number, status: string) => {
    try {
      console.log(`[FRONTEND] Atualizando reserva ${id} para status: ${status}`);
      
      // Validar status antes de enviar
      const statusValidos = ['pendente', 'confirmada', 'cancelada'];
      if (!statusValidos.includes(status.toLowerCase())) {
        alert(`Status inválido: ${status}. Use: ${statusValidos.join(', ')}`);
        return;
      }

      const response = await api.put(`/reservas/${id}/status`, { status: status.toLowerCase() });
      console.log('✓ Status atualizado com sucesso:', response.data);
      
      // Recarregar reservas imediatamente
      await carregarReservas();
      
      // Mostrar feedback visual
      const statusLabels: { [key: string]: string } = {
        'pendente': 'Pendente',
        'confirmada': 'Confirmada',
        'cancelada': 'Cancelada'
      };
      
      console.log(`Status da reserva ${id} alterado para: ${statusLabels[status.toLowerCase()] || status}`);
    } catch (error: any) {
      console.error('✗ Erro ao atualizar status:', error);
      console.error('Detalhes:', error.response?.data);
      
      let errorMessage = 'Erro ao atualizar status da reserva.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.details) {
          errorMessage += `\n\n${error.response.data.details}`;
        }
      } else if (error.response?.status === 404) {
        errorMessage = 'Reserva não encontrada. A página será atualizada.';
        setTimeout(() => carregarReservas(), 1000);
      } else if (error.response?.status === 401) {
        // Removido redirecionamento - acesso público
        errorMessage = 'Erro de autenticação (acesso público)';
        console.warn('[RESERVAS] Erro 401 - mas continuando (acesso público)');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  };

  const deletarReserva = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta reserva?')) {
      console.log('[EXCLUIR] Exclusão cancelada pelo usuário');
      return;
    }

    try {
      console.log('[EXCLUIR] Excluindo reserva ID:', id);
      
      const response = await api.delete(`/reservas/${id}`);
      console.log('[EXCLUIR] ✓ Reserva excluída com sucesso');
      console.log('[EXCLUIR] Status:', response.status);
      
      // Recarregar reservas imediatamente
      await carregarReservas();
      console.log('[EXCLUIR] Lista de reservas atualizada');
    } catch (error: any) {
      console.error('[EXCLUIR] ✗ Erro ao excluir reserva:', error);
      console.error('[EXCLUIR] Status:', error.response?.status);
      console.error('[EXCLUIR] Data:', error.response?.data);
      
      let errorMessage = 'Erro ao excluir reserva.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.details) {
          errorMessage += `\n\n${error.response.data.details}`;
        }
      } else if (error.response?.status === 404) {
        errorMessage = 'Reserva não encontrada. A página será atualizada.';
        setTimeout(() => carregarReservas(), 1000);
      } else if (error.response?.status === 401) {
        // Removido redirecionamento - acesso público
        errorMessage = 'Erro de autenticação (acesso público)';
        console.warn('[RESERVAS] Erro 401 - mas continuando (acesso público)');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  };


  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Reservas</h1>
          <Link
            href="/admin/reservas/nova"
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            + Nova Reserva
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Status
          </label>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Todas</option>
            <option value="pendente">Pendente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Carregando reservas...</div>
            <div className="mt-2 text-sm text-gray-400">Aguarde um momento</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 font-semibold mb-2">Erro ao carregar reservas</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <button
              onClick={() => carregarReservas()}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Tentar Novamente
            </button>
          </div>
        ) : reservas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Nenhuma reserva encontrada</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nome
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
                  {reservas.map((reserva) => (
                    <tr key={reserva.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reserva.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reserva.telefone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          👥 {reserva.qtdPessoas || 1}
                        </span>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            reserva.status === 'confirmada'
                              ? 'bg-green-100 text-green-800'
                              : reserva.status === 'cancelada'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {reserva.status === 'confirmada' ? '✓ Confirmada' : 
                           reserva.status === 'cancelada' ? '✗ Cancelada' : 
                           '⏳ Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          {reserva.status !== 'confirmada' && (
                            <button
                              onClick={() => atualizarStatus(reserva.id, 'confirmada')}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                              title="Confirmar reserva"
                            >
                              ✓ Confirmar
                            </button>
                          )}
                          {reserva.status !== 'cancelada' && (
                            <button
                              onClick={() => atualizarStatus(reserva.id, 'cancelada')}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                              title="Cancelar reserva"
                            >
                              ✗ Cancelar
                            </button>
                          )}
                          {reserva.status !== 'pendente' && (
                            <button
                              onClick={() => atualizarStatus(reserva.id, 'pendente')}
                              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                              title="Voltar para pendente"
                            >
                              ↻ Pendente
                            </button>
                          )}
                          <button
                            onClick={() => deletarReserva(reserva.id)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                            title="Excluir reserva"
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}


