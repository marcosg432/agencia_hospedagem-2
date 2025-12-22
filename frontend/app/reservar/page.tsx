'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { format, addDays, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Reservar() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    // Dados da reserva
    checkIn: '',
    checkOut: '',
    hospedes: 2,
    quarto: '',
    // Dados pessoais
    nome: '',
    email: '',
    telefone: '',
    documento: '',
    // Observações
    observacoes: '',
    // Extras
    cafeDaManha: true,
    transferAeroporto: false,
    latecheckout: false
  })

  const quartos = [
    { id: 'standard', nome: 'Suíte Standard', preco: 280, maxHospedes: 2 },
    { id: 'superior', nome: 'Suíte Superior', preco: 420, maxHospedes: 2 },
    { id: 'master', nome: 'Suíte Master', preco: 680, maxHospedes: 3 },
    { id: 'familia', nome: 'Suíte Família', preco: 550, maxHospedes: 4 },
    { id: 'luademel', nome: 'Suíte Lua de Mel', preco: 750, maxHospedes: 2 },
    { id: 'presidencial', nome: 'Suíte Presidencial', preco: 1200, maxHospedes: 4 }
  ]

  const extras = [
    { id: 'cafeDaManha', nome: 'Café da Manhã', preco: 0, descricao: 'Incluso em todas as diárias' },
    { id: 'transferAeroporto', nome: 'Transfer Aeroporto', preco: 150, descricao: 'Ida e volta' },
    { id: 'latecheckout', nome: 'Late Checkout', preco: 100, descricao: 'Saída até 16h' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const calcularNoites = () => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn)
      const checkOut = new Date(formData.checkOut)
      return Math.max(0, differenceInDays(checkOut, checkIn))
    }
    return 0
  }

  const calcularTotal = () => {
    const noites = calcularNoites()
    const quartoSelecionado = quartos.find(q => q.id === formData.quarto)
    const precoQuarto = quartoSelecionado ? quartoSelecionado.preco * noites : 0
    
    let extrasTotal = 0
    if (formData.transferAeroporto) extrasTotal += 150
    if (formData.latecheckout) extrasTotal += 100
    
    return precoQuarto + extrasTotal
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simula envio da reserva
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Aqui você pode integrar com a API real
    // try {
    //   await api.post('/reservas', formData)
    // } catch (error) {
    //   console.error(error)
    // }

    setLoading(false)
    setSubmitted(true)
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const isStep1Valid = formData.checkIn && formData.checkOut && formData.quarto && calcularNoites() > 0
  const isStep2Valid = formData.nome && formData.email && formData.telefone && formData.documento

  // Set min date for check-in as today
  const today = format(new Date(), 'yyyy-MM-dd')
  const minCheckOut = formData.checkIn ? format(addDays(new Date(formData.checkIn), 1), 'yyyy-MM-dd') : today

  if (submitted) {
    return (
      <section className="min-h-screen pt-32 pb-24 bg-ivory-50 flex items-center">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-charcoal-900 mb-6">
              Reserva Confirmada!
            </h1>
            <p className="text-charcoal-600 text-lg mb-8">
              Obrigado por escolher a Villa Serena! Enviamos um e-mail de confirmação para <strong>{formData.email}</strong> com todos os detalhes da sua reserva.
            </p>
            <div className="bg-white p-8 shadow-card mb-8">
              <h3 className="font-display text-xl text-charcoal-900 mb-4">Resumo da Reserva</h3>
              <div className="space-y-2 text-left">
                <p><span className="text-charcoal-500">Hóspede:</span> {formData.nome}</p>
                <p><span className="text-charcoal-500">Quarto:</span> {quartos.find(q => q.id === formData.quarto)?.nome}</p>
                <p><span className="text-charcoal-500">Check-in:</span> {formData.checkIn && format(new Date(formData.checkIn), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                <p><span className="text-charcoal-500">Check-out:</span> {formData.checkOut && format(new Date(formData.checkOut), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                <p><span className="text-charcoal-500">Total:</span> <strong className="text-gold-600">R$ {calcularTotal().toLocaleString('pt-BR')}</strong></p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/" className="btn-primary">
                Voltar ao Início
              </a>
              <a
                href={`https://wa.me/5511999999999?text=Olá! Acabei de fazer uma reserva na Villa Serena para ${formData.checkIn} a ${formData.checkOut}. Nome: ${formData.nome}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-charcoal-900">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080"
            alt="Reservar Villa Serena"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative container-custom text-center">
          <span className="inline-block text-gold-400 text-sm tracking-[0.3em] uppercase mb-4">
            Reserva Online
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-6">
            Faça Sua <span className="italic">Reserva</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Reserve sua estadia em poucos passos e garanta momentos inesquecíveis
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="bg-ivory-50 py-8 border-b border-charcoal-100">
        <div className="container-custom">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {[
              { num: 1, label: 'Escolha a Suíte' },
              { num: 2, label: 'Seus Dados' },
              { num: 3, label: 'Confirmação' }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center gap-4 md:gap-8">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors duration-300 ${
                      step >= s.num
                        ? 'bg-gold-500 text-white'
                        : 'bg-charcoal-200 text-charcoal-500'
                    }`}
                  >
                    {step > s.num ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s.num
                    )}
                  </div>
                  <span className={`hidden md:block text-sm font-medium ${
                    step >= s.num ? 'text-charcoal-900' : 'text-charcoal-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`w-12 md:w-24 h-0.5 ${
                    step > s.num ? 'bg-gold-500' : 'bg-charcoal-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-ivory-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Escolha a Suíte */}
                {step === 1 && (
                  <div className="bg-white p-8 shadow-card">
                    <h2 className="font-display text-2xl text-charcoal-900 mb-6">Escolha sua Suíte</h2>
                    
                    {/* Datas */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label htmlFor="checkIn" className="label-elegant">Check-in</label>
                        <input
                          type="date"
                          id="checkIn"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleChange}
                          min={today}
                          required
                          className="input-elegant"
                        />
                      </div>
                      <div>
                        <label htmlFor="checkOut" className="label-elegant">Check-out</label>
                        <input
                          type="date"
                          id="checkOut"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleChange}
                          min={minCheckOut}
                          required
                          className="input-elegant"
                        />
                      </div>
                    </div>

                    {/* Hóspedes */}
                    <div className="mb-8">
                      <label htmlFor="hospedes" className="label-elegant">Número de Hóspedes</label>
                      <select
                        id="hospedes"
                        name="hospedes"
                        value={formData.hospedes}
                        onChange={handleChange}
                        className="input-elegant"
                      >
                        {[1, 2, 3, 4].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'hóspede' : 'hóspedes'}</option>
                        ))}
                      </select>
                    </div>

                    {/* Quartos */}
                    <div>
                      <label className="label-elegant mb-4 block">Selecione o Quarto</label>
                      <div className="grid gap-4">
                        {quartos.filter(q => q.maxHospedes >= formData.hospedes).map((quarto) => (
                          <label
                            key={quarto.id}
                            className={`flex items-center justify-between p-4 border cursor-pointer transition-all duration-300 ${
                              formData.quarto === quarto.id
                                ? 'border-gold-500 bg-gold-50'
                                : 'border-charcoal-200 hover:border-gold-300'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <input
                                type="radio"
                                name="quarto"
                                value={quarto.id}
                                checked={formData.quarto === quarto.id}
                                onChange={handleChange}
                                className="w-4 h-4 text-gold-500 focus:ring-gold-500"
                              />
                              <div>
                                <span className="font-medium text-charcoal-900">{quarto.nome}</span>
                                <span className="block text-sm text-charcoal-500">Até {quarto.maxHospedes} hóspedes</span>
                              </div>
                            </div>
                            <span className="font-display text-xl text-gold-600">
                              R$ {quarto.preco}
                              <span className="text-sm text-charcoal-400">/noite</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStep1Valid}
                        className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continuar
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Dados Pessoais */}
                {step === 2 && (
                  <div className="bg-white p-8 shadow-card">
                    <h2 className="font-display text-2xl text-charcoal-900 mb-6">Seus Dados</h2>
                    
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="nome" className="label-elegant">Nome Completo</label>
                          <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                            className="input-elegant"
                            placeholder="Seu nome completo"
                          />
                        </div>
                        <div>
                          <label htmlFor="documento" className="label-elegant">CPF</label>
                          <input
                            type="text"
                            id="documento"
                            name="documento"
                            value={formData.documento}
                            onChange={handleChange}
                            required
                            className="input-elegant"
                            placeholder="000.000.000-00"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="email" className="label-elegant">E-mail</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="input-elegant"
                            placeholder="seu@email.com"
                          />
                        </div>
                        <div>
                          <label htmlFor="telefone" className="label-elegant">Telefone</label>
                          <input
                            type="tel"
                            id="telefone"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            required
                            className="input-elegant"
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="observacoes" className="label-elegant">Observações (opcional)</label>
                        <textarea
                          id="observacoes"
                          name="observacoes"
                          value={formData.observacoes}
                          onChange={handleChange}
                          rows={3}
                          className="textarea-elegant"
                          placeholder="Algum pedido especial?"
                        />
                      </div>

                      {/* Extras */}
                      <div>
                        <label className="label-elegant mb-4 block">Serviços Adicionais</label>
                        <div className="space-y-3">
                          {extras.map((extra) => (
                            <label
                              key={extra.id}
                              className="flex items-center justify-between p-4 border border-charcoal-200 cursor-pointer hover:border-gold-300 transition-colors duration-300"
                            >
                              <div className="flex items-center gap-4">
                                <input
                                  type="checkbox"
                                  name={extra.id}
                                  checked={formData[extra.id as keyof typeof formData] as boolean}
                                  onChange={handleChange}
                                  disabled={extra.preco === 0}
                                  className="w-4 h-4 text-gold-500 focus:ring-gold-500 rounded"
                                />
                                <div>
                                  <span className="font-medium text-charcoal-900">{extra.nome}</span>
                                  <span className="block text-sm text-charcoal-500">{extra.descricao}</span>
                                </div>
                              </div>
                              <span className={`font-medium ${extra.preco === 0 ? 'text-green-600' : 'text-charcoal-700'}`}>
                                {extra.preco === 0 ? 'Incluso' : `+ R$ ${extra.preco}`}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn-secondary"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStep2Valid}
                        className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continuar
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmação */}
                {step === 3 && (
                  <div className="bg-white p-8 shadow-card">
                    <h2 className="font-display text-2xl text-charcoal-900 mb-6">Confirme sua Reserva</h2>
                    
                    <div className="space-y-6">
                      {/* Resumo da Reserva */}
                      <div className="bg-ivory-50 p-6 border border-charcoal-100">
                        <h3 className="font-display text-lg text-charcoal-900 mb-4">Detalhes da Estadia</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-charcoal-500">Check-in:</span>
                            <p className="font-medium">{formData.checkIn && format(new Date(formData.checkIn), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                          </div>
                          <div>
                            <span className="text-charcoal-500">Check-out:</span>
                            <p className="font-medium">{formData.checkOut && format(new Date(formData.checkOut), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                          </div>
                          <div>
                            <span className="text-charcoal-500">Quarto:</span>
                            <p className="font-medium">{quartos.find(q => q.id === formData.quarto)?.nome}</p>
                          </div>
                          <div>
                            <span className="text-charcoal-500">Hóspedes:</span>
                            <p className="font-medium">{formData.hospedes}</p>
                          </div>
                        </div>
                      </div>

                      {/* Dados do Hóspede */}
                      <div className="bg-ivory-50 p-6 border border-charcoal-100">
                        <h3 className="font-display text-lg text-charcoal-900 mb-4">Dados do Hóspede</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-charcoal-500">Nome:</span>
                            <p className="font-medium">{formData.nome}</p>
                          </div>
                          <div>
                            <span className="text-charcoal-500">CPF:</span>
                            <p className="font-medium">{formData.documento}</p>
                          </div>
                          <div>
                            <span className="text-charcoal-500">E-mail:</span>
                            <p className="font-medium">{formData.email}</p>
                          </div>
                          <div>
                            <span className="text-charcoal-500">Telefone:</span>
                            <p className="font-medium">{formData.telefone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Termos */}
                      <div className="text-sm text-charcoal-600">
                        <p>
                          Ao confirmar esta reserva, você concorda com nossos{' '}
                          <a href="#" className="text-gold-600 hover:underline">Termos de Uso</a> e{' '}
                          <a href="#" className="text-gold-600 hover:underline">Política de Cancelamento</a>.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn-secondary"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processando...
                          </span>
                        ) : (
                          <>
                            Confirmar Reserva
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Sidebar - Resumo */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 shadow-card sticky top-32">
                <h3 className="font-display text-xl text-charcoal-900 mb-6 pb-4 border-b border-charcoal-100">
                  Resumo da Reserva
                </h3>

                {formData.quarto ? (
                  <>
                    <div className="mb-6">
                      <p className="font-medium text-charcoal-900">
                        {quartos.find(q => q.id === formData.quarto)?.nome}
                      </p>
                      <p className="text-sm text-charcoal-500">{formData.hospedes} hóspede(s)</p>
                    </div>

                    {formData.checkIn && formData.checkOut && (
                      <div className="mb-6 pb-6 border-b border-charcoal-100">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-charcoal-500">Check-in</span>
                          <span>{format(new Date(formData.checkIn), 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-charcoal-500">Check-out</span>
                          <span>{format(new Date(formData.checkOut), 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-charcoal-500">Noites</span>
                          <span>{calcularNoites()}</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 mb-6 pb-6 border-b border-charcoal-100">
                      <div className="flex justify-between">
                        <span className="text-charcoal-600">
                          {quartos.find(q => q.id === formData.quarto)?.nome} x {calcularNoites()} noites
                        </span>
                        <span>
                          R$ {((quartos.find(q => q.id === formData.quarto)?.preco || 0) * calcularNoites()).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      {formData.transferAeroporto && (
                        <div className="flex justify-between text-sm">
                          <span className="text-charcoal-500">Transfer Aeroporto</span>
                          <span>R$ 150</span>
                        </div>
                      )}
                      {formData.latecheckout && (
                        <div className="flex justify-between text-sm">
                          <span className="text-charcoal-500">Late Checkout</span>
                          <span>R$ 100</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-display text-lg text-charcoal-900">Total</span>
                      <span className="font-display text-2xl text-gold-600">
                        R$ {calcularTotal().toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-charcoal-500 text-sm">
                    Selecione uma suíte e as datas para ver o resumo da sua reserva.
                  </p>
                )}

                {/* Help */}
                <div className="mt-8 pt-6 border-t border-charcoal-100">
                  <p className="text-sm text-charcoal-500 mb-3">Precisa de ajuda?</p>
                  <a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="font-medium">Falar no WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

