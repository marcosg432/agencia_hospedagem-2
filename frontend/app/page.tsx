'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

export default function Home() {
  const [health, setHealth] = useState<any>(null)

  useEffect(() => {
    checkHealth()
  }, [])

  const checkHealth = async () => {
    try {
      const response = await api.get('/health')
      setHealth(response.data)
    } catch (error) {
      console.error('Erro ao verificar saúde da API:', error)
    }
  }

  const amenities = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
      title: 'Wi-Fi Gratuito',
      description: 'Internet de alta velocidade em todos os ambientes'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Café da Manhã',
      description: 'Café da manhã completo com produtos frescos'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: 'Estacionamento',
      description: 'Estacionamento privativo e seguro'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Segurança 24h',
      description: 'Monitoramento e segurança durante toda estadia'
    }
  ]

  const rooms = [
    {
      name: 'Suíte Standard',
      description: 'Conforto essencial com vista para o jardim',
      price: 'A partir de R$ 280',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070',
      features: ['Cama Queen Size', 'Ar Condicionado', 'TV 43"', 'Frigobar']
    },
    {
      name: 'Suíte Superior',
      description: 'Espaço amplo com varanda privativa',
      price: 'A partir de R$ 420',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074',
      features: ['Cama King Size', 'Varanda', 'Banheira', 'Smart TV 55"']
    },
    {
      name: 'Suíte Master',
      description: 'O máximo em luxo e sofisticação',
      price: 'A partir de R$ 680',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070',
      features: ['Cama King Size', 'Sala de Estar', 'Jacuzzi', 'Vista Panorâmica']
    }
  ]

  const testimonials = [
    {
      name: 'Maria Silva',
      location: 'São Paulo, SP',
      text: 'Uma experiência incrível! O atendimento foi impecável e as acomodações superaram todas as expectativas. Com certeza voltarei.',
      rating: 5
    },
    {
      name: 'João Santos',
      location: 'Rio de Janeiro, RJ',
      text: 'Ambiente perfeito para descansar. O café da manhã é maravilhoso e a equipe muito atenciosa. Recomendo fortemente!',
      rating: 5
    },
    {
      name: 'Ana Oliveira',
      location: 'Belo Horizonte, MG',
      text: 'Melhor hospedagem da região. Quartos impecáveis, localização privilegiada e uma atmosfera acolhedora. Nota 10!',
      rating: 5
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
            alt="Villa Serena - Vista panorâmica"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/80 via-charcoal-900/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative container-custom z-10">
          <div className="max-w-3xl">
            <div className="opacity-0 animate-fade-in-up">
              <span className="inline-block text-gold-400 text-sm tracking-[0.3em] uppercase mb-4">
                Bem-vindo à Villa Serena
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-tight mb-6 opacity-0 animate-fade-in-up animate-delay-200">
              Onde o Conforto{' '}
              <span className="italic text-gold-400">Encontra</span>{' '}
              a Elegância
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed mb-10 max-w-xl opacity-0 animate-fade-in-up animate-delay-300">
              Descubra uma experiência única de hospedagem em um ambiente sofisticado, 
              onde cada detalhe foi pensado para proporcionar momentos inesquecíveis.
            </p>
            
            <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in-up animate-delay-400">
              <Link href="/reservar" className="btn-gold">
                Fazer Reserva
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/hospedagem" className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 font-body font-medium tracking-wide transition-all duration-300 hover:bg-white hover:text-charcoal-900">
                Explorar Suítes
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-ivory-100">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070"
                    alt="Suíte luxuosa"
                    className="w-full h-48 object-cover rounded-sm shadow-elegant"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070"
                    alt="Área de piscina"
                    className="w-full h-64 object-cover rounded-sm shadow-elegant"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img
                    src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070"
                    alt="Recepção elegante"
                    className="w-full h-64 object-cover rounded-sm shadow-elegant"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070"
                    alt="Restaurante"
                    className="w-full h-48 object-cover rounded-sm shadow-elegant"
                  />
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-gold-500 text-white p-6 shadow-gold">
                <span className="block text-4xl font-display font-bold">15+</span>
                <span className="text-sm uppercase tracking-wider">Anos de Excelência</span>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="text-gold-600 text-sm tracking-[0.3em] uppercase">Sobre Nós</span>
              <h2 className="section-title mt-4 mb-6">
                Uma História de{' '}
                <span className="italic">Hospitalidade</span>
              </h2>
              <div className="gold-line mb-8" />
              <p className="text-charcoal-600 text-lg leading-relaxed mb-6">
                Há mais de 15 anos, a Villa Serena tem sido sinônimo de excelência em hospedagem. 
                Nosso compromisso é oferecer uma experiência única, onde cada hóspede é tratado 
                com atenção especial e cuidado personalizado.
              </p>
              <p className="text-charcoal-600 leading-relaxed mb-8">
                Localizada em uma região privilegiada, nossa pousada combina o charme da 
                arquitetura clássica com o conforto das instalações modernas, criando o 
                ambiente perfeito para relaxar e recarregar as energias.
              </p>
              <Link href="/sobre" className="btn-secondary">
                Conhecer Nossa História
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-24 bg-charcoal-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold-400 text-sm tracking-[0.3em] uppercase">Comodidades</span>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-white mt-4 mb-6">
              Tudo Para Seu Conforto
            </h2>
            <div className="gold-line-center" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="group text-center p-8 border border-charcoal-700 hover:border-gold-500 transition-all duration-500"
              >
                <div className="text-gold-500 mb-6 flex justify-center group-hover:scale-110 transition-transform duration-500">
                  {amenity.icon}
                </div>
                <h3 className="font-display text-xl text-white mb-3">{amenity.title}</h3>
                <p className="text-charcoal-400 text-sm">{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-24 bg-ivory-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold-600 text-sm tracking-[0.3em] uppercase">Acomodações</span>
            <h2 className="section-title mt-4 mb-6">
              Nossas <span className="italic">Suítes</span>
            </h2>
            <div className="gold-line-center mb-6" />
            <p className="section-subtitle mx-auto">
              Cada suíte foi cuidadosamente projetada para oferecer o máximo em conforto e elegância
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <div key={index} className="card-elegant group overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-charcoal-900 mb-2">{room.name}</h3>
                  <p className="text-charcoal-500 text-sm mb-4">{room.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-charcoal-600 bg-ivory-200 px-3 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-charcoal-100">
                    <span className="font-display text-lg text-gold-600">{room.price}</span>
                    <Link
                      href="/hospedagem"
                      className="text-charcoal-900 text-sm font-medium hover:text-gold-600 transition-colors duration-300"
                    >
                      Ver Detalhes →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/hospedagem" className="btn-primary">
              Ver Todas as Suítes
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-32">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080"
            alt="Vista do resort"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal-900/70" />
        </div>
        <div className="relative container-custom text-center">
          <span className="text-gold-400 text-sm tracking-[0.3em] uppercase">Experiência Exclusiva</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-white mt-4 mb-6">
            Reserve Sua Estadia dos Sonhos
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
            Garanta agora sua reserva e desfrute de uma experiência inesquecível. 
            Condições especiais para reservas antecipadas.
          </p>
          <Link href="/reservar" className="btn-gold">
            Reservar Agora
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-ivory-100">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold-600 text-sm tracking-[0.3em] uppercase">Depoimentos</span>
            <h2 className="section-title mt-4 mb-6">
              O Que Nossos Hóspedes <span className="italic">Dizem</span>
            </h2>
            <div className="gold-line-center" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 shadow-card">
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-charcoal-600 italic leading-relaxed mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                    <span className="font-display text-gold-600 text-lg font-medium">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-charcoal-900">{testimonial.name}</p>
                    <p className="text-sm text-charcoal-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Preview */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold-600 text-sm tracking-[0.3em] uppercase">Contato</span>
              <h2 className="section-title mt-4 mb-6">
                Estamos Aqui Para <span className="italic">Você</span>
              </h2>
              <div className="gold-line mb-8" />
              <p className="text-charcoal-600 text-lg leading-relaxed mb-8">
                Tem alguma dúvida ou precisa de ajuda com sua reserva? Nossa equipe está 
                pronta para atendê-lo com toda atenção e carinho.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gold-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-500 uppercase tracking-wide">Telefone</p>
                    <a href="tel:+5511999999999" className="text-lg text-charcoal-900 hover:text-gold-600 transition-colors">
                      +55 (11) 99999-9999
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gold-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-500 uppercase tracking-wide">E-mail</p>
                    <a href="mailto:contato@villaserena.com" className="text-lg text-charcoal-900 hover:text-gold-600 transition-colors">
                      contato@villaserena.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gold-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-500 uppercase tracking-wide">Endereço</p>
                    <p className="text-lg text-charcoal-900">Rua das Palmeiras, 123 - Centro</p>
                  </div>
                </div>
              </div>
              
              <Link href="/contato" className="btn-primary mt-10 inline-flex">
                Entrar em Contato
              </Link>
            </div>

            {/* Map Placeholder */}
            <div className="relative h-96 lg:h-full min-h-[400px] bg-charcoal-100 rounded-sm overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975820694466!2d-46.65390768502216!3d-23.564981284681974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1635789456123!5m2!1spt-BR!2sbr"
                className="w-full h-full border-0 grayscale"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
