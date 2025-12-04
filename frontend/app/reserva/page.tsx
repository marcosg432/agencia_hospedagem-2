'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { Preco, Quarto } from '@/lib/types';
import { format } from 'date-fns';

export default function Reserva() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    qtdPessoas: 1,
    checkIn: '',
    checkOut: '',
    valorTotal: 0,
    observacoes: '',
    quarto: 'Quarto 1',
  });
  const [precos, setPrecos] = useState<Preco[]>([]);
  const [quartos, setQuartos] = useState<Quarto[]>([]);
  const [quartoSelecionado, setQuartoSelecionado] = useState<Quarto | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [datasOcupadas, setDatasOcupadas] = useState<any>(null);

  useEffect(() => {
    carregarPrecos();
    carregarQuartos();
  }, []);

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      calcularValor();
      verificarDisponibilidade();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.checkIn, formData.checkOut, formData.qtdPessoas, formData.quarto, quartos, quartoSelecionado, precos]);

  const verificarDisponibilidade = async () => {
    if (!formData.checkIn || !formData.checkOut) return;

    try {
      const quarto = formData.quarto || 'Quarto 1';
      const response = await api.get(
        `/disponibilidade?checkIn=${formData.checkIn}&checkOut=${formData.checkOut}&quarto=${encodeURIComponent(quarto)}`
      );
      setDatasOcupadas(response.data);
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
    }
  };

  const carregarPrecos = async () => {
    try {
      const response = await api.get('/precos');
      setPrecos(response.data);
    } catch (error) {
      console.error('Erro ao carregar preços:', error);
    }
  };

  const carregarQuartos = async () => {
    try {
      const response = await api.get('/quartos');
      setQuartos(response.data);
      // Se já tiver um quarto selecionado, atualizar o objeto
      if (formData.quarto) {
        const quarto = response.data.find((q: Quarto) => q.nome === formData.quarto);
        if (quarto) {
          setQuartoSelecionado(quarto);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar quartos:', error);
    }
  };

  const calcularValor = () => {
    if (!formData.checkIn || !formData.checkOut) return;

    // Criar datas sem hora (apenas data) para evitar problemas de timezone
    const checkIn = new Date(formData.checkIn + 'T00:00:00');
    const checkOut = new Date(formData.checkOut + 'T00:00:00');
    
    // Validar datas
    if (checkOut <= checkIn) {
      setFormData({ ...formData, valorTotal: 0 });
      return;
    }

    // Buscar o quarto selecionado
    const quarto = quartos.find((q: Quarto) => q.nome === formData.quarto) || quartoSelecionado;
    
    // Se não encontrou o quarto, usar preços padrão da tabela
    if (!quarto) {
      const precoComum = precos.find(p => p.tipo === 'comum')?.valor || 150;
      const precoFimSemana = precos.find(p => p.tipo === 'fim_semana')?.valor || 200;
      
      let valorTotal = 0;
      const dataAtual = new Date(checkIn);
      while (dataAtual < checkOut) {
        const diaSemana = dataAtual.getDay();
        if (diaSemana === 0 || diaSemana === 5 || diaSemana === 6) {
          valorTotal += precoFimSemana;
        } else {
          valorTotal += precoComum;
        }
        dataAtual.setDate(dataAtual.getDate() + 1);
      }
      
      const valorFinal = valorTotal * formData.qtdPessoas;
      setFormData({ ...formData, valorTotal: valorFinal });
      return;
    }

    // Calcular usando preço base do quarto + ajuste de fim de semana
    const precoBase = quarto.precoBase || 150;
    const ajusteFimSemana = precos.find(p => p.tipo === 'fim_semana')?.valor || 200;
    const precoComum = precos.find(p => p.tipo === 'comum')?.valor || 150;
    
    // Se o quarto tem preço específico para fim de semana, usar ele
    // Senão, usar: preço_base + (ajuste_fim_semana - preço_comum)
    const diferencaFimSemana = ajusteFimSemana - precoComum;
    const precoFimSemanaQuarto = quarto.precoFimSemana || (precoBase + diferencaFimSemana);

    let valorTotal = 0;
    const dataAtual = new Date(checkIn);
    while (dataAtual < checkOut) {
      const diaSemana = dataAtual.getDay();
      // 0 = domingo, 5 = sexta, 6 = sábado
      if (diaSemana === 0 || diaSemana === 5 || diaSemana === 6) {
        valorTotal += precoFimSemanaQuarto;
      } else {
        valorTotal += precoBase;
      }
      // Avançar para o próximo dia
      dataAtual.setDate(dataAtual.getDate() + 1);
    }

    // Multiplicar pelo número de pessoas
    const valorFinal = valorTotal * formData.qtdPessoas;
    setFormData({ ...formData, valorTotal: valorFinal });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      console.log('[RESERVA] Enviando reserva:', formData);
      
      // Validar dados antes de enviar
      if (!formData.nome || !formData.telefone || !formData.checkIn || !formData.checkOut) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        setLoading(false);
        return;
      }

      if (formData.valorTotal <= 0) {
        alert('O valor total deve ser maior que zero. Verifique as datas selecionadas.');
        setLoading(false);
        return;
      }

      // Verificar se alguma data está no passado
      const checkInDate = new Date(formData.checkIn);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      if (checkInDate < hoje) {
        alert('A data de check-in não pode ser no passado.');
        setLoading(false);
        return;
      }

      // Verificar disponibilidade antes de criar reserva
      console.log('[RESERVA] Verificando disponibilidade...');
      try {
        const quarto = formData.quarto || 'Quarto 1';
        const disponibilidadeRes = await api.get(
          `/disponibilidade?checkIn=${formData.checkIn}&checkOut=${formData.checkOut}&quarto=${encodeURIComponent(quarto)}`
        );
        
        if (!disponibilidadeRes.data.disponivel) {
          const conflitos = disponibilidadeRes.data.reservasConflitantes || [];
          const bloqueios = disponibilidadeRes.data.bloqueios || [];
          
          let mensagem = 'Estas datas estão ocupadas ou bloqueadas.\n\n';
          
          if (conflitos.length > 0) {
            mensagem += 'Reservas existentes:\n';
            conflitos.forEach((c: any) => {
              const checkIn = new Date(c.checkIn).toLocaleDateString('pt-BR');
              const checkOut = new Date(c.checkOut).toLocaleDateString('pt-BR');
              mensagem += `• ${c.quarto || 'Quarto'}: ${checkIn} a ${checkOut}\n`;
            });
          }
          
          if (bloqueios.length > 0) {
            mensagem += '\nDatas bloqueadas:\n';
            bloqueios.forEach((b: any) => {
              const data = new Date(b.data).toLocaleDateString('pt-BR');
              mensagem += `• ${data} (${b.motivo})\n`;
            });
          }
          
          alert(mensagem);
          setLoading(false);
          return;
        }
      } catch (disponibilidadeError: any) {
        console.warn('[RESERVA] Erro ao verificar disponibilidade, continuando...', disponibilidadeError);
        // Continuar mesmo se houver erro na verificação
      }

      console.log('[RESERVA] Dados validados, enviando para o backend...');
      const response = await api.post('/reservas', {
        nome: formData.nome.trim(),
        telefone: formData.telefone.trim(),
        qtdPessoas: formData.qtdPessoas,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        valorTotal: formData.valorTotal,
        observacoes: formData.observacoes || '',
        quarto: formData.quarto || 'Quarto 1',
      });
      
      console.log('[RESERVA] ✓ Reserva criada com sucesso:', response.data);
      
      setSuccess(true);
      setFormData({
        nome: '',
        telefone: '',
        qtdPessoas: 1,
        checkIn: '',
        checkOut: '',
        valorTotal: 0,
        observacoes: '',
        quarto: 'Quarto 1',
      });
      setDatasOcupadas(null);

      // Limpar mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error('[RESERVA] ✗ Erro ao criar reserva:', error);
      console.error('[RESERVA] Status:', error.response?.status);
      console.error('[RESERVA] Detalhes:', error.response?.data);
      console.error('[RESERVA] É erro de rede?', error.isNetworkError);
      
      let errorMessage = 'Erro ao criar reserva. Tente novamente.';
      
      // Tratar erro de rede
      if (error.isNetworkError || !error.response) {
        errorMessage = 'Erro de conexão com o servidor.\n\n';
        errorMessage += 'Verifique:\n';
        errorMessage += '• Se o backend está rodando (porta 4000)\n';
        errorMessage += '• Se a URL da API está correta\n';
        errorMessage += '• Sua conexão com a internet\n\n';
        errorMessage += 'Tente novamente em alguns instantes.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.details) {
          errorMessage += `\n\n${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
              Fazer Reserva
            </h1>

            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                <p className="font-semibold">Reserva criada com sucesso!</p>
                <p className="text-sm">Em breve entraremos em contato para confirmar.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade de Pessoas *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.qtdPessoas}
                    onChange={(e) => setFormData({ ...formData, qtdPessoas: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quarto *
                  </label>
                  <select
                    required
                    value={formData.quarto}
                    onChange={(e) => {
                      const quartoNome = e.target.value;
                      const quarto = quartos.find((q: Quarto) => q.nome === quartoNome);
                      setQuartoSelecionado(quarto || null);
                      setFormData({ ...formData, quarto: quartoNome });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {quartos.length > 0 ? (
                      quartos.map((quarto: Quarto) => (
                        <option key={quarto.id} value={quarto.nome}>
                          {quarto.nome} - R$ {quarto.precoBase.toFixed(2)}/dia
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Quarto 1">Quarto 1</option>
                        <option value="Quarto 2">Quarto 2</option>
                        <option value="Quarto 3">Quarto 3</option>
                        <option value="Quarto 4">Quarto 4</option>
                        <option value="Quarto 5">Quarto 5</option>
                      </>
                    )}
                  </select>
                  {quartoSelecionado && (
                    <p className="mt-1 text-xs text-gray-500">
                      {quartoSelecionado.descricao || `Capacidade: ${quartoSelecionado.capacidade} pessoa(s)`}
                    </p>
                  )}
                </div>
              </div>

              {datasOcupadas && !datasOcupadas.disponivel && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                  <p className="text-sm font-semibold text-red-800 mb-2">
                    ⚠️ Período Indisponível
                  </p>
                  {datasOcupadas.reservasConflitantes?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-red-700">Reservas existentes neste período:</p>
                      {datasOcupadas.reservasConflitantes.map((r: any, idx: number) => (
                        <p key={idx} className="text-xs text-red-600">
                          • {r.quarto || 'Quarto'}: {new Date(r.checkIn).toLocaleDateString('pt-BR')} a {new Date(r.checkOut).toLocaleDateString('pt-BR')}
                        </p>
                      ))}
                    </div>
                  )}
                  {datasOcupadas.bloqueios?.length > 0 && (
                    <div>
                      <p className="text-xs text-red-700">Datas bloqueadas:</p>
                      {datasOcupadas.bloqueios.map((b: any, idx: number) => (
                        <p key={idx} className="text-xs text-red-600">
                          • {new Date(b.data).toLocaleDateString('pt-BR')} ({b.motivo})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {formData.valorTotal > 0 && (
                <div className="bg-primary-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-1">Valor Total Estimado:</p>
                  <p className="text-2xl font-bold text-primary-600">
                    R$ {formData.valorTotal.toFixed(2)}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  rows={4}
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Alguma observação especial?"
                />
              </div>

              <button
                type="submit"
                disabled={loading || (datasOcupadas && !datasOcupadas.disponivel)}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : (datasOcupadas && !datasOcupadas.disponivel) ? 'Período Indisponível' : 'Confirmar Reserva'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


