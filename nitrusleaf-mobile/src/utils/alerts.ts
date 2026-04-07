import { Alert } from 'react-native';

export const showErrorAlert = (message: string, title: string = 'Erro') => {
  Alert.alert(title, message);
};

export const showSuccessAlert = (message: string, buttons?: any[], title: string = 'Sucesso') => {
  Alert.alert(title, message, buttons);
};

export const showConfirmAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  confirmText: string = 'Confirmar',
  cancelText: string = 'Cancelar'
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: confirmText,
        style: 'destructive',
        onPress: onConfirm,
      },
    ]
  );
};