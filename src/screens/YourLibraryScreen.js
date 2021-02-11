import React, { useEffect, useState } from 'react';
import { 
    ActivityIndicator, 
    FlatList, 
    Image, 
    View, 
    StyleSheet, 
    RefreshControl 
} from 'react-native';
import { List } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';

export default YourLibraryScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    getTracks();
  }, []);

  const getTracks = () => {
    fetch('http://192.168.1.113:8161/tracks')
    .then((response) => response.json())
    .then((json) => setData(json))
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
  }

  const onPress = async (track) => { 
    await TrackPlayer.reset();
    await TrackPlayer.add(track);
    await TrackPlayer.play();

    navigation.navigate('Details') 
  };

  const onRefresh = () => {
    //Clear old data of the list
    setData([]);
    //Call the Service to get the latest data
    getTracks();
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? <ActivityIndicator animating={true}/> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id.toString()}
          renderItem={({ item }) => (
            <List.Item
                title={item.title}
                description={item.artist}
                left={props => <Image source={{ uri: item.artwork}} style={styles.image_view}/>}
                onPress={onPress.bind(null, item)}
            />
          )}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={isLoading}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    image_view:{
      height:"100%",
      width:"20%",
      borderRadius:10
    },
  })