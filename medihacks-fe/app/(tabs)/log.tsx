import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Component } from 'react';

export default class LogScreen extends Component<any, { DeviceName: string, Judgements: any}>{

  constructor(props: any) {
    super(props);

    this.state = {
      DeviceName: "test_device",
      Judgements: []
    }

    this.getJudgements()

  }

  async getJudgements() {
    await fetch("https://u4ejbprm4rmkgu6wofweoxsp2m0pmpam.lambda-url.eu-west-2.on.aws/", {
      method: "POST",
      body: JSON.stringify({
        device_name: "test_device",
        pwhash: "test_hash"
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data.body);
      this.setState({ Judgements: data.body });
    });

  }

  render() {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Ionicons size={310} name="file-tray-full" style={styles.headerImage} />}
        >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Log</ThemedText>
        </ThemedView>

        <ThemedView>
          { this.state.Judgements && this.state.Judgements.map((s: string) => <ThemedText>{JSON.stringify(s)}</ThemedText>) } 
        </ThemedView>

        {/* <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 1: Try it</ThemedText>
          <ThemedText>
            Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
            Press{' '}
            <ThemedText type="defaultSemiBold">
              {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
            </ThemedText>{' '}
            to open developer tools.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          <ThemedText>
            Tap the Explore tab to learn more about what's included in this starter app.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
          <ThemedText>
            When you're ready, run{' '}
            <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
            <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
            <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
            <ThemedText type="defaultSemiBold">app-example</ThemedText>.
          </ThemedText>
        </ThemedView> */}
      </ParallaxScrollView> 
    );
  }
}

const styles = StyleSheet.create({
  headerImage: {
      color: '#808080',
      bottom: -90,
      left: -35,
      position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
