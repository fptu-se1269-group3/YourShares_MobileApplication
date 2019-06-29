import {createStackNavigator} from "react-navigation";
import LoginScreen from "../screens/LoginScreen";

const AuthNavigator = createStackNavigator({
    Login: LoginScreen
});

export default AuthNavigator;