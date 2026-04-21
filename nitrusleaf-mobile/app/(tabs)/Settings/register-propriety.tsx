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
  Alert
} from 'react-native';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Background } from '@/components/ui/background';

const CadastroPropriedade = () => {
  const [nomePropriedade, setNomePropriedade] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinuar = () => {
    if (!nomePropriedade.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o nome da propriedade');
      return;
    }
    
    setIsLoading(true);
    
    // Simulando uma chamada de API
    setTimeout(() => {
      setIsLoading(false);
      // Aqui você pode navegar para a próxima tela ou salvar os dados
      console.log('Propriedade cadastrada:', nomePropriedade);
      Alert.alert('Sucesso', 'Propriedade cadastrada com sucesso!');
    }, 1000);
  };

    function onPress(): void {
        throw new Error('Function not implemented.');
    }

  return (
    <Background>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Cadastro</Text>
            <Text style={styles.subtitle}>Dados da Propriedade</Text>
            
            <Text style={styles.description}>
              Informe o nome da sua propriedade para começar.
            </Text>
            
            <View style={styles.inputContainer}>
              <Input placeholder="nome da fazenda" size="size-352" variant="default" />
            </View>
            
             <Button
                title="Continuar"
                variant="primary"
                size="378"
                onPress={onPress}
              />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 40,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 32,
  },
  button: {
    marginTop: 'auto',
  },
});

export default CadastroPropriedade;