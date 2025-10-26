// components/MenuSub.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MenuSubProps {
  title?: string;
  dropdownOptions?: string[];
  onOptionSelect?: (option: string) => void;
  selectedOption?: string;
}

export const MenuSub = ({ 
  title = 'Análises Gerais',
  dropdownOptions = ['Propriedade 1', 'Propriedade 2', 'Propriedade 3'],
  onOptionSelect,
  selectedOption = 'Propriedade 1'
}: MenuSubProps) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(selectedOption);

  const handleOptionSelect = (option: string) => {
    setCurrentSelection(option);
    setIsDropdownVisible(false);
    onOptionSelect?.(option);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>{title}</Text>

      {/* Botão Dropdown */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          style={styles.dropdownButton}
          onPress={toggleDropdown}
        >
          <Text style={styles.dropdownButtonText}>{currentSelection}</Text>
          <Ionicons 
            name={isDropdownVisible ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#333" 
          />
        </TouchableOpacity>

        {/* Modal do Dropdown */}
        <Modal
          visible={isDropdownVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsDropdownVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsDropdownVisible(false)}
          >
            <View style={styles.dropdownMenu}>
              {dropdownOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    option === currentSelection && styles.dropdownItemSelected
                  ]}
                  onPress={() => handleOptionSelect(option)}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    option === currentSelection && styles.dropdownItemTextSelected
                  ]}>
                    {option}
                  </Text>
                  {option === currentSelection && (
                    <Ionicons name="checkmark" size={16} color="#FFA62B" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 150,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginRight: 8,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 16,
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 180,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemSelected: {
    backgroundColor: '#FFF8F0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  dropdownItemTextSelected: {
    color: '#FFA62B',
    fontWeight: '600',
  },
});