import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { vocabList } from '../../data/vocab';

export default function HomeScreen() {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [notifOn, setNotifOn] = useState(false);
  const word = vocabList[current];

  function nextWord() {
    setFlipped(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % vocabList.length);
    }, 150);
  }

  function prevWord() {
    setFlipped(false);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + vocabList.length) % vocabList.length);
    }, 150);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <Text style={styles.appTitle}>🇯🇵 JLPTify</Text>
        <Text style={styles.appSub}>Smart Japanese Vocab Coach</Text>

        {/* Level Badge */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: levelColor(word.level) }]}>
            <Text style={styles.badgeText}>{word.level}</Text>
          </View>
          <Text style={styles.typeText}>{word.type}</Text>
        </View>

        {/* Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => setFlipped(!flipped)}
          activeOpacity={0.9}
        >
          {!flipped ? (
            <View style={styles.cardFront}>
              <Text style={styles.kanji}>{word.kanji}</Text>
              <Text style={styles.hiragana}>{word.hiragana}</Text>
              <Text style={styles.katakana}>{word.katakana}</Text>
              <Text style={styles.romajiWord}>{word.romaji}</Text>
            </View>
          ) : (
            <View style={styles.cardBack}>
              <Text style={styles.meaning}>{word.meaning}</Text>
              <View style={styles.divider} />
              <Text style={styles.sentence}>{word.sentence}</Text>
              <Text style={styles.sentenceRomaji}>{word.sentenceRomaji}</Text>
              <Text style={styles.translation}>{word.translation}</Text>
            </View>
          )}
          <Text style={styles.flipHint}>
            {flipped ? '← tap to see kanji' : 'tap to see meaning →'}
          </Text>
        </TouchableOpacity>

        {/* Progress */}
        <Text style={styles.progress}>
          {current + 1} / {vocabList.length}
        </Text>

        {/* Navigation */}
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.navBtn} onPress={prevWord}>
            <Text style={styles.navText}>← Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={nextWord}>
            <Text style={styles.navText}>Next →</Text>
          </TouchableOpacity>
        </View>

        {/* Know it / Don't know */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.dontKnow]}
            onPress={nextWord}
          >
            <Text style={styles.actionText}>😅 Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.knowIt]}
            onPress={nextWord}
          >
            <Text style={styles.actionText}>✅ Got it!</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
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
  container: { alignItems: 'center', padding: 20, paddingBottom: 40 },
  appTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  appSub: { fontSize: 13, color: '#555', marginBottom: 16 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  typeText: { color: '#888', fontSize: 13 },
  card: {
    width: '100%', backgroundColor: '#1a1a2e',
    borderRadius: 20, padding: 30, alignItems: 'center',
    minHeight: 240, justifyContent: 'center',
    borderWidth: 1, borderColor: '#2a2a3e',
    shadowColor: '#000', shadowOpacity: 0.4,
    shadowRadius: 10, elevation: 8,
  },
  cardFront: { alignItems: 'center' },
  cardBack: { alignItems: 'center', width: '100%' },
  kanji: { fontSize: 64, color: '#fff', marginBottom: 8 },
  hiragana: { fontSize: 20, color: '#90caf9', marginBottom: 4 },
  katakana: { fontSize: 16, color: '#80cbc4', marginBottom: 4 },
  romajiWord: { fontSize: 14, color: '#888', fontStyle: 'italic' },
  meaning: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 4, textAlign: 'center' },
  divider: { width: '80%', height: 1, backgroundColor: '#2a2a3e', marginVertical: 10 },
  sentence: { fontSize: 15, color: '#ccc', textAlign: 'center', marginBottom: 4 },
  sentenceRomaji: { fontSize: 13, color: '#80cbc4', textAlign: 'center', marginBottom: 6, fontStyle: 'italic' },
  translation: { fontSize: 13, color: '#888', textAlign: 'center' },
  flipHint: { fontSize: 11, color: '#444', marginTop: 16 },
  progress: { color: '#555', fontSize: 13, marginTop: 16 },
  navRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  navBtn: {
    backgroundColor: '#1a1a2e', paddingHorizontal: 24,
    paddingVertical: 12, borderRadius: 12,
    borderWidth: 1, borderColor: '#2a2a3e',
  },
  navText: { color: '#fff', fontSize: 15 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  actionBtn: {
    flex: 1, paddingVertical: 14,
    borderRadius: 14, alignItems: 'center',
  },
  dontKnow: { backgroundColor: '#2a1a1a' },
  knowIt: { backgroundColor: '#1a2a1a' },
  actionText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});