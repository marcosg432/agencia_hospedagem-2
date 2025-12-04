'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/sobre', label: 'Sobre' },
    { href: '/hospedagem', label: 'Hospedagem' },
    { href: '/contato', label: 'Contato' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-elegant py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 flex items-center justify-center border-2 transition-colors duration-300 ${
                  isScrolled ? 'border-gold-500' : 'border-white'
                }`}>
                  <span className={`font-display text-xl font-bold transition-colors duration-300 ${
                    isScrolled ? 'text-gold-500' : 'text-white'
                  }`}>
                    V
                  </span>
                </div>
                <div>
                  <span className={`font-display text-xl font-semibold tracking-wide transition-colors duration-300 ${
                    isScrolled ? 'text-charcoal-900' : 'text-white'
                  }`}>
                    Villa Serena
                  </span>
                  <p className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                    isScrolled ? 'text-charcoal-500' : 'text-white/70'
                  }`}>
                    Hospedagem
                  </p>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-body text-sm tracking-[0.15em] uppercase transition-colors duration-300 ${
                    isScrolled
                      ? isActive(link.href)
                        ? 'text-gold-500'
                        : 'text-charcoal-700 hover:text-gold-500'
                      : isActive(link.href)
                      ? 'text-gold-400'
                      : 'text-white/90 hover:text-gold-400'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold-500" />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Link
                href="/reservar"
                className={`inline-flex items-center gap-2 px-6 py-3 font-body text-sm font-medium tracking-wider uppercase transition-all duration-300 ${
                  isScrolled
                    ? 'bg-gold-500 text-white hover:bg-gold-600'
                    : 'bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-charcoal-900'
                }`}
              >
                Reservar
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors duration-300 ${
                isScrolled ? 'text-charcoal-900' : 'text-white'
              }`}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-charcoal-900/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-full bg-ivory-50 shadow-2xl transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-8">
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-charcoal-600 hover:text-charcoal-900"
              aria-label="Fechar menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Logo */}
            <div className="mb-12">
              <span className="font-display text-2xl font-semibold text-charcoal-900">Villa Serena</span>
              <p className="text-xs tracking-[0.2em] uppercase text-charcoal-500 mt-1">Hospedagem</p>
            </div>

            {/* Nav Links */}
            <nav className="space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block font-body text-lg tracking-wide transition-colors duration-300 ${
                    isActive(link.href)
                      ? 'text-gold-500'
                      : 'text-charcoal-700 hover:text-gold-500'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="mt-12">
              <Link
                href="/reservar"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-gold w-full text-center"
              >
                Reservar Agora
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-12 pt-8 border-t border-charcoal-200">
              <p className="text-sm text-charcoal-500 mb-4">Contato</p>
              <a href="tel:+5511999999999" className="block text-charcoal-700 hover:text-gold-500 mb-2">
                +55 (11) 99999-9999
              </a>
              <a href="mailto:contato@villaserena.com" className="block text-charcoal-700 hover:text-gold-500">
                contato@villaserena.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

