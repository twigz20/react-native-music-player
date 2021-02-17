import * as React from "react";
import { ImageBackground } from "react-native";
import { Box } from "react-native-design-utility";
import backgroundImage from "./assets/background.jpg";

class BackgroundImage extends React.Component {
  render() {
    return (
      <ImageBackground
        style={{ flex: 1 }}
        source={backgroundImage}
        blurRadius={5}
      >
        <Box
          f={1}
          mt={
            this.props.navbarSpace == undefined || this.props.navbarSpace
              ? 50
              : 0
          }
        >
          {this.props.children}
        </Box>
      </ImageBackground>
    );
  }
}

export default BackgroundImage;
