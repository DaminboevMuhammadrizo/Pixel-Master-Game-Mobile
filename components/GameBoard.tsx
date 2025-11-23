import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeColors } from '../constants/colors';

interface GameBoardProps {
  grid: string[][];
  onCellPress: (row: number, col: number) => void;
  theme: ThemeColors;
  title: string;
  showGrid?: boolean;
}

export default function GameBoard({
  grid,
  onCellPress,
  theme,
  title,
  showGrid = true,
}: GameBoardProps) {
  const size = grid.length;
  const screenWidth = Dimensions.get('window').width;
  const maxGridWidth = Math.min(screenWidth - 64, 400);
  const cellSize = Math.floor(maxGridWidth / size) - 2;

  if (!showGrid) {
    return (
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <View style={styles.hiddenContainer}>
          <Text style={[styles.hiddenText, { color: theme.textSecondary }]}>
            🙈 Grid hidden
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

      <View style={styles.gridContainer}>
        <View
          style={[
            styles.grid,
            {
              backgroundColor: theme.border,
              gap: 2,
              padding: 4,
              borderRadius: 8,
            },
          ]}
        >
          {grid.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map((color, j) => (
                <TouchableOpacity
                  key={`${i}-${j}`}
                  style={[
                    styles.cell,
                    {
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: color,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => onCellPress(i, j)}
                  activeOpacity={0.7}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  gridContainer: {
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    gap: 2,
  },
  cell: {
    borderRadius: 4,
    borderWidth: 1,
  },
  hiddenContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenText: {
    fontSize: 16,
  },
});
