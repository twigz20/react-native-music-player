import React, { useContext, useState } from "react";
import { Text } from "react-native-design-utility";
import { Modal, Portal, TextInput } from "react-native-paper";

import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useEffect } from "react";
import { database } from "../../database/index.js";
import { useDatabaseInfo } from "../../hooks/useDatabase.js";
import { useDatabase } from "../../contexts/DatabaseContext.js";

const AddUpdatePlaylistModal = ({ hideModal, isUpdate, playlist }) => {
  const { addPlaylist, renamePlaylist } = useDatabase();
  const [playlistIdToUpdate, setPlaylistIdToUpdate] = useState("");
  const [modalInputValue, setModalInputValue] = useState("");
  const [modalTitle, setModalTitle] = useState("New Playlist");
  const [modalActionRight, setModalActionRight] = useState("CREATE");

  useEffect(() => {
    if (isUpdate && playlist) {
      setPlaylistIdToUpdate(playlist.playlist_id);
      setModalInputValue(playlist.playlist_id);
      setModalTitle("Rename Playlist");
      setModalActionRight("SAVE");
    }
  }, []);

  return (
    <Portal>
      <Modal
        visible={true}
        onDismiss={() => {
          setModalInputValue("");
          hideModal();
        }}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{modalTitle}</Text>
          <View style={styles.modalInputContainer}>
            <TextInput
              label="Playlist Name"
              value={modalInputValue}
              numberOfLines={1}
              onChangeText={(text) => setModalInputValue(text)}
            />
          </View>
          <View style={styles.modalActionsContainer}>
            <TouchableOpacity
              onPress={() => {
                setModalInputValue("");
                hideModal();
              }}
            >
              <Text style={styles.modalActionCancel}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                let playlist_id = modalInputValue.trim();
                if (playlist_id != "") {
                  if (isUpdate) {
                    renamePlaylist(playlistIdToUpdate, playlist_id);
                    setPlaylistIdToUpdate("");
                  } else {
                    await addPlaylist(playlist_id);
                  }
                  setModalInputValue("");
                  hideModal();
                }
              }}
            >
              <Text style={styles.modalActionCreate}>{modalActionRight}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#1f2126",
    width: "60%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 5,
    borderRadius: 10,
  },
  modalTitle: {
    color: "white",
    textAlign: "center",
  },
  modalInputContainer: {
    width: "80%",
    alignSelf: "center",
    marginTop: 20,
  },
  modalActionsContainer: {
    alignSelf: "center",
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
  },
  modalActionCancel: {
    marginRight: 10,
    color: "white",
  },
  modalActionCreate: {
    color: "white",
  },
});

export default AddUpdatePlaylistModal;
