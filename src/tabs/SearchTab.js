import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CustomNavigationBar from '../components/CustomNavigationBar.js';
import SearchScreen from '../screens/SearchScreen.js';
import DetailsScreen from '../screens/DetailsScreen.js';

const SearchStack = createStackNavigator();

const SearchTab = ({ navigation }) => {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
  
    return (
        <SearchStack.Navigator
          initialRouteName="Search"
          screenOptions={{
            header: (props) => <CustomNavigationBar {...props} />,
          }}>
          <SearchStack.Screen name="Search" component={SearchScreen} />
          <SearchStack.Screen name="Details" component={DetailsScreen} />
        </SearchStack.Navigator>
    );
}

export default SearchTab;