window.addEventListener('load', () => {

  // Tendremos una lista de palabras que se seleccionara al principio, las letras de estas palabras aparecen en la parte inferior
  
  // Funcion de inicio
    // Selecciona nueva palabra
    // Limpia el ahorcado
    // Reinicia el teclado

  // Variables de configuracion
  var letras = 'abcdefghijklmnñopqrstuvwxyz'.split('');
  var palabras = ['hola', 'ahorcado', 'prueba', 'cosa', 'círculo', 'paralelepípedo', 'guille'];
  var estado = 0; // Inicia el estado en 0
  var palabraJuego = ''; // Inicializa vacio
  var palabraFiltrada = [];
  var letrasUsadas = []; // Registra las letras usadas
  var puntuacion = 0; // Controla la puntuacion, si es igual a palabraJuego.length --> hemos ganado
  var aciertos = 0; // Controla los aciertos

  // Variables DOM
  var ahorcado = document.querySelector('.ahorcado');
  var palabra = document.querySelector('.palabra');
  var form = document.querySelector('form');
  var input = document.querySelector('input[type="text"]');
  var teclado = document.querySelector('.teclado');
  var modal = document.querySelector('.modal');
  var mensajeModal = document.querySelector('.modal p');
  var botonModal = document.querySelector('.modal a');

  ///////////////////
  // Funciones
  //////////////////

  function armarTeclado() {
    teclado.innerHTML = ''; // Limpia el teclado

    // Por cada una de las letras, genera una tecla
    for (var i = 0; i < letras.length; i++) {
      var enlace = document.createElement('a');
      enlace.href = '#';
      enlace.innerHTML = letras[i];
      enlace.addEventListener('click', evento => { // Añade eventListener a cada tecla
        evento.preventDefault();
        evento.target.classList.add('usada'); // Marca la tecla como usada
        // No se hace aqui la comprobacion, delega en comprobarLetra
        comprobarLetra(evento.target.innerHTML); // Llama a comprobaLetra, pasandole el innerHTML (la letra en si)
      }); 
      teclado.appendChild(enlace);
    };
  };

  // Filtra letra para eliminar los acentos
  const filtrarLetra = letra => letra.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u');


  // Comprueba que letra hemos clickado
  function comprobarLetra(letra) {
    var acierto = palabraFiltrada.indexOf(letra) >= 0; // Si la letra se encuentra, asigna true
    var usada = letrasUsadas.indexOf(letra) >= 0; // Controla que la letra no haya sido usada

    if (!usada) { // Si NO ha sido usada la letra...
      if (acierto) { // Si acierto
        for (var i = 0; i < palabraFiltrada.length; i++) { // Recorre palabraFiltrada y si la letra coincide con la que hemos pulsado, sustituimos con la letra el innerHTML del span
          if (letra == palabraFiltrada[i]) { // Si la letra está en la palabra...
            palabra.querySelectorAll('span')[i].innerHTML = palabraJuego[i]; // Selecciona los span correspondientes a esa letra y le pasamos la letra
          } 
        }
        puntuacion++; // Acierto --> sumamos puntuacion
        puntuacion == aciertos ? abrirModal('Win!') : null; // Si la puntuacion es igual a aciertos
      } else {
        estado++; // Fallo --> sumamos estado
        estadoAhorcado(estado); // Le pasa el estado actual
        estado == 7 ? abrirModal('Looooser!') : null; // Si estado es igual al numero de partes del ahorcado
      }
      letrasUsadas.push(letra); // Añade la letra a letras usadas
    }
  }

  function resetAhorcado() {
    ahorcado.innerHTML = ''; // Resetea el html
    ahorcado.classList.remove('a', 'b', 'c', 'd'); // Limpia las clases
  }

  // Controla como se pinta el ahorcado
  function pintarAhorcado(partes) { // Recibe la cantidad de partes a pintar
    ahorcado.innerHTML = ''; // Limpia el html
    var etapasAhorcado = ['/\\', '/|\\', 'ö'];
    for (var i = 0; i < partes; i++) {
      var div = document.createElement('div');
      var cuerpo = document.createElement('p');
      cuerpo.innerHTML = etapasAhorcado[i];
      div.appendChild(cuerpo);
      ahorcado.prepend(div); // prepend porque empieza por las piernas
    }
  }

  // Añade las clases 
  function clasesAhorcado(cantidadClases) {
    ahorcado.classList.remove('a', 'b', 'c', 'd'); // Limpia las clases
    var clases = 'abcd'.split(''); // Array con las clases que se añaden
    for (var i = 0; i < cantidadClases; i++) {
      ahorcado.classList.add(clases[i]); // Añade clase en funcion del estado
    }
  }

  // Controla el estado del ahorcado
  function estadoAhorcado(estado) {   // Recibe el estado
    if (estado < 4) { // Para los primeros 3 estados
      clasesAhorcado(estado);
    } else if (estado == 7) { // Para estado 7
      // Añadimos las 4 clases
      clasesAhorcado(4); // Estado - 3
      pintarAhorcado(3); // Añadimos los 3 primeros estados
    } else { // Para estados 4, 5, 6
      clasesAhorcado(3);
      pintarAhorcado(estado - 3); // 
    }
  };

  // Abre modal, recibe el mensaje como parametro
  function abrirModal(mensaje) {
    mensajeModal.innerHTML = mensaje;
    modal.classList.add('visible');
  }

  // Inicializa
  function init() {
    armarTeclado();// Arma  el teclado
    resetAhorcado();
    estado = 0; // Inicializa el estado
    puntuacion = 0; // Inicializa la puntuacion
    palabraJuego = palabras[Math.floor(Math.random() * palabras.length)].split(''); // Selecciona una palabra al azar y la divide por letras en un array
    palabraFiltrada = palabraJuego.map(item => filtrarLetra(item));// Filtra la palabra
    letrasUsadas = []; // Inicializa letrasUsadas
    console.log('palabra filtrada', palabraFiltrada);

    // Por cada una de las letras de palabrasJuego, acumula en una variable
    var letrasUnicas = []; // Inicializa la variable para controlar que no haya letras repetidas en la palabra
    console.log('palabra juego', palabraJuego);

    // Añade palabra (separada en spans)
    palabra.innerHTML = ''; // Inicializa la palabra
    for (var i = 0; i < palabraJuego.length; i++) {
      // Si la letra no se encuentra en letrasUnicas, la añade, si ya está, null
      letrasUnicas.indexOf(palabraJuego[i]) < 0 ? letrasUnicas.push(palabraJuego[i]) : null;
      var span = document.createElement('span');// Pone un span vacio por cada una de las posibles letras
      palabra.appendChild(span);
    }
    aciertos = letrasUnicas.length; // Define cuantos aciertos debemos tener
    console.log('letrasUnicas', letrasUnicas);
  }

  // Inicia
  init();

  botonModal.addEventListener('click', evento => {
    evento.preventDefault();
    modal.classList.remove('visible'); // Oculta el menu
    init(); // Reinicia el juego
  })
  
  // El input solo puede recibir 1 letra
  input.addEventListener('input', function() {
    // Si lo que recibe no es valido --> null. Si es valido --> deja solo la primera de las letras
    this.value = letras.indexOf(this.value.slice(0, 1)) < 0 ? '' : this.value.slice(0, 1);
  })

  // Evento submit en el form
  form.addEventListener('submit', evento => {
    evento.preventDefault();
    if (input.value.length > 0) { // Si hay algo en el input...
      comprobarLetra(input.value); // Comprueba la letra introducida
      // Añade la clase .usada a la letra del teclado que coincida con el indice de la letra introducida en el input
      teclado.querySelectorAll('a')[letras.indexOf(input.value)].classList.add('usada');
      input.value = ''; // Vacia el input
    } 
  });
});