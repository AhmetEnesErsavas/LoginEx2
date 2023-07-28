import { useContext, useState } from 'react';
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverplay from '../components/ui/LoadingOverlay';
import { createUser } from '../util/auth';
import { AuthContext } from '../store/auth-context';


function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] =useState(false);

  const authCtx = useContext(AuthContext);


  async function singupHandler({email,password}){
    setIsAuthenticating(true);
    try{
      const token = await createUser(email,password);
      authCtx.authenticate(token);
    }catch(error){
      Alert.alert('Kimlik Doğrulama Başarısız Oldu',
      'Kullanıcı Oluşturulamadı.Lütfen Girişinizi Kontrol Edip Daha Sonra Tekrar Deneyinizi')      
    };
    
    setIsAuthenticating(false);
  }

    if(isAuthenticating){
      return <LoadingOverplay message="Kullanıcı Oluşturuluyor..." />
    }
  return <AuthContent onAuthenticate={singupHandler} />;
}

export default SignupScreen;
