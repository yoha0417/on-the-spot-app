import { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  useTheme,
} from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const theme = useTheme();
  const { login, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(username, password);
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
        }}
      >
        <Text
          variant="headlineMedium"
          style={{ marginBottom: 24, textAlign: 'center' }}
        >
          ログイン
        </Text>
        <TextInput
          label="ユーザー名"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          style={{ marginBottom: 12 }}
        />
        <TextInput
          label="パスワード"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={{ marginBottom: 8 }}
        />
        {error !== null && (
          <HelperText type="error" visible>
            {error}
          </HelperText>
        )}
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading || username.length === 0 || password.length === 0}
          style={{ marginTop: 12 }}
        >
          ログイン
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
