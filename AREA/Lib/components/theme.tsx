
    import { Dimensions, Platform, StyleSheet } from 'react-native';

    export const styles = StyleSheet.create({
        appBarContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        appBarTitle:{
            height: 56
            ,
            alignSelf: 'center',
            fontFamily: 'Josefin',
            color: 'Black',
            fontSize: 36
        },
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        gradient: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        textinput: {
            height: 40,
            borderColor: 'black',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            borderWidth: 1,
            padding: 10
        },
        button: {
            backgroundColor: '#006064',
        },
        imageIcon: {
            width: 40,
            height: 40,
            borderRadius: 10,
            alignSelf: 'center',
        },
        image: {
            width: 120,
            height: 120,
            marginBottom: 20,
            borderRadius: 10,
            alignSelf: 'center',
        },
        title: {
            height: 70,
            marginBottom: 24,
            alignSelf: 'center',
            fontFamily: 'Josefin',
            color: 'white',
            fontSize: 64
        },
        error: {
            height: 40,
            marginBottom: 24,
            alignSelf: 'center',
            fontFamily: 'Inter',
            color: 'red',
            fontSize: 20
        },
        row : {
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingVertical: 20
        },
        appBar: {   
            width: Dimensions.get('window').width,
            height: 56,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            backgroundColor: '#11999E',
        },
        iconButton: {
            padding: 8,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          modalContent: {
            width: 300,
            padding: 20,
            backgroundColor: 'white',   
            borderRadius: 10,
          },
          modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 15,
            color: '#11999E',
            fontFamily: 'Josefin',
            textAlign: 'center',
          },
    });