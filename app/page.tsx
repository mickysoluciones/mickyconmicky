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

// 3. SECCIÓN ESPECIAL: NUESTROS PASOS ACTUALIZADA (6 Hitos Importantes)
const HITOS_ESPECIALES = [
  { id: 1, texto: "El día que nos conocimos 🏛️", foto: "hito1.jpg" },
  { id: 2, texto: "El día que nos hicimos novios 🤍", foto: "hito2.jpg" },
  { id: 3, texto: "El día que nos comprometimos 💍", foto: "hito3.jpg" }, // <-- ¡Agregado aquí!
  { id: 4, texto: "Entrega del terrenito 🪵", foto: "hito4.jpg" },
  { id: 5, texto: "Entrega del departamentito 🔑", foto: "hito5.jpg" },
  { id: 6, texto: "Y todos los que nos faltan... ♾️", foto: "hito6.jpg" }
];

// 4. CANCIONES BASE
const CANCIONES_BASE = [
  { id: "perdon", titulo: "Perdón", artista: "MICKY", archivo: "/audio/perdon.mp3", cover: "/images/cover-perdon.jpg" },
  { id: "momento-perfecto", titulo: "El Momento Perfecto", artista: "MICKY", archivo: "/audio/el-momento-perfecto.mp3", cover: "/images/cover-momento.jpg" },
  { id: "quiero", titulo: "Quiero", artista: "MICKY", archivo: "/audio/quiero.mp3", cover: "/images/cover-quiero.jpg" }
];

export default function Home() {
  const [fase, setFase] = useState("inicio"); 
  const [noBtnPos, setNoBtnPos] = useState({ top: "0px", left: "0px" });
  const [noBtnAbsolute, setNoBtnAbsolute] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  // Estados de Música
  const [cancionSeleccionada, setCancionSeleccionada] = useState<typeof CANCIONES_BASE[0] | null>(null);
  const [reproductorExpandido, setReproductorExpandido] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Cascada de texto inicial
  const [frasesVisibles, setFrasesVisibles] = useState(0);
  useEffect(() => {
    if (fase === "inicio") {
      setTimeout(() => setFrasesVisibles(1), 400);
      setTimeout(() => setFrasesVisibles(2), 2600);
      setTimeout(() => setFrasesVisibles(3), 5200);
      setTimeout(() => setFrasesVisibles(4), 8000);
      setTimeout(() => setFrasesVisibles(5), 9800);
      setTimeout(() => setFrasesVisibles(6), 1300);
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

  const cambiarCancion = (direccion: "siguiente" | "anterior") => {
    const currentIndex = CANCIONES_BASE.findIndex((c) => c.id === cancionSeleccionada?.id);
    let nextIndex = currentIndex;
    if (direccion === "siguiente") {
      nextIndex = (currentIndex + 1) % CANCIONES_BASE.length;
    } else {
      nextIndex = (currentIndex - 1 + CANCIONES_BASE.length) % CANCIONES_BASE.length;
    }
    setCancionSeleccionada(CANCIONES_BASE[nextIndex]);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
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

  const moverBotonNo = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    setNoBtnAbsolute(true);
    const rangoX = 110; 
    const rangoY = 70;
    const randomX = (Math.random() - 0.5) * 2 * rangoX;
    const randomY = (Math.random() - 0.5) * 2 * rangoY;
    setNoBtnPos({ top: `${randomY}px`, left: `${randomX}px` });
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

      {/* FASE 1: BIENVENIDA CON TU TEXTO ACTUALIZADO */}
      {fase === "inicio" && (
        <div className="card-pantalla card-inicio-premium">
          <span className="emoji-header animate-heart">❤️</span>
          <h1 className="saludo-inicio">Hola, Micky</h1>
          
          <div className="carta-introduccion">
            <p className="bloque-oraciones">
              <span className="frase-css f-1">Sé que te lastimé, Micky, y que sanar toma tiempo.</span>
            </p>
            <p className="bloque-oraciones">
              <span className="frase-css f-2">Pero más de 8 años de historia no se borran.</span>
            </p>
            <p className="bloque-oraciones">
              <span className="frase-css f-3">Diseñé este espacio para nosotros: </span>
              <span className="frase-css f-4">para recordar quiénes somos, cuidar de lo que tenemos </span>
              <span className="frase-css f-5 destacada-frase">y volver a construir el futuro que siempre soñamos.</span>
            </p>
          </div>

          <div className="bloque-firma-accion">
            <div className="firma-remitente">Con amor, Carlitos</div>
            <button className="btn-principal" onClick={() => setFase("q_musica")}>Comenzar</button>
          </div>
        </div>
      )}

      {/* FASE 2: SELECCIÓN DE MÚSICA (CON LOGO DE SPOTIFY ALINEADO) */}
      {fase === "q_musica" && !reproductorExpandido && (
        <div className="card-pantalla fade-in">
          <h2>Ponle música a nuestro viaje 🎧</h2>
          <p className="pregunta-texto">Escoge la canción que nos acompañará en este viaje</p>
          <div className="opciones-lista">
            {CANCIONES_BASE.map((cancion) => (
              <button key={cancion.id} className="btn-opcion btn-cancion-selector" onClick={() => { setCancionSeleccionada(cancion); setReproductorExpandido(true); }}>
                {/* Logo de Spotify SVG alineado de forma fija */}
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
        <div className="card-pantalla fade-in premium-player-card">
          <h2>Sonando ahora... 🎵</h2>
          <div className="player-big-cover-box"><img src={cancionSeleccionada.cover} alt="Cover" className="player-big-cover" /></div>
          <div className="player-track-details">
            <h3 className="player-big-title">{cancionSeleccionada.titulo}</h3>
            <p className="player-big-artist">{cancionSeleccionada.artista}</p>
          </div>
          <div className="expanded-spotify-block">
            <div className="expanded-single-control">
              <button className="spotify-play-btn big-play-btn" onClick={togglePlay}>
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path fillRule="evenodd" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" clipRule="evenodd" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
            </div>
            <div className="spotify-progress-container large-progress-wrapper">
              <input type="range" className="spotify-progress-bar" min="0" max={duration || 0} value={currentTime} onChange={handleProgressChange} />
              <div className="time-labels-row"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
            </div>
          </div>
          <div className="opciones-lista" style={{ marginTop: "30px" }}>
            <button className="btn-principal" onClick={() => { setReproductorExpandido(false); setFase("pueblitos_magicos"); }}>Primer Parada</button>
            <button className="btn-opcion" style={{ textAlign: "center" }} onClick={() => setReproductorExpandido(false)}>Cambiar de canción</button>
          </div>
        </div>
      )}

      {/* FASE 3: PUEBLITOS MÁGICOS (FEED DE 23 POLAROIDS) */}
      {fase === "pueblitos_magicos" && (
        <div className="card-pantalla card-feed-polaroids fade-in">
          <div className="feed-header">
            <h2>Pueblitos Mágicos</h2>
            <p className="pregunta-texto">Un recordatorio de todos los lugares que hemos visitado y los que nos faltan por conocer</p>
          </div>
          
          <div className="contenedor-scroll-polaroids">
            {MOMENTOS_VIAJES.map((momento, index) => {
              const seed = Math.sin(index + 1) * 10000;
              const anguloAleatorio = (seed - Math.floor(seed)) * 8 - 4; 

              return (
                <div 
                  key={momento.id} 
                  className="polaroid-física"
                  style={{ "--angulo-random": `${anguloAleatorio}deg` } as React.CSSProperties}
                >
                  <div className="masking-tape"></div>
                  <img 
                    src={`/images/${momento.foto}`} 
                    alt={momento.texto} 
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/portada.jpg"; }} 
                  />
                  <div className="polaroid-caption">{momento.texto}</div>
                </div>
              );
            })}

            <div className="feed-actions-scroll-natural">
              <button className="btn-principal" onClick={() => setFase("pregunta_nueva")}>
                Siguiente Parada
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FASE 4: CDMX (FEED DE 30 POLAROIDS) */}
      {fase === "pregunta_nueva" && (
        <div className="card-pantalla card-feed-polaroids fade-in">
          <div className="feed-header">
            <h2>CDMX</h2>
            <p className="pregunta-texto">La ciudad que nos encontro</p>
          </div>
          
          <div className="contenedor-scroll-polaroids">
            {MOMENTOS_CDMX.map((momento, index) => {
              const seed = Math.sin(index + 5) * 10000; 
              const anguloAleatorio = (seed - Math.floor(seed)) * 8 - 4; 

              return (
                <div 
                  key={momento.id} 
                  className="polaroid-física"
                  style={{ "--angulo-random": `${anguloAleatorio}deg` } as React.CSSProperties}
                >
                  <div className="masking-tape"></div>
                  <img 
                    src={`/images/${momento.foto}`} 
                    alt={momento.texto} 
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/portada.jpg"; }} 
                  />
                  <div className="polaroid-caption">{momento.texto}</div>
                </div>
              );
            })}

            <div className="feed-actions-scroll-natural">
              <button className="btn-principal" onClick={() => setFase("nuestros_pasos")}>
                Ultima Parada
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FASE 5: NUESTROS PASOS (FEED DE 6 POLAROIDS CON EL COMPROMISO ACTUALIZADO) */}
      {fase === "nuestros_pasos" && (
        <div className="card-pantalla card-feed-polaroids fade-in">
          <div className="feed-header">
            <h2>Momentos</h2>
            <p className="pregunta-texto">Por ultimo quiero mostrate los momentos que considero han sido de suma importancia y son la promesa de todo lo que vendrá:</p>
          </div>
          
          <div className="contenedor-scroll-polaroids">
            {HITOS_ESPECIALES.map((momento, index) => {
              const seed = Math.sin(index + 9) * 10000; 
              const anguloAleatorio = (seed - Math.floor(seed)) * 6 - 3; 

              return (
                <div 
                  key={momento.id} 
                  className="polaroid-física"
                  style={{ "--angulo-random": `${anguloAleatorio}deg` } as React.CSSProperties}
                >
                  <div className="masking-tape"></div>
                  <img 
                    src={`/images/${momento.foto}`} 
                    alt={momento.texto} 
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/portada.jpg"; }} 
                  />
                  <div className="polaroid-caption" style={{ fontWeight: "600" }}>{momento.texto}</div>
                </div>
              );
            })}

            <div className="feed-actions-scroll-natural">
              <button className="btn-principal" onClick={() => setFase("q_huye")}>
                Mirar al futuro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FASE 6: EL BOTÓN QUE HUYE CON TU TEXTO PERSONALIZADO */}
      {fase === "q_huye" && (
        <div className="card-pantalla fade-in" style={{ paddingBottom: "110px", maxWidth: "420px" }}>
          <h2>Micky... 🤍</h2>
          <p className="pregunta-texto" style={{ textAlign: "left", lineHeight: "1.6", fontSize: "1.05rem" }}>
            Me tomó este tiempo de distancia entender el daño que te estaba haciendo. No quiero ofrecerte el mismo pasado, 
            quiero ofrecerte un presente distinto y un futuro que no te deje dudas, donde mis ganas de construir una vida 
            y un hogar contigo siguen intactas. 
            <br /><br />
            Si la vida nos vuelve a poner de frente y el amor sigue intacto... 
            <br /><br />
            <strong>¿Te gustaría que empecemos de nuevo, a nuestra manera, y sigamos escribiendo este libro llamado Micky con Micky Foeva?</strong>
          </p>
          
          <div className="contenedor-botones-huye" style={{ marginTop: "30px" }}>
            <button className="btn-si" onClick={() => setFase("invitacion")}>
              Sí, empecemos de nuevo ❤️
            </button>
            <button 
              className="btn-no" 
              style={noBtnAbsolute ? { position: "relative", transform: `translate(${noBtnPos.left}, ${noBtnPos.top})`, transition: "all 0.15s ease-out" } : {}} 
              onMouseEnter={moverBotonNo} 
              onTouchStart={moverBotonNo}
            >
              Vemos
            </button>
          </div>
        </div>
      )}

     {/* FASE FINAL: SECCIÓN DE CIERRE ULTRA MINIMALISTA */}
      {fase === "invitacion" && (
        <div className="card-pantalla boda-template fade-in" style={{ maxWidth: "420px" }}>
          <div className="boda-marco">
            <span className="boda-badge">NUESTRO PRESENTE</span>
            {/* TÍTULO EN CURSIVA Y SIN CORAZÓN */}
            <h1 className="boda-titulo-cursivo">Sigamos construyendo</h1>

            {/* CONTENEDOR DE FOTOS INDIVIDUALES CON EL SÍMBOLO DE MÁS */}
            <div className="pareja-fotos-container" style={{ marginTop: "25px" }}>
              <div className="pareja-foto-wrapper polaroid-mini-style">
                <img src="/images/micky_perfil.jpg" alt="Micky" onError={(e) => { (e.target as HTMLImageElement).src = "/images/portada.jpg"; }} />
              </div>
              <div className="pareja-simbolo-mas">+</div>
              <div className="pareja-foto-wrapper polaroid-mini-style">
                <img src="/images/carlos_perfil.jpg" alt="Carlos" onError={(e) => { (e.target as HTMLImageElement).src = "/images/portada.jpg"; }} />
              </div>
            </div>

            <div className="boda-detalles">
              <p className="boda-invitacion-estilizada">
                Estás cordialmente invitada a nuestro felices por siempre.
              </p>
              <p className="boda-lugar">Lugar: Nuestro rincón favorito del mundo.</p>
              
              <div className="selector-fecha-box">
                <label htmlFor="fecha-pacto">Falta lo más importante, escoge la fecha:</label>
                <input 
                  type="date" 
                  id="fecha-pacto"
                  className="input-fecha" 
                  value={fechaSeleccionada} 
                  onChange={(e) => setFechaSeleccionada(e.target.value)} 
                />
              </div>
              
              {fechaSeleccionada && (
                <div className="confirmacion-boda fade-in">
                  <span className="animate-heart">✨❤️✨</span>
                  <p>
                    El primer día del resto de nuestras vidas está agendado para el 
                    <strong> {new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
                  </p>
                  <p style={{ marginTop: '10px', fontSize: '0.85rem', opacity: 0.9 }}>
                    Micky con Micky Foeva.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
{/* REPRODUCTOR LINEAL CORREGIDO SIN BUG DE TIEMPOS */}
      {cancionSeleccionada && !reproductorExpandido && fase !== "inicio" && (
        <div className="spotify-player-lineal">
          
          {/* 1. PORTADA */}
          <img src={cancionSeleccionada.cover} alt="Cover" className="player-lineal-cover" />
          
          {/* 2. TEXTO INFO */}
          <div className="player-lineal-text">
            <div className="player-lineal-title">{cancionSeleccionada.titulo}</div>
            <div className="player-lineal-artist">{cancionSeleccionada.artista}</div>
          </div>
          
          {/* 3. CONTROLES MULTIMEDIA CORREGIDOS */}
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
          
          {/* 4. PROGRESO CON TIEMPOS ALINEADOS ARRIBA */}
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