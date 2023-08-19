import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import Modal from 'react-native-modal';

const initialSentences = [
    "This is the first sentence",
    "Here is another sentence to arrange",
    // Add more sentences here.
];

const shuffleArray = (array) => {
    // Use the Fisher-Yates (Knuth) shuffle algorithm to randomize the array.
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const App = () => {
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [sentences, setSentences] = useState(shuffleArray([...initialSentences]));
    const [jumbledWords, setJumbledWords] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

    const [score, setScore] = useState(0);

    useEffect(() => {
        if (sentences.length > 0) {
            const sentence = sentences[0];
            const initialWordArray = sentence.split(" ").map((word, index) => ({ key: `${index}`, label: word }));
            setJumbledWords(shuffleArray([...initialWordArray])); // Randomize the initial order
        }
    }, [sentences]);

    const checkAnswer = () => {
        if (sentences.length === 0) {
            Alert.alert("Congratulations!", "You completed the game!");
            return;
        }

        const correctOrder = sentences[0].split(" ");
        const userOrder = jumbledWords.map((item) => item.label);
        const isAnswerCorrect = userOrder.join(" ") === correctOrder.join(" ");
        setScore(score + 1);
        setIsModalVisible(true); // Show the modal

        setModalContent(
            <View>
                <Text>{isAnswerCorrect ? "Correct!" : "Try Again"}</Text>
                <Text>The answer is: {correctOrder.join(" ")}</Text>
                {sentences.length > 1 ? (
                    <TouchableOpacity onPress={() => nextSentence()}>
                        <Text>Next</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const nextSentence = () => {
        const remainingSentences = [...sentences];
        remainingSentences.shift();
        setSentences(remainingSentences);
        setIsModalVisible(false);
    };

    const [modalContent, setModalContent] = useState(null);

    const renderItem = ({ item, index, drag, isActive }) => (
        <TouchableOpacity
            style={{
                backgroundColor: isActive ? "lightgrey" : "white",
                padding: 10,
                marginVertical: 5,
            }}
            onLongPress={isModalVisible ? undefined : drag} // Disable dragging when the modal is visible
        >
            <Text>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            {sentences.length > 0 ? (
                <>
                    <Text>Arrange the words in the correct order:</Text>
                    <DraggableFlatList
                        data={jumbledWords}
                        renderItem={renderItem}
                        horizontal
                        keyExtractor={(item) => item.key}
                        onDragEnd={({ data }) => setJumbledWords(data)}
                    />
                    <TouchableOpacity onPress={() => checkAnswer()}>
                        <Text>Check Answer</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text>No more sentences to arrange.</Text>
            )}

            <Modal
                isVisible={isModalVisible}
                backdropOpacity={0.1} // Set the backdrop opacity to a lighter value (e.g., 0.5)
            >
                {modalContent}
            </Modal>
        </View>
    );
};

export default App;
