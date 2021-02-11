// Use of Redux in React Native App | React Native Redux
// https://aboutreact.com/react-native-redux/
import React from 'react';
import {
  FlatList,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {removeFromBookmark} from './utils/actions';

const BookmarkScreen = (props) => {
  const getItem = (item) => {
    props.removeFromBookmark(item);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleStyle}>
          React Native + Redux Example
        </Text>
        <Text style={{textAlign: 'center'}}>
          Total Bookmarks: {props.counter}
        </Text>
        <FlatList
          data={props.bookmarkItems}
          ItemSeparatorComponent={
            () => <View style={styles.divider} />
          }
          renderItem={({item}) => {
            return (
              <TouchableOpacity onPress={() => getItem(item)}>
                <View style={styles.innerContainer}>
                  <Text>
                    Id: {item.id}
                    {'\n'}
                    Title: {item.title}
                    {'\n'}
                    Body : {item.body}
                  </Text>
                  <Text style={styles.itemRed}>
                    Remove from Bookmark
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(_item, index) => index.toString()}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => props.navigation.navigate('PostList')}
          style={styles.touchableOpacityStyle}>
          <Image
            source={{
              uri:
                'https://raw.githubusercontent.com/AboutReact/sampleresource/master/plus_icon.png',
            }}
            style={styles.floatingButtonStyle}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: 'grey',
        }}>
        www.aboutreact.com
      </Text>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  const {counter, bookmarkItems} = state;
  return {
    counter: counter,
    bookmarkItems: bookmarkItems,
  };
};

const mapDispatchToProps = (dispatch) => ({
  removeFromBookmark: (item) => dispatch(removeFromBookmark(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  titleStyle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  textStyle: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
  innerContainer: {
    padding: 10,
  },
  itemRed: {
    color: 'red',
  },
  divider: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#C8C8C8',
  },
});