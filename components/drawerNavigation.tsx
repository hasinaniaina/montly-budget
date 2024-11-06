import Home from '@/app/dashboard/home';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation(Menu: JSX.Element) {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="home" component={Home} />
    </Drawer.Navigator>
  );
}