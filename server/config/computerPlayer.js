const rooms = require('./../models/big2Rooms').rooms;

const suitValueMap = {
  '♦': 1,
  '♣': 2,
  '♥': 3,
  '♠': 4,
};

const selectHand = (user, room) => {
  // Return hand that is valid
  const previousHand = rooms[room].pot.slice(-1, 1);
  return previousHand;
};

const getValue = (card) => {
  const value = parseInt(card.slice(0, card.length - 1), 10);
  const suit = card[card.length - 1];
  const suitValue = suitValueMap[suit];
  return {
    value,
    suitValue,
  };
};

const cardIsLarger = (card1, card2) => {
  const card1Val = getValue(card1);
  const card2Val = getValue(card2);
  return card1Val.value > card2Val.value
        && card1Val.suitValueMap > card1Val.suitVale;
};

const suitIsMatch = (card1, card2) =>
  getValue(card1).suitValueMap === getValue(card2).suitValueMap;

const valueIsMatch = (card1, card2) =>
  getValue(card1).value === getValue(card2).value;

// only worry about singles, pairs, and trips for now
// TODO: Make this function check for legal poker hands
const handPatternCheck = (hand) => {
  let result = true;
  for (let i = 1; i < hand.length; i += 1) {
    result = valueIsMatch(hand[i - 1], hand[i]) && result;
  }
  return result;
};

const handIsLarger = (hand, previousHand) =>
  hand.length === previousHand.length
    && hand.reduce((acc, val, idx) =>
      cardIsLarger(val, previousHand[idx]),
      false);

// TODO: Make sure hands are properly sorted for index compares
const validCheck = (hand, previousHand) =>
  handPatternCheck(hand)
    && handIsLarger(hand, previousHand);

module.exports = {
  suitValueMap,
  selectHand,
  getValue,
  cardIsLarger,
  suitIsMatch,
  valueIsMatch,
  handPatternCheck,
  handIsLarger,
  validCheck,
};