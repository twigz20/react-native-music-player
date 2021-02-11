// Use of Redux in React Native App | React Native Redux
// https://aboutreact.com/react-native-redux/
export const addToBookmark = (item) => {
    return (dispatch) => {
      dispatch({
        type: 'ADD_BOOKMARK',
        payload: item,
      });
    };
  };
  
  export const removeFromBookmark = (item) => {
    return (dispatch) => {
      dispatch({
        type: 'REMOVE_BOOKMARK',
        payload: item,
      });
    };
  };
  
  export const sortBookMarkList = () => {
    return (dispatch) => {
      dispatch({
        type: 'SORT_BOOKMARK_LIST',
      });
    };
  };
  
  export const getPostsList = () => {
    return (dispatch) => {
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((responseJson) => {
          dispatch({
            type: 'POST_LIST_DATA',
            payload: responseJson,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    };
  };