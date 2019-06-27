import {createStackNavigator} from "react-navigation";
import {Login} from "../components/Login";

const MainNavigator = createStackNavigator({
    Login: {screen: Login}
}, {
    headerMode: 'none'
});

export default MainNavigator;