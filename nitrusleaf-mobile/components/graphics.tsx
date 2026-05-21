const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Configuração
const canvasWidth = 1200;
const canvasHeight = 800;

// Dados extraídos dos arquivos
const dados = {
  propriedade: {
    nome: 'Sítio Santa Aurora',
    proprietario: 'Roberto Almeida'
  },
  cobertura: {
    totalArvores: 87,
    analisadas: 56,
    naoAnalisadas: 31
  },
  deficiencias: {
    manganes: { porcentagem: 43, ocorrencias: 24 },
    cobre: { porcentagem: 19, ocorrencias: 10 },
    adversos: { porcentagem: 38, ocorrencias: 21 }
  },
  ultimaAnalise: {
    deficiencia: 'Cobre',
    probabilidade: 92,
    talhao: 3,
    arvore: 6,
    data: '23 de Março de 2026',
    status: 'Não tratado',
    relatorio: 'A análise da imagem da folha identificou deficiência de cobre com alta confiança (92%). O padrão visual identificado é compatível com sintomas descritos para a cultura da mexerica.'
  }
};

// Função para criar o gráfico de barras (Status Nutricional)
function criarGraficoBarras() {
  const canvas = createCanvas(800, 500);
  const ctx = canvas.getContext('2d');
  
  // Fundo branco
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Título
  ctx.fillStyle = '#2C3E50';
  ctx.font = 'bold 20px Arial';
  ctx.fillText('Status Nutricional da Propriedade', 50, 50);
  
  ctx.font = '14px Arial';
  ctx.fillStyle = '#7F8C8D';
  ctx.fillText(`${dados.propriedade.proprietario} - ${dados.propriedade.nome}`, 50, 80);
  
  // Dados para o gráfico
  const nutrientes = ['Manganês', 'Cobre', 'Adversos'];
  const porcentagens = [
    dados.deficiencias.manganes.porcentagem,
    dados.deficiencias.cobre.porcentagem,
    dados.deficiencias.adversos.porcentagem
  ];
  const cores = ['#3498DB', '#E74C3C', '#F39C12'];
  
  // Configurações do gráfico
  const barWidth = 150;
  const startX = 100;
  const startY = 150;
  const maxBarHeight = 300;
  
  // Desenhar barras
  for (let i = 0; i < nutrientes.length; i++) {
    const x = startX + (barWidth + 50) * i;
    const barHeight = (porcentagens[i] / 100) * maxBarHeight;
    const y = startY + (maxBarHeight - barHeight);
    
    // Barra
    ctx.fillStyle = cores[i];
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Borda
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);
    
    // Label do nutriente
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(nutrientes[i], x + barWidth/2 - 30, startY + maxBarHeight + 20);
    
    // Valor da porcentagem
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`${porcentagens[i]}%`, x + barWidth/2 - 20, y - 10);
    
    // Número de ocorrências
    ctx.font = '12px Arial';
    ctx.fillStyle = '#7F8C8D';
    const ocorrencias = [dados.deficiencias.manganes.ocorrencias, 
                         dados.deficiencias.cobre.ocorrencias, 
                         dados.deficiencias.adversos.ocorrencias];
    ctx.fillText(`${ocorrencias[i]} árvores`, x + barWidth/2 - 30, y + barHeight + 5);
  }
  
  // Linha do eixo X
  ctx.beginPath();
  ctx.moveTo(50, startY + maxBarHeight);
  ctx.lineTo(canvas.width - 50, startY + maxBarHeight);
  ctx.stroke();
  
  // Linha do eixo Y
  ctx.beginPath();
  ctx.moveTo(50, startY);
  ctx.lineTo(50, startY + maxBarHeight);
  ctx.stroke();
  
  // Labels do eixo Y
  for (let i = 0; i <= 5; i++) {
    const value = i * 20;
    const y = startY + maxBarHeight - (value / 100) * maxBarHeight;
    ctx.fillStyle = '#7F8C8D';
    ctx.font = '10px Arial';
    ctx.fillText(`${value}%`, 30, y);
  }
  
  return canvas;
}

// Função para criar o gráfico de pizza (Cobertura)
function criarGraficoPizza() {
  const canvas = createCanvas(500, 500);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Título
  ctx.fillStyle = '#2C3E50';
  ctx.font = 'bold 18px Arial';
  ctx.fillText('Cobertura das Análises', 120, 50);
  
  const total = dados.cobertura.totalArvores;
  const analisadas = dados.cobertura.analisadas;
  const naoAnalisadas = dados.cobertura.naoAnalisadas;
  
  const anguloAnalisadas = (analisadas / total) * 2 * Math.PI;
  const anguloNaoAnalisadas = (naoAnalisadas / total) * 2 * Math.PI;
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 150;
  
  let startAngle = 0;
  
  // Fatia das árvores analisadas
  ctx.beginPath();
  ctx.fillStyle = '#2ECC71';
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, startAngle + anguloAnalisadas);
  ctx.fill();
  
  startAngle += anguloAnalisadas;
  
  // Fatia das árvores não analisadas
  ctx.beginPath();
  ctx.fillStyle = '#E74C3C';
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, startAngle + anguloNaoAnalisadas);
  ctx.fill();
  
  // Borda branca
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Legenda
  const legendY = 350;
  ctx.fillStyle = '#2ECC71';
  ctx.fillRect(centerX - 120, legendY, 20, 20);
  ctx.fillStyle = '#2C3E50';
  ctx.font = '12px Arial';
  ctx.fillText(`Analisadas: ${analisadas} árvores (${Math.round((analisadas/total)*100)}%)`, centerX - 95, legendY + 15);
  
  ctx.fillStyle = '#E74C3C';
  ctx.fillRect(centerX - 120, legendY + 30, 20, 20);
  ctx.fillStyle = '#2C3E50';
  ctx.fillText(`Não analisadas: ${naoAnalisadas} árvores (${Math.round((naoAnalisadas/total)*100)}%)`, centerX - 95, legendY + 45);
  
  // Texto central
  ctx.fillStyle = '#2C3E50';
  ctx.font = 'bold 20px Arial';
  ctx.fillText(`${analisadas}/${total}`, centerX - 30, centerY);
  ctx.font = '12px Arial';
  ctx.fillText('árvores', centerX - 25, centerY + 25);
  
  return canvas;
}

// Função para criar o card da última análise
function criarCardAnalise() {
  const canvas = createCanvas(500, 400);
  const ctx = canvas.getContext('2d');
  
  // Fundo
  ctx.fillStyle = '#F8F9FA';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Borda decorativa
  ctx.strokeStyle = '#3498DB';
  ctx.lineWidth = 3;
  ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
  
  // Título
  ctx.fillStyle = '#2C3E50';
  ctx.font = 'bold 18px Arial';
  ctx.fillText('Última Análise - #06', 20, 40);
  
  // Linha separadora
  ctx.beginPath();
  ctx.moveTo(20, 50);
  ctx.lineTo(canvas.width - 20, 50);
  ctx.strokeStyle = '#BDC3C7';
  ctx.stroke();
  
  // Conteúdo
  ctx.font = '14px Arial';
  ctx.fillStyle = '#2C3E50';
  
  let y = 80;
  const lineHeight = 25;
  
  ctx.fillText(`Deficiência: ${dados.ultimaAnalise.deficiencia}`, 20, y);
  y += lineHeight;
  ctx.fillText(`Probabilidade IA: ${dados.ultimaAnalise.probabilidade}%`, 20, y);
  y += lineHeight;
  ctx.fillText(`Data: ${dados.ultimaAnalise.data}`, 20, y);
  y += lineHeight;
  ctx.fillText(`Localização: Talhão ${dados.ultimaAnalise.talhao} | Árvore ${dados.ultimaAnalise.arvore}`, 20, y);
  y += lineHeight;
  
  // Status com cor
  ctx.fillStyle = dados.ultimaAnalise.status === 'Não tratado' ? '#E74C3C' : '#2ECC71';
  ctx.fillText(`Status: ${dados.ultimaAnalise.status}`, 20, y);
  y += lineHeight + 10;
  
  // Relatório
  ctx.fillStyle = '#7F8C8D';
  ctx.font = '12px Arial';
  ctx.fillText('Relatório:', 20, y);
  y += 20;
  
  const relatorio = dados.ultimaAnalise.relatorio;
  const words = relatorio.split(' ');
  let line = '';
  let lineY = y;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > canvas.width - 40 && line.length > 0) {
      ctx.fillText(line, 20, lineY);
      line = words[i] + ' ';
      lineY += 18;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 20, lineY);
  
  return canvas;
}

// Função para criar o gráfico de ocorrências
function criarGraficoOcorrencias() {
  const canvas = createCanvas(800, 500);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#2C3E50';
  ctx.font = 'bold 20px Arial';
  ctx.fillText('Ocorrências Totais por Deficiência', 50, 50);
  
  const deficiencias = ['Manganês', 'Cobre', 'Adversos'];
  const ocorrencias = [
    dados.deficiencias.manganes.ocorrencias,
    dados.deficiencias.cobre.ocorrencias,
    dados.deficiencias.adversos.ocorrencias
  ];
  const cores = ['#3498DB', '#E74C3C', '#F39C12'];
  
  const barWidth = 150;
  const startX = 100;
  const startY = 150;
  const maxBarHeight = 300;
  const maxOcorrencias = Math.max(...ocorrencias);
  
  for (let i = 0; i < deficiencias.length; i++) {
    const x = startX + (barWidth + 50) * i;
    const barHeight = (ocorrencias[i] / maxOcorrencias) * maxBarHeight;
    const y = startY + (maxBarHeight - barHeight);
    
    ctx.fillStyle = cores[i];
    ctx.fillRect(x, y, barWidth, barHeight);
    
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);
    
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(deficiencias[i], x + barWidth/2 - 30, startY + maxBarHeight + 20);
    
    ctx.font = 'bold 16px Arial';
    ctx.fillText(ocorrencias[i].toString(), x + barWidth/2 - 10, y - 10);
  }
  
  return canvas;
}

// Função para criar o dashboard completo
async function criarDashboard() {
  console.log('🎨 Criando dashboard nutricional...\n');
  
  // Criar todos os gráficos
  const graficoBarras = criarGraficoBarras();
  const graficoPizza = criarGraficoPizza();
  const cardAnalise = criarCardAnalise();
  const graficoOcorrencias = criarGraficoOcorrencias();
  
  // Criar diretório de saída se não existir
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  // Salvar imagens
  const bufferBarras = graficoBarras.toBuffer('image/png');
  const bufferPizza = graficoPizza.toBuffer('image/png');
  const bufferCard = cardAnalise.toBuffer('image/png');
  const bufferOcorrencias = graficoOcorrencias.toBuffer('image/png');
  
  fs.writeFileSync(path.join(outputDir, 'status_nutricional.png'), bufferBarras);
  fs.writeFileSync(path.join(outputDir, 'cobertura_analises.png'), bufferPizza);
  fs.writeFileSync(path.join(outputDir, 'ultima_analise.png'), bufferCard);
  fs.writeFileSync(path.join(outputDir, 'ocorrencias_deficiencias.png'), bufferOcorrencias);
  
  console.log('✅ Gráficos gerados com sucesso!');
  console.log(`📁 Localização: ${outputDir}`);
  console.log('\n📊 Arquivos gerados:');
  console.log('   - status_nutricional.png');
  console.log('   - cobertura_analises.png');
  console.log('   - ultima_analise.png');
  console.log('   - ocorrencias_deficiencias.png');
  
  // Gerar relatório HTML
  const html = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Nutricional - ${dados.propriedade.nome}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        min-height: 100vh;
      }
      
      .container {
        max-width: 1400px;
        margin: 0 auto;
      }
      
      .header {
        background: white;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      
      .header h1 {
        color: #2C3E50;
        margin-bottom: 5px;
      }
      
      .header p {
        color: #7F8C8D;
      }
      
      .dashboard {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
      }
      
      .card {
        background: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transition: transform 0.3s;
      }
      
      .card:hover {
        transform: translateY(-5px);
      }
      
      .card img {
        width: 100%;
        height: auto;
        border-radius: 5px;
      }
      
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      
      .stat-box {
        background: white;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      
      .stat-number {
        font-size: 36px;
        font-weight: bold;
        color: #3498DB;
      }
      
      .stat-label {
        color: #7F8C8D;
        margin-top: 10px;
      }
      
      @media (max-width: 768px) {
        .dashboard {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🌱 Dashboard Nutricional</h1>
        <p>${dados.propriedade.proprietario} | ${dados.propriedade.nome}</p>
        <p>Data da análise: ${new Date().toLocaleDateString('pt-BR')}</p>
      </div>
      
      <div class="stats">
        <div class="stat-box">
          <div class="stat-number">${dados.cobertura.totalArvores}</div>
          <div class="stat-label">Total de Árvores</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">${dados.cobertura.analisadas}</div>
          <div class="stat-label">Árvores Analisadas</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">${dados.cobertura.naoAnalisadas}</div>
          <div class="stat-label">Árvores Não Analisadas</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">${Math.round((dados.cobertura.analisadas/dados.cobertura.totalArvores)*100)}%</div>
          <div class="stat-label">Cobertura</div>
        </div>
      </div>
      
      <div class="dashboard">
        <div class="card">
          <h3>📊 Status Nutricional da Propriedade</h3>
          <img src="output/status_nutricional.png" alt="Status Nutricional">
        </div>
        
        <div class="card">
          <h3>🥧 Cobertura das Análises</h3>
          <img src="output/cobertura_analises.png" alt="Cobertura das Análises">
        </div>
        
        <div class="card">
          <h3>🔬 Última Análise Detalhada</h3>
          <img src="output/ultima_analise.png" alt="Última Análise">
        </div>
        
        <div class="card">
          <h3>📈 Ocorrências por Deficiência</h3>
          <img src="output/ocorrencias_deficiencias.png" alt="Ocorrências">
        </div>
      </div>
      
      <div class="header">
        <h3>🎯 Recomendações Técnicas</h3>
        <ul style="margin-top: 10px; margin-left: 20px;">
          <li>✓ Correção nutricional imediata para deficiência de <strong>Cobre</strong> (Talhão 3, Árvore 6)</li>
          <li>✓ Monitoramento contínuo das 31 árvores não analisadas</li>
          <li>✓ Realizar análise foliar complementar em 30 dias</li>
          <li>✓ Aplicação via foliar recomendada para rápida absorção do cobre</li>
          <li>✓ Atenção especial para as 24 árvores com deficiência de Manganês (43% das ocorrências)</li>
        </ul>
      </div>
    </div>
  </body>
  </html>
  `;
  
  fs.writeFileSync(path.join(outputDir, 'dashboard.html'), html);
  console.log('\n📄 Dashboard HTML gerado: output/dashboard.html');
  console.log('\n🌐 Abra o arquivo dashboard.html no navegador para visualizar todos os gráficos!');
}

// Executar o dashboard
criarDashboard().catch(console.error);