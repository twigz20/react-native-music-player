import React, {useEffect, useState} from 'react';
import { 
  Text, 
  View, 
  StyleSheet ,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity
 } from 'react-native';

const Dev_Height = Dimensions.get("window").height
const Dev_Width = Dimensions.get("window").width

import Icon from "react-native-vector-icons/Ionicons"
import Slider from '@react-native-community/slider';

import TrackPlayer, {
    TrackPlayerEvents,
    STATE_PLAYING,
    usePlaybackState
} from 'react-native-track-player';
import { useTheme } from 'react-native-paper';
import {
    useTrackPlayerProgress,
    useTrackPlayerEvents,
} from 'react-native-track-player/lib/hooks';

function secondsToHms(d) {
    d = Number(d);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var mDisplay = m + (m == 1 ? ":" : ":");
    var sDisplay = s.toString().padStart(2, '0') + (s == 1 ? "" : "");
    return mDisplay + sDisplay; 
}

const DetailsScreen = ({ props, navigation }) => {
    const { colors } = useTheme();
    const playbackState = usePlaybackState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const {position, duration} = useTrackPlayerProgress(250);
    const [track, setTrack] = useState({duration:0});

    useEffect(() => {
        const startPlayer = async () => {
            const currentTrackId = await TrackPlayer.getCurrentTrack();
            let currentTrack = {};
            if (currentTrackId != null) {
                currentTrack = await TrackPlayer.getTrack(currentTrackId);
            }
            setTrack(currentTrack);
        }
        startPlayer();
    }, []);

     //this hook updates the value of the slider whenever the current position of the song changes
    useEffect(() => {
        if (!isSeeking && position && duration) {
            setSliderValue(position / duration);
        }
    }, [position, duration]);

    useTrackPlayerEvents([TrackPlayerEvents.PLAYBACK_STATE], event => {
        if (event.state === STATE_PLAYING) {
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
    });
    
    const slidingStarted = () => {
        setIsSeeking(true);
    };
    
    const slidingCompleted = async value => {
        await TrackPlayer.seekTo(value * duration);
        setSliderValue(value);
        setIsSeeking(false);
    };
    
    async function togglePlayback() {
        if (!isPlaying) {
            await TrackPlayer.play();
            //setIsPlaying(true);
        } else {
            await TrackPlayer.pause();
            //setIsPlaying(false);
        }
    }

    async function skipTrack(next) {
        if (next) {
            await TrackPlayer.skipToNext();
        } else {
            await TrackPlayer.skipToPrevious();
        }
    }

    return (
        <View style={styles.contanier}>
        <View style={styles.mainbar}>
          {/* <AntDesign name="left" size={24} style={{marginLeft:"5%"}} /> */}
          {/* <Text style={styles.now_playing_text}> Now Playing </Text> */}
          {/* <Entypo name="dots-three-horizontal" size={24} style={{marginLeft:"20%"}} /> */}
        </View>

        <View style={styles.music_logo_view}>
          <Image source={{uri:track.artwork}} style={styles.image_view}/>
        </View>

        <View style={styles.name_of_song_View} >
          <Text style={styles.name_of_song_Text1}>{track.title}</Text>
          <Text style={styles.name_of_song_Text2}>{track.artist}</Text>
        </View>

        <View style={styles.slider_view}>
          <Text style={styles.slider_time}> {secondsToHms(position)} </Text>
            <Slider
                style={styles.slider_style}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor={colors.primary}
                onSlidingStart={slidingStarted}
                onSlidingComplete={slidingCompleted}
                value={sliderValue}
            />
          <Text style={styles.slider_time}>{track ? secondsToHms(track.duration) : "0:00"}</Text>
        </View>

        <View style={styles.functions_view}>
          <Icon name="shuffle-outline" size={24} color={colors.primary} style={{marginLeft:"9%"}}></Icon>
          <TouchableOpacity 
            onPress={togglePlayback}
            style={{marginLeft:"12%"}}>
            <Icon name="play-back-outline" size={24} color={colors.primary}></Icon>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={togglePlayback}
            style={{marginLeft:"12%"}}>
            <Icon name="pause-circle-outline" size={50} color={colors.primary}></Icon>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={togglePlayback.bind(null, true)}
            style={{marginLeft:"12%"}}>
            <Icon name="play-forward-outline" size={24} color={colors.primary}></Icon>
          </TouchableOpacity>
          <Icon name="repeat-outline" size={20} color={colors.primary} style={{marginLeft:"10%"}}></Icon>
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
  contanier:{
    height:Dev_Height,
    width:Dev_Width
  },
  mainbar:{
    height:"10%",
    width:"100%",
    flexDirection:"row",
    alignItems:"center",
  },
  now_playing_text:{
    fontSize:19,
    marginLeft:"24%"
  },
  music_logo_view:{
    height:"30%",
    width:"100%",
    justifyContent:"center",
    alignItems:"center",
  },
  image_view:{
    height:"100%",
    width:"50%",
    borderRadius:10,
  },
  name_of_song_View:{
    height:"15%",
    width:"100%",
    alignItems:"center",
    justifyContent:"center"
  },
  name_of_song_Text1:{
    fontSize:19,
    fontWeight:"500"
  },
  name_of_song_Text2:{
    color:"#808080",
    marginTop:"4%"
  },
  slider_view:{
    height:"10%",
    width:"100%",
    alignItems:"center",
    flexDirection:"row"
  },
  slider_style:{
    height:"70%",
    width:"68%",
    marginRight: "-5%"
  },
  slider_time:{
    fontSize:15,
    marginLeft:"6%",
    color:"#808080"
  },
  functions_view:{
    flexDirection:"row",
    height:"10%",
    width:"100%",
    alignItems:"center"
  },
  recently_played_view:{
    height:"25%",
    width:"100%",
  },
  recently_played_text:{
    fontWeight:"bold",
    fontSize:16,
    color:"#808080",
    marginLeft:"5%",
    marginTop:"6%"
  },
  recently_played_list:{
    backgroundColor:"#FFE3E3",
    height:"50%",
    width:"90%",
    borderRadius:10,
    marginLeft:"5%",
    marginTop:"5%",
    alignItems:"center",
    flexDirection:"row"
  },
  recently_played_image:{
    height:"80%",
    width:"20%",
    borderRadius:10
  },
  recently_played_list_text:{
    height:"100%",
    width:"60%",
    justifyContent:"center"
  },
  recently_played_list_text1:{
    fontSize:15,
    marginLeft:"8%"
  },
  recently_played_list_text2:{
    fontSize:16,
    color:"#808080",
    marginLeft:"8%"
  }
})

export default DetailsScreen;