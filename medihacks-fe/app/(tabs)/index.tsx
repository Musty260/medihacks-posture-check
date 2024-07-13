import React from 'react';
import { Image, StyleSheet, Platform, View, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import { Component } from 'react';

import { LineChart, ProgressChart } from "react-native-chart-kit";
export default class HomeScreen extends Component {

  constructor(props: any) {
    super(props);

    
    this.state = {
      DeviceName: "TestDevice"
    }

  }

  render() {
    const data = {
      labels: ["Upper Body", "Arms", "Torso", "Legs"], // optional
      data: [0.4, 0.6, 0.8, .3]
    };

    const chartConfig = {
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#08130D",
      backgroundGradientToOpacity: 0,
      color: (opacity = 1) => `rgba(47, 149, 202, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false // optional
    };

    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/banner_logo.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Home</ThemedText>
        </ThemedView>

        <ThemedText>Welcome to HAL 1000, the Desktop Posture Monitor which helps you stay comfortable and healthy at your desk. Your device is called <Text style={{ color: "rgb(47, 149, 202)", fontFamily: "monospace" }}>TestDevice</Text>.</ThemedText>

      <ThemedView style={{ backgroundColor: "rgba(47, 149, 202, .05)", paddingVertical: 16, borderRadius: 16 }}>
        <ThemedText style={{ fontSize: 15, color: "lightgrey", fontWeight: "bold", marginLeft: 15, marginBottom: -5, textAlign: "center"  }}>Your Posture at a Glance</ThemedText>
        <ProgressChart
          data={data}
          width={430}
          height={230}
          strokeWidth={17}
          radius={32}
          chartConfig={chartConfig}
          hideLegend={false}
          style={{ marginLeft: -50, marginTop: 10 }}
        />
      </ThemedView>
    
        {/* <ThemedText type="subtitle">FAQ</ThemedText> */}
        

        <Collapsible title="How do I use HAL?">
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


        <Collapsible title="How can HAL improve my health?">
          <ThemedText>
            You can open this project on Android, iOS, and the web. To open the web version, press{' '}
            <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
          </ThemedText>
        </Collapsible>

        <Collapsible title="How does this App Work?">
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

        <Collapsible title="I have an idea to make HAL better!">
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

      </ParallaxScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
    width: "100%",
    height: "100%",
    left: 0,
    bottom: 0,
    position: 'absolute',
  },
  deviceNameContainer: {
    borderRadius: 15,
    borderColor: "rgba(255, 255, 255, .2)",
    borderWidth: 3,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    padding: 16,
    textAlign: "center",
    backgroundColor: "black",
    flexDirection: "row"
  }
});
