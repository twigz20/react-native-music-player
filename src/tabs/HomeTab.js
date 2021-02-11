import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CustomNavigationBar from '../components/CustomNavigationBar.js';
import HomeScreen from '../screens/HomeScreen.js';
import DetailsScreen from '../screens/DetailsScreen.js';

const HomeStack = createStackNavigator();

const HomeTab = ({ navigation }) => {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
  
    return (
        <HomeStack.Navigator
          initialRouteName="Home"
          screenOptions={{
            header: (props) => <CustomNavigationBar {...props} />,
          }}>
          <HomeStack.Screen name="Home" component={HomeScreen} />
          <HomeStack.Screen name="Details" component={DetailsScreen} />
        </HomeStack.Navigator>
    );
}

export default HomeTab;