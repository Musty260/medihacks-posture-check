import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, Text } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { Avatar, Divider } from '@rneui/themed';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: 'rgba(220, 20, 60, .3)' }}
      headerImage={<Ionicons size={310} name="podium" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Weekly Leaderboard</ThemedText>
      </ThemedView>
      <ThemedText>See how your posture stacks up against others!</ThemedText>
      <View style={styles.awardContainer}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 10}}>
          <ThemedText type="subtitle">Your Past Awards</ThemedText>
        </View>
        <Divider style={styles.dividerCol} width={3}/>
        <View style={{ padding: 16, flexDirection: 'row', gap: 15   }}>
          <Avatar
            size={64}
            rounded
            icon={{ name: 'trophy', type: 'ionicon', color: 'gold' }}
            containerStyle={{
              borderColor: 'grey',
              borderStyle: 'solid',
              borderWidth: 3,
            }}
          />
          <Avatar
            size={64}
            rounded
            icon={{ name: 'trophy', type: 'ionicon', color: 'silver' }}
            containerStyle={{
              borderColor: 'grey',
              borderStyle: 'solid',
              borderWidth: 3,
            }}
          />
        </View>
      </View>

      <View style={styles.awardContainer}>

        <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', gap: 16, left: 16, paddingVertical: 13, paddingHorizontal: 10 }}>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <ThemedText style={{ fontWeight: "bold" }}>Score</ThemedText>
          </View>
          <View style={{ flex: 4, alignSelf: 'stretch' }}>
            <ThemedText style={{ fontWeight: "bold" }}>Name</ThemedText>
          </View>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <Ionicons name="trophy-outline" size={24} color="white" />
          </View>
        </View>

        <Divider style={styles.dividerCol} width={3}/>

        <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', gap: 16, left: 16, paddingVertical: 13, paddingHorizontal: 10 }}>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <ThemedText>63278</ThemedText>
          </View>
          <View style={{ flex: 4, alignSelf: 'stretch' }}>
            <ThemedText>Test Name</ThemedText>
          </View>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <Ionicons name="trophy" size={24} color="gold" />
          </View>
        </View>

        <Divider style={styles.dividerCol} width={2}/>

        <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', gap: 16, left: 16, paddingVertical: 13, paddingHorizontal: 10 }}>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <ThemedText>32612</ThemedText>
          </View>
          <View style={{ flex: 4, alignSelf: 'stretch' }}>
            <ThemedText>Test Name</ThemedText>
          </View>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <Ionicons name="trophy" size={24} color="silver" />
          </View>
        </View>

        <Divider style={styles.dividerCol} width={2}/>

        <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', gap: 16, left: 16, paddingVertical: 13, paddingHorizontal: 10 }}>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <ThemedText>29874</ThemedText>
          </View>
          <View style={{ flex: 4, alignSelf: 'stretch' }}>
            <ThemedText>Test Name</ThemedText>
          </View>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <Ionicons name="trophy" size={24} color="rgb(205, 127, 50)" />
          </View>
        </View>

        <Divider style={styles.dividerCol} width={2}/>

        <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', gap: 16, left: 16, paddingVertical: 13, paddingHorizontal: 10 }}>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <ThemedText>23212</ThemedText>
          </View>
          <View style={{ flex: 4, alignSelf: 'stretch' }}>
            <ThemedText>Test Name</ThemedText>
          </View>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
          </View>
        </View>

      </View>

      {/* <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <ThemedText>
          Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> to see how to load{' '}
          <ThemedText style={{ fontFamily: 'SpaceMono' }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user's current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText> library
          to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible> */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: 'rgba(210, 10, 50, .7)',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  awardContainer: {
    borderRadius: 15,
    borderColor: "rgba(255, 255, 255, .2)",
    borderWidth: 3,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14
  },
  dividerCol: {
    borderColor: "rgba(255, 255, 255, .2)"
  }
});
