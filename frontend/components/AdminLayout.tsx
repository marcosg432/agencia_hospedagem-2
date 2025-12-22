'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>({ nome: 'Administrador', email: 'admin@admin.com' });

  // Removido verificação de autenticação - acesso público
  useEffect(() => {
    // Sem verificação de login - sempre permite acesso
    setUser({ nome: 'Administrador', email: 'admin@admin.com' });
  }, []);

  const handleLogout = () => {
    // Removido logout - não há mais sistema de autenticação
    router.push('/');
  };

  const menuItems = [
    { href: '/admin/painel', label: 'Painel', icon: '📊' },
    { href: '/admin/quartos-reservados', label: 'Quartos Reservados', icon: '🛏️' },
    { href: '/admin/reservas', label: 'Reservas', icon: '📋' },
    { href: '/admin/bloqueios', label: 'Bloqueios', icon: '⛔' },
    { href: '/admin/precos', label: 'Preços', icon: '💰' },
    { href: '/admin/hospedagem', label: 'Hospedagem', icon: '🏠' },
    { href: '/admin/relatorios', label: 'Relatórios', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin/painel" className="text-xl font-bold text-primary-600">
                Admin
              </Link>
              <div className="hidden md:flex space-x-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.nome}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

