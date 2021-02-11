// Use of Redux in React Native App | React Native Redux
// https://aboutreact.com/react-native-redux/
import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {getPostsList, addToBookmark} from './utils/actions';

const PostList = (props) => {
  useState(() => {
    props.getPostsList();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <FlatList
          data={props.postData}
          ItemSeparatorComponent={
            () => <View style={styles.divider} />
          }
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  props.addToBookmark(item);
                }}>
                <View style={styles.innerContainer}>
                  <Text>
                    Id: {item.id}
                    {'\n'}
                    Title: {item.title}
                    {'\n'}
                    Body : {item.body}
                  </Text>
                  <Text style={styles.itemRed}>
                    Click to Add in Bookmark
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(_item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  const {postData} = state;
  return {
    postData: postData,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getPostsList: () => dispatch(getPostsList()),
  addToBookmark: (item) => dispatch(addToBookmark(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
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