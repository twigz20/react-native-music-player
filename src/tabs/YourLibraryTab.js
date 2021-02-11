import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CustomNavigationBar from '../components/CustomNavigationBar.js';
import YourLibraryScreen from '../screens/YourLibraryScreen.js';
import DetailsScreen from '../screens/DetailsScreen.js';

const YourLibraryStack = createStackNavigator();

const YourLibraryTab = ({ navigation }) => {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
  
    return (
        <YourLibraryStack.Navigator
          initialRouteName="YourLibrary"
          screenOptions={{
            header: (props) => <CustomNavigationBar {...props} />,
          }}>
          <YourLibraryStack.Screen name="YourLibrary" component={YourLibraryScreen} />
          <YourLibraryStack.Screen name="Details" component={DetailsScreen} />
        </YourLibraryStack.Navigator>
    );
}

export default YourLibraryTab;