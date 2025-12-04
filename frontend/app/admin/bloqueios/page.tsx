'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import api from '@/lib/api';
import { Bloqueio } from '@/lib/types';
import { format } from 'date-fns';

export default function Bloqueios() {
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);
  const [formData, setFormData] = useState({
    data: '',
    motivo: 'limpeza',
  });
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarBloqueios();
  }, []);

  const carregarBloqueios = async () => {
    try {
      console.log('[BLOQUEIOS] Carregando bloqueios...');
      setLoading(true);
      const hoje = new Date();
      const ano = hoje.getFullYear();
      const mes = hoje.getMonth() + 1;
      console.log('[BLOQUEIOS] Ano:', ano, 'Mês:', mes);
      
      const response = await api.get(`/bloqueios?ano=${ano}&mes=${mes}`);
      console.log('[BLOQUEIOS] Resposta recebida:', response.status);
      console.log('[BLOQUEIOS] Bloqueios:', response.data.length);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('[BLOQUEIOS] ✗ Resposta inválida');
        setBloqueios([]);
        return;
      }
      
      setBloqueios(response.data);
    } catch (error: any) {
      console.error('[BLOQUEIOS] ✗ Erro ao carregar bloqueios:', error);
      console.error('[BLOQUEIOS] Status:', error.response?.status);
      console.error('[BLOQUEIOS] Data:', error.response?.data);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
        return;
      }
      
      alert(error.response?.data?.error || 'Erro ao carregar bloqueios');
      setBloqueios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    try {
      console.log('[BLOQUEIOS] Criando bloqueio:', formData);
      const response = await api.post('/bloqueios', formData);
      console.log('[BLOQUEIOS] ✓ Bloqueio criado:', response.data);
      setFormData({ data: '', motivo: 'limpeza' });
      await carregarBloqueios();
    } catch (error: any) {
      console.error('[BLOQUEIOS] ✗ Erro ao criar bloqueio:', error);
      console.error('[BLOQUEIOS] Status:', error.response?.status);
      console.error('[BLOQUEIOS] Data:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || error.response?.data?.details || 'Erro ao criar bloqueio';
      alert(errorMessage);
    } finally {
      setSalvando(false);
    }
  };

  const deletarBloqueio = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover este bloqueio?')) {
      console.log('[BLOQUEIOS] Exclusão cancelada pelo usuário');
      return;
    }

    try {
      console.log('[BLOQUEIOS] Deletando bloqueio ID:', id);
      await api.delete(`/bloqueios/${id}`);
      console.log('[BLOQUEIOS] ✓ Bloqueio deletado com sucesso');
      await carregarBloqueios();
    } catch (error: any) {
      console.error('[BLOQUEIOS] ✗ Erro ao deletar bloqueio:', error);
      console.error('[BLOQUEIOS] Status:', error.response?.status);
      console.error('[BLOQUEIOS] Data:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || error.response?.data?.details || 'Erro ao deletar bloqueio';
      alert(errorMessage);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Bloqueio de Datas</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Criar Novo Bloqueio</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data *
                </label>
                <input
                  type="date"
                  required
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo *
                </label>
                <select
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                >
                  <option value="limpeza">Limpeza</option>
                  <option value="manutencao">Manutenção</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={salvando}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : 'Bloquear Data'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Datas Bloqueadas</h2>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : bloqueios.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhuma data bloqueada</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Motivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bloqueios.map((bloqueio) => (
                    <tr key={bloqueio.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(bloqueio.data), 'dd/MM/yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bloqueio.motivo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deletarBloqueio(bloqueio.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}


