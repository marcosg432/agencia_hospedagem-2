'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import api from '@/lib/api';
import { DiaCalendario, Reserva } from '@/lib/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import Link from 'next/link';

export default function Calendario() {
  const [dataAtual, setDataAtual] = useState(new Date());
  const [calendario, setCalendario] = useState<DiaCalendario[]>([]);
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);
  const isMountedRef = useRef(true);

  const carregarCalendario = useCallback(async () => {
    if (isLoadingRef.current) {
      console.log('[CALENDARIO] Já está carregando, ignorando chamada duplicada');
      return;
    }

    try {
      console.log('[CALENDARIO] Iniciando carregamento do calendário...');
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);

      const ano = dataAtual.getFullYear();
      const mes = dataAtual.getMonth() + 1;
      console.log('[CALENDARIO] Ano:', ano, 'Mês:', mes);

      const response = await api.get(`/calendario?ano=${ano}&mes=${mes}`);
      console.log('[CALENDARIO] Resposta recebida:', response.status);
      console.log('[CALENDARIO] Dias no calendário:', response.data.length);

      if (!response.data || !Array.isArray(response.data)) {
        console.error('[CALENDARIO] ✗ Resposta inválida');
        setError('Resposta inválida do servidor');
        setCalendario([]);
        return;
      }

      setCalendario(response.data);
      setError(null);
    } catch (error: any) {
      console.error('[CALENDARIO] ✗ Erro ao carregar calendário:', error);
      console.error('[CALENDARIO] Status:', error.response?.status);
      console.error('[CALENDARIO] Data:', error.response?.data);

      if (!isMountedRef.current) {
        return;
      }

      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
        return;
      }

      const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar calendário';
      setError(errorMessage);
      setCalendario([]);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      isLoadingRef.current = false;
      console.log('[CALENDARIO] Carregamento finalizado');
    }
  }, [dataAtual]);

  useEffect(() => {
    console.log('[CALENDARIO] useEffect executado');
    isMountedRef.current = true;
    carregarCalendario();

    return () => {
      console.log('[CALENDARIO] Cleanup do useEffect');
      isMountedRef.current = false;
    };
  }, [dataAtual, carregarCalendario]);

  // Atualização automática a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (isMountedRef.current && !isLoadingRef.current) {
        console.log('[CALENDARIO] Atualização automática');
        carregarCalendario();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [carregarCalendario]);

  const mesAnterior = () => {
    setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1));
  };

  const proximoMes = () => {
    setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 1));
  };

  const editarStatusDia = async (dia: Date, novoStatus: string) => {
    try {
      console.log('[CALENDARIO] Editando status do dia:', format(dia, 'dd/MM/yyyy'), 'para:', novoStatus);
      
      if (novoStatus === 'bloqueado') {
        // Criar bloqueio
        const dataStr = format(dia, 'yyyy-MM-dd');
        await api.post('/bloqueios', {
          data: dataStr,
          motivo: 'manutencao',
        });
        console.log('[CALENDARIO] ✓ Dia bloqueado');
        await carregarCalendario();
      } else if (novoStatus === 'livre') {
        // Remover bloqueio (precisa buscar o ID primeiro)
        const ano = dia.getFullYear();
        const mes = dia.getMonth() + 1;
        const bloqueiosRes = await api.get(`/bloqueios?ano=${ano}&mes=${mes}`);
        const bloqueio = bloqueiosRes.data.find((b: any) => {
          const dataBloqueio = new Date(b.data);
          return format(dataBloqueio, 'yyyy-MM-dd') === format(dia, 'yyyy-MM-dd');
        });
        
        if (bloqueio) {
          await api.delete(`/bloqueios/${bloqueio.id}`);
          console.log('[CALENDARIO] ✓ Bloqueio removido');
          await carregarCalendario();
        }
      }
    } catch (error: any) {
      console.error('[CALENDARIO] ✗ Erro ao editar status:', error);
      alert(error.response?.data?.error || 'Erro ao editar status do dia');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ocupado':
        return 'bg-red-500 text-white';
      case 'bloqueado':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  };

  const diasDoMes = eachDayOfInterval({
    start: startOfMonth(dataAtual),
    end: endOfMonth(dataAtual),
  });

  const primeiroDiaSemana = startOfMonth(dataAtual).getDay();
  const diasVazios = Array(primeiroDiaSemana).fill(null);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Calendário</h1>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/bloqueios"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                📅 Editar Calendário
              </Link>
              <button
                onClick={mesAnterior}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                ← Anterior
              </button>
              <h2 className="text-xl font-semibold text-gray-700">
                {format(dataAtual, 'MMMM yyyy')}
              </h2>
              <button
                onClick={proximoMes}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Próximo →
              </button>
            </div>
          </div>

          {/* Legenda */}
          <div className="flex space-x-6 mb-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Livre</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Ocupado</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Bloqueado</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600">Carregando calendário...</div>
              <div className="mt-2 text-sm text-gray-400">Aguarde um momento</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 font-semibold mb-2">Erro ao carregar calendário</div>
              <div className="text-gray-600 mb-4">{error}</div>
              <button
                onClick={() => carregarCalendario()}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Tentar Novamente
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {/* Cabeçalho dos dias da semana */}
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
                <div key={dia} className="text-center font-semibold text-gray-700 py-2">
                  {dia}
                </div>
              ))}

              {/* Dias vazios no início */}
              {diasVazios.map((_, index) => (
                <div key={`empty-${index}`} className="h-20"></div>
              ))}

              {/* Dias do mês */}
              {diasDoMes.map((dia) => {
                const diaCalendario = calendario.find((c) =>
                  isSameDay(new Date(c.data), dia)
                );
                const status = diaCalendario?.status || 'livre';

                return (
                  <div
                    key={dia.toISOString()}
                    className={`h-20 border border-gray-200 rounded p-2 cursor-pointer hover:bg-gray-50 relative ${
                      isSameDay(dia, new Date()) ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => {
                      if (diaCalendario?.reservas && diaCalendario.reservas.length > 0) {
                        setReservaSelecionada(diaCalendario.reservas[0] as any);
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      // Menu de contexto para editar status do dia
                      const novoStatus = status === 'livre' ? 'bloqueado' : status === 'bloqueado' ? 'livre' : 'livre';
                      editarStatusDia(dia, novoStatus);
                    }}
                    title="Clique para ver reservas. Clique com botão direito para editar status."
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-700">
                        {format(dia, 'd')}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                    </div>
                    {diaCalendario?.reservas && diaCalendario.reservas.length > 0 && (
                      <div className="mt-1 text-xs text-gray-600">
                        {diaCalendario.reservas.length} reserva(s)
                      </div>
                    )}
                    {status === 'bloqueado' && (
                      <div className="absolute bottom-1 right-1 text-xs text-yellow-600">🔒</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal de Detalhes da Reserva */}
        {reservaSelecionada && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Detalhes da Reserva</h3>
                <button
                  onClick={() => setReservaSelecionada(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                <p><strong>Nome:</strong> {reservaSelecionada.nome}</p>
                <p><strong>Telefone:</strong> {reservaSelecionada.telefone}</p>
                <p><strong>Check-in:</strong> {format(new Date(reservaSelecionada.checkIn), 'dd/MM/yyyy')}</p>
                <p><strong>Check-out:</strong> {format(new Date(reservaSelecionada.checkOut), 'dd/MM/yyyy')}</p>
                <p><strong>Valor:</strong> R$ {reservaSelecionada.valorTotal.toFixed(2)}</p>
                <p><strong>Status:</strong> {reservaSelecionada.status}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

