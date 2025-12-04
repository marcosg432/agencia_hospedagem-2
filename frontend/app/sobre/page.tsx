'use client'

import Link from 'next/link'

export default function Sobre() {
  const values = [
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Hospitalidade',
      description: 'Acolhemos cada hóspede como parte da família, com carinho e atenção genuína.'
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: 'Excelência',
      description: 'Buscamos a perfeição em cada detalhe, superando expectativas constantemente.'
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      title: 'Sustentabilidade',
      description: 'Comprometidos com práticas sustentáveis que preservam o meio ambiente.'
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Tradição',
      description: 'Mais de 15 anos criando memórias inesquecíveis para nossos hóspedes.'
    }
  ]

  const team = [
    {
      name: 'Carlos Eduardo',
      role: 'Diretor Geral',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
      description: 'Com mais de 20 anos de experiência em hotelaria de luxo.'
    },
    {
      name: 'Mariana Costa',
      role: 'Gerente de Hospitalidade',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400',
      description: 'Especialista em proporcionar experiências memoráveis aos hóspedes.'
    },
    {
      name: 'Roberto Almeida',
      role: 'Chef Executivo',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400',
      description: 'Criador do nosso premiado menu de café da manhã.'
    }
  ]

  const milestones = [
    { year: '2008', title: 'Fundação', description: 'Villa Serena abre suas portas com 8 suítes' },
    { year: '2012', title: 'Expansão', description: 'Inauguração de mais 12 suítes e área de lazer' },
    { year: '2016', title: 'Premiação', description: 'Eleita melhor pousada da região' },
    { year: '2020', title: 'Renovação', description: 'Modernização completa das instalações' },
    { year: '2023', title: 'Excelência', description: 'Certificação de qualidade 5 estrelas' }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 min-h-[60vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2089"
            alt="Villa Serena - Sobre nós"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal-900/60" />
        </div>

        <div className="relative container-custom text-center">
          <span className="inline-block text-gold-400 text-sm tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in">
            Nossa História
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium text-white mb-6 opacity-0 animate-fade-in-up animate-delay-200">
            Sobre a <span className="italic">Villa Serena</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto opacity-0 animate-fade-in-up animate-delay-300">
            Uma jornada de dedicação à arte da hospitalidade
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-ivory-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-gold-600 text-sm tracking-[0.3em] uppercase">Nossa Essência</span>
              <h2 className="section-title mt-4 mb-6">
                Uma Paixão por{' '}
                <span className="italic">Acolher</span>
              </h2>
              <div className="gold-line mb-8" />
              
              <div className="space-y-6 text-charcoal-600 leading-relaxed">
                <p>
                  A Villa Serena nasceu de um sonho: criar um refúgio onde cada pessoa pudesse 
                  se sentir verdadeiramente em casa, longe das preocupações do dia a dia.
                </p>
                <p>
                  Fundada em 2008, nossa pousada começou como um projeto familiar modesto, 
                  com apenas 8 suítes e uma equipe dedicada de 6 pessoas. Ao longo dos anos, 
                  crescemos mantendo sempre a essência que nos tornou especiais: o cuidado 
                  genuíno com cada hóspede.
                </p>
                <p>
                  Hoje, com mais de 20 suítes e uma equipe de profissionais apaixonados pelo 
                  que fazem, continuamos a mesma missão: transformar estadias em memórias 
                  inesquecíveis.
                </p>
              </div>

              <div className="mt-10 flex items-center gap-8">
                <div className="text-center">
                  <span className="block font-display text-4xl text-gold-600 font-bold">15+</span>
                  <span className="text-sm text-charcoal-500 uppercase tracking-wide">Anos</span>
                </div>
                <div className="w-px h-16 bg-charcoal-200" />
                <div className="text-center">
                  <span className="block font-display text-4xl text-gold-600 font-bold">20k+</span>
                  <span className="text-sm text-charcoal-500 uppercase tracking-wide">Hóspedes</span>
                </div>
                <div className="w-px h-16 bg-charcoal-200" />
                <div className="text-center">
                  <span className="block font-display text-4xl text-gold-600 font-bold">4.9</span>
                  <span className="text-sm text-charcoal-500 uppercase tracking-wide">Avaliação</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070"
                alt="Villa Serena - História"
                className="w-full h-[500px] object-cover rounded-sm shadow-elegant"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 shadow-card max-w-xs">
                <blockquote className="font-display text-lg italic text-charcoal-700 mb-4">
                  "Nosso maior orgulho é ver o sorriso de satisfação de cada hóspede."
                </blockquote>
                <cite className="text-sm text-charcoal-500">— Família Fundadora</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-charcoal-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold-400 text-sm tracking-[0.3em] uppercase">Nossos Pilares</span>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-white mt-4 mb-6">
              Valores Que Nos Guiam
            </h2>
            <div className="gold-line-center" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-8 border border-charcoal-700 hover:border-gold-500 transition-all duration-500 group"
              >
                <div className="text-gold-500 mb-6 flex justify-center group-hover:scale-110 transition-transform duration-500">
                  {value.icon}
                </div>
                <h3 className="font-display text-xl text-white mb-4">{value.title}</h3>
                <p className="text-charcoal-400 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-ivory-100">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold-600 text-sm tracking-[0.3em] uppercase">Nossa Trajetória</span>
            <h2 className="section-title mt-4 mb-6">
              Marcos da Nossa <span className="italic">História</span>
            </h2>
            <div className="gold-line-center" />
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold-300 hidden lg:block" />

            <div className="space-y-12 lg:space-y-0">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`lg:flex lg:items-center lg:gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:pl-12'}`}>
                    <div className="bg-white p-6 shadow-card inline-block">
                      <span className="font-display text-3xl text-gold-600 font-bold">{milestone.year}</span>
                      <h3 className="font-display text-xl text-charcoal-900 mt-2">{milestone.title}</h3>
                      <p className="text-charcoal-500 mt-2">{milestone.description}</p>
                    </div>
                  </div>
                  {/* Timeline Dot */}
                  <div className="hidden lg:flex w-4 h-4 bg-gold-500 rounded-full border-4 border-ivory-100 z-10" />
                  <div className="lg:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold-600 text-sm tracking-[0.3em] uppercase">Nossa Equipe</span>
            <h2 className="section-title mt-4 mb-6">
              Pessoas <span className="italic">Dedicadas</span>
            </h2>
            <div className="gold-line-center mb-6" />
            <p className="section-subtitle mx-auto">
              Conheça os profissionais que fazem a diferença em cada estadia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="font-display text-2xl text-charcoal-900">{member.name}</h3>
                <p className="text-gold-600 text-sm uppercase tracking-wide mb-3">{member.role}</p>
                <p className="text-charcoal-500">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-ivory-200">
        <div className="container-custom text-center">
          <h2 className="section-title mb-6">
            Venha Fazer Parte da Nossa <span className="italic">História</span>
          </h2>
          <p className="section-subtitle mx-auto mb-10">
            Reserve sua estadia e descubra por que tantos hóspedes se tornaram parte da família Villa Serena
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/reservar" className="btn-gold">
              Fazer Reserva
            </Link>
            <Link href="/contato" className="btn-secondary">
              Entrar em Contato
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
