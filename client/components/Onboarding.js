import * as React from 'react';
import { Text, TextInput, SafeAreaView, StyleSheet, TouchableOpacity, View, Image, Dimensions} from 'react-native';
import { connect } from 'react-redux';
import { changeRegNumber  } from '../actions/counts.js';
import rem from 'pr-unit';

  ////////// New pages in onboarding

  export function Onboarding1({ navigation }) {
    return (
      <SafeAreaView style={style.background}>
        <View style={{marginTop: 50}}>
        <Text style={style.heading}>Nu är det slut på{"\n"}P-böter!</Text>
        <Text style={style.description}>Våra tester som vi utfört på bilägare i Stockholm visar att de minskade risken för att få P-böter upp till 70%.</Text>
        </View>
        <View style={{marginBottom: 20 }}>
        <TouchableOpacity
          style={style.nextButton}
          onPress={() => navigation.navigate('Onboarding2')}>
            <Text style={style.nextButtonText} >
              Nästa
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeApp')}
        >
          <Text style={style.skipButton}>
            Hoppa över
          </Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  export function Onboarding2({ navigation }) {
    return (
      <SafeAreaView style={style.background}>
        <View style={{marginTop: 50}}>
        <Text style={style.heading}>Glömt städgata igen?</Text>
        <Text style={style.description}>P-hjälpen glömmer inte när det är dags att flytta på bilen. Välj när du vill bli påmind.</Text>
        </View>
        <View style={{marginBottom: 20 }}>
        <TouchableOpacity
          style={style.nextButton}
          onPress={() => navigation.navigate('Onboarding3')}>
            <Text style={style.nextButtonText}>
              Nästa
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeApp')}
        >
          <Text style={style.skipButton}>
            Hoppa över
          </Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    );
  };
  
  export function Onboarding3({ navigation }) {
    return (
      <SafeAreaView style={style.background}>
        <View style={{marginTop: 50}}>
        <Text style={style.heading}>P-hjälpen påminner dig när det är dags!
        </Text>
        <Text style={style.description}>P-hjälpen är skapad av bilägare för bilägare i syfte spara dina pengar till något vettigare.
        </Text>
        </View>
        <View style={{marginBottom: 20 }}>
        <TouchableOpacity
          style={style.nextButton}
          onPress={() => navigation.navigate('Onboarding4')}>
            <Text style={style.nextButtonText} >
              Nästa
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeApp')}
        >
          <Text style={style.skipButton}>
            Hoppa över
          </Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  export function Onboarding4({ navigation }) {
    return (
    <SafeAreaView style={style.background}>
      <View style={{marginTop: '15%'}}>
        <Text style={style.headingTwoLast}>Välj din bils Bluetooth uppkoppling</Text>
    <View style= {{flexDirection: 'row', justifyContent: 'space-between'}}>
    <Text style={style.descriptionBil}>Bil 1
    </Text>
      <Text style={style.descriptionAdd}> Lägg till >
      </Text>
    </View>
    <View style= {{flexDirection: 'row', justifyContent: 'space-between'}}>
    <Text style={style.descriptionBil}>Bil 2
    </Text>
      <Text style={style.descriptionAdd}> Lägg till >
      </Text>
    </View>
    <View style= {{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text style={style.descriptionBil}>Bil 3
      </Text>
    <Text style={style.descriptionAdd}> Lägg till >
    </Text>
    </View>
    </View>
    <View style={{marginBottom: 20 }}>
    <TouchableOpacity
    style={style.nextButton}
    onPress={() => navigation.navigate('Onboarding5')}>
    <Text style={style.nextButtonText} >
    Nästa
    </Text>
    </TouchableOpacity>
    <TouchableOpacity
    onPress={() => navigation.navigate('HomeApp')}
    >
    <Text style={style.skipButton}>
    Hoppa över
    </Text>
    </TouchableOpacity>
    </View>
    </SafeAreaView>
    );
    }

   function Onboarding5({ navigation, changeRegNumber }) {

    const [value, setValue] = React.useState("")
    return (
      <SafeAreaView style={style.background}>
        <View style={{marginTop: 50}}>
        <Text style={style.headingTwoLast}>Fyll i din bils registreringsnummer
        </Text>
        <View  style={{flexDirection:'row', justifyContent: 'center'}}>
        <Image
          style={{height: Dimensions.get('screen').height * 0.07, width: Dimensions.get('screen').height * 0.04, position:'relative', top:20, borderTopLeftRadius: 10, borderBottomLeftRadius: 10}}
          source={require('../images/sweden.png')}/>
        <TextInput style={style.regNumInput} ref={c => this.text = c} maxLength={6}
        style={{height:60, backgroundColor:'white', width:'70%', marginVertical:20, borderTopRightRadius: 10, borderBottomRightRadius: 10, fontSize: 45, fontWeight: 'bold', textAlign: 'center'}}
          onChangeText={(text)=> {
            setValue(text);
          }} 
        >
        </TextInput>
          </View>
        </View>
    <View style={{marginBottom: 20 }}>
        <TouchableOpacity
          style={style.nextButton}
          placeholder="REGNR"
          onPress={() => {
            changeRegNumber(value)
            navigation.navigate('HomeApp')
          }}
          >
            <Text style={style.nextButtonText} >
              Spara och fortsätt
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
onPress={() => navigation.navigate('HomeApp')}
>
<Text style={style.skipButton}>
Hoppa över
</Text>
</TouchableOpacity>
</View>
</SafeAreaView>
    );
  }

  const style = StyleSheet.create({
    heading: {
    color: '#F5C932',
    fontSize: 57,
    textAlign: 'left',
    fontWeight: '700',
    marginLeft: 28,
    marginRight: 90,
    },
    headingTwoLast:{
    color: '#F5C932',
    fontSize: 32,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: '20%',
    },
    description: {
    color: 'white',
    fontSize: 22,
    marginHorizontal:'7%',
    lineHeight: 36,
    marginTop: '20%',
    },
    descriptionBil: {
      color: 'white',
      fontSize: 22,
      marginHorizontal:'7%',
      lineHeight: 36,
      marginBottom: '5%',
    },
    descriptionAdd: {
    color: '#F5C932',
    fontSize: 22,
    marginHorizontal:'10%',
    lineHeight: 36,
    },
    background: {
    backgroundColor: '#001736',
    flex: 1,
    justifyContent: "space-between"
    },
    nextButton: {
    alignSelf: 'stretch',
    backgroundColor: '#F5C932',
    borderRadius: 34,
    borderWidth: 1,
    marginHorizontal: 22,
    height: 68,
    },
    nextButtonText: {
    alignSelf: 'center',
    paddingVertical: 21,
    fontSize: 22,
    color: '#1E2657',
    fontSize: Dimensions.get('screen').height * 0.022,
    },
    skipButton: {
    color: '#fff',
    fontSize: 16,
    alignSelf: 'center',
    lineHeight: 30,
    marginTop: 22
    },
    regNumInput: {
    height:'20%',
    backgroundColor:'white',
    width:'80%',
    alignSelf: 'center',
    marginTop: '20%',
    borderRadius:50,
    borderColor: 'black',
    borderWidth: 2,
    }
    });
function mapStateToProps (state) {
  return {
    count: state,
  }
}
const mapDispatchToProps = dispatch => ({
  changeRegNumber: regNumber => dispatch(changeRegNumber(regNumber)),
})

export default connect(
  mapStateToProps,
 mapDispatchToProps
)(Onboarding5)