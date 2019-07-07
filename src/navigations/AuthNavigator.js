import {createStackNavigator} from "react-navigation";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const AuthNavigator = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen
});

export default AuthNavigator;