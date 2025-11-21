// import { TabBar } from '@/components/';
// import { TopProfile } from '@/components/top-profile';
// import { UserList } from '@/components/userList'; // Importe o UserList
// import React, { useState } from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// const App = () => {
//   const [activeTab, setActiveTab] = useState('home');

//   const handleTabPress = (tabName: string) => {
//     setActiveTab(tabName);
//     console.log('Tab pressionada:', tabName);
//   };

//   function handleMenuPress(): void {
//     throw new Error('Function not implemented.');
//   }

//   function handleProfilePress(): void {
//     throw new Error('Function not implemented.');
//   }

//   // Renderizar conteúdo baseado na tab ativa
//   const renderContent = () => {
//     switch (activeTab) {
//       case 'home':
//         return <UserList />; // UserList na tab home
//       case 'search':
//         return (
//           <View style={styles.tabContent}>
//             <Text style={styles.tabTitle}>Pesquisa</Text>
//             <Text>Conteúdo da tela de pesquisa</Text>
//           </View>
//         );
//       case 'favorites':
//         return (
//           <View style={styles.tabContent}>
//             <Text style={styles.tabTitle}>Favoritos</Text>
//             <Text>Conteúdo da tela de favoritos</Text>
//           </View>
//         );
//       case 'profile':
//         return (
//           <View style={styles.tabContent}>
//             <Text style={styles.tabTitle}>Perfil</Text>
//             <Text>Conteúdo da tela de perfil</Text>
//           </View>
//         );
//       default:
//         return <UserList />;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TopProfile 
//         userName="Paulo"
//         onMenuPress={handleMenuPress}
//         onProfilePress={handleProfilePress}
//         showGreeting={true}
//       />
      
//       {/* Conteúdo principal baseado na tab ativa */}
//       <View style={styles.content}>
//         {renderContent()}
//       </View>

//       {/* TabBar fixa na parte inferior */}
//       <TabBar 
//         activeTab={activeTab}
//         onTabPress={handleTabPress}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   content: {
//     flex: 1,
//   },
//   tabContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   tabTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 20,
//   },
// });

// export default App;
