# BeckAI/api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)   # Permite requisições do React Native.\venv\Scripts\Activate.ps1

# ============================================
# 1. CARREGAR MODELO
# ============================================
print("[INFO] Carregando modelo...")
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'folhas_mexerica_modelo.keras')

try:
    modelo = tf.keras.models.load_model(MODEL_PATH)
    print("[OK] Modelo carregado com sucesso!")
except Exception as e:
    print(f"[ERRO] Erro ao carregar modelo: {e}")
    modelo = None

# ============================================
# 2. CONFIGURAÇÕES DA IMAGEM
# ============================================
TAMANHO_IMAGEM = (224, 224)
CLASSES = {
    0: "Saudável",
    1: "Manganês"
}

# ============================================
# 3. FUNÇÃO DE PREDIÇÃO
# ============================================
def prever_doenca(imagem_bytes):
    """
    Recebe bytes da imagem e retorna a predição
    """
    try:
        # Carregar imagem dos bytes
        imagem = Image.open(io.BytesIO(imagem_bytes))
        
        # Converter para RGB se necessário
        if imagem.mode != 'RGB':
            imagem = imagem.convert('RGB')
        
        # Redimensionar
        imagem = imagem.resize(TAMANHO_IMAGEM)
        
        # Converter para array e normalizar
        img_array = img_to_array(imagem)
        img_array = img_array / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Fazer predição
        predicao = modelo.predict(img_array, verbose=0)
        probabilidade = float(predicao[0][0])
        
        # Determinar classe
        if probabilidade > 0.5:
            classe = 1  # Manganês
            confianca = probabilidade * 100
        else:
            classe = 0  # Saudável
            confianca = (1 - probabilidade) * 100
        
        # LOGS DENTRO DA FUNÇÃO
        print(f"[OK] Predicao realizada pelo modelo treinado!")
        print(f"   Classe: {CLASSES[classe]}")
        print(f"   Probabilidade: {confianca:.2f}%")
        
        return {
            "classe_id": int(classe),
            "classe_nome": CLASSES[classe],
            "probabilidade": round(confianca, 2),
            "probabilidade_raw": round(probabilidade, 4),
            "status": "sucesso"
        }
        
    except Exception as e:
        return {
            "status": "erro",
            "mensagem": str(e)
        }

# ============================================
# 4. ROTAS DA API
# ============================================

@app.route('/', methods=['GET'])
def home():
    """Rota de verificação da API"""
    return jsonify({
        "api": "Classificador de Folhas de Mexerica",
        "versao": "1.0.0",
        "modelo_carregado": modelo is not None,
        "endpoints": {
            "GET /": "Informações da API",
            "POST /predict": "Enviar imagem para predição (multipart/form-data com campo 'imagem')",
            "GET /health": "Verificar saúde da API"
        }
    })

@app.route('/health', methods=['GET'])
def health():
    """Verificar se a API e o modelo estão funcionando"""
    return jsonify({
        "status": "online",
        "modelo_carregado": modelo is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint para predição
    Espera uma imagem no campo 'imagem' do formulário
    """
    # Verificar se o modelo está carregado
    if modelo is None:
        return jsonify({
            "status": "erro",
            "mensagem": "Modelo não carregado"
        }), 500
    
    # Verificar se a imagem foi enviada
    if 'imagem' not in request.files:
        return jsonify({
            "status": "erro",
            "mensagem": "Nenhuma imagem enviada. Use o campo 'imagem'"
        }), 400
    
    arquivo = request.files['imagem']
    
    # Verificar se o arquivo tem nome
    if arquivo.filename == '':
        return jsonify({
            "status": "erro",
            "mensagem": "Arquivo sem nome"
        }), 400
    
    # Verificar extensão
    extensoes_permitidas = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
    if '.' not in arquivo.filename or \
       arquivo.filename.rsplit('.', 1)[1].lower() not in extensoes_permitidas:
        return jsonify({
            "status": "erro",
            "mensagem": "Formato de imagem não suportado"
        }), 400
    
    try:
        # Ler bytes da imagem
        imagem_bytes = arquivo.read()
        
        # Fazer predição
        resultado = prever_doenca(imagem_bytes)
        
        if resultado["status"] == "erro":
            return jsonify(resultado), 500
        
        return jsonify(resultado)
        
    except Exception as e:
        return jsonify({
            "status": "erro",
            "mensagem": f"Erro ao processar imagem: {str(e)}"
        }), 500

# ============================================
# 5. INICIAR SERVIDOR
# ============================================
if __name__ == '__main__':
    print("\n" + "="*50)
    print("API INICIADA")
    print("="*50)
    print(f"URL: http://localhost:5000")
    print(f"Endpoint predicao: POST /predict")
    print(f"Health check: GET /health")
    print("="*50)
    
    app.run(
        host='0.0.0.0',  # Aceita conexões de qualquer IP
        port=5000,
        debug=True
    )