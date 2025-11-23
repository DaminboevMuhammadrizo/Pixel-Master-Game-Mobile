import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeColors } from '../constants/colors';

interface HeaderProps {
    level: number;
    stage: number;
    stageInLevel: number;
    score: number;
    moves: number;
    totalStages: number;
    theme: ThemeColors;
    onSettingsPress: () => void;
}

export default function Header({
    level,
    stage,
    stageInLevel,
    score,
    moves,
    totalStages,
    theme,
    onSettingsPress,
}: HeaderProps) {
    const progress = (stage / totalStages) * 100;

    return (
        <View style={[styles.container, { backgroundColor: theme.card }]}>
            {/* Title va Settings tugmasi */}
            <View style={styles.topRow}>
                <View>
                    <Text style={[styles.title, { color: theme.text }]}>
                        🎨 Pixel Master
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Stage {stage}/{totalStages} • Level {level} ({stageInLevel}/5)
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.settingsBtn, { backgroundColor: theme.primary }]}
                    onPress={onSettingsPress}
                >
                    <Text style={styles.settingsIcon}>⚙️</Text>
                </TouchableOpacity>
            </View>

            {/* Stats (Level, Score, Moves) */}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: theme.primary }]}>
                        {level}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Level
                    </Text>
                </View>

                <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: theme.warning }]}>
                        {score}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Score
                    </Text>
                </View>

                <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: theme.success }]}>
                        {moves}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Moves
                    </Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressLabels}>
                    <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                        Level progress: {stageInLevel}/5
                    </Text>
                    <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                        {Math.floor(progress)}%
                    </Text>
                </View>

                <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${progress}%`, backgroundColor: theme.success }
                        ]}
                    />
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
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    settingsBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsIcon: {
        fontSize: 22,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    statBox: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 11,
        marginTop: 2,
    },
    progressContainer: {
        marginTop: 8,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    progressText: {
        fontSize: 11,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
});
