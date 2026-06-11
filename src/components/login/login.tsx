import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

interface LoadingCoinProps {
  text?: string;
}

export function LoadingCoin({ text = "Carregando..." }: LoadingCoinProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const scaleX = rotateAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 0.1, 1, 0.1, 1],
  });

  useEffect(() => {
    rotateAnim.setValue(0);

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.coin,
          {
            transform: [{ perspective: 1000 }, { rotateY: rotate }, { scaleX }],
          },
        ]}
      >
        <Text style={styles.coinText}>$</Text>
      </Animated.View>

      <Text style={styles.loading}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "#efefef",
    fontSize: 18,
    marginBottom: 25,
    letterSpacing: 2,
  },

  coin: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#5BBF26",
    justifyContent: "center",
    alignItems: "center",
  },

  coinText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#efefef",
  },

  loading: {
    marginTop: 25,
    color: "#EFEFEF",
    fontSize: 16,
  },
});
