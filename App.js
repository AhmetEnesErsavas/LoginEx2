import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { useContext, useEffect, useState } from 'react';
import IconButton from './components/ui/IconButton'
import MenuApp from './Menu/MenuScreen'; 
import { StyleSheet, Text, Button } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import CategoriesScreen from './screens/CategoriesScreen';
import MealsOverviewScreen from './screens/MealsOverviewScreen';
import MealDetailScreen from './screens/MealDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
  <Drawer.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#351401' },
      headerTintColor: 'white',
      sceneContainerStyle: { backgroundColor: '#3f2f25' }
    }} >
    <Drawer.Screen name="Categories" component={CategoriesScreen} 
    options={{title:'All Categories'}} />
    <Drawer.Screen name="Favorites" component={FavoritesScreen} />
  </Drawer.Navigator>);
}



const styles = StyleSheet.create({
  container: {},
});


function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{title:"Giriş Sayfası"}} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{title:"Kayıt Sayfası"}} />
    </Stack.Navigator>  
  );
}

//Buraya Menü Ekranımı Yazacağım Giriş Yaptıktan Sonra
function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Hoşgeldin" component={WelcomeScreen} options={{
        headerRight: ({tintColor})=> <IconButton 
        icon="exit" 
        color={tintColor}
        size={24} 
        onPress={authCtx.logout} />
      }}  />
      <Stack.Screen name="Menu" 
      component={MenuApp} 
      options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);


  return (
   
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>

  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  
  const authCtx = useContext(AuthContext);

  useEffect(()=> {
    async function fetchToken(){
       const storedToken = await AsyncStorage.getItem('token');
        
       if(storedToken){
        authCtx.authenticate(storedToken);
       }
       
   
       setIsTryingLogin(false);
    } 
    
    fetchToken();
},[]);

  if (isTryingLogin){
    return <AppLoading/>;
  }

  return <Navigation />;
}

export default function App() {



  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root/>
      </AuthContextProvider>
    </>
  );
}
