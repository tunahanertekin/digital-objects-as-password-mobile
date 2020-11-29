
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';

import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import CryptoJS from 'crypto-js';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash, faCopy, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import Clipboard from '@react-native-community/clipboard';

export default class App extends React.Component {

  state = {
    binaryData: "binary",
    hashedData: "hashed",
    avatarSource: {},
    message: "mo message",
    isFilePicked: false,
    
    fileProperties: {},
    isPasswordVisible: false,
    isCopied: false
  }
  


  async pickFile(){

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      this.setState({
        fileProperties: res
      })
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
            binaryData: contents,
            isFilePicked: true,
            isCopied: false
          })
          this.evaluateHash()
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
      <View style={{ flex: 6, flexDirection: "column", alignItems: "center", backgroundColor: "black" }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ fontFamily: "courier", fontWeight: "bold", fontSize: 25, color: "white" }}>
            Create Powerful Passwords!
          </Text>
        </View>
        <View style={{ flex: 3, justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
          onPress = { () => this.pickFile() }
          style={{ margin: 5, alignItems: "center" }}
          >
            <Text style = {{ color: "yellow", margin: 10, fontStyle: "italic" }}>
              Upload A File: 
            </Text>
            {
              this.state.isFilePicked?
              <FontAwesomeIcon icon={faFileUpload} color="green" size={40} style={{ margin: 10  }} />:
              <FontAwesomeIcon icon={faFileUpload} color="white" size={40} style={{ margin: 10  }} />
            }
          </TouchableOpacity>
         
          
          <Text style={{ color: "yellow", fontFamily: "courier", fontWeight: "bold", fontSize: 20 }}>
            File picked: &nbsp;
          { this.state.isFilePicked?   this.state.fileProperties.name  : "..." }
          </Text> 

          <View style={{ backgroundColor: "black", margin: 20, opacity: 0.5 }}>
            <Text style = {{ backgroundColor: "yellow", color: "black", fontStyle: "italic", padding: 15, borderRadius: 15, borderColor: "red", borderWidth: 4 }}>
              { this.state.isFilePicked? this.state.isPasswordVisible? this.state.hashedData : "Your password is generated." : "No file is picked." }
            </Text>
          </View>

          <View style={{ flexDirection: "row" }} >
            <TouchableOpacity
            onPress = { () => this.setState({ isPasswordVisible: !this.state.isPasswordVisible }) }
            style={{ marginHorizontal: 15 }}
            >
              { this.state.isPasswordVisible?
              <FontAwesomeIcon icon={faEye} color="white" size={25} />:
              <FontAwesomeIcon icon={faEyeSlash} color="white" size={25} />
              }
            </TouchableOpacity>

            <TouchableOpacity
            style={{ marginHorizontal: 15 }}
            onPress = { () => 
              {
                if(this.state.isFilePicked){
                  Clipboard.setString(this.state.hashedData)
                  this.setState({ isCopied: true })
                }
              }
            }
            >
              {
                this.state.isCopied?
                <FontAwesomeIcon icon={faCopy} color="green" size={25} />:
                <FontAwesomeIcon icon={faCopy} color="white" size={25} />
              }
              
            </TouchableOpacity>
            
          </View>

        </View>
        <View style={{ flex: 2, justifyContent: "center" }}>
          {
            this.state.isCopied?
            <Text style={{ color: "yellow", fontFamily: "courier", fontWeight: "bold", fontSize: 20  }}> Password is copied to clipboard! </Text>:
            null
          }
        </View>
        
      </View>
    )
  }
}
