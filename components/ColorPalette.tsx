import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeColors, WHITE_COLOR } from '../constants/colors';

interface ColorPaletteProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  theme: ThemeColors;
}

export default function ColorPalette({
  colors,
  selectedColor,
  onColorSelect,
  theme,
}: ColorPaletteProps) {
  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.label, { color: theme.text }]}>
        🎨 Select Color:
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* White color (eraser) */}
        <TouchableOpacity
          style={[
            styles.colorButton,
            {
              backgroundColor: WHITE_COLOR,
              borderColor: selectedColor === WHITE_COLOR ? theme.primary : theme.border,
              borderWidth: selectedColor === WHITE_COLOR ? 4 : 2,
            },
          ]}
          onPress={() => onColorSelect(WHITE_COLOR)}
        >
          {selectedColor === WHITE_COLOR && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Game colors */}
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorButton,
              {
                backgroundColor: color,
                borderColor: selectedColor === color ? theme.primary : theme.border,
                borderWidth: selectedColor === color ? 4 : 2,
              },
            ]}
            onPress={() => onColorSelect(color)}
          >
            {selectedColor === color && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 2,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
