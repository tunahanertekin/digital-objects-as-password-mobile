
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableHighlightBase
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import CryptoJS from 'crypto-js';

export default class App extends React.Component {

  state = {
      options: {
      title: 'Select Photo',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      }
    },
    binaryData: "heyu",
    hashedData: "hashed",
    avatarSource: {},
    message: "mo message"
  }
  

  pickPhoto = () => {
    ImagePicker.showImagePicker(this.state.options, (response) => {
     
      if (response.didCancel) {
        this.setState({
          message: "User cancelled image picker."
        })
      } else if (response.error) {
        this.setState({
          message: response.error
        })
      } else if (response.customButton) {
        this.setState({
          message: response.customButton
        })
      } else {

        const source = { uri: 'data:image/jpeg;base64,' + response.data };
     
        this.setState({
          avatarSource: source,
          binaryData: response.data,
          message: "Image is picked."
        });
      }

      console.log(this.state.message)

    });
  }

  async pickOtherFile(){

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );

      //------------------READ FILE--------------------

      try {
        
        RNFS.readFile(res.uri, 'base64')
        .then((contents) => {
          this.setState({
            binaryData: contents
          })
        })
        .catch((err) => {
          console.log(err.message, err.code);
        });

      } catch (error) {
        console.log("error:", error.message)
      }
      
      //------------------END READ FILE--------------------



    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }

    
  }

  async evaluateHash(){

    this.setState({
      hashedData: await CryptoJS.SHA256(this.state.binaryData).toString()
    })
 
  }
  

  render() {
    return(
      <View>
        <TouchableOpacity
        onPress = { () => this.pickPhoto() }
        >
          <Text>
            Fotoğraf seç!
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress = { () => this.pickOtherFile() }
        >
          <Text>
            Dosya seç!
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress = { () => this.evaluateHash() }
        >
          <Text>
            Özet fonksiyonunu al.
          </Text>
        </TouchableOpacity>
        <Text>
          { this.state.hashedData }

        </Text>
        <Image source={this.state.avatarSource} style={{ width: 400, height: 400 }}  />
      </View>
    )
  }
}
