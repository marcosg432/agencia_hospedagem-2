'use client'

import { useState } from 'react'

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simula envio do formulário
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      assunto: '',
      mensagem: ''
    })

    // Reset submitted state após 5 segundos
    setTimeout(() => setSubmitted(false), 5000)
  }

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Endereço',
      content: 'Rua das Palmeiras, 123\nCentro - São Paulo, SP\nCEP: 01310-100'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Telefone',
      content: '+55 (11) 99999-9999\n+55 (11) 3333-4444',
      links: ['tel:+5511999999999', 'tel:+551133334444']
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'E-mail',
      content: 'contato@villaserena.com\nreservas@villaserena.com',
      links: ['mailto:contato@villaserena.com', 'mailto:reservas@villaserena.com']
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Horário',
      content: 'Recepção 24 horas\nCheck-in: 14h\nCheck-out: 12h'
    }
  ]

  const faqs = [
    {
      question: 'Qual o horário de check-in e check-out?',
      answer: 'O check-in é a partir das 14h e o check-out até às 12h. Caso precise de horários diferenciados, entre em contato conosco para verificarmos a disponibilidade.'
    },
    {
      question: 'Aceitam animais de estimação?',
      answer: 'Sim, somos pet-friendly! Aceitamos animais de pequeno porte mediante comunicação prévia e taxa adicional.'
    },
    {
      question: 'O café da manhã está incluso?',
      answer: 'Sim, todas as nossas diárias incluem um delicioso café da manhã buffet com produtos frescos e opções regionais.'
    },
    {
      question: 'Qual a política de cancelamento?',
      answer: 'Cancelamentos com até 7 dias de antecedência têm reembolso total. Entre 3-7 dias, 50% do valor. Menos de 3 dias não há reembolso.'
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 min-h-[50vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?q=80&w=2070"
            alt="Contato Villa Serena"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal-900/60" />
        </div>

        <div className="relative container-custom text-center">
          <span className="inline-block text-gold-400 text-sm tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in">
            Fale Conosco
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium text-white mb-6 opacity-0 animate-fade-in-up animate-delay-200">
            <span className="italic">Contato</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto opacity-0 animate-fade-in-up animate-delay-300">
            Estamos prontos para atendê-lo e tornar sua experiência inesquecível
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-ivory-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24 relative z-10">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gold-50 flex items-center justify-center text-gold-600 mb-4">
                  {info.icon}
                </div>
                <h3 className="font-display text-lg text-charcoal-900 mb-2">{info.title}</h3>
                <div className="text-charcoal-600 text-sm whitespace-pre-line">
                  {info.links ? (
                    info.content.split('\n').map((line, idx) => (
                      <a
                        key={idx}
                        href={info.links![idx]}
                        className="block hover:text-gold-600 transition-colors duration-300"
                      >
                        {line}
                      </a>
                    ))
                  ) : (
                    info.content
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-24 bg-ivory-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <span className="text-gold-600 text-sm tracking-[0.3em] uppercase">Envie uma Mensagem</span>
              <h2 className="section-title mt-4 mb-6">
                Entre em <span className="italic">Contato</span>
              </h2>
              <div className="gold-line mb-8" />
              <p className="text-charcoal-600 mb-8">
                Preencha o formulário abaixo e nossa equipe entrará em contato o mais breve possível.
              </p>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Mensagem enviada com sucesso! Entraremos em contato em breve.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="Seu nome"
                    />
                  </div>
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
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="telefone" className="label-elegant">Telefone</label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="input-elegant"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label htmlFor="assunto" className="label-elegant">Assunto</label>
                    <select
                      id="assunto"
                      name="assunto"
                      value={formData.assunto}
                      onChange={handleChange}
                      required
                      className="input-elegant"
                    >
                      <option value="">Selecione</option>
                      <option value="reserva">Reserva</option>
                      <option value="informacoes">Informações</option>
                      <option value="eventos">Eventos</option>
                      <option value="parceria">Parceria</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="mensagem" className="label-elegant">Mensagem</label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="textarea-elegant"
                    placeholder="Como podemos ajudar?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    'Enviar Mensagem'
                  )}
                </button>
              </form>
            </div>

            {/* Map */}
            <div>
              <div className="bg-charcoal-100 h-full min-h-[400px] rounded-sm overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975820694466!2d-46.65390768502216!3d-23.564981284681974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1635789456123!5m2!1spt-BR!2sbr"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-16 bg-green-600">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl md:text-3xl text-white mb-2">
                Prefere WhatsApp?
              </h3>
              <p className="text-white/80">
                Fale diretamente conosco de forma rápida e prática
              </p>
            </div>
            <a
              href="https://wa.me/5511999999999?text=Olá! Gostaria de mais informações sobre a Villa Serena."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-green-600 font-medium tracking-wide hover:bg-green-50 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Iniciar Conversa
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold-600 text-sm tracking-[0.3em] uppercase">Dúvidas Frequentes</span>
            <h2 className="section-title mt-4 mb-6">
              Perguntas <span className="italic">Frequentes</span>
            </h2>
            <div className="gold-line-center" />
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-ivory-50 border border-charcoal-100"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-display text-lg text-charcoal-900 pr-4">{faq.question}</span>
                    <svg
                      className="w-5 h-5 text-gold-500 transition-transform duration-300 group-open:rotate-180 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-charcoal-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
