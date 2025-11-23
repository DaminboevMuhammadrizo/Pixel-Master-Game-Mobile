import React from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ThemeColors } from '../constants/colors';

interface CompletionModalProps {
  visible: boolean;
  stage: number;
  stageInLevel: number;
  level: number;
  score: number;
  totalStages: number;
  onNextStage: () => void;
  theme: ThemeColors;
}

export default function CompletionModal({
  visible,
  stage,
  stageInLevel,
  level,
  score,
  totalStages,
  onNextStage,
  theme,
}: CompletionModalProps) {
  const isLevelComplete = stageInLevel === 5;
  const isGameComplete = stage >= totalStages;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onNextStage}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.card }]}>
          {/* Emoji */}
          <Text style={styles.emoji}>
            {isLevelComplete ? '🎊' : '🎉'}
          </Text>

          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>
            {isGameComplete
              ? 'Game Complete!'
              : isLevelComplete
              ? `Level ${level} Complete!`
              : 'Great Job!'}
          </Text>

          {/* Stage Info */}
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Stage {stage}/{totalStages}
          </Text>

          {/* Score */}
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreLabel, { color: theme.textSecondary }]}>
              Total Score
            </Text>
            <Text style={[styles.scoreValue, { color: theme.success }]}>
              {score}
            </Text>
          </View>

          {/* Level Complete Message */}
          {isLevelComplete && !isGameComplete && (
            <Text style={[styles.levelMessage, { color: theme.primary }]}>
              ⭐ Next level will be harder! ⭐
            </Text>
          )}

          {/* Game Complete Message */}
          {isGameComplete && (
            <Text style={[styles.levelMessage, { color: theme.primary }]}>
              🏆 You completed all stages! 🏆
            </Text>
          )}

          {/* Next Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.success }]}
            onPress={onNextStage}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isGameComplete ? 'Play Again 🔄' : 'Next Stage →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: Dimensions.get('window').width - 64,
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  levelMessage: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
