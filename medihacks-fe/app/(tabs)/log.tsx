import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Platform, ActivityIndicator, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Component } from 'react';
import { Chip, ListItem, Button, Icon } from '@rneui/base';
import { LineChart } from 'react-native-chart-kit';

import moment from "moment";

export default class LogScreen extends Component<any, { DeviceName: string, Judgements: any, expanded: any }> {

  constructor(props: any) {
    super(props);

    this.state = {
      DeviceName: "test_device",
      Judgements: null,
      expanded: {}
    }

    this.getJudgements()

    this.refreshPage = this.refreshPage.bind(this);
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
        this.setState({ Judgements: data.body.sort(this.compareJudgements) });
      });

  }
  compareJudgements(a: any, b: any) {
    if (a.timestamp < b.timestamp) return 1
    else if (a.timestamp > b.timestamp) return -1
    else return 0;
  }

  getColor(score: number) {
    if (score) {
      if (score <= 3) return "red"
      else if (score <= 6) return "orange"
      else if (score <= 9.9) return "green"
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

  getCategoryColor(s: any) {
    console.log(s);

    if (!s || this.getColor(s.score) === "red") return ["rgba(255, 0, 0, .2)", "rgb(255, 0, 0)"];
    else if (this.getColor(s.score) === "orange") return ["rgba(255, 165, 0, .2)", "rgb(255, 165, 0)"];
    else return ["rgba(0, 128, 0, .2)", "rgb(0, 128, 0)"];
  }

  refreshPage() {
    this.setState({ Judgements: null }, this.getJudgements);
  }

  aggregateScore(s: any) {
    const score_sum = s.arms.score + s['upper-body'].score + s.legs.score + s.torso.score;
    return (score_sum / 4);
  }

  render() {
    let slicedJudgements = [];

    if (this.state.Judgements) {
      slicedJudgements = this.state.Judgements.slice(0, 5);
      slicedJudgements = slicedJudgements
        .sort((a: any, b: any) => -this.compareJudgements(a, b));
    }

    console.log(slicedJudgements);

    const datasets = ["upper-body", "arms", "torso", "legs"]
      .map((s: string) => {
        return { data: slicedJudgements.map((x: any) => x[s].score) }
      });

    console.log(datasets);

    let flag = 0;

    const config = {
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#08130D",
      backgroundGradientToOpacity: 0,
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => {
        flag = flag + 1;
        if (flag === 13) return "green";
        else if (flag === 14) return "orange";
        else if (flag === 15) return "purple";
        else if (flag === 16) return "white";
        else return `rgba(47, 149, 202, ${opacity})`
      },
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
        <ThemedView style={{ ...styles.titleContainer, display: "flex", flexDirection: "row" }}>
          <ThemedText type="title" style={{ flex: 2 }}>Log</ThemedText>
          <ThemedView style={{ alignSelf: "flex-end", flex: 1 }}>
            <Button
              iconContainerStyle={{ marginRight: 5, marginLeft: -5 }}
              icon={{
                name: 'refresh-outline',
                type: 'ionicon',
                size: 15,
                color: 'white',
              }}
              title="REFRESH"
              buttonStyle={{ borderRadius: 5, backgroundColor: "rgb(4,123,174)" }}
              onPress={this.refreshPage}
            />
          </ThemedView>
        </ThemedView>

        <ThemedText>See a report-by-report breadkdown of your posture. Click on a report to reveal more information.</ThemedText>

        {
          this.state.Judgements !== null ? (
            <>
              <ThemedView style={{ backgroundColor: "rgba(47, 149, 202, .05)", padding: 16, borderRadius: 16 }}>
                <ThemedText style={{ fontSize: 15, color: "lightgrey", fontWeight: "bold", marginLeft: 15, marginBottom: -5, textAlign: "center" }}>Graphing Your Posture</ThemedText>
                {
                  datasets.length > 0 && datasets[0]["data"].length > 0 &&
                  <LineChart
                    data={{
                      labels: slicedJudgements.map((x: any) => (new Date(x.timestamp)).toLocaleTimeString()),
                      datasets: datasets
                    }}
                    width={360} // from react-native
                    height={220}
                    // yAxisLabel="$"
                    // yAxisSuffix="k"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={config}
                    formatYLabel={(val: string) => Math.round(parseFloat(val)).toString()}
                    bezier
                    style={{ marginTop: 20 }}
                  />
                }
                <ThemedView style={{ display: "flex", flexDirection: "row", backgroundColor: "rgba(0, 0, 0, 0)", paddingLeft: 60, paddingRight: 30 }}>
                  <ThemedView style={{ flex: 1, display: "flex", flexDirection: "row", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                    <Icon name='circle' type='feather' color='green' style={{ marginRight: 10 }} />
                    <ThemedText> Upper Body </ThemedText>
                  </ThemedView>
                  <ThemedView style={{ flex: 1, display: "flex", flexDirection: "row", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                    <Icon name='circle' type='feather' color='orange' style={{ marginRight: 10 }} />
                    <ThemedText> Arms </ThemedText>
                  </ThemedView>
                </ThemedView>

                <ThemedView style={{ display: "flex", flexDirection: "row", backgroundColor: "rgba(0, 0, 0, 0)", paddingLeft: 60, paddingRight: 30, marginTop: 15 }}>
                  <ThemedView style={{ flex: 1, display: "flex", flexDirection: "row", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                    <Icon name='circle' type='feather' color='purple' style={{ marginRight: 10 }} />
                    <ThemedText> Torso </ThemedText>
                  </ThemedView>
                  <ThemedView style={{ flex: 1, display: "flex", flexDirection: "row", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                    <Icon name='circle' type='feather' color='white' style={{ marginRight: 10 }} />
                    <ThemedText> Legs </ThemedText>
                  </ThemedView>
                </ThemedView>

              </ThemedView>

              <ThemedView>
                {/* { this.state.Judgements  
                ? this.state.Judgements.map((s: string, key: string) => 
                  <ThemedText key={key}>{JSON.stringify(s)}</ThemedText>
                ) 
                : <ActivityIndicator size="large" />
              }  */}

                {this.state.Judgements
                  ? this.state.Judgements.map((s: any, key: string) =>
                    <ListItem.Accordion
                      key={key} theme="" style={styles.logItem}
                      content={
                        <>
                          <Ionicons name="body" size={24} color={this.getColor(this.aggregateScore(s))} style={{ marginRight: 4 }} />
                          <ThemedText style={{ color: this.getColor(this.aggregateScore(s)) }}>{this.aggregateScore(s).toFixed(1) + " "}</ThemedText>
                          <ListItem.Content style={{ marginLeft: 16 }}>
                            <ThemedText style={{ color: "grey", fontSize: 15, fontFamily: "monospace" }}>
                              {moment(new Date(s.timestamp)).fromNow()}
                            </ThemedText>
                            <ThemedText style={{ color: "whitesmoke", fontSize: 13, fontFamily: "monospace" }}>
                              {((new Date(s.timestamp)).toLocaleString() || "00:00:00")}
                            </ThemedText>
                          </ListItem.Content>
                        </>
                      }
                      isExpanded={this.isExpanded(key)}
                      onPress={() => {
                        this.toggleExpanded(key);
                      }}
                    >
                      <ThemedView style={{ padding: 16, flexDirection: "column", gap: 5, ...styles.logItem }}>
                        <ThemedView style={{ flexDirection: "row", backgroundColor: "black", padding: 0, gap: 5 }}>
                          <ThemedText style={{ flex: 1, backgroundColor: this.getCategoryColor(s["upper-body"])[0], color: this.getCategoryColor(s["upper-body"])[1], borderRadius: 5, paddingVertical: 10, paddingHorizontal: 16 }}>
                            Upper Body &nbsp;&nbsp;  {s["upper-body"] ? s["upper-body"].score : 0}/10
                          </ThemedText>
                          <ThemedText style={{ flex: 1, backgroundColor: this.getCategoryColor(s.arms)[0], color: this.getCategoryColor(s.arms)[1], borderRadius: 5, paddingVertical: 10, paddingHorizontal: 16 }}>
                            Arms  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {s.arms ? s.arms.score : 0}/10
                          </ThemedText>
                        </ThemedView>
                        <ThemedView style={{ flexDirection: "row", backgroundColor: "black", padding: 0, gap: 5 }}>
                          <ThemedText style={{ flex: 1, backgroundColor: this.getCategoryColor(s.torso)[0], color: this.getCategoryColor(s.torso)[1], borderRadius: 5, paddingVertical: 10, paddingHorizontal: 16 }}>
                            Torso  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {s.torso ? s.torso.score : 0}/10
                          </ThemedText>
                          <ThemedText style={{ flex: 1, backgroundColor: this.getCategoryColor(s.legs)[0], color: this.getCategoryColor(s.legs)[1], borderRadius: 5, paddingVertical: 10, paddingHorizontal: 16 }}>
                            Legs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {s.legs ? s.legs.score : 0}/10
                          </ThemedText>
                        </ThemedView>
                        <ThemedText style={{ marginTop: 10, fontStyle: "italic" }}>
                          {'"' + (s.description || "Placeholder Summary") + '"'}
                        </ThemedText>
                      </ThemedView>
                    </ListItem.Accordion>
                  )
                  : <ActivityIndicator size="large" />
                }
              </ThemedView>
            </>
          ) : <ActivityIndicator size="large" style={{ marginTop: 50 }} />
        }
      </ParallaxScrollView >
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
