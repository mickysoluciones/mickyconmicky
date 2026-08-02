"use client";

import { useState, useRef, useEffect } from "react";

// 1. LISTA DE 23 MOMENTOS (PUEBLITOS MÁGICOS Y VIAJES)
const MOMENTOS_VIAJES = [
  { id: 1, texto: "Tulum 🌊 ", foto: "foto1.jpg" },
  { id: 2, texto: "Real del Monte 🏔️", foto: "foto2.jpg" },
  { id: 3, texto: "Zacatecas ⛪", foto: "foto3.jpg" },
  { id: 4, texto: "Taxco 💎", foto: "foto4.jpg" },
  { id: 5, texto: "San Mike 🌺", foto: "foto5.jpg" },
  { id: 6, texto: "Acapulco 🌊", foto: "foto6.jpg" },
  { id: 7, texto: "Bacalar ⛵", foto: "foto7.jpg" },
  { id: 8, texto: "Mahahual 🌴", foto: "foto8.jpg" },
  { id: 9, texto: "Progreso 🌅", foto: "foto9.jpg" },
  { id: 10, texto: "Tepoztlan ✨", foto: "foto10.jpg" },
  { id: 11, texto: "Tlaxcala 🍂", foto: "foto11.jpg" },
  { id: 12, texto: "Cuernavaca ☀️", foto: "foto12.jpg" },
  { id: 13, texto: "María Desatadora de Nudos 🙏", foto: "foto13.jpg" },
  { id: 14, texto: "Isla Mujeres 🏖️", foto: "foto14.jpg" },
  { id: 15, texto: "Cancún 🌊", foto: "foto15.jpg" },
  { id: 16, texto: "Cozumel 🐠", foto: "foto16.jpg" },
  { id: 17, texto: "Teotihuacán 🔺", foto: "foto17.jpg" },
  { id: 18, texto: "Costa Mujeres 🥂", foto: "foto18.jpg" },
  { id: 19, texto: "Toluca ❄️", foto: "foto19.jpg" },
  { id: 20, texto: "Zacatlán 🍏", foto: "foto20.jpg" },
  { id: 21, texto: "Cascadas 🏺", foto: "foto21.jpg" },
  { id: 22, texto: "Chautla 🏰", foto: "foto22.jpg" },
  { id: 23, texto: "Valle de Bravo ⛵", foto: "foto23.jpg" }
];

// 2. LISTA DE 30 FOTOS PARA LA SECCIÓN DE CDMX
const MOMENTOS_CDMX = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  texto: "CDMX ",
  foto: `cdmx${i + 1}.jpg`
}));

// 3. SECCIÓN ESPECIAL: NUESTROS PASOS (6 Hitos Importantes)
const HITOS_ESPECIALES = [
  { id: 1, texto: "El día que nos conocimos 🏛️", foto: "hito1.jpg" },
  { id: 2, texto: "El día que nos hicimos novios 🤍", foto: "hito2.jpg" },
  { id: 3, texto: "El día que nos comprometimos 💍", foto: "hito3.jpg" },
  { id: 4, texto: "Entrega del terrenito 🪵", foto: "hito4.jpg" },
  { id: 5, texto: "Entrega del departamentito 🔑", foto: "hito5.jpg" },
  { id: 6, texto: "Y todos los que nos faltan... ♾️", foto: "hito6.jpg" }
];

// 4. CANCIONES BASE (SIN LA CANCIÓN "PERDÓN")
const CANCIONES_BASE = [
  { id: "momento-perfecto", titulo: "El Momento Perfecto", artista: "MICKY", archivo: "/audio/el-momento-perfecto.mp3", cover: "/images/cover-momento.jpg" },
  { id: "quiero", titulo: "Quiero", artista: "MICKY", archivo: "/audio/quiero.mp3", cover: "/images/cover-quiero.jpg" }
];

export default function Home() {
  const [fase, setFase] = useState("inicio"); 
  const [cancionSeleccionada, setCancionSeleccionada] = useState<typeof CANCIONES_BASE[0] | null>(null);
  const [reproductorExpandido, setReproductorExpandido] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  // FUNCIÓN RETORNADA A WHATSAPP (CALLMEBOT)
  const notificarWhatsApp = async (mensaje: string) => {
    try {
      const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
      const apiKey = process.env.NEXT_PUBLIC_WHATSAPP_API_KEY;
      if (!phone || !apiKey) return;

      const textoFormateado = encodeURIComponent(`[mickyconmicky]: ${mensaje}`);
      
      // Llamada directa al bot de WhatsApp (asíncrona y silenciosa)
      fetch(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${textoFormateado}&apikey=${apiKey}`, {
        mode: 'no-cors'
      });
    } catch (e) {
      console.error("Error enviando notificación", e);
    }
  };

  // CONTROL DE TIEMPOS DINÁMICO
  const [frasesVisibles, setFrasesVisibles] = useState(0);
  useEffect(() => {
    if (fase === "inicio") {
      const temporizadores = [
        setTimeout(() => setFrasesVisibles(1), 150),
        setTimeout(() => setFrasesVisibles(2), 1100),
        setTimeout(() => setFrasesVisibles(3), 2050),
        setTimeout(() => setFrasesVisibles(4), 3000),
      ];

      return () => temporizadores.forEach(clearTimeout);
    }
  }, [fase]);

  useEffect(() => {
    if (cancionSeleccionada && audioRef.current) {
      setIsPlaying(false);
      audioRef.current.pause();
      audioRef.current.load();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  }, [cancionSeleccionada]);

  const regresarFase = () => {
    if (fase === "q_musica") {
      if (reproductorExpandido) {
        setReproductorExpandido(false);
      } else {
        setFrasesVisibles(0);
        setFase("inicio");
      }
    } else if (fase === "pregunta_nueva") {
      setFase("q_musica");
      setReproductorExpandido(true);
    } else if (fase === "pueblitos_magicos") {
      setFase("pregunta_nueva");
    } else if (fase === "nuestros_pasos") {
      setFase("pueblitos_magicos");
    } else if (fase === "q_huye") {
      setFase("nuestros_pasos");
    }
  };

  const cambiarCancion = (direccion: "siguiente" | "anterior") => {
    const currentIndex = CANCIONES_BASE.findIndex((c) => c.id === cancionSeleccionada?.id);
    let nextIndex = currentIndex;
    if (direccion === "siguiente") {
      nextIndex = (currentIndex + 1) % CANCIONES_BASE.length;
    } else {
      nextIndex = (currentIndex - 1 + CANCIONES_BASE.length) % CANCIONES_BASE.length;
    }
    setCancionSeleccionada(CANCIONES_BASE[nextIndex]);
    notificarWhatsApp(`Cambió de canción a: ${CANCIONES_BASE[nextIndex].titulo} 🎵`);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      notificarWhatsApp(`Le dio Play / Reanudó la música ▶️`);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <main className="app-container" style={{ margin: "0 auto" }}>
      {cancionSeleccionada && (
        <audio
          ref={audioRef}
          src={cancionSeleccionada.archivo}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={() => cambiarCancion("siguiente")}
        />
      )}

      {/* FASE 1: BIENVENIDA */}
      {fase === "inicio" && (
        <div className="card-pantalla card-inicio-premium">
          <div className="inicio-sello" aria-hidden="true">
            <span>Para Micky</span>
            <span className="inicio-sello-corazon">♥</span>
          </div>
          <div className="inicio-divisor" aria-hidden="true">
            <span />
            <span>♥</span>
            <span />
          </div>

          <div className="carta-introduccion">
            <p className={`frase-css f-1 ${frasesVisibles >= 1 ? "visible" : ""}`}>
              No verte todos los días ha sido difícil, pero sentirte lejos de mi vida ha sido mucho más doloroso.
            </p>

            <p className={`frase-css f-2 ${frasesVisibles >= 2 ? "visible" : ""}`}>
              Te extraño en las cosas pequeñas, en nuestras conversaciones, en tu sonrisa y en todo lo que hacía especial mis días sin que yo me diera cuenta.
            </p>

            <p className={`frase-css f-3 ${frasesVisibles >= 3 ? "visible" : ""}`}>
              Si pudiera regalarte algo, te regalaría mis ojos, para que pudieras verte como yo te veo: única, hermosa y capaz de hacer que cualquier lugar se sienta como hogar.
            </p>

            <p className={`frase-css f-4 frase-destacada-inicio ${frasesVisibles >= 4 ? "visible" : ""}`}>
              Hice este espacio para mostrarte un poquito de todo lo que veo cuando pienso en ti y recordarte cuánto significas para mí.
            </p>

            <div className={`inicio-cierre ${frasesVisibles >= 4 ? "visible" : ""}`}>
              <div className="firma-inicio">
                <span>Con amor,</span>
                <strong>Carlitos</strong>
              </div>
              <button
                className="btn-principal btn-inicio"
                onClick={() => {
                  setFase("q_musica");
                  notificarWhatsApp("¡Abrió la carta y comenzó a recorrer sus recuerdos! 💌");
                }}
              >
                Abrir nuestros recuerdos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FASE 2: SELECCIÓN DE MÚSICA */}
      {fase === "q_musica" && !reproductorExpandido && (
        <div className="card-pantalla fade-in" style={{ position: "relative" }}>
          <button className="btn-regresar" onClick={regresarFase}>← Volver</button>
          <h2>Ponle música a nuestro viaje 🎧</h2>
          <p className="pregunta-texto">Escoge la canción que nos acompañará en este viaje</p>
          <div className="opciones-lista">
            {CANCIONES_BASE.map((cancion) => (
              <button key={cancion.id} className="btn-opcion btn-cancion-selector" onClick={() => { setCancionSeleccionada(cancion); setReproductorExpandido(true); notificarWhatsApp(`Seleccionó la canción: ${cancion.titulo} 🎵`); }}>
                <div className="spotify-selector-icon">
                  <svg viewBox="0 0 24 24" fill="#1DB954" width="22" height="22">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.564.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.075-.336.135-.668.47-.743 3.856-.88 7.15-.509 9.822 1.13.296.178.387.563.206.858zm1.224-2.723c-.226.367-.706.487-1.074.26-2.72-1.672-6.87-2.157-10.08-1.182-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.676-1.114 8.243-.573 11.347 1.336.368.226.487.706.26 1.074zm.104-2.825C14.392 8.76 8.442 8.563 5.005 9.606c-.53.16-1.09-.14-1.25-.67-.16-.53.14-1.09.67-1.25 3.963-1.202 10.556-.975 14.61 1.433.477.283.632.9.348 1.377-.283.478-.9.632-1.377.348z"/>
                  </svg>
                </div>
                <div className="texto-cancion-btn">
                  <strong>{cancion.titulo}</strong>
                  <span>{cancion.artista}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* REPRODUCTOR EXPANDIDO */}
      {fase === "q_musica" && reproductorExpandido && cancionSeleccionada && (
        <div className="card-pantalla fade-in premium-player-card" style={{ position: "relative" }}>
          <button className="btn-regresar" onClick={regresarFase}>← Elegir otra canción</button>
          <h2>Sonando ahora</h2>
          <div className="player-big-cover-box">
            <img src={cancionSeleccionada.cover} alt={`Portada de ${cancionSeleccionada.titulo}`} className="player-big-cover" />
          </div>
          <div className="player-track-details">
            <h3 className="player-big-title">{cancionSeleccionada.titulo}</h3>
            <p className="player-big-artist">{cancionSeleccionada.artista}</p>
          </div>
          <div className="expanded-spotify-block">
            <div className="expanded-player-controls">
              <button className="btn-player-skip" onClick={() => cambiarCancion("anterior")} aria-label="Canción anterior">
                <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
              </button>
              <button className="spotify-play-btn big-play-btn" onClick={togglePlay} aria-label={isPlaying ? "Pausar canción" : "Reproducir canción"}>
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path fillRule="evenodd" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" clipRule="evenodd" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
              <button className="btn-player-skip" onClick={() => cambiarCancion("siguiente")} aria-label="Siguiente canción">
                <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19"><path d="M6 18l8.5-6L6 6zm9-12h2v12h-2z" /></svg>
              </button>
            </div>
            <div className="spotify-progress-container large-progress-wrapper">
              <input type="range" className="spotify-progress-bar" min="0" max={duration || 0} value={currentTime} onChange={handleProgressChange} />
              <div className="time-labels-row"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
            </div>
          </div>
          <div className="opciones-lista" style={{ marginTop: "30px" }}>
            <button className="btn-principal" onClick={() => { setReproductorExpandido(false); setFase("pregunta_nueva"); notificarWhatsApp("Entró a la sección de CDMX 🏙️"); }}>Que comience el viaje</button>
          </div>
        </div>
      )}

      {/* FASE 3: CDMX */}
      {fase === "pregunta_nueva" && (
        <div className="card-pantalla card-feed-polaroids fade-in" style={{ position: "relative" }}>
          <button className="btn-regresar" style={{ zIndex: 10 }} onClick={regresarFase}>← Volver</button>
          <div className="feed-header">
            <h2>CDMX</h2>
            <p className="pregunta-texto">La ciudad que nos encontro</p>
          </div>
          
          <div className="contenedor-scroll-polaroids">
            {MOMENTOS_CDMX.map((momento, index) => {
              const seed = Math.sin(index + 5) * 10000; 
              const anguloAleatorio = (seed - Math.floor(seed)) * 8 - 4; 

              return (
                <div key={momento.id} className="polaroid-física" style={{ "--angulo-random": `${anguloAleatorio}deg` } as React.CSSProperties}>
                  <div className="masking-tape"></div>
                  <img src={`/images/${momento.foto}`} alt={momento.texto} onError={(e) => { (e.target as HTMLImageElement).src = "/images/portada.jpg"; }} />
                  <div className="polaroid-caption">{momento.texto}</div>
                </div>
              );
            })}

            <div className="feed-actions-scroll-natural">
              <button className="btn-principal" onClick={() => { setFase("pueblitos_magicos"); notificarWhatsApp("Entró a la sección de Pueblitos Mágicos 🏔️"); }}>
                Sigamos viajando
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FASE 4: PUEBLITOS MÁGICOS */}
      {fase === "pueblitos_magicos" && (
        <div className="card-pantalla card-feed-polaroids fade-in" style={{ position: "relative" }}>
          <button className="btn-regresar" style={{ zIndex: 10 }} onClick={regresarFase}>← Volver</button>
          <div className="feed-header">
            <h2>Pueblitos Mágicos</h2>
            <p className="pregunta-texto">Los lugares que guardan un pedacito de nuestra historia</p>
          </div>
          
          <div className="contenedor-scroll-polaroids">
            {MOMENTOS_VIAJES.map((momento, index) => {
              const seed = Math.sin(index + 1) * 10000;
              const anguloAleatorio = (seed - Math.floor(seed)) * 8 - 4; 

              return (
                <div key={momento.id} className="polaroid-física" style={{ "--angulo-random": `${anguloAleatorio}deg` } as React.CSSProperties}>
                  <div className="masking-tape"></div>
                  <img src={`/images/${momento.foto}`} alt={momento.texto} onError={(e) => { (e.target as HTMLImageElement).src = "/images/portada.jpg"; }} />
                  <div className="polaroid-caption">{momento.texto}</div>
                </div>
              );
            })}

            <div className="feed-actions-scroll-natural">
              <button className="btn-principal" onClick={() => { setFase("nuestros_pasos"); notificarWhatsApp("Entró a la sección de Momentos clave 💍🔑"); }}>
                Los momentos que cambiaron nuestra vida
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FASE 5: NUESTROS PASOS */}
      {fase === "nuestros_pasos" && (
        <div className="card-pantalla card-feed-polaroids fade-in" style={{ position: "relative" }}>
          <button className="btn-regresar" style={{ zIndex: 10 }} onClick={regresarFase}>← Volver</button>
          <div className="feed-header">
            <h2>Momentos</h2>
            <p className="pregunta-texto">Cada uno de estos momentos escribió una parte de nuestra historia</p>
          </div>
          
          <div className="contenedor-scroll-polaroids">
            {HITOS_ESPECIALES.map((momento, index) => {
              const seed = Math.sin(index + 9) * 10000; 
              const anguloAleatorio = (seed - Math.floor(seed)) * 6 - 3; 

              return (
                <div key={momento.id} className="polaroid-física" style={{ "--angulo-random": `${anguloAleatorio}deg` } as React.CSSProperties}>
                  <div className="masking-tape"></div>
                  <img src={`/images/${momento.foto}`} alt={momento.texto} onError={(e) => { (e.target as HTMLImageElement).src = "/images/portada.jpg"; }} />
                  <div className="polaroid-caption" style={{ fontWeight: "600" }}>{momento.texto}</div>
                </div>
              );
            })}

            <div className="feed-actions-scroll-natural">
              <button className="btn-principal" onClick={() => { setFase("q_huye"); notificarWhatsApp("¡Ha llegado a la carta final sincera! 🤍✨"); }}>
                Nuestro siguiente capítulo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FASE 6: MENSAJE FINAL SINCERO */}
      {fase === "q_huye" && (
        <div className="card-pantalla card-cierre-propuesta fade-in">
          <button className="btn-regresar" onClick={regresarFase}>← Volver</button>
          
          <h2 style={{ marginBottom: "20px" }}>Micky... 🤍</h2>
          
          <div className="pareja-fotos-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", marginTop: "10px", marginBottom: "25px" }}>
            <div className="pareja-foto-wrapper polaroid-mini-style" style={{ width: "110px", padding: "6px", background: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.15)", borderRadius: "2px" }}>
              <img src="/images/micky_perfil.jpg" alt="Micky" style={{ width: "100%", height: "110px", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).src = "/images/portada.jpg"; }} />
            </div>
            <div className="pareja-simbolo-mas" style={{ fontSize: "1.8rem", fontWeight: "300", color: "#a1887f" }}>+</div>
            <div className="pareja-foto-wrapper polaroid-mini-style" style={{ width: "110px", padding: "6px", background: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.15)", borderRadius: "2px" }}>
              <img src="/images/carlos_perfil.jpg" alt="Carlos" style={{ width: "100%", height: "110px", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).src = "/images/portada.jpg"; }} />
            </div>
          </div>

          <div className="carta-introduccion carta-cierre-propuesta">
            <p>
              Todo lo que viste aquí forma parte de la historia que hemos construido: los lugares, las canciones, los momentos y cada paso que nos ha traído hasta aquí.
            </p>

            <p>
              Aprendí que amar también significa cuidar, escuchar, aprender y estar presente. No quiero prometerte una vida perfecta, pero sí quiero prometerte lo siguiente: elegirte cada día, cuidarte todos los días y construir un hogar donde ambos podamos sentirnos amados y seguros.
            </p>

            <p>
              Cuando pienso en mi futuro, no imagino solamente grandes momentos. Pienso en las pláticas de todos los días, en nuevas aventuras, en superar juntos los días difíciles y en seguir encontrando hogar el uno en el otro.
            </p>

            <p>
              Hice este espacio para enseñarte lo mucho que significas para mí, pero hay algo que no quiero preguntarte detrás de una pantalla.
            </p>

            <div className="cierre-voltea">
              <span>Cuando termines de leer, voltea.</span>
              <strong>Tengo algo muy importante que preguntarte.</strong>
            </div>
          </div>
        </div>
      )}

      {/* REPRODUCTOR LINEAL */}
      {cancionSeleccionada && !reproductorExpandido && fase !== "inicio" && (
        <div className="spotify-player-lineal">
          <img src={cancionSeleccionada.cover} alt="Cover" className="player-lineal-cover" />
          <div className="player-lineal-text">
            <div className="player-lineal-title">{cancionSeleccionada.titulo}</div>
            <div className="player-lineal-artist">{cancionSeleccionada.artista}</div>
          </div>
          <div className="player-lineal-controls">
            <button className="btn-multimedia-circular btn-nav-izq" onClick={() => cambiarCancion("anterior")}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
            </button>
            <button className="btn-multimedia-circular btn-play-centro" onClick={togglePlay}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path fillRule="evenodd" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" clipRule="evenodd" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <button className="btn-multimedia-circular btn-nav-der" onClick={() => cambiarCancion("siguiente")}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M6 18l8.5-6L6 6zm9-12h2v12h-2z"/></svg>
            </button>
          </div>
          <div className="player-lineal-progress-box">
            <div className="lineal-time-labels">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input type="range" className="lineal-progress-bar" min="0" max={duration || 0} value={currentTime} onChange={handleProgressChange} />
          </div>
        </div>
      )}
    </main>
  );
}
