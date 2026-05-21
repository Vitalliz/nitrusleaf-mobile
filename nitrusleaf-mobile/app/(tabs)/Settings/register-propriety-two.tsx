// CadastroPropriedade.jsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Input } from '@/components/ui/input';
import { ContinueButton } from '@/components/ui/button';
import { Background } from '@/components/ui/background';

const CadastroPropriedade = () => {
  const [formData, setFormData] = useState({
    nomePropriedade: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Se for campo CEP e tiver 8 dígitos, busca automaticamente
    if (field === 'cep' && value.replace(/\D/g, '').length === 8) {
      buscarCep(value.replace(/\D/g, ''));
    }
  };

  const formatCep = (cep: string) => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length <= 5) return cleaned;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  };

  const buscarCep = async (cep: string) => {
    setIsSearchingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: `${data.localidade} - ${data.uf}`,
        }));
      } else {
        Alert.alert('CEP não encontrado', 'Verifique o CEP informado');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar o CEP');
    } finally {
      setIsSearchingCep(false);
    }
  };

  const handleContinuar = () => {
    // Validações
    if (!formData.nomePropriedade.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o nome da propriedade');
      return;
    }
    
    if (!formData.cep.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o CEP');
      return;
    }
    
    if (!formData.logradouro.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o logradouro');
      return;
    }
    
    if (!formData.numero.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o número');
      return;
    }
    
    if (!formData.bairro.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o bairro');
      return;
    }
    
    if (!formData.cidade.trim()) {
      Alert.alert('Atenção', 'Por favor, informe a cidade');
      return;
    }
    
    setIsLoading(true);
    
    // Simulando uma chamada de API
    setTimeout(() => {
      setIsLoading(false);
      console.log('Propriedade cadastrada:', formData);
      Alert.alert('Sucesso', 'Propriedade cadastrada com sucesso!');
      // Aqui você pode navegar para a próxima tela
    }, 1000);
  };

  return (
    <Background>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.content}>
              <Text style={styles.title}>Cadastro</Text>
              <Text style={styles.subtitle}>Dados da Propriedade</Text>
              
              <Text style={styles.description}>
                Informe os dados da sua propriedade para começar.
              </Text>
              
              {/* Nome da Propriedade */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Nome da Propriedade *</Text>
                <Input
                  placeholder="Ex: Fazenda Boa Vista"
                  value={formData.nomePropriedade}
                  onChangeText={(text) => handleInputChange('nomePropriedade', text)}
                  size="full"
                  variant="default"
                />
              </View>

              {/* CEP com busca automática */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>CEP *</Text>
                <View style={styles.cepContainer}>
                  <Input
                    placeholder="00000-000"
                    value={formatCep(formData.cep)}
                    onChangeText={(text) => handleInputChange('cep', text)}
                    size="full"
                    variant="default"
                    keyboardType="numeric"
                  />
                  {isSearchingCep && (
                    <View style={styles.cepLoading}>
                      <ActivityIndicator size="small" color="#6BC24A" />
                    </View>
                  )}
                </View>
              </View>

              {/* Logradouro */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Logradouro *</Text>
                <Input
                  placeholder="Ex: Rua das Flores"
                  value={formData.logradouro}
                  onChangeText={(text) => handleInputChange('logradouro', text)}
                  size="full"
                  variant="default"
                />
              </View>

              {/* Número e Bairro em linha */}
              <View style={styles.rowContainer}>
                <View style={[styles.halfField, { marginRight: 12 }]}>
                  <Text style={styles.label}>Número *</Text>
                  <Input
                    placeholder="123"
                    value={formData.numero}
                    onChangeText={(text) => handleInputChange('numero', text)}
                    size="full"
                    variant="default"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.halfField}>
                  <Text style={styles.label}>Bairro *</Text>
                  <Input
                    placeholder="Centro"
                    value={formData.bairro}
                    onChangeText={(text) => handleInputChange('bairro', text)}
                    size="full"
                    variant="default"
                  />
                </View>
              </View>

              {/* Cidade */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Cidade *</Text>
                <Input
                  placeholder="Ex: São Paulo - SP"
                  value={formData.cidade}
                  onChangeText={(text) => handleInputChange('cidade', text)}
                  size="full"
                  variant="default"
                />
              </View>
              
              <View style={styles.buttonContainer}>
                <ContinueButton onPress={handleContinuar} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#7f8c8d',
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 32,
    lineHeight: 22,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  halfField: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  cepContainer: {
    position: 'relative',
  },
  cepLoading: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
});

export default CadastroPropriedade;