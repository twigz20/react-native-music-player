// Use of Redux in React Native App | React Native Redux
// https://aboutreact.com/react-native-redux/
import React from 'react';
import {Text} from 'react-native';
import {connect} from 'react-redux';

const HeaderCountLabel = (props) => {
  return (
    <Text style={{color: 'white', fontWeight: 'bold', padding: 10}}>
      Bookmarked: {props.counter}
    </Text>
  );
};

const mapStateToProps = (state) => {
  const {counter} = state;
  return {
    counter: counter,
  };
};

export default connect(mapStateToProps)(HeaderCountLabel);