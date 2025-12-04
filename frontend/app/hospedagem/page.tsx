'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Hospedagem() {
  const [selectedCategory, setSelectedCategory] = useState('todas')

  const rooms = [
    {
      id: 1,
      name: 'Suíte Standard',
      category: 'standard',
      description: 'Conforto essencial em um ambiente acolhedor, perfeito para viajantes que buscam qualidade e praticidade.',
      longDescription: 'Nossa Suíte Standard oferece tudo que você precisa para uma estadia confortável. Com decoração elegante e mobiliário de qualidade, proporciona o descanso perfeito após um dia de passeios.',
      price: 280,
      size: '25m²',
      maxGuests: 2,
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070',
      gallery: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070',
        'https://images.unsplash.com/photo-1631049421450-348ccd7f8949?q=80&w=2070',
        'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=2070'
      ],
      amenities: ['Cama Queen Size', 'Ar Condicionado', 'TV 43"', 'Frigobar', 'Cofre Digital', 'Secador de Cabelo', 'Wi-Fi']
    },
    {
      id: 2,
      name: 'Suíte Superior',
      category: 'superior',
      description: 'Espaço amplo com varanda privativa e vista para o jardim, ideal para casais em busca de momentos especiais.',
      longDescription: 'A Suíte Superior foi projetada para quem deseja um pouco mais de conforto e exclusividade. Com varanda privativa e banheira de imersão, é o cenário perfeito para uma estadia romântica.',
      price: 420,
      size: '35m²',
      maxGuests: 2,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074',
      gallery: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=2074',
        'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?q=80&w=2070'
      ],
      amenities: ['Cama King Size', 'Varanda Privativa', 'Banheira de Imersão', 'Smart TV 55"', 'Minibar Premium', 'Roupão e Chinelos', 'Wi-Fi', 'Cafeteira Nespresso']
    },
    {
      id: 3,
      name: 'Suíte Master',
      category: 'master',
      description: 'O máximo em luxo e sofisticação, com sala de estar separada e vista panorâmica deslumbrante.',
      longDescription: 'Nossa Suíte Master representa o ápice do conforto e elegância. Com espaço generoso, jacuzzi privativa e vista panorâmica, oferece uma experiência verdadeiramente exclusiva.',
      price: 680,
      size: '50m²',
      maxGuests: 3,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070',
      gallery: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074'
      ],
      amenities: ['Cama King Size', 'Sala de Estar', 'Jacuzzi Privativa', 'Vista Panorâmica', 'Smart TV 65"', 'Home Office', 'Bar Privativo', 'Serviço de Mordomo']
    },
    {
      id: 4,
      name: 'Suíte Família',
      category: 'familia',
      description: 'Espaço aconchegante projetado para famílias, com acomodações para até 4 pessoas em total conforto.',
      longDescription: 'A Suíte Família foi pensada especialmente para proporcionar momentos inesquecíveis em família. Com dois ambientes e espaço para crianças, garante diversão e descanso para todos.',
      price: 550,
      size: '45m²',
      maxGuests: 4,
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074',
      gallery: [
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074',
        'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=2070',
        'https://images.unsplash.com/photo-1598928506311-c55ez7a00e3?q=80&w=2070'
      ],
      amenities: ['Cama King + 2 Camas Solteiro', 'Dois Ambientes', 'TV em Ambos Quartos', 'Minigeladeira', 'Berço Disponível', 'Kit Infantil', 'Wi-Fi', 'Área de Jogos']
    },
    {
      id: 5,
      name: 'Suíte Lua de Mel',
      category: 'romantica',
      description: 'Ambiente romântico com decoração especial, perfeito para celebrar o amor em grande estilo.',
      longDescription: 'Criada para os momentos mais especiais, a Suíte Lua de Mel oferece um ambiente único e romântico. Com pétalas de rosa, champanhe de boas-vindas e decoração intimista.',
      price: 750,
      size: '40m²',
      maxGuests: 2,
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070',
      gallery: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070'
      ],
      amenities: ['Cama King Size', 'Decoração Romântica', 'Champanhe de Boas-vindas', 'Banheira com Hidromassagem', 'Varanda Privativa', 'Café da Manhã no Quarto', 'Late Checkout', 'Velas Aromáticas']
    },
    {
      id: 6,
      name: 'Suíte Presidencial',
      category: 'master',
      description: 'Nossa acomodação mais exclusiva, com serviços premium e total privacidade.',
      longDescription: 'A Suíte Presidencial é o ponto máximo de sofisticação da Villa Serena. Com entrada privativa, dois andares e terraço exclusivo, oferece uma experiência verdadeiramente única.',
      price: 1200,
      size: '80m²',
      maxGuests: 4,
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070',
      gallery: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074'
      ],
      amenities: ['Dois Andares', 'Entrada Privativa', 'Terraço Exclusivo', 'Cozinha Gourmet', 'Home Cinema', 'Sauna Privativa', 'Mordomo 24h', 'Traslado Incluso']
    }
  ]

  const categories = [
    { id: 'todas', label: 'Todas' },
    { id: 'standard', label: 'Standard' },
    { id: 'superior', label: 'Superior' },
    { id: 'master', label: 'Master' },
    { id: 'familia', label: 'Família' },
    { id: 'romantica', label: 'Romântica' }
  ]

  const filteredRooms = selectedCategory === 'todas'
    ? rooms
    : rooms.filter(room => room.category === selectedCategory)

  const [selectedRoom, setSelectedRoom] = useState<typeof rooms[0] | null>(null)

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 min-h-[50vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070"
            alt="Nossas acomodações"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal-900/60" />
        </div>

        <div className="relative container-custom text-center">
          <span className="inline-block text-gold-400 text-sm tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in">
            Acomodações
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium text-white mb-6 opacity-0 animate-fade-in-up animate-delay-200">
            Nossas <span className="italic">Suítes</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto opacity-0 animate-fade-in-up animate-delay-300">
            Descubra o conforto e a elegância de nossas acomodações exclusivas
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-ivory-50 border-b border-charcoal-100">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 text-sm font-medium tracking-wide uppercase transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-charcoal-900 text-white'
                    : 'bg-white text-charcoal-700 border border-charcoal-200 hover:border-gold-500 hover:text-gold-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-24 bg-ivory-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="card-elegant group overflow-hidden cursor-pointer"
                onClick={() => setSelectedRoom(room)}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-gold-500 text-white text-xs uppercase tracking-wide mb-2">
                      {room.size} • Até {room.maxGuests} hóspedes
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-charcoal-900 mb-2">{room.name}</h3>
                  <p className="text-charcoal-500 text-sm mb-4 line-clamp-2">{room.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities.slice(0, 4).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-charcoal-600 bg-ivory-200 px-3 py-1"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 4 && (
                      <span className="text-xs text-gold-600 px-3 py-1">
                        +{room.amenities.length - 4} mais
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-charcoal-100">
                    <div>
                      <span className="text-sm text-charcoal-500">A partir de</span>
                      <span className="block font-display text-2xl text-gold-600">
                        R$ {room.price}
                        <span className="text-sm text-charcoal-400">/noite</span>
                      </span>
                    </div>
                    <button className="text-charcoal-900 text-sm font-medium hover:text-gold-600 transition-colors duration-300 flex items-center gap-2">
                      Ver Detalhes
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Modal */}
      {selectedRoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-sm"
          onClick={() => setSelectedRoom(null)}
        >
          <div
            className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-72 md:h-96">
              <img
                src={selectedRoom.image}
                alt={selectedRoom.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedRoom(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
              >
                <svg className="w-5 h-5 text-charcoal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-charcoal-900/80 to-transparent">
                <h2 className="font-display text-3xl md:text-4xl text-white">{selectedRoom.name}</h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Quick Info */}
              <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-charcoal-100">
                <div className="flex items-center gap-2 text-charcoal-600">
                  <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span>{selectedRoom.size}</span>
                </div>
                <div className="flex items-center gap-2 text-charcoal-600">
                  <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Até {selectedRoom.maxGuests} hóspedes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl text-gold-600">R$ {selectedRoom.price}</span>
                  <span className="text-charcoal-400">/noite</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-display text-xl text-charcoal-900 mb-4">Sobre esta suíte</h3>
                <p className="text-charcoal-600 leading-relaxed">{selectedRoom.longDescription}</p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h3 className="font-display text-xl text-charcoal-900 mb-4">Comodidades</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedRoom.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-charcoal-600"
                    >
                      <svg className="w-4 h-4 text-gold-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div className="mb-8">
                <h3 className="font-display text-xl text-charcoal-900 mb-4">Galeria</h3>
                <div className="grid grid-cols-3 gap-4">
                  {selectedRoom.gallery.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${selectedRoom.name} - Foto ${idx + 1}`}
                      className="w-full h-24 md:h-32 object-cover rounded-sm"
                    />
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <Link href="/reservar" className="btn-gold flex-1 text-center">
                  Reservar Esta Suíte
                </Link>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="btn-secondary"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold-600 text-sm tracking-[0.3em] uppercase">Serviços Inclusos</span>
              <h2 className="section-title mt-4 mb-6">
                Muito Além da <span className="italic">Hospedagem</span>
              </h2>
              <div className="gold-line mb-8" />
              <p className="text-charcoal-600 text-lg leading-relaxed mb-8">
                Todas as nossas suítes incluem uma gama completa de serviços pensados para 
                tornar sua estadia ainda mais especial e confortável.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: '☕', title: 'Café da Manhã', desc: 'Buffet completo incluso' },
                  { icon: '📶', title: 'Wi-Fi Premium', desc: 'Alta velocidade em todo espaço' },
                  { icon: '🅿️', title: 'Estacionamento', desc: 'Gratuito e seguro' },
                  { icon: '🛎️', title: 'Concierge', desc: 'Atendimento 24 horas' },
                  { icon: '🧹', title: 'Arrumação', desc: 'Limpeza diária do quarto' },
                  { icon: '🏊', title: 'Área de Lazer', desc: 'Piscina e jardins' }
                ].map((service, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <h4 className="font-medium text-charcoal-900">{service.title}</h4>
                      <p className="text-sm text-charcoal-500">{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070"
                alt="Serviços premium"
                className="w-full h-[500px] object-cover rounded-sm shadow-elegant"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-charcoal-900">
        <div className="container-custom text-center">
          <span className="text-gold-400 text-sm tracking-[0.3em] uppercase">Reserve Agora</span>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-white mt-4 mb-6">
            Encontre Sua Suíte Perfeita
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Não deixe para depois. Reserve agora e garanta a melhor experiência de hospedagem.
          </p>
          <Link href="/reservar" className="btn-gold">
            Fazer Reserva
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
