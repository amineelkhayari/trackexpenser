import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';


// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors['light' ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="plus-circle"
                    size={40}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
      name="Transaction"
      options={{
        title: 'History Transaction',
        tabBarIcon: ({ color }) => <MaterialIcons name="import-export" size={24} color="black" />,

        headerShown:false,
        
      }}
    />



      <Tabs.Screen
        name="category"
        options={{
          title: 'Category',
          tabBarIcon: ({ color }) => <TabBarIcon name="caret-down" color={color} />,
          headerShown:false,
          
        }}
      />
      <Tabs.Screen
        name="Subcategory"
        options={{
          title: 'Sub Cat',
          tabBarIcon: ({ color }) => <TabBarIcon name="caret-down" color={color} />,
          headerShown:false,
          
        }}
      />
      <Tabs.Screen
        name="importData"
        options={{
          title: 'Import',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="database-import-outline" size={24} color="black" />,
          headerShown:false,
          
        }}
      />
    </Tabs>
  );
}
