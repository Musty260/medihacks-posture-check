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
export default class HomeScreen extends Component<{}, { DeviceName: string, Judgements: any }> {

  constructor(props: any) {
    super(props);


    this.state = {
      DeviceName: "TestDevice",
      Judgements: null
    }

    this.getJudgements();

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
    let arms = 0;
    let legs = 0;
    let upper_body = 0;
    let torso = 0;
    let flag = 0;

    if (!!this.state.Judgements) {
      const arms_arr = this.state.Judgements
        .filter((x: any) => !!x.arms && !!x.arms.score)
        .map((x: any) => x.arms.score);
      arms = arms_arr
        .reduce((partialSum: number, a: number) => partialSum + a, 0)
        / arms_arr.length;

      const legs_arr = this.state.Judgements
        .filter((x: any) => !!x.legs && !!x.legs.score)
        .map((x: any) => x.legs.score);
      legs = legs_arr
        .reduce((partialSum: number, a: number) => partialSum + a, 0)
        / legs_arr.length;

      const upper_body_arr = this.state.Judgements
        .filter((x: any) => !!x["upper-body"] && !!x["upper-body"].score)
        .map((x: any) => x["upper-body"].score);
      upper_body = upper_body_arr
        .reduce((partialSum: number, a: number) => partialSum + a, 0)
        / upper_body_arr.length;

      const torso_arr = this.state.Judgements
        .filter((x: any) => !!x.torso && !!x.torso.score)
        .map((x: any) => x.torso.score);
      torso = torso_arr
        .reduce((partialSum: number, a: number) => partialSum + a, 0)
        / torso_arr.length;
    }

    const data = {
      labels: ["Upper Body", "Arms", "Torso", "Legs"], // optional
      data: [upper_body / 10, arms / 10, torso / 10, legs / 10]
    };

    const chartConfig = {
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#08130D",
      backgroundGradientToOpacity: 0,
      color: (opacity = 1) => {
        if (opacity > .8) return `rgb(12,192,223)`;
        else if (opacity > .7) return `rgb(8,158,199)`;
        else if (opacity > .6) return `rgb(4,123,174)`;
        else if (opacity > .19 && (flag < 2 || flag === 6)) {
          flag = flag + 1;
          return `rgb(0,89,150)`;
        }
        else {
          flag = flag + 1;
          return `rgba(255, 255, 255, ${opacity})`;
        }
      },
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
          <ThemedText style={{ fontSize: 15, color: "lightgrey", fontWeight: "bold", marginLeft: 15, marginBottom: -5, textAlign: "center" }}>Your Posture at a Glance</ThemedText>
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
          <ThemedText>Place HAL's enclosure to the side of your desk, so that camera has a good view of you on your chair. 
          Then simply turn HAL on, and listen his advice on how to improve your posture, given around every 30 seconds.</ThemedText>
        </Collapsible>


        <Collapsible title="How can HAL improve my health?">
          <ThemedText>
            According to the <ExternalLink href="https://newsinhealth.nih.gov/2017/08/getting-it-straight"><ThemedText type='link'>US Department of Health and Human Services</ThemedText></ExternalLink>, poor posture can lead to decreased flexibility, back pain, and joint degredation.
            Based on <ExternalLink href="https://www.hse.gov.uk/msd/dse/good-posture.htm"><ThemedText type='link'>posture guidelines</ThemedText></ExternalLink> by the UK Health and Safety Executive, HAL helps you maintain good posture and thereby avoid these long-term health effects.
          </ThemedText>
        </Collapsible>

        <Collapsible title="How does this App Work?">
          <ThemedText>
          In addition to HAL's voiced advice, this app provides more detailed information on your posture. A quick summary can be seen on this Home Page, the Log tab provides report-by-report data, and the Leaderboard tab allows you to measure your posture against others using HAL in a weekly competition. 
          </ThemedText>
        </Collapsible>

        <Collapsible title="I have an idea to make HAL better!">
          <ThemedText>
            Please let us know on our <ExternalLink href="https://devpost.com/software/hal-10000-desktop-posture-monitor">
            <ThemedText type='link'>Devpost Page</ThemedText></ExternalLink>, or <ExternalLink href=""><ThemedText type='link'>GitHub</ThemedText></ExternalLink>. All suggestions are appreciated!
          </ThemedText>
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
