import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Avatar, Button, Dialog, Portal, Text, TextInput } from "react-native-paper";
import { addParticipant, getParticipants } from "../services/desafioService";

interface Participant {
  id: string;
  nome: string;
  email?: string;
}

interface ParticipantsTabProps {
  challengeId: string;
}

const ParticipantsTab: React.FC<ParticipantsTabProps> = ({ challengeId }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getParticipants(challengeId);
        console.log("Response from getParticipants:", response.body);
        if (response.ok) {
          const data = await response.json();
          setParticipants(data);
        } else {
          setError("Erro ao carregar participantes.");
        }
      } catch (err) {
        setError("Erro de conexão ao carregar participantes.");
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, [challengeId]);

  const handleAddParticipant = async () => {
    setAdding(true);
    setAddError(null);
    try {
      const response = await addParticipant(challengeId, newEmail);
      if (response.ok) {
        setDialogVisible(false);
        setNewEmail("");
        // Atualiza a lista
        const updated = await getParticipants(challengeId);
        if (updated.ok) {
          setParticipants(await updated.json());
        }
      } else {
        const errorData = await response.json();
        setAddError(errorData?.message || "Erro ao adicionar participante.");
      }
    } catch (err) {
      setAddError("Erro de conexão ao adicionar participante.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Carregando participantes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>{error}</Text>
        <Button mode="contained" onPress={() => setDialogVisible(true)} style={{ marginTop: 16 }}>
          Adicionar Participante
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={participants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Avatar.Text
              label={item.nome?.[0]?.toUpperCase() || "?"}
              size={40}
              style={{ marginRight: 12 }}
            />
            <View>
              <Text style={styles.name}>{item.nome}</Text>
              {item.email && <Text style={styles.email}>{item.email}</Text>}
            </View>
          </View>
        )}
      />
      <Button mode="contained" onPress={() => setDialogVisible(true)} style={{ margin: 16 }}>
        Adicionar Participante
      </Button>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Adicionar Participante</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="E-mail do participante"
              value={newEmail}
              onChangeText={setNewEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{ marginBottom: 8 }}
            />
            {addError && <Text style={{ color: 'red' }}>{addError}</Text>}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
            <Button loading={adding} onPress={handleAddParticipant} disabled={adding || !newEmail}>
              Adicionar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContent: {
    padding: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  email: {
    color: "#888",
    fontSize: 14,
  },
});

export default ParticipantsTab;
