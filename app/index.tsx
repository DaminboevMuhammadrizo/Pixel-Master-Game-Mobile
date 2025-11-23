// app/index.tsx
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ColorPalette from '../components/ColorPalette';
import CompletionModal from '../components/CompletionModal';
import GameBoard from '../components/GameBoard';
import Header from '../components/Header';
import { GAME_COLORS, THEME_COLORS, WHITE_COLOR } from '../constants/colors';
import {
    calculateScore,
    checkCompletion,
    createEmptyGrid,
    createTargetGrid,
    getColorCount,
    getCurrentLevel,
    getGridSize,
    getStageInLevel,
} from '../utils/gameLogic';
import {
    loadGameState,
    loadSettings,
    saveGameState,
    saveHighScore,
    saveSettings,
} from '../utils/storage';

export default function Index() {
  // Game State
  const [currentStage, setCurrentStage] = useState(1);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [grid, setGrid] = useState<string[][]>([]);
  const [targetGrid, setTargetGrid] = useState<string[][]>([]);
  const [selectedColor, setSelectedColor] = useState(WHITE_COLOR);
  const [completed, setCompleted] = useState(false);

  // Settings
  const [showTarget, setShowTarget] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const totalStages = 400;
  const level = getCurrentLevel(currentStage);
  const stageInLevel = getStageInLevel(currentStage);
  const theme = darkMode ? THEME_COLORS.dark : THEME_COLORS.light;

  // Load saved data on mount
  useEffect(() => {
    // Kichik kechikish bilan yuklash (modallar to'qnashmasligi uchun)
    const timer = setTimeout(() => {
      loadData();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Save game state when it changes
  useEffect(() => {
    if (grid.length > 0) {
      saveGameState({
        currentStage,
        totalStages,
        score,
        moves,
        grid,
        targetGrid,
      });
    }
  }, [currentStage, score, moves, grid]);

  const loadData = async () => {
    const savedSettings = await loadSettings();
    if (savedSettings) {
      setDarkMode(savedSettings.darkMode);
      setSoundEnabled(savedSettings.soundEnabled);
      setMusicEnabled(savedSettings.musicEnabled);
    }

    const savedGame = await loadGameState();
    if (savedGame && savedGame.currentStage > 1) {
      // Faqat bitta Alert, qisqa va aniq
      setTimeout(() => {
        Alert.alert(
          'Continue?',
          `Stage ${savedGame.currentStage}`,
          [
            {
              text: 'New Game',
              onPress: () => initStage(1),
              style: 'cancel'
            },
            {
              text: 'Continue',
              onPress: () => {
                setCurrentStage(savedGame.currentStage);
                setScore(savedGame.score);
                setMoves(savedGame.moves);
                setGrid(savedGame.grid);
                setTargetGrid(savedGame.targetGrid);
                setSelectedColor(
                  GAME_COLORS.slice(0, getColorCount(getCurrentLevel(savedGame.currentStage)))[0]
                );
              },
            },
          ],
          { cancelable: false } // Tashqariga bosilsa yopilmasin
        );
      }, 100);
    } else {
      initStage(1);
    }
  };

  const initStage = (stage: number) => {
    const currentLevel = getCurrentLevel(stage);
    const size = getGridSize(currentLevel);
    const newTargetGrid = createTargetGrid(size, stage, currentLevel);
    const newGrid = createEmptyGrid(size);
    const availableColors = GAME_COLORS.slice(0, getColorCount(currentLevel));

    setTargetGrid(newTargetGrid);
    setGrid(newGrid);
    setMoves(0);
    setCompleted(false);
    setSelectedColor(availableColors[0]);
  };

  const handleCellPress = (row: number, col: number) => {
    if (completed) return;

    const newGrid = grid.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? selectedColor : cell))
    );

    setGrid(newGrid);
    setMoves(moves + 1);

    // Check completion
    const isComplete = checkCompletion(newGrid, targetGrid);
    if (isComplete) {
      const stageScore = calculateScore(moves + 1, currentStage, targetGrid);
      const newScore = score + stageScore;
      setScore(newScore);
      setCompleted(true);
      saveHighScore(newScore);
    }
  };

  const handleNextStage = () => {
    if (currentStage < totalStages) {
      const nextStage = currentStage + 1;
      setCurrentStage(nextStage);
      initStage(nextStage);
    } else {
      // Game completed - restart
      setCurrentStage(1);
      setScore(0);
      initStage(1);
    }
  };

  const handleReset = () => {
    Alert.alert('Reset Stage?', 'This will clear your current progress on this stage.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        onPress: () => {
          setGrid(createEmptyGrid(grid.length));
          setMoves(0);
          setCompleted(false);
        },
      },
    ]);
  };

  const handleSettings = () => {
    Alert.alert(
      'Settings',
      'Toggle your preferences:',
      [
        {
          text: `Target: ${showTarget ? 'Visible' : 'Hidden'}`,
          onPress: () => setShowTarget(!showTarget),
        },
        {
          text: `Theme: ${darkMode ? 'Dark' : 'Light'}`,
          onPress: () => {
            const newDarkMode = !darkMode;
            setDarkMode(newDarkMode);
            saveSettings({
              darkMode: newDarkMode,
              soundEnabled,
              musicEnabled,
              soundVolume: 50,
              musicVolume: 20,
            });
          },
        },
        {
          text: `Sound: ${soundEnabled ? 'On' : 'Off'}`,
          onPress: () => {
            const newSound = !soundEnabled;
            setSoundEnabled(newSound);
            saveSettings({
              darkMode,
              soundEnabled: newSound,
              musicEnabled,
              soundVolume: 50,
              musicVolume: 20,
            });
          },
        },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  const availableColors = GAME_COLORS.slice(0, getColorCount(level));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Header
          level={level}
          stage={currentStage}
          stageInLevel={stageInLevel}
          score={score}
          moves={moves}
          totalStages={totalStages}
          theme={theme}
          onSettingsPress={handleSettings}
        />

        {/* Target Grid */}
        <GameBoard
          grid={targetGrid}
          onCellPress={() => {}}
          theme={theme}
          title="🎯 Target Pattern"
          showGrid={showTarget}
        />

        {/* Player Grid */}
        <GameBoard
          grid={grid}
          onCellPress={handleCellPress}
          theme={theme}
          title="🎨 Your Canvas"
        />

        {/* Color Palette */}
        <ColorPalette
          colors={availableColors}
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
          theme={theme}
        />

        {/* Action Buttons */}
        <View style={[styles.buttonContainer, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.danger }]}
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>↻ Reset</Text>
          </TouchableOpacity>

          {completed && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.success }]}
              onPress={handleNextStage}
            >
              <Text style={styles.buttonText}>
                {currentStage < totalStages ? 'Next Stage →' : 'Restart 🔄'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Completion Modal */}
      <CompletionModal
        visible={completed}
        stage={currentStage}
        stageInLevel={stageInLevel}
        level={level}
        score={score}
        totalStages={totalStages}
        onNextStage={handleNextStage}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
