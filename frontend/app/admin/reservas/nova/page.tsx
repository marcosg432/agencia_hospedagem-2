'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import api from '@/lib/api';
import { Preco } from '@/lib/types';

export default function NovaReserva() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    qtdPessoas: 1,
    checkIn: '',
    checkOut: '',
    valorTotal: 0,
    status: 'pendente',
    observacoes: '',
  });
  const [precos, setPrecos] = useState<Preco[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarPrecos();
  }, []);

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      calcularValor();
    }
  }, [formData.checkIn, formData.checkOut, formData.qtdPessoas]);

  const carregarPrecos = async () => {
    try {
      const response = await api.get('/precos');
      setPrecos(response.data);
    } catch (error) {
      console.error('Erro ao carregar preços:', error);
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

    let valorTotal = 0;
    const precoComum = precos.find(p => p.tipo === 'comum')?.valor || 150;
    const precoFimSemana = precos.find(p => p.tipo === 'fim_semana')?.valor || 200;

    // Iterar dia a dia (NÃO incluir o dia de check-out)
    const dataAtual = new Date(checkIn);
    while (dataAtual < checkOut) {
      const diaSemana = dataAtual.getDay();
      // 0 = domingo, 5 = sexta, 6 = sábado
      if (diaSemana === 0 || diaSemana === 5 || diaSemana === 6) {
        valorTotal += precoFimSemana;
      } else {
        valorTotal += precoComum;
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

    try {
      await api.post('/reservas', formData);
      router.push('/admin/reservas');
    } catch (error) {
      alert('Erro ao criar reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Nova Reserva</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in *
                </label>
                <input
                  type="date"
                  required
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
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
                  min={formData.checkIn}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                >
                  <option value="pendente">Pendente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            {formData.valorTotal > 0 && (
              <div className="bg-primary-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-1">Valor Total:</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar Reserva'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}




