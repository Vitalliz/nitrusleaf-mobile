import React from 'react';
import FormaComplexaProps from "@/components/footer";
import './App.css';
import FormaComplexa from '@/components/footer';

const App = () => {
  return (
    <div className="App">
      <h1>Design com Shape-Outside em React</h1>
      
      <div className="formas-multiplas-container">
        <FormaComplexa
          tamanho={120}
          cor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          posicao="esquerda"
          texto="Esta forma usa shape-outside e clip-path para criar um layout circular assimétrico. O texto flui naturalmente ao redor da curva definida pelas propriedades CSS."
        />
        
        <FormaComplexa
          tamanho={140}
          cor="linear-gradient(45deg, #ff6b6b, #ffa726)"
          posicao="direita"
          texto="Aqui a forma está posicionada à direita, demonstrando a versatilidade do componente. O clip-path recorta visualmente o elemento enquanto o shape-outside define como o texto deve fluir ao seu redor."
        />
        
        <FormaComplexa
          tamanho={100}
          cor="linear-gradient(90deg, #4ecdc4, #44a08d)"
          posicao="esquerda"
          texto="Formas menores também funcionam perfeitamente. Esta técnica é ideal para designs criativos que fogem do tradicional layout retangular."
        />
      </div>
    </div>
  );
};

export default App;