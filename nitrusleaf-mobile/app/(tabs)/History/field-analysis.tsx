import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/header';
import { CustomCard } from '@/components/cards/card';
import BottomNavbar from '@/components/ui/menu';
import { Background } from '@/components/ui/background';

// Tipagem dos dados
interface AnalysisData {
  number: string;
  date: string;
  deficiency: string;
  probability: number;
  author: {
    name: string;
    avatar: string | null;
  };
  status: string | null;
  location: {
    talhao: string;
    arvore: string;
  };
}

// Dados mock
const analysisData: AnalysisData = {
  number: '#006',
  date: '23 de Março de 2026',
  deficiency: 'Cobre',
  probability: 92,
  author: {
    name: 'Roberto Almeida',
    avatar: null,
  },
  status: 'Em tratamento',
  location: {
    talhao: 'Talhão 3',
    arvore: 'Árvore 6',
  },
};

// Componente principal
const AnalysisResultScreen: React.FC = () => {
  const [reportText, setReportText] = useState<string>('');
  const [status, setStatus] = useState<string | null>(analysisData.status);
  const [location, setLocation] = useState(analysisData.location);

  // Handlers
  const handleGoBack = () => {
    console.log('Voltar para tela anterior');
  };

  const handleEditReport = () => {
    console.log('Editar relatório');
  };

  const handleEditLocation = () => {
    console.log('Alterar localização');
  };

  const handleExportPDF = () => {
    console.log('Exportar como PDF');
  };

  const handleSaveHistory = () => {
    console.log('Salvar no histórico');
  };

  const handleAddStatus = () => {
    console.log('Adicionar status');
    setStatus('Em tratamento'); // Exemplo de adição de status
  };

  // Componente de Badge reutilizável
  const Badge: React.FC<{
    children: React.ReactNode;
    backgroundColor: string;
    textColor?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
  }> = ({ children, backgroundColor, textColor = '#1F2937', icon, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={{
        backgroundColor,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {icon && <Ionicons name={icon} size={16} color={textColor} />}
      <Text style={{ color: textColor, fontWeight: '600', fontSize: 14 }}>
        {children}
      </Text>
    </TouchableOpacity>
  );

  // Barra de Progresso
  const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <View
      style={{
        backgroundColor: '#E5E7EB',
        height: 12,
        borderRadius: 6,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          backgroundColor: '#EA580C',
          width: `${progress}%`,
          height: '100%',
          borderRadius: 6,
        }}
      />
    </View>
  );

  // Separador
  const Separator: React.FC = () => (
    <View
      style={{
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 20,
      }}
    />
  );

  return (
    <Background>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />
      
      {/* Header Customizado */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF1E5',
        }}
      >
        <TouchableOpacity
          onPress={handleGoBack}
          style={{
            position: 'absolute',
            left: 20,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#4CAF50',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: '#1F2937',
            textAlign: 'center',
          }}
        >
          Resultado da análise por imagem
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, paddingBottom: 80 }}>
          <CustomCard variant="white-large-analysis">
            <View style={{ paddingHorizontal: 24, paddingVertical: 20, paddingTop: 750 }}>
              {/* Cabeçalho da Análise */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <Text style={{ fontWeight: '600', color: '#6B7280', fontSize: 16 }}>
                  Análise {analysisData.number}
                </Text>
                <Badge
                  backgroundColor="#F3F4F6"
                  textColor="#6B7280"
                  icon="calendar-outline"
                >
                  {analysisData.date}
                </Badge>
              </View>
              
              <View
                style={{
                  backgroundColor: '#EA580C',
                  height: 4,
                  marginTop: 12,
                  borderRadius: 2,
                }}
              />

              {/* Deficiência Detectada */}
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: '600', color: '#1F2937', marginBottom: 8, fontSize: 14 }}>
                  Deficiência detectada:
                </Text>
                <Badge backgroundColor="#EA580C" textColor="#FFFFFF">
                  {analysisData.deficiency}
                </Badge>
              </View>

              {/* Probabilidade da IA */}
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: '600', color: '#1F2937', marginBottom: 8, fontSize: 14 }}>
                  Probabilidade estimada da IA: {analysisData.probability}%
                </Text>
                <ProgressBar progress={analysisData.probability} />
              </View>

              <Separator />

              {/* Autor da Análise */}
              <View>
                <Text style={{ fontWeight: '600', color: '#1F2937', marginBottom: 8, fontSize: 14 }}>
                  Autor da análise:
                </Text>
                <View
                  style={{
                    backgroundColor: '#F3F4F6',
                    padding: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    alignSelf: 'flex-start',
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: '#D1D5DB',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="person" size={18} color="#6B7280" />
                  </View>
                  <Text style={{ color: '#1F2937', fontWeight: '500', fontSize: 14 }}>
                    {analysisData.author.name}
                  </Text>
                </View>
              </View>

              {/* Status */}
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontWeight: '600', color: '#1F2937', marginBottom: 8, fontSize: 14 }}>
                  Status:
                </Text>
                {status ? (
                  <Badge
                    backgroundColor="#FBBF24"
                    textColor="#92400E"
                    icon="time-outline"
                  >
                    {status}
                  </Badge>
                ) : (
                  <TouchableOpacity
                    onPress={handleAddStatus}
                    style={{
                      backgroundColor: '#F3F4F6',
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: 'center',
                      alignSelf: 'flex-start',
                    }}
                  >
                    <Text style={{ color: '#6B7280', fontWeight: '600', fontSize: 14 }}>
                      + Adicionar status
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <Separator />

              {/* Localização da Amostra */}
              <View>
                <Text style={{ fontWeight: '700', fontSize: 16, color: '#1F2937', marginBottom: 12 }}>
                  Localização da amostra
                </Text>
                <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
                  <Badge backgroundColor="#F3F4F6" icon="lock-closed-outline">
                    {location.talhao}
                  </Badge>
                  <Badge backgroundColor="#F3F4F6" icon="lock-closed-outline">
                    {location.arvore}
                  </Badge>
                </View>
                <TouchableOpacity
                  onPress={handleEditLocation}
                  style={{
                    backgroundColor: '#F9FAFB',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 12,
                    alignSelf: 'flex-start',
                  }}
                >
                  <Ionicons name="create-outline" size={16} color="#3B82F6" />
                  <Text style={{ color: '#3B82F6', fontWeight: '500', fontSize: 14 }}>
                    Alterar localização
                  </Text>
                </TouchableOpacity>
              </View>

              <Separator />

              {/* Escrever Relatório */}
              <View>
                <Text style={{ fontWeight: '700', fontSize: 16, color: '#1F2937', marginBottom: 12 }}>
                  Escrever Relatório
                </Text>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 8,
                    padding: 16,
                    minHeight: 120,
                    textAlignVertical: 'top',
                    fontSize: 14,
                    color: '#6B7280',
                    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
                  }}
                  placeholder="Adicione suas observações..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  value={reportText}
                  onChangeText={setReportText}
                />
                <TouchableOpacity
                  onPress={handleEditReport}
                  style={{
                    backgroundColor: '#F3F4F6',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 8,
                    alignSelf: 'flex-end',
                  }}
                >
                  <Ionicons name="create-outline" size={14} color="#6B7280" />
                  <Text style={{ color: '#6B7280', fontSize: 12, fontWeight: '500' }}>
                    Editar relatório
                  </Text>
                </TouchableOpacity>
              </View>

              <Separator />

              {/* Botões de Ação */}
              <View>
                <TouchableOpacity
                  onPress={handleExportPDF}
                  style={{
                    backgroundColor: 'white',
                    borderWidth: 2,
                    borderColor: '#6BC24A',
                    borderRadius: 24,
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name="document-text-outline" size={20} color="#6BC24A" />
                  <Text style={{ color: '#6BC24A', fontWeight: '600', fontSize: 16 }}>
                    Exportar como PDF
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveHistory}
                  style={{
                    backgroundColor: '#6BC24A',
                    borderRadius: 24,
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <Ionicons name="save-outline" size={20} color="white" />
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                    Salvar no histórico
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </CustomCard>
        </View>
      </ScrollView>

      {/* BottomNavbar */}
      <BottomNavbar />
    </Background>
  );
};

export default AnalysisResultScreen;