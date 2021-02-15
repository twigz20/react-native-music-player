import * as React from "react";
import { ImageBackground } from "react-native";
import backgroundImage from "./assets/background.jpg";

class BackgroundImage extends React.Component {
  render() {
    return (
      <ImageBackground
        style={{ flex: 1 }}
        source={backgroundImage}
        blurRadius={5}
      >
        {this.props.children}
      </ImageBackground>
    );
  }
}

export default BackgroundImage;
