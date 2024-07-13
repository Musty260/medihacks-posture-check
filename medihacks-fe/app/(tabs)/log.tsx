import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Platform, ActivityIndicator, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Component } from 'react';
import { Chip, ListItem } from '@rneui/base';
import { LineChart } from 'react-native-chart-kit';

export default class LogScreen extends Component<any, { DeviceName: string, Judgements: any, expanded: any }>{

  constructor(props: any) {
    super(props);

    this.state = {
      DeviceName: "test_device",
      Judgements: null,
      expanded : {}
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

  getColor(score: number) {
    if (score) {
      if (score <= 3) return "red"
      else if (score <= 6) return "orange"
      else if (score <= 9) return "green"
      else return "gold"
    }

    return "orange"
  }

  isExpanded(key: any) {
    const expanded = this.state.expanded;
    return expanded[key] || false;
  }

  toggleExpanded(key: any) {
    const expanded = this.state.expanded;
    expanded[key] = expanded[key] ? !expanded[key] : true;
    this.setState({ expanded: expanded });
  }

  render() {
    const datasets = [
      {
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100
        ]
      },
      {
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100
        ]
      },
      {
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100
        ]
      },
      {
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100
        ]
      }
    ];

    const config = {
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#08130D",
      backgroundGradientToOpacity: 0,
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(47, 149, 202, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(47, 149, 202, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "rgb(47, 149, 202)"
      }
    }

    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Ionicons size={310} name="file-tray-full" style={styles.headerImage} />}
        >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Log</ThemedText>
        </ThemedView>

        <ThemedText>See a report-by-report breadkdown of your posture. Click on a report to reveal more information.</ThemedText>

        <ThemedView style={{ backgroundColor: "rgba(47, 149, 202, .05)", padding: 16, borderRadius: 16 }}>
          <ThemedText style={{ fontSize: 15, color: "lightgrey", fontWeight: "bold", marginLeft: 15, marginBottom: -5, textAlign: "center"  }}>Graphing Your Posture</ThemedText>
          <LineChart
            data={{
              labels: ["January", "February", "March", "April", "May", "June"],
              datasets: datasets
            }}
            width={360} // from react-native
            height={220}
            yAxisLabel="$"
            yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={config}
            bezier
            style={{ marginTop: 20 }}
          />
        </ThemedView>

        <ThemedView>
          {/* { this.state.Judgements  
            ? this.state.Judgements.map((s: string, key: string) => 
              <ThemedText key={key}>{JSON.stringify(s)}</ThemedText>
            ) 
            : <ActivityIndicator size="large" />
          }  */}

          { this.state.Judgements  
            ? this.state.Judgements.map((s: any, key: string) => 
              <ListItem.Accordion 
                key={key} theme="" style={styles.logItem}
                content = {
                  <>
                    <Ionicons name="body" size={24} color={ this.getColor(s.score) } style={{ marginRight: 4 }} />
                    <ThemedText style={{ color: this.getColor(s.score) }}>{(s.score ? s.score.toString() : "6") + " "}</ThemedText>
                    <ListItem.Content style={{ marginLeft: 16 }}>
                      {<ThemedText style={{ color: "grey", fontSize: 15, fontFamily: "monospace" }}>{"7 MINUTES AGO  (" + (s.timestamp || "00:00:00") + ")"}</ThemedText>}
                    </ListItem.Content>
                  </>
                }
                isExpanded={this.isExpanded(key)}
                onPress={() => {
                  this.toggleExpanded(key);
                }}
              >
                <ThemedView style={ { padding: 16, flexDirection: "column", gap: 5, ...styles.logItem }}>
                  <ThemedView style={ { flexDirection: "row", backgroundColor: "black", padding: 0, gap: 5 }}>
                    <ThemedText style={{ flex: 1, backgroundColor: "rgba(0, 128, 0, .2)", color: "rgb(0, 128, 0)", borderRadius: 5, paddingVertical: 10, paddingHorizontal: 16 }}>
                      Upper Body &nbsp;&nbsp;&nbsp;&nbsp;  8/10
                    </ThemedText>
                    <ThemedText style={{ flex: 1, backgroundColor: "rgba(0, 128, 0, .2)", color: "rgb(0, 128, 0)", borderRadius: 5, paddingVertical: 10, paddingHorizontal: 16 }}>
                      Arms  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 10/10
                    </ThemedText>    
                  </ThemedView>
                  <ThemedView style={ { flexDirection: "row", backgroundColor: "black", padding: 0, gap: 5 }}>
                    <ThemedText style={{ flex: 1, backgroundColor: "rgba(255, 165, 0, .2)", color: "rgb(255, 165, 0)", borderRadius: 5, paddingVertical: 10, paddingHorizontal: 16 }}>
                      Torso  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 6/10
                    </ThemedText>
                    <ThemedText style={{ flex: 1, backgroundColor: "rgba(255, 0, 0, .2)", color: "rgb(255, 0, 0)", borderRadius: 5, paddingVertical: 10, paddingHorizontal: 16 }}>
                      Legs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3/10
                    </ThemedText>
                  </ThemedView>
                  <ThemedText style={{ marginTop: 10 }}>
                    Summary: {s.description || "Placeholder Summary"}  
                  </ThemedText>  
                </ThemedView>        
              </ListItem.Accordion>
            ) 
            : <ActivityIndicator size="large" />
          } 
        </ThemedView>
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
  logItem: { 
    backgroundColor: "black", 
    borderWidth: 2, 
    borderColor: "rgba(255, 255, 255, .2)" 
  }
});
