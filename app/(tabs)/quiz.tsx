import { useEffect, useState } from 'react';
import {
    Animated,
    SafeAreaView, StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { vocabList } from '../../data/vocab';

function getRandomWord() {
  return vocabList[Math.floor(Math.random() * vocabList.length)];
}

function getChoices(correct) {
  const choices = [correct];
  while (choices.length < 4) {
    const random = getRandomWord();
    if (!choices.find(c => c.id === random.id)) {
      choices.push(random);
    }
  }
  return choices.sort(() => Math.random() - 0.5);
}

export default function QuizScreen() {
  const [question, setQuestion] = useState(getRandomWord());
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    setChoices(getChoices(question));
  }, [question]);

  function nextQuestion(word) {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0, duration: 200, useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 200, useNativeDriver: true
      }),
    ]).start();
    setTimeout(() => {
      setQuestion(word);
      setSelected(null);
    }, 200);
  }

  function handleAnswer(choice) {
    if (selected) return;
    setSelected(choice);
    setTotal(t => t + 1);
    if (choice.id === question.id) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      setTimeout(() => nextQuestion(getRandomWord()), 1000);
    } else {
      setStreak(0);
      setTimeout(() => nextQuestion(getRandomWord()), 1500);
    }
  }

  function getChoiceStyle(choice) {
    if (!selected) return styles.choiceBtn;
    if (choice.id === question.id) return [styles.choiceBtn, styles.correct];
    if (choice.id === selected.id) return [styles.choiceBtn, styles.wrong];
    return [styles.choiceBtn, styles.dimmed];
  }

  function getChoiceTextStyle(choice) {
    if (!selected) return styles.choiceText;
    if (choice.id === question.id) return [styles.choiceText, styles.correctText];
    if (choice.id === selected.id) return [styles.choiceText, styles.wrongText];
    return [styles.choiceText, styles.dimmedText];
  }

  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>⚡ Quiz</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{score}</Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{accuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: '#FF9800' }]}>
              🔥{streak}
            </Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>
      </View>

      {/* Question */}
      <Animated.View style={[styles.questionCard, { opacity: fadeAnim }]}>
        <Text style={styles.questionLabel}>What does this mean?</Text>
        <Text style={styles.questionKanji}>{question.kanji}</Text>
        <Text style={styles.questionReading}>{question.hiragana}</Text>
        <View style={[styles.levelBadge, { backgroundColor: levelColor(question.level) }]}>
          <Text style={styles.levelText}>{question.level}</Text>
        </View>
      </Animated.View>

      {/* Choices */}
      <View style={styles.choicesContainer}>
        {choices.map((choice, i) => (
          <TouchableOpacity
            key={i}
            style={getChoiceStyle(choice)}
            onPress={() => handleAnswer(choice)}
            activeOpacity={0.8}
          >
            <Text style={getChoiceTextStyle(choice)}>
              {choice.meaning}
            </Text>
            {selected && choice.id === question.id && (
              <Text style={styles.emoji}>✅</Text>
            )}
            {selected && choice.id === selected.id && choice.id !== question.id && (
              <Text style={styles.emoji}>❌</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Sentence hint after answer */}
      {selected && (
        <View style={styles.hintBox}>
          <Text style={styles.hintSentence}>{question.sentence}</Text>
          <Text style={styles.hintTranslation}>{question.translation}</Text>
        </View>
      )}

    </SafeAreaView>
  );
}

function levelColor(level) {
  const colors = {
    N5: '#4CAF50', N4: '#2196F3',
    N3: '#FF9800', N2: '#E91E63', N1: '#9C27B0'
  };
  return colors[level] || '#888';
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { padding: 20, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: {
    flex: 1, backgroundColor: '#1a1a2e',
    borderRadius: 12, padding: 10, alignItems: 'center',
    borderWidth: 1, borderColor: '#2a2a3e',
  },
  statNum: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 11, color: '#555', marginTop: 2 },
  questionCard: {
    margin: 20, backgroundColor: '#1a1a2e',
    borderRadius: 20, padding: 30, alignItems: 'center',
    borderWidth: 1, borderColor: '#2a2a3e',
  },
  questionLabel: { fontSize: 13, color: '#555', marginBottom: 12 },
  questionKanji: { fontSize: 56, color: '#fff', marginBottom: 8 },
  questionReading: { fontSize: 18, color: '#90caf9', marginBottom: 12 },
  levelBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  levelText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  choicesContainer: { paddingHorizontal: 20, gap: 10 },
  choiceBtn: {
    backgroundColor: '#1a1a2e', padding: 16,
    borderRadius: 14, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#2a2a3e',
  },
  correct: { backgroundColor: '#1a2a1a', borderColor: '#4CAF50' },
  wrong: { backgroundColor: '#2a1a1a', borderColor: '#f44336' },
  dimmed: { opacity: 0.4 },
  choiceText: { fontSize: 16, color: '#fff', fontWeight: '500' },
  correctText: { color: '#4CAF50' },
  wrongText: { color: '#f44336' },
  dimmedText: { color: '#888' },
  emoji: { fontSize: 18 },
  hintBox: {
    margin: 20, backgroundColor: '#1a1a2e',
    borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#2a2a3e',
  },
  hintSentence: { fontSize: 14, color: '#ccc', marginBottom: 6 },
  hintTranslation: { fontSize: 12, color: '#888' },
});