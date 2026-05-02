// // components/charts/DonutChartAlternative.tsx
// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import Svg, { Circle, Path } from 'react-native-svg';

// export interface DonutData {
//   name: string;
//   percentage: number;
//   value: number;
//   color: string;
// }

// interface DonutChartProps {
//   data: DonutData[];
//   analyzed: number;
//   total: number;
//   onPress?: () => void;
// }

// // ─── Gráfico interno ──────────────────────────────────────────────────────────
// const Donut: React.FC<{ data: DonutData[]; size: number }> = ({ data, size }) => {
//   const radius = size / 2;
//   const strokeWidth = radius * 0.38;
//   const centerRadius = radius - strokeWidth / 2;
//   const totalPct = data.reduce((s, i) => s + i.percentage, 0);
//   let currentAngle = -90;

//   const polarToCartesian = (angle: number) => {
//     const rad = (angle * Math.PI) / 180;
//     return {
//       x: radius + centerRadius * Math.cos(rad),
//       y: radius + centerRadius * Math.sin(rad),
//     };
//   };

//   const describeArc = (startAngle: number, endAngle: number) => {
//     const safeEnd = endAngle - startAngle >= 360 ? startAngle + 359.99 : endAngle;
//     const start = polarToCartesian(startAngle);
//     const end = polarToCartesian(safeEnd);
//     const largeArc = safeEnd - startAngle <= 180 ? 0 : 1;
//     return `M ${start.x} ${start.y} A ${centerRadius} ${centerRadius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
//   };

//   const slices = data.map((item) => {
//     const angle = (item.percentage / totalPct) * 360;
//     const startAngle = currentAngle;
//     currentAngle += angle;
//     return { ...item, startAngle, endAngle: currentAngle };
//   });

//   return (
//     <Svg width={size} height={size}>
//       <Circle cx={radius} cy={radius} r={centerRadius} stroke="#F0F0F0" strokeWidth={strokeWidth} fill="none" />
//       {slices.map((slice, i) => (
//         <Path
//           key={i}
//           d={describeArc(slice.startAngle, slice.endAngle)}
//           stroke={slice.color}
//           strokeWidth={strokeWidth}
//           fill="none"
//           strokeLinecap="butt"
//         />
//       ))}
//       <Circle cx={radius} cy={radius} r={centerRadius - strokeWidth / 2} fill="#FFFFFF" />
//     </Svg>
//   );
// };

// // ─── Card completo ────────────────────────────────────────────────────────────
// const CHART_SIZE = 130;

// export const DonutChart: React.FC<DonutChartProps> = ({
//   data,
//   analyzed,
//   total,
//   onPress,
// }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Ocorrências totais de deficiências em %</Text>

//       <View style={styles.chartRow}>
//         {/* Donut + label central */}
//         <View style={styles.donutWrapper}>
//           <Donut data={data} size={CHART_SIZE} />
//           <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
//             <View style={styles.centerLabel}>
//               <Text>
//                 <Text style={styles.centerMain}>{analyzed}</Text>
//                 <Text style={styles.centerSub}>/{total}</Text>
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Legenda */}
//         <View style={styles.legend}>
//           {data.map((item, i) => (
//             <View key={i} style={styles.legendItem}>
//               <View style={[styles.badge, { backgroundColor: item.color }]}>
//                 <Text style={styles.badgeText}>{item.percentage}%</Text>
//               </View>
//               <Text style={styles.legendName}>{item.name}</Text>
//               <Text style={styles.legendCount}>{item.value}</Text>
//             </View>
//           ))}
//         </View>
//       </View>

//       <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
//         <Text style={styles.buttonText}>Ver detalhes</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     borderTopWidth: 4,
//     borderTopColor: '#98979F',
//     borderTopLeftRadius: 0,
//     borderTopRightRadius: 0,
//   },
//   title: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#1A2C3E',
//     marginBottom: 16,
//   },
//   chartRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//     marginBottom: 20,
//   },
//   donutWrapper: {
//     width: CHART_SIZE,
//     height: CHART_SIZE,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   centerLabel: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   centerMain: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: '#1A1A1A',
//   },
//   centerSub: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#1A1A1A',
//   },
//   legend: {
//     flex: 1,
//     gap: 10,
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   badge: {
//     borderRadius: 10,
//     paddingHorizontal: 7,
//     paddingVertical: 2,
//     minWidth: 42,
//     alignItems: 'center',
//   },
//   badgeText: {
//     color: '#FFF',
//     fontSize: 11,
//     fontWeight: '700',
//   },
//   legendName: {
//     flex: 1,
//     fontSize: 13,
//     color: '#444',
//     fontWeight: '500',
//   },
//   legendCount: {
//     fontSize: 13,
//     color: '#888',
//     fontWeight: '500',
//   },
//   button: {
//     backgroundColor: '#6BC24A',
//     borderRadius: 25,
//     paddingVertical: 13,
//     alignItems: 'center',
//   },
//   buttonText: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#FFF',
//   },
// });