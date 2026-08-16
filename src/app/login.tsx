import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, HelperText, useTheme } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const theme = useTheme();
  const { login, signUp, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handlePress = async () => {
    if (mode === 'login') {
      await login(email, password);
    } else {
      await signUp(email, password, name);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={styles.title}>
        {mode === 'login' ? 'ログイン' : '新規登録'}
      </Text>

      {mode === 'signup' && (
        <TextInput
          label="名前"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
          autoCapitalize="words"
        />
      )}

      <TextInput
        label="メールアドレス"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        label="パスワード"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        mode="outlined"
        secureTextEntry
      />

      {error ? (
        <HelperText type="error" visible>
          {error}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        onPress={handlePress}
        style={styles.button}
        disabled={!email.trim() || !password.trim() || (mode === 'signup' && !name.trim())}
      >
        {mode === 'login' ? 'ログイン' : '登録'}
      </Button>

      <Button mode="text" onPress={toggleMode} style={styles.toggleButton}>
        {mode === 'login' ? '新規登録はこちら' : 'ログイン画面に戻る'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    marginBottom: 32,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  toggleButton: {
    marginTop: 12,
    alignSelf: 'center',
  },
});
