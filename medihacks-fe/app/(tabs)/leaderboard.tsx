import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, Text, ActivityIndicator } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { Avatar, Divider } from '@rneui/themed';
import { Component } from 'react';
import { Badge } from '@rneui/base';

export default class TabTwoScreen extends Component<{}, { awards: any, leaderboard: any }> {

  constructor(props: any) {
    super(props);

    this.state = {
      awards: null,
      leaderboard: null
    };

    this.getLeaderboard();
  }

  async getLeaderboard() {
    await fetch("https://36vojn4clhxqjoevx4zoptgnky0zcfzd.lambda-url.eu-west-2.on.aws/", {
      method: "POST",
      body: JSON.stringify({
        device_name: "test_device"
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.setState({ awards: data.body.awards, leaderboard: [data.body.leaderboard] });
      });
  }

  render() {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: 'rgba(220, 20, 60, .3)' }}
        headerImage={<Ionicons size={310} name="podium" style={styles.headerImage} />}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Weekly Leaderboard</ThemedText>
        </ThemedView>

        <ThemedText>See how your posture stacks up against others, and win weekly prizes by placing at the top of the leaderboard below!</ThemedText>
        <ThemedText style={{ fontSize: 14, color: "lightgrey", fontWeight: "bold", marginLeft: 15 }}>Your Past Awards</ThemedText>

        {
          this.state.awards ? (
            <View style={styles.awardContainer}>

              {
                ["gold", "silver", "bronze"].filter(x => this.state.awards[x] > 0).map((x: string, k: number) =>
                  <View key={k}>
                    <Avatar
                      size={64}
                      rounded
                      icon={{ name: 'trophy', type: 'ionicon', color: x == "bronze" ? "rgb(205, 127, 50)" : x }}
                      containerStyle={{
                        backgroundColor: "rgba(255, 255, 255, .2)",
                        borderWidth: 3,
                      }}
                    />
                    <Badge
                      status="primary"
                      value={this.state.awards[x].toString()}
                      containerStyle={{ position: 'absolute', top: 5, left: 45 }}
                      badgeStyle={{ borderWidth: 0 }}
                    />
                  </View>
                )
              }
            </View>
          ) : <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        }

        <View style={{ marginHorizontal: 15, flexDirection: "row", marginVertical: 10 }}>
          <Text style={{ fontSize: 14, color: "lightgrey", fontWeight: "bold", flex: 1 }}>Thu 14 - Thu 21</Text>

          <Text style={{ alignSelf: "flex-end", fontSize: 14, color: "lightgrey" }}>3 DAYS LEFT</Text>
        </View>

        {
          this.state.leaderboard ?

            <View style={styles.leaderboardContainer}>

              <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', gap: 16, paddingVertical: 13, paddingRight: -6, paddingLeft: 26, backgroundColor: "rgba(255, 255, 255, .2)", borderTopLeftRadius: 13, borderTopRightRadius: 13 }}>
                <View style={{ flex: 1, alignSelf: 'stretch' }}>
                  <ThemedText style={{ fontWeight: "bold" }}>Score</ThemedText>
                </View>
                <View style={{ flex: 4, alignSelf: 'stretch' }}>
                  <ThemedText style={{ fontWeight: "bold" }}>Name</ThemedText>
                </View>
                <View style={{ flex: 1, alignSelf: 'stretch', marginRight: -4 }}>
                  <Ionicons name="trophy-outline" size={24} color="white" />
                </View>
              </View>

              {
                this.state.leaderboard.map((x: any, k: number) =>
                  <View key={k}>
                    <Divider style={styles.dividerCol} width={3} />

                    <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', gap: 16, left: 16, paddingVertical: 13, paddingHorizontal: 10 }}>
                      <View style={{ flex: 1, alignSelf: 'stretch' }}>
                        <ThemedText>{x.score}</ThemedText>
                      </View>
                      <View style={{ flex: 4, alignSelf: 'stretch' }}>
                        <ThemedText style={{ fontFamily: "monospace" }}>{x.DeviceName}</ThemedText>
                      </View>
                      <View style={{ flex: 1, alignSelf: 'stretch' }}>
                        {k < 3 && <Ionicons name="trophy" size={24} color={["gold", "silver", "bronze"][k]} />}
                      </View>
                    </View>
                  </View>
                )
              }

            </View>
            : <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        }
      </ParallaxScrollView>
    );
  }
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
    gap: 8
  },
  awardContainer: {
    borderRadius: 15,
    borderColor: "rgba(255, 255, 255, .2)",
    borderWidth: 2,
    elevation: 14,
    padding: 16,
    flexDirection: "row",
    gap: 16,
    marginTop: -8,
    backgroundColor: "black"
  },
  leaderboardContainer: {
    borderRadius: 15,
    borderColor: "rgba(255, 255, 255, .2)",
    borderWidth: 2,
    elevation: 14,
    marginTop: -8,
    backgroundColor: "black"
  },
  dividerCol: {
    borderColor: "rgba(255, 255, 255, .2)"
  }
});
