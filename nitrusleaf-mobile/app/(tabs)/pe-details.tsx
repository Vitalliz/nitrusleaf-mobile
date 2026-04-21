// app/(tabs)/pe-details.tsx - Detalhes do Pé (Árvore)
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '@/components/footer';
import { Background } from '@/components/ui/background';
import { Ionicons } from '@expo/vector-icons';
import { getPeById, deletePe } from '@/repositories/peRepository';
import { getFotosByPe } from '@/repositories/fotoRepository';
import type { Pe } from '@/types/pe';
import type { Foto } from '@/types/foto';

export default function PeDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { peId, talhaoId, talhaoName } = useLocalSearchParams<{
    peId: string;
    talhaoId: string;
    talhaoName: string;
  }>();

  const [pe, setPe] = useState<Pe | null>(null);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (peId) {
      loadPeDetails();
    }
  }, [peId]);

  const loadPeDetails = async () => {
    if (!peId) return;

    try {
      const [peData, fotosData] = await Promise.all([
        getPeById(peId),
        getFotosByPe(peId)
      ]);

      setPe(peData);
      setFotos(fotosData);
    } catch (error) {
      console.error('Erro ao carregar detalhes do pé:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do pé.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePe = () => {
    if (!pe) return;

    Alert.alert(
      'Excluir Pé',
      `Tem certeza que deseja excluir o pé "${pe.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePe(pe.id);
              Alert.alert('Sucesso', 'Pé excluído com sucesso!', [
                {
                  text: 'OK',
                  onPress: () => router.back()
                }
              ]);
            } catch (error) {
              console.error('Erro ao excluir pé:', error);
              Alert.alert('Erro', 'Não foi possível excluir o pé. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'Tratado':
        return '#8B5CF6';
      case 'Não-Tratado':
        return '#FACC15';
      case 'Sem-informações':
      default:
        return '#6B7280';
    }
  };

  const getSituacaoIcon = (situacao: string) => {
    switch (situacao) {
      case 'Tratado':
        return 'checkmark-circle';
      case 'Não-Tratado':
        return 'alert-circle';
      case 'Sem-informações':
      default:
        return 'help-circle';
    }
  };

  if (loading) {
    return (
      <Background>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes do Pé</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.content}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
        <Footer />
      </Background>
    );
  }

  if (!pe) {
    return (
      <Background>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes do Pé</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.content}>
          <Text style={styles.emptyText}>Pé não encontrado</Text>
        </View>
        <Footer />
      </Background>
    );
  }

  return (
    <Background>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Pé</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeletePe}
        >
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.peCard}>
          <View style={styles.peHeader}>
            <Text style={styles.peIdentificacao}>{pe.nome}</Text>
            <View style={[styles.situacaoBadge, { backgroundColor: getSituacaoColor(pe.situacao) + '20' }]}>
              <Ionicons
                name={getSituacaoIcon(pe.situacao)}
                size={16}
                color={getSituacaoColor(pe.situacao)}
              />
              <Text style={[styles.situacaoText, { color: getSituacaoColor(pe.situacao) }]}>
                {pe.situacao}
              </Text>
            </View>
          </View>

          <Text style={styles.talhaoInfo}>Talhão: {talhaoName}</Text>

          <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>Localização</Text>
            {pe.latitude != null && pe.longitude != null ? (
              <Text style={styles.locationText}>
                GPS: {pe.latitude.toFixed(6)}, {pe.longitude.toFixed(6)}
              </Text>
            ) : (
              <Text style={styles.locationText}>Coordenadas não informadas</Text>
            )}
          </View>

          <View style={styles.deficienciasSection}>
            <Text style={styles.sectionTitle}>Deficiências Identificadas</Text>
            {(pe.deficienciaCobre || pe.deficienciaManganes || pe.outros) ? (
              <>
                {pe.deficienciaCobre && (
                  <View style={styles.deficienciaItem}>
                    <Ionicons name="warning" size={16} color="#EF4444" />
                    <Text style={styles.deficienciaText}>Deficiência de Cobre</Text>
                  </View>
                )}
                {pe.deficienciaManganes && (
                  <View style={styles.deficienciaItem}>
                    <Ionicons name="warning" size={16} color="#EF4444" />
                    <Text style={styles.deficienciaText}>Deficiência de Manganês</Text>
                  </View>
                )}
                {pe.outros && (
                  <View style={styles.deficienciaItem}>
                    <Ionicons name="warning" size={16} color="#EF4444" />
                    <Text style={styles.deficienciaText}>Outros</Text>
                  </View>
                )}
              </>
            ) : (
              <Text style={styles.noDeficiencias}>Nenhuma deficiência identificada</Text>
            )}
          </View>

          <View style={styles.datesSection}>
            <Text style={styles.sectionTitle}>Registro</Text>
            <Text style={styles.dateText}>
              Criado em: {new Date(pe.createdAt).toLocaleString('pt-BR')}
            </Text>
            <Text style={styles.dateText}>
              Atualizado em: {new Date(pe.updatedAt).toLocaleString('pt-BR')}
            </Text>
          </View>
        </View>

        <View style={styles.fotosSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fotos ({fotos.length})</Text>
            <TouchableOpacity
              style={styles.addFotoBtn}
              onPress={() => {
                // TODO: Implementar adição de foto
                Alert.alert('Em desenvolvimento', 'Funcionalidade de adicionar foto será implementada em breve.');
              }}
            >
              <Ionicons name="camera" size={16} color="#6BC24A" />
              <Text style={styles.addFotoText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          {fotos.length === 0 ? (
            <View style={styles.emptyFotos}>
              <Ionicons name="images-outline" size={48} color="#6BC24A" />
              <Text style={styles.emptyTitle}>Nenhuma foto cadastrada</Text>
              <Text style={styles.emptyText}>
                Adicione fotos para acompanhar a evolução do pé
              </Text>
            </View>
          ) : (
            <View style={styles.fotosGrid}>
              {fotos.map((foto) => (
                <TouchableOpacity
                  key={foto.id}
                  style={styles.fotoCard}
                  onPress={() => {
                    // TODO: Implementar visualização de foto em tela cheia
                    Alert.alert('Foto', `Data: ${foto.dataFoto ? new Date(foto.dataFoto).toLocaleDateString('pt-BR') : '—'}\nTipo: ${foto.tipo || '—'}`);
                  }}
                >
                  <Image
                    source={{ uri: foto.caminhoFoto }}
                    style={styles.fotoImage}
                    resizeMode="cover"
                  />
                  <View style={styles.fotoOverlay}>
                    <Text style={styles.fotoDate}>
                      {foto.dataFoto ? new Date(foto.dataFoto).toLocaleDateString('pt-BR') : '—'}
                    </Text>
                    <Text style={styles.fotoType}>{foto.tipo}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            // TODO: Implementar edição do pé
            Alert.alert('Em desenvolvimento', 'Funcionalidade de editar pé será implementada em breve.');
          }}
        >
          <Ionicons name="pencil" size={20} color="#FFFFFF" />
          <Text style={styles.editBtnText}>Editar Pé</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
      <Footer />
    </Background>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF'
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  deleteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
  },
  peCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#6BC24A',
  },
  peHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  peIdentificacao: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  situacaoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  situacaoText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  talhaoInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  locationSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  deficienciasSection: {
    marginBottom: 16,
  },
  deficienciaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  deficienciaText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 8,
  },
  noDeficiencias: {
    fontSize: 14,
    color: '#10B981',
    fontStyle: 'italic',
  },
  datesSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  fotosSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addFotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addFotoText: {
    color: '#6BC24A',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyFotos: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  fotosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fotoCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  fotoImage: {
    width: '100%',
    height: '100%',
  },
  fotoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
  },
  fotoDate: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  fotoType: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6BC24A',
    borderRadius: 8,
    paddingVertical: 16,
    marginBottom: 20,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});