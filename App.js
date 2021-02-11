import React, {useEffect, useState} from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

import TrackPlayer from 'react-native-track-player';

import HomeTab from './src/tabs/HomeTab.js';
import SearchTab from './src/tabs/SearchTab.js';
import YourLibraryTab from './src/tabs/YourLibraryTab.js';

import MiniPlayer from './src/components/MiniPlayer.js';

const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors
  },
};

const Main = (props) => {
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    const startPlayer = async () => {
        let isInit =  await setup();
        setIsTrackPlayerInit(isInit);
    }
    startPlayer();
  }, []);

  async function setup() {
    await TrackPlayer.setupPlayer({
      maxCacheSize: 1024 * 10
    });
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_JUMP_FORWARD,
        TrackPlayer.CAPABILITY_JUMP_BACKWARD,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE
      ]
    });
    return true;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        barStyle={{ backgroundColor: colors.primary }}
        tabBar={(tabsProps) => (
          <>
            <MiniPlayer />
            <BottomTabBar {...tabsProps}/>
          </>
        )}
        tabBarOptions={{
          activeTintColor: "red"
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeTab}         
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }} />
        <Tab.Screen 
          name="Search" 
          component={SearchTab} 
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="magnify" color={color} size={26} />
            ),
          }}/>
        <Tab.Screen 
          name="Your Library" 
          component={YourLibraryTab} 
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="music-box-multiple" color={color} size={26} />
            ),
          }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App(props) {
  return (
    <PaperProvider theme={theme}>
      <Main />
    </PaperProvider>
  );
}