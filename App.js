import "react-native-gesture-handler";
import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Dimensions,
  FlatList,
  Animated as RNAnimated,
  Platform,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import { StyleSheet } from "react-native";
import { DefaultTheme } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import * as StoreReview from "expo-store-review";
import { StatusBar } from "expo-status-bar";
import { SvgXml } from "react-native-svg";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  TouchableOpacity as RNGHTouchableOpacity,
} from "react-native-gesture-handler";
import { Canvas, Path } from "@shopify/react-native-skia";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { SearchBar, LinearProgress, Slider } from "@rneui/base";
import * as ImagePicker from "expo-image-picker";
import prompt from "react-native-prompt-android";
import { Shadow } from "react-native-shadow-2";

const COLOR1 = "#fff";
const COLOR2 = "#f2f2f2";
const COLOR3 = "#e5e5e5";
const ACCENT_COLOR = "#e3b419";
const GREYED_TEXT_COLOR = "#c7c7cd";
const SHADOW_COLOR = "#dcdcdc";

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLOR2,
    primary: ACCENT_COLOR,
    card: COLOR2,
  },
};

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  welcomeDismissButtonsContainer: {
    height: 200,
    position: "absolute",
    top: HEIGHT - 200,
    width: WIDTH,
    backgroundColor: COLOR3,
  },
  welcomePermanentDismissButton: {
    width: 200,
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    left: (WIDTH - 200) / 2,
  },
  welcomePermanentDismissButtonText: {
    color: ACCENT_COLOR,
  },
  welcomeDismissButton: {
    position: "absolute",
    height: 50,
    width: 100,
    bottom: 100,
    left: (WIDTH - 100) / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ACCENT_COLOR,
    borderRadius: 30,
  },
  welcomeDismissButtonText: {
    fontSize: 18,
    color: COLOR2,
  },
  emptyMessageContainer: {
    height: 30,
    width: WIDTH,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: (HEIGHT - 30) / 2,
  },
  emptyMessage: {
    color: GREYED_TEXT_COLOR,
    textAlign: "center",
    fontSize: 18,
    textAlignVertical: "center",
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLOR2,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: ACCENT_COLOR,
    fontSize: 24,
  },
  deckContainer: {
    backgroundColor: GREYED_TEXT_COLOR,
  },
  deck: {
    backgroundColor: COLOR2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    height: 50,
    justifyContent: "center",
    paddingLeft: 20,
    width: WIDTH,
  },
  firstDeck: {
    backgroundColor: COLOR2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    height: 50,
    justifyContent: "center",
    paddingLeft: 20,
    width: WIDTH,
  },
  deckText: {
    fontSize: 18,
  },
  cardDeleteButtonContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    height: 50,
    width: 75,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
  deckDeleteButtonContainer: {
    height: 50,
    width: 75,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "red",
  },
  deckEditButtonContainer: {
    height: 50,
    width: 75,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "grey",
  },
  button: {
    height: 25,
    width: 25,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    position: "absolute",
    top: 75,
    left: 25,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    left: 25,
    paddingBottom: 5,
  },
  welcomeTips: {
    height: HEIGHT - 150,
    top: 150,
  },
  welcomeTip: {
    paddingBottom: 25,
  },
  welcomeTipText: {
    left: 25,
    width: WIDTH - 50,
    fontSize: 18,
    paddingTop: 5,
  },
  welcomeTipImageContainer: {
    paddingTop: 5,
  },
  welcomeTipImage: {
    left: 25,
    width: WIDTH - 50,
    height: "auto",
  },
  searchBarContainer: {
    position: "absolute",
    top: 125,
    height: 75,
    width: WIDTH,
    backgroundColor: COLOR2,
    justifyContent: "center",
  },
  searchBarInputContainer: {
    height: 25,
  },
  searchBarCancel: {
    color: ACCENT_COLOR,
  },
  infoButtonContainer: {
    position: "absolute",
    top: 50,
    right: 0,
    height: 50,
    width: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  deckList: {
    flex: 1,
    top: 200,
    height: HEIGHT - 200,
  },
  cardList: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  newTextCardInputWindow: {
    position: "absolute",
    top: (HEIGHT - 275) / 2,
    height: 275,
    width: 300,
    backgroundColor: COLOR1,
    alignItems: "center",
    borderRadius: 10,
  },
  newDrawingCardInputWindow: {
    position: "absolute",
    bottom: (HEIGHT - 550) / 2,
    height: 550,
    width: 300,
    backgroundColor: COLOR1,
    alignItems: "center",
    borderRadius: 10,
  },
  newImageCardInputWindow: {
    position: "absolute",
    bottom: (HEIGHT - 550) / 2,
    height: 550,
    width: 300,
    backgroundColor: COLOR1,
    alignItems: "center",
    borderRadius: 10,
  },
  imageCardImagePreview: {
    position: "absolute",
    top: 150,
    height: 256,
    width: 256,
  },
  noImageMessageContainer: {
    position: "absolute",
    top: 150,
    height: 256,
    width: 256,
    backgroundColor: COLOR2,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageMessage: {
    color: GREYED_TEXT_COLOR,
    textAlign: "center",
    fontSize: 18,
    textAlignVertical: "center",
  },
  windowTitle: {
    fontSize: 24,
    position: "absolute",
    top: 25,
    left: 0,
    width: 300,
    textAlign: "center",
  },
  cancelButton: {
    position: "absolute",
    top: 3,
    right: 3,
    padding: 10,
  },
  cancelButtonText: {
    fontSize: 24,
  },
  deckInputYesButton: {
    position: "absolute",
    height: 50,
    width: 100,
    bottom: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ACCENT_COLOR,
    borderRadius: 30,
  },
  textCardInputYesButton: {
    position: "absolute",
    height: 50,
    width: 100,
    top: 200,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ACCENT_COLOR,
    borderRadius: 30,
  },
  drawingCardInputYesButton: {
    position: "absolute",
    height: 50,
    width: 100,
    bottom: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ACCENT_COLOR,
    borderRadius: 30,
  },
  imageCardInputYesButton: {
    position: "absolute",
    height: 50,
    width: 100,
    bottom: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ACCENT_COLOR,
    borderRadius: 30,
  },
  inputYesButtonText: {
    fontSize: 18,
    color: COLOR2,
  },
  cardTypeChoiceWindow: {
    position: "absolute",
    bottom: (HEIGHT - 250) / 2,
    height: 250,
    width: 300,
    backgroundColor: COLOR1,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 10,
  },
  cardTypeChoiceButton: {
    alignItems: "center",
    paddingTop: 20,
  },
  cardTypeChoiceButtonText: {
    fontSize: 18,
    paddingTop: 20,
    width: 75,
    textAlign: "center",
  },
  cardTypeChoiceButtonIcon: {
    height: 75,
    width: 75,
  },
  newCardTermInputField: {
    width: 250,
    height: 50,
    position: "absolute",
    top: 50,
    fontSize: 18,
    backgroundColor: COLOR2,
    borderRadius: 30,
    paddingLeft: 15,
  },
  newCardDefInputField: {
    width: 250,
    height: 50,
    position: "absolute",
    top: 125,
    fontSize: 18,
    backgroundColor: COLOR2,
    borderRadius: 30,
    paddingLeft: 15,
  },
  canvasContainer: {
    position: "absolute",
    top: 150,
    left: 25,
    height: 250,
    width: 250,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR2,
    borderWidth: 1,
  },
  canvas: {
    height: 225,
    width: 225,
  },
  canvasToggleToolButtonContainer: {
    position: "absolute",
    bottom: 50,
    left: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR2,
    borderRadius: 30,
  },
  canvasUndoButtonContainer: {
    position: "absolute",
    bottom: 50,
    right: 24,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR2,
    borderRadius: 30,
  },
  imageUploadButtonContainer: {
    position: "absolute",
    bottom: 50,
    right: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR2,
    borderRadius: 30,
  },
  cardContainer: {
    position: "relative",
    height: 255,
    width: WIDTH,
  },
  practiceCardContainer: {
    position: "absolute",
    bottom: (HEIGHT - 250) / 2,
    height: 250,
    width: WIDTH,
  },
  card: {
    position: "absolute",
    height: 250,
    width: WIDTH,
    backgroundColor: COLOR1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    borderRadius: 20,
    justifyContent: "center",
  },
  practiceCard: {
    position: "absolute",
    height: 250,
    top: (HEIGHT - 250) / 2,
    width: WIDTH,
    backgroundColor: COLOR1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    borderRadius: 20,
    justifyContent: "center",
  },
  cardContentContainer: {
    height: 225,
    justifyContent: "center",
    alignItems: "center",
    width: WIDTH,
    overflow: "hidden",
  },
  cardText: {
    fontSize: 36,
    textAlign: "center",
  },
  cardImage: {
    width: WIDTH - 150,
    height: 225,
  },
  newCardButtonText: {
    color: ACCENT_COLOR,
    fontWeight: "bold",
    fontSize: 18,
  },
  greyedNewCardButtonText: {
    color: GREYED_TEXT_COLOR,
    fontWeight: "bold",
    fontSize: 18,
  },
  body: {
    fontSize: 18,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    width: WIDTH,
    borderWidth: 1,
  },
  practiceControlsContainer: {
    width: 322,
    height: 100,
    position: "absolute",
    left: (WIDTH - 322) / 2,
    bottom: 125,
    justifyContent: "center",
    backgroundColor: COLOR1,
    borderRadius: 30,
  },
  practicePrevButtonContainer: {
    height: 50,
    width: 50,
    position: "absolute",
    left: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  practiceNextButtonContainer: {
    height: 50,
    width: 50,
    position: "absolute",
    right: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  practiceShuffleButtonContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLOR1,
    borderRadius: 30,
    borderWidth: 1,
    position: "absolute",
    left: 74,
    justifyContent: "center",
    alignItems: "center",
  },
  practiceResetShuffleButtonContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLOR1,
    borderRadius: 30,
    borderWidth: 1,
    position: "absolute",
    right: 74,
    justifyContent: "center",
    alignItems: "center",
  },
  practiceAutoplayButtonContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLOR1,
    borderRadius: 30,
    borderWidth: 1,
    position: "absolute",
    left: 136,
    justifyContent: "center",
    alignItems: "center",
  },
  practiceProgressContainer: {
    height: 50,
    width: 100,
    position: "absolute",
    left: (WIDTH - 100) / 2,
    bottom: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  practiceProgressText: {
    fontWeight: "bold",
  },
  practiceAutoplayProgress: {
    position: "absolute",
    bottom: (HEIGHT - 250) / 2 - 4,
  },
  practiceAutoplayCardBlocker: {
    zIndex: 1,
    width: WIDTH,
    height: 250,
    position: "absolute",
    bottom: (HEIGHT - 250) / 2,
  },
  practiceAutoplayLeftButtonBlocker: {
    height: 100,
    width: 124,
    position: "absolute",
    left: (WIDTH - 322) / 2,
    bottom: 125,
    zIndex: 1,
  },
  practiceAutoplayRightButtonBlocker: {
    height: 100,
    width: 124,
    position: "absolute",
    right: (WIDTH - 322) / 2,
    bottom: 125,
    zIndex: 1,
  },
  practiceSettingsButtonContainer: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  practiceSettingsWindow: {
    position: "absolute",
    bottom: (HEIGHT - 200) / 2,
    height: 200,
    width: 300,
    backgroundColor: COLOR1,
    alignItems: "center",
    borderRadius: 10,
  },
  practiceSettingsAutoplayIntervalSlider: {
    position: "absolute",
    top: 115,
    width: 150,
    left: 50,
  },
  practiceSettingsAutoplayIntervalSliderHeader: {
    position: "absolute",
    top: 90,
    fontSize: 18,
  },
  practiceSettingsAutoplayIntervalSliderThumb: {
    height: 30,
    width: 30,
    backgroundColor: ACCENT_COLOR,
  },
  practiceSettingsAutoplayIntervalSliderLabelContainer: {
    position: "absolute",
    top: 125,
    right: 50,
    height: 20,
    justifyContent: "center",
  },
  practiceSettingsAutoplayIntervalSliderLabel: {
    fontWeight: "100",
  },
});

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation, route }) => {
  const [decks, setDecks] = useState([]);
  const [search, setSearch] = useState("");
  const [renderedDecks, setRenderedDecks] = useState([]);
  const swipeableRefs = useRef({});
  useEffect(() => {
    const loadDecks = async () => {
      const value = JSON.parse(await SecureStore.getItemAsync("decks"));
      if (value !== null) {
        setDecks(value);
      }
    };
    loadDecks();
  }, []);
  useEffect(() => {
    const saveDecks = async () => {
      await SecureStore.setItemAsync("decks", JSON.stringify(decks));
    };
    saveDecks();
  }, [decks]);
  useEffect(() => {
    if (route.params?.welcomeScreenPermanentDismiss) {
      (async () => {
        await SecureStore.setItemAsync("welcomeScreenPermanentDismiss", "true");
      })();
    } else {
      (async () => {
        let value = JSON.parse(
          await SecureStore.getItemAsync("welcomeScreenPermanentDismiss"),
        );
        if (value === null) {
          navigation.navigate("Welcome");
        }
      })();
    }
  }, []);
  useEffect(() => {
    setRenderedDecks(
      decks.filter((item) =>
        item.title.toLowerCase().trim().includes(search.toLowerCase().trim()),
      ),
    );
  }, [decks]);
  const handleDeckCreation = () => {
    prompt(
      "New study set",
      "",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: (text) => {
            if (!text.trim()) {
              return;
            }
            const id = Math.random();
            setDecks((prev) => [
              ...prev,
              {
                title: text.trim(),
                id: id,
                cards: [],
              },
            ]);
            setRenderedDecks([
              ...decks,
              {
                title: text.trim(),
                id: id,
                cards: [],
              },
            ]);
            setSearch("");
          },
        },
      ],
      {},
    );
  };
  const handleDeckSelection = (deck) => {
    navigation.navigate("Deck", {
      deck: deck,
      updateDeckCards: updateDeckCards,
    });
  };
  const handleDeckDeletion = (deck) => {
    const newDecks = [];
    for (let i = 0; i < decks.length; i++) {
      if (decks[i].id != deck.id) {
        newDecks.push(decks[i]);
      }
    }
    setDecks(newDecks);
    setRenderedDecks(
      newDecks.filter((item) =>
        item.title.toLowerCase().trim().includes(search.toLowerCase().trim()),
      ),
    );
    swipeableRefs.current[deck.id].close();
  };
  const handleDeckTitleEdit = (deck) => {
    const newDecks = [];
    prompt(
      "Enter new title",
      "",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: (text) => {
            if (!text.trim()) {
              return;
            }
            for (let i = 0; i < decks.length; i++) {
              if (decks[i].id != deck.id) {
                newDecks.push(decks[i]);
              } else {
                newDecks.push({
                  title: text.trim(),
                  id: deck.title,
                  cards: deck.cards,
                });
              }
            }
            setDecks(newDecks);
            setRenderedDecks(newDecks);
          },
        },
      ],
      {},
    );
    swipeableRefs.current[deck.id].close();
  };
  const updateDeckCards = (newCards, deck) => {
    const newDecks = [];
    for (let i = 0; i < decks.length; i++) {
      if (decks[i].id != deck.id) {
        newDecks.push(decks[i]);
      } else {
        newDecks.push({
          title: decks[i].title,
          id: decks[i].id,
          cards: newCards,
        });
      }
    }
    setDecks(newDecks);
  };
  const onChangeSearchBarText = (text) => {
    setSearch(text);
    setRenderedDecks(
      decks.filter((item) =>
        item.title.toLowerCase().trim().includes(text.toLowerCase().trim()),
      ),
    );
  };
  const handleInfoButtonPress = () => {
    (async () => {
      await SecureStore.deleteItemAsync("welcomeScreenPermanentDismiss");
    })();
    navigation.navigate("Welcome");
  };
  return (
    <View style={styles.container}>
      {!decks.length ? (
        <View style={styles.emptyMessageContainer}>
          <Text style={styles.emptyMessage}>
            Press + to create your first study set!
          </Text>
        </View>
      ) : null}
      {decks.length && !renderedDecks.length ? (
        <View style={styles.emptyMessageContainer}>
          <Text style={styles.emptyMessage}>No results</Text>
        </View>
      ) : null}
      <Text style={styles.title}>My study sets</Text>
      <TouchableOpacity
        style={styles.infoButtonContainer}
        onPress={handleInfoButtonPress}
      >
        <Image style={styles.button} source={require("./assets/info.png")} />
      </TouchableOpacity>
      {decks.length ? (
        <SearchBar
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
          platform={Platform.OS}
          placeholder="Search"
          cancelButtonProps={styles.searchBarCancel}
          value={search}
          onChangeText={onChangeSearchBarText}
        />
      ) : null}
      <FlatList
        style={styles.deckList}
        data={renderedDecks}
        keyExtractor={(deck) => deck.id}
        renderItem={({ item, index }) => (
          <GestureHandlerRootView style={styles.deckContainer}>
            <Swipeable
              key={item.id}
              ref={(el) => (swipeableRefs.current[item.id] = el)}
              friction={1}
              overshootFriction={4}
              renderRightActions={(progress) => {
                return (
                  <View
                    style={{
                      width: 150,
                      flexDirection: "row",
                      alignItems: "flex-end",
                    }}
                  >
                    <RNAnimated.View
                      style={{
                        flexDirection: "row",
                        transform: [
                          {
                            scaleX: progress.interpolate({
                              inputRange: [0, 1, 2],
                              outputRange: [0, 1, 1],
                            }),
                          },
                          { translateX: -75 },
                        ],
                        left: 75,
                      }}
                    >
                      <RNAnimated.View style={{ flex: 1 }}>
                        <TouchableOpacity
                          onPress={() => {
                            handleDeckTitleEdit(item);
                          }}
                        >
                          <View style={styles.deckEditButtonContainer}>
                            <Image
                              style={styles.button}
                              source={require("./assets/pencil.png")}
                            />
                          </View>
                        </TouchableOpacity>
                      </RNAnimated.View>
                      <RNAnimated.View style={{ flex: 1 }}>
                        <TouchableOpacity
                          onPress={() => {
                            handleDeckDeletion(item);
                          }}
                        >
                          <View style={styles.deckDeleteButtonContainer}>
                            <Image
                              style={styles.button}
                              source={require("./assets/trashWhite.png")}
                            />
                          </View>
                        </TouchableOpacity>
                      </RNAnimated.View>
                    </RNAnimated.View>
                  </View>
                );
              }}
            >
              <RNGHTouchableOpacity onPress={() => handleDeckSelection(item)}>
                <View style={index == 0 ? styles.firstDeck : styles.deck}>
                  <Text style={styles.deckText}>{item.title}</Text>
                </View>
              </RNGHTouchableOpacity>
            </Swipeable>
          </GestureHandlerRootView>
        )}
      />
      <TouchableOpacity
        style={styles.addButtonContainer}
        onPress={handleDeckCreation}
      >
        <Shadow startColor={SHADOW_COLOR} style={styles.container}>
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </View>
        </Shadow>
      </TouchableOpacity>
    </View>
  );
};

const WelcomeScreen = ({ navigation }) => {
  const WelcomeTipImage = ({ aspectRatio, source }) => {
    return (
      <View style={styles.welcomeTipImageContainer}>
        <Image
          style={{
            ...styles.welcomeTipImage,
            aspectRatio: aspectRatio,
          }}
          source={source}
        />
      </View>
    );
  };
  const handleDismiss = () => {
    navigation.navigate("Home");
  };
  const handlePermanentDismiss = () => {
    navigation.navigate("Home", { welcomeScreenPermanentDismiss: true });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcards</Text>
      <View style={styles.welcomeTips}>
        <ScrollView>
          <View style={styles.welcomeTip}>
            <Text style={styles.heading}>Create custom flashcards</Text>
            <Text style={styles.welcomeTipText}>
              Create traditional text-based flashcards as well as image-based
              flashcards using our built-in drawing tool or an image of your
              choice.
            </Text>
          </View>
          <View style={styles.welcomeTip}>
            <Text style={styles.heading}>Organize your learning</Text>
            <Text style={styles.welcomeTipText}>
              Create study sets that you can access and modify with ease.
            </Text>
            <WelcomeTipImage
              source={require("./assets/homeScreen.gif")}
              aspectRatio={479 / 252}
            />
          </View>
          <View style={styles.welcomeTip}>
            <Text style={styles.heading}>Test your knowledge</Text>
            <Text style={styles.welcomeTipText}>
              Master any concept using the practice feature, which allows you to
              focus on your learning hands free.
            </Text>
            <WelcomeTipImage
              source={require("./assets/practiceControls.png")}
              aspectRatio={1170 / 425}
            />
          </View>
          <View style={{ height: 200 }} />
        </ScrollView>
      </View>
      <View style={styles.welcomeDismissButtonsContainer} intensity={30}>
        <TouchableOpacity
          style={styles.welcomePermanentDismissButton}
          onPress={handlePermanentDismiss}
        >
          <Text style={styles.welcomePermanentDismissButtonText}>
            Don't show again
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.welcomeDismissButton}
          onPress={handleDismiss}
        >
          <Text style={styles.welcomeDismissButtonText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DeckScreen = ({ navigation, route }) => {
  const [cards, setCards] = useState(route.params.deck.cards);
  const [textInputVisible, setTextInputVisible] = useState(false);
  const [drawingInputVisible, setDrawingInputVisible] = useState(false);
  const [imageInputVisible, setImageInputVisible] = useState(false);
  const [cardTypeChoiceVisible, setCardTypeChoiceVisible] = useState(false);
  const [termInput, setTermInput] = useState("");
  const [defInput, setDefInput] = useState("");
  const [imageCardImage, setImageCardImage] = useState(null);
  const handleCardTypeChoice = (type) => {
    setCardTypeChoiceVisible(false);
    switch (type) {
      case "text":
        setTextInputVisible(true);
        break;
      case "drawing":
        setDrawingInputVisible(true);
        break;
      case "image":
        setImageInputVisible(true);
        break;
    }
  };
  const handleTextCardCreation = () => {
    if (!termInput.trim() || !defInput.trim()) {
      handleInputClose();
      return;
    }
    const id = Math.random();
    route.params.updateDeckCards(
      [
        ...cards,
        {
          type: "text",
          term: termInput.trim(),
          def: defInput,
          id: id,
        },
      ],
      route.params.deck,
    );
    setCards((prevCards) => [
      ...prevCards,
      { type: "text", term: termInput, def: defInput, id: id },
    ]);
    handleInputClose();
  };
  const handleDrawingCardCreation = () => {
    if (!termInput.trim()) {
      handleInputClose();
      return;
    }
    const id = Math.random();
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="225" height="225" viewBox="0 0 225 225" fill="none">`;
    paths.forEach((path) => {
      let color, width;
      if (path.type == "draw") {
        (color = "#000"), (width = 10);
      } else {
        (color = "#fff"), (width = 25);
      }
      let pathSvg = ` <path d="${path.segments.join(
        " ",
      )}" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/> `;
      svg += pathSvg;
    });
    svg += `</svg>`;
    setCards((prevCards) => {
      newCards = [
        ...prevCards,
        {
          type: "drawing",
          term: termInput.trim(),
          def: svg,
          id: id,
        },
      ];
      route.params.updateDeckCards(newCards, route.params.deck);
      return newCards;
    });
    handleInputClose();
  };
  const handleImageCardCreation = () => {
    if (!termInput.trim() || imageCardImage == null) {
      handleInputClose();
      return;
    }
    const id = Math.random();
    setCards((prevCards) => {
      route.params.updateDeckCards(
        [
          ...prevCards,
          {
            type: "image",
            term: termInput.trim(),
            def: imageCardImage,
            id: id,
          },
        ],
        route.params.deck,
      );
      return [
        ...prevCards,
        {
          type: "image",
          term: termInput.trim(),
          def: imageCardImage,
          id: id,
        },
      ];
    });
    handleInputClose();
  };
  const handleCardDeletion = (card) => {
    const newCards = [];
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].id != card.id) {
        newCards.push(cards[i]);
      }
    }
    setCards(newCards);
    route.params.updateDeckCards(newCards, route.params.deck);
  };
  const handleAddButtonPress = () => {
    setCardTypeChoiceVisible(true);
  };
  const handleInputClose = () => {
    setTextInputVisible(false);
    setDrawingInputVisible(false);
    setCanvasTool("brush");
    setImageInputVisible(false);
    setTermInput("");
    setDefInput("");
    setPaths([]);
    setImageCardImage(null);
  };
  navigation.setOptions({
    title: route.params.deck.title,
    headerRight: cards.length
      ? () => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Practice", {
                title: route.params.deck.title,
                cards: cards,
              })
            }
          >
            <Text style={styles.newCardButtonText}>Practice</Text>
          </TouchableOpacity>
        )
      : () => <Text style={styles.greyedNewCardButtonText}>Practice</Text>,
  });
  const [paths, setPaths] = useState([]);
  const [canvasTool, setCanvasTool] = useState("brush");
  const drawGesture = Gesture.Simultaneous(
    Gesture.LongPress().minDuration(0),
    Gesture.Pan()
      .onBegin((g) => {
        const newPaths = [...paths];
        newPaths[paths.length] = {
          type: canvasTool == "brush" ? "draw" : "erase",
          strokeWidth: canvasTool == "brush" ? 10 : 25,
          color: canvasTool == "brush" ? "#000" : COLOR2,
          segments: [`M ${g.x} ${g.y}`, `L ${g.x} ${g.y}`],
        };
        setPaths(newPaths);
      })
      .onUpdate((g) => {
        const newPaths = [...paths];
        if (newPaths?.[paths.length - 1]?.segments) {
          newPaths[paths.length - 1].segments.push(`L ${g.x} ${g.y}`);
          setPaths(newPaths);
        }
      })
      .runOnJS(true),
  );
  const handleCanvasToggleTool = () => {
    setCanvasTool(canvasTool == "brush" ? "erase" : "brush");
  };
  const handleCanvasUndo = () => {
    const newPaths = [...paths];
    newPaths.pop();
    setPaths(newPaths);
  };
  const handleImageUploadButtonPress = () => {
    (async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });
      if (!result.canceled) {
        setImageCardImage(result.assets[0].uri);
      }
    })();
  };
  return (
    <View style={styles.container}>
      {!cards.length ? (
        <View style={styles.emptyMessageContainer}>
          <Text style={styles.emptyMessage}>
            Press + to create your first card!
          </Text>
        </View>
      ) : null}
      <Modal visible={textInputVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalContainer}>
            <View style={styles.newTextCardInputWindow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleInputClose}
              >
                <Text style={styles.cancelButtonText}>✕</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.newCardTermInputField}
                placeholder="Term"
                placeholderTextColor={GREYED_TEXT_COLOR}
                onChangeText={setTermInput}
                value={termInput}
              />
              <TextInput
                style={styles.newCardDefInputField}
                placeholder="Definition"
                placeholderTextColor={GREYED_TEXT_COLOR}
                onChangeText={setDefInput}
                value={defInput}
              />
              <TouchableOpacity
                style={styles.textCardInputYesButton}
                onPress={handleTextCardCreation}
              >
                <Text style={styles.inputYesButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal visible={drawingInputVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalContainer}>
            <GestureHandlerRootView style={styles.newDrawingCardInputWindow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleInputClose}
              >
                <Text style={styles.cancelButtonText}>✕</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.newCardTermInputField}
                placeholder="Term"
                placeholderTextColor={GREYED_TEXT_COLOR}
                onChangeText={setTermInput}
                value={termInput}
              />
              <View style={styles.canvasContainer}>
                <GestureDetector gesture={drawGesture}>
                  <Canvas style={styles.canvas}>
                    {paths.map((p, index) => (
                      <Path
                        key={index}
                        path={p.segments.join(" ")}
                        style="stroke"
                        strokeWidth={p.strokeWidth}
                        strokeJoin={"round"}
                        strokeCap={"round"}
                        color={p.color}
                      />
                    ))}
                  </Canvas>
                </GestureDetector>
              </View>
              <TouchableOpacity
                style={styles.canvasToggleToolButtonContainer}
                onPress={handleCanvasToggleTool}
              >
                <Image
                  style={styles.button}
                  source={
                    canvasTool == "brush"
                      ? require("./assets/eraser.png")
                      : require("./assets/brush.png")
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.canvasUndoButtonContainer}
                onPress={handleCanvasUndo}
              >
                <Image
                  style={styles.button}
                  source={require("./assets/undo.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.drawingCardInputYesButton}
                onPress={handleDrawingCardCreation}
              >
                <Text style={styles.inputYesButtonText}>Create</Text>
              </TouchableOpacity>
            </GestureHandlerRootView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal visible={imageInputVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalContainer}>
            <View style={styles.newImageCardInputWindow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleInputClose}
              >
                <Text style={styles.cancelButtonText}>✕</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.newCardTermInputField}
                placeholder="Term"
                placeholderTextColor={GREYED_TEXT_COLOR}
                onChangeText={setTermInput}
                value={termInput}
              />
              <TouchableOpacity
                style={styles.imageUploadButtonContainer}
                onPress={handleImageUploadButtonPress}
              >
                <Image
                  style={styles.button}
                  source={require("./assets/image.png")}
                />
              </TouchableOpacity>
              {imageCardImage == null ? (
                <TouchableOpacity
                  style={styles.noImageMessageContainer}
                  onPress={handleImageUploadButtonPress}
                >
                  <Text style={styles.noImageMessage}>Upload an image</Text>
                </TouchableOpacity>
              ) : (
                <Image
                  style={styles.imageCardImagePreview}
                  source={{ uri: imageCardImage }}
                />
              )}
              <TouchableOpacity
                style={styles.imageCardInputYesButton}
                onPress={handleImageCardCreation}
              >
                <Text style={styles.inputYesButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal visible={cardTypeChoiceVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.cardTypeChoiceWindow}>
            <Text style={styles.windowTitle}>New Card</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setCardTypeChoiceVisible(false)}
            >
              <Text style={styles.cancelButtonText}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCardTypeChoice("text")}>
              <View style={styles.cardTypeChoiceButton}>
                <Image
                  style={styles.cardTypeChoiceButtonIcon}
                  source={require("./assets/text.png")}
                />
                <Text style={styles.cardTypeChoiceButtonText}>Text</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCardTypeChoice("drawing")}>
              <View style={styles.cardTypeChoiceButton}>
                <Image
                  style={styles.cardTypeChoiceButtonIcon}
                  source={require("./assets/drawing.png")}
                />
                <Text style={styles.cardTypeChoiceButtonText}>Drawing</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCardTypeChoice("image")}>
              <View style={styles.cardTypeChoiceButton}>
                <Image
                  style={styles.cardTypeChoiceButtonIcon}
                  source={require("./assets/image.png")}
                />
                <Text style={styles.cardTypeChoiceButtonText}>Image</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        data={cards}
        keyExtractor={(card) => card.id}
        renderItem={({ item }) => (
          <Card
            card={item}
            key={item.id}
            handleCardDeletion={handleCardDeletion}
          />
        )}
      />
      <TouchableOpacity
        style={styles.addButtonContainer}
        onPress={handleAddButtonPress}
      >
        <Shadow startColor={SHADOW_COLOR} style={styles.container}>
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </View>
        </Shadow>
      </TouchableOpacity>
    </View>
  );
};

const Card = forwardRef(({ card, practice, handleCardDeletion }, ref) => {
  const spin = useSharedValue(false);
  const frontStyle = useAnimatedStyle(() => {
    const spinVal = interpolate(spin.value, [0, 1], [0, 180]);
    return {
      transform: [
        {
          rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
        },
      ],
      backfaceVisibility: "hidden",
    };
  }, []);
  const backStyle = useAnimatedStyle(() => {
    const spinVal = interpolate(spin.value, [0, 1], [180, 360]);
    return {
      transform: [
        {
          rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
        },
      ],
      backfaceVisibility: "hidden",
    };
  }, []);
  const handleFlip = () => {
    spin.value = !spin.value;
  };
  useImperativeHandle(ref, () => ({
    flip: handleFlip,
    spin: () => spin.value,
  }));
  useEffect(() => {
    spin.value = false;
  }, []);
  return (
    <TouchableWithoutFeedback onPress={handleFlip}>
      <View
        style={practice ? styles.practiceCardContainer : styles.cardContainer}
      >
        <View style={{ flex: 1 }}>
          {!practice ? (
            <TouchableOpacity
              style={styles.cardDeleteButtonContainer}
              onPress={() => handleCardDeletion(card)}
            >
              <Image
                style={styles.button}
                source={require("./assets/trashRed.png")}
              />
            </TouchableOpacity>
          ) : null}
          <Animated.View style={[styles.card, frontStyle]}>
            <View style={styles.cardContentContainer}>
              <Text style={styles.cardText}>{card.term}</Text>
            </View>
          </Animated.View>
          <Animated.View style={[styles.card, backStyle]}>
            <View style={styles.cardContentContainer}>
              {card.type == "text" ? (
                <Text style={styles.cardText}>{card.def}</Text>
              ) : card.type == "drawing" ? (
                <SvgXml xml={card.def} />
              ) : (
                <Image style={styles.cardImage} source={{ uri: card.def }} />
              )}
            </View>
          </Animated.View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

const PracticeScreen = ({ navigation, route }) => {
  const [cards, setCards] = useState(route.params.cards);
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [autoplayInterval, setAutoplayInterval] = useState(1000);
  const autoplayIntervalIDRef = useRef(null);
  const autoplayProgressRef = useRef(0);
  const [autoplayProgressKey, setAutoplayProgressKey] = useState(0);
  const cardRef = useRef(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const handlePrevCard = () => {
    setIndex((prev) => (prev - 1 > -1 ? prev - 1 : cards.length - 1));
  };
  const handleNextCard = () => {
    setIndex((prev) => (prev + 1) % cards.length);
  };
  const handleShuffle = () => {
    const n = cards.length;
    const newCards = [...cards];
    while (JSON.stringify(newCards) == JSON.stringify(cards) && n > 1) {
      for (let i = 0; i < n; i++) {
        const j = Math.floor(Math.random() * (n - i)) + i;
        const t = newCards[i];
        newCards[i] = newCards[j];
        newCards[j] = t;
      }
      setCards(newCards);
    }
    setIndex(0);
  };
  const handleResetShuffle = () => {
    setCards(route.params.cards);
    setIndex(0);
    if (cardRef.current.spin()) {
      cardRef.current.flip();
    }
  };
  const handleToggleAutoplay = () => {
    setAutoplay((prev) => !prev);
  };
  const handleSettingsButtonPress = () => {
    setSettingsVisible(true);
  };
  const handleSettingsClose = () => {
    setSettingsVisible(false);
  };
  useEffect(() => {
    const loadAutoplayInterval = async () => {
      const value = JSON.parse(
        await SecureStore.getItemAsync("autoplayInterval"),
      );
      if (value !== null) {
        setAutoplayInterval(value);
      }
    };
    loadAutoplayInterval();
  }, []);
  useEffect(() => {
    const saveAutoplayInterval = async () => {
      await SecureStore.setItemAsync(
        "autoplayInterval",
        JSON.stringify(autoplayInterval),
      );
    };
    saveAutoplayInterval();
  }, [autoplayInterval]);
  useEffect(() => {
    navigation.setOptions({ title: "" });
  }, []);
  useEffect(() => {
    if (autoplay) {
      let flipNext = !cardRef.current.spin() || cards.length == 1;
      autoplayProgressRef.current = 1;
      setAutoplayProgressKey((prev) => prev + 1);
      const autoplayIntervalID = setInterval(() => {
        autoplayProgressRef.current = 0;
        setAutoplayProgressKey((prev) => prev + 1);
        if (flipNext) {
          cardRef.current.flip();
          flipNext = cards.length == 1;
        } else {
          handleNextCard();
          flipNext = true;
        }
        autoplayProgressRef.current = 1;
        setAutoplayProgressKey((prev) => prev + 1);
      }, autoplayInterval);
      autoplayIntervalIDRef.current = autoplayIntervalID;
      return () => {
        clearInterval(autoplayIntervalIDRef.current);
      };
    }
  }, [autoplay]);
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        style={styles.practiceSettingsButtonContainer}
        onPress={handleSettingsButtonPress}
      >
        <Image style={styles.button} source={require("./assets/cog.png")} />
      </TouchableOpacity>
    ),
  });
  return (
    <View style={styles.container}>
      <Card practice card={cards[index]} key={cards[index].id} ref={cardRef} />
      {autoplay ? <View style={styles.practiceAutoplayCardBlocker} /> : null}
      {autoplay ? (
        <View style={styles.practiceAutoplayRightButtonBlocker} />
      ) : null}
      {autoplay ? (
        <View style={styles.practiceAutoplayLeftButtonBlocker} />
      ) : null}
      {autoplay ? (
        <LinearProgress
          style={styles.practiceAutoplayProgress}
          color={ACCENT_COLOR}
          animation={{ duration: autoplayInterval }}
          variant="determinate"
          key={autoplayProgressKey}
          value={autoplayProgressRef.current}
        />
      ) : null}
      <View style={styles.practiceControlsContainer}>
        <TouchableOpacity
          style={styles.practicePrevButtonContainer}
          onPress={handlePrevCard}
        >
          <Image
            style={styles.button}
            source={require("./assets/leftArrow.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.practiceNextButtonContainer}
          onPress={handleNextCard}
        >
          <Image
            style={styles.button}
            source={require("./assets/rightArrow.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.practiceShuffleButtonContainer}
          onPress={handleShuffle}
        >
          <Image
            style={styles.button}
            source={require("./assets/shuffle.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.practiceResetShuffleButtonContainer}
          onPress={handleResetShuffle}
        >
          <Image style={styles.button} source={require("./assets/reset.png")} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.practiceAutoplayButtonContainer}
          onPress={handleToggleAutoplay}
        >
          <Image
            style={styles.button}
            source={
              !autoplay
                ? require("./assets/play.png")
                : require("./assets/pause.png")
            }
          />
        </TouchableOpacity>
      </View>
      <View style={styles.practiceProgressContainer}>
        <Text style={styles.practiceProgressText}>
          {index + 1} / {cards.length}
        </Text>
      </View>
      <Modal visible={settingsVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.practiceSettingsWindow}>
            <Text style={styles.windowTitle}>Practice Settings</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleSettingsClose}
            >
              <Text style={styles.cancelButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.practiceSettingsAutoplayIntervalSliderHeader}>
              Autoplay interval (ms)
            </Text>
            <Slider
              value={autoplayInterval}
              onValueChange={setAutoplayInterval}
              minimumValue={1000}
              maximumValue={10000}
              step={100}
              allowTouchTrack
              style={styles.practiceSettingsAutoplayIntervalSlider}
              thumbStyle={styles.practiceSettingsAutoplayIntervalSliderThumb}
            />
            <View
              style={
                styles.practiceSettingsAutoplayIntervalSliderLabelContainer
              }
            >
              <Text style={styles.practiceSettingsAutoplayIntervalSliderLabel}>
                {autoplayInterval}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer theme={Theme}>
      <StatusBar barStyle="default" />
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          title="Home"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false, gestureDirection: "vertical" }}
        />
        <Stack.Screen
          name="Deck"
          component={DeckScreen}
          options={{ headerShadowVisible: false }}
        />
        <Stack.Screen
          name="Practice"
          component={PracticeScreen}
          options={{ headerShadowVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;