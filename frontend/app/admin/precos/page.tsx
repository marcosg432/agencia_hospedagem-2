'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import api from '@/lib/api';
import { Preco } from '@/lib/types';

export default function Precos() {
  const [precos, setPrecos] = useState<Preco[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<Preco | null>(null);

  useEffect(() => {
    carregarPrecos();
  }, []);

  const carregarPrecos = async () => {
    try {
      const response = await api.get('/precos');
      setPrecos(response.data);
    } catch (error) {
      console.error('Erro ao carregar preços:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async (preco: Preco) => {
    try {
      if (!editando) return;
      
      // Garantir que o valor é um número
      const valorNumerico = typeof editando.valor === 'string' 
        ? parseFloat(editando.valor) 
        : editando.valor;
      
      if (isNaN(valorNumerico) || valorNumerico < 0) {
        alert('Valor deve ser um número positivo');
        return;
      }
      
      const response = await api.put(`/precos/${preco.id}`, {
        tipo: editando.tipo,
        valor: valorNumerico,
        descricao: editando.descricao || null,
      });
      
      console.log('Preço atualizado:', response.data);
      setEditando(null);
      await carregarPrecos();
      
      // Mostrar mensagem de sucesso
      alert('Preço salvo com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar preço:', error);
      const mensagem = error.response?.data?.error || error.response?.data?.details || 'Erro ao salvar preço';
      alert(`Erro: ${mensagem}`);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Tabela de Preços</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ Como funciona:</strong> Esta tabela define os preços base de referência. 
            Os preços de fim de semana dos quartos são calculados usando: <strong>preço_base_quarto + (ajuste_fim_semana - preço_comum)</strong>.
            Para gerenciar os preços individuais de cada quarto, acesse a seção de Quartos.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {precos.map((preco) => (
                  <tr key={preco.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {preco.tipo === 'comum' ? (
                        <span>
                          Dias Úteis<br />
                          <span className="text-xs text-gray-500">(Preço base de referência)</span>
                        </span>
                      ) : preco.tipo === 'fim_semana' ? (
                        <span>
                          Fim de Semana<br />
                          <span className="text-xs text-gray-500">(Preço base de referência)</span>
                        </span>
                      ) : (
                        'Especial'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editando?.id === preco.id ? (
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editando.valor || ''}
                          onChange={(e) => {
                            const valor = e.target.value === '' ? 0 : parseFloat(e.target.value);
                            if (!isNaN(valor) && valor >= 0) {
                              setEditando({ ...editando, valor });
                            }
                          }}
                          className="w-24 px-2 py-1 border border-gray-300 rounded"
                          placeholder="0.00"
                        />
                      ) : (
                        `R$ ${preco.valor.toFixed(2)}`
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {editando?.id === preco.id ? (
                        <input
                          type="text"
                          value={editando.descricao || ''}
                          onChange={(e) => setEditando({ ...editando, descricao: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      ) : (
                        preco.descricao || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editando?.id === preco.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSalvar(editando)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditando(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditando(preco)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Editar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}




