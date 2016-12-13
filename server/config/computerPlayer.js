const rooms = require('./../models/big2Rooms').rooms;

const suitValueMap = {
  '♦': 1,
  '♣': 2,
  '♥': 3,
  '♠': 4,
};

const handTypeMap = {
  straight: 1,
  flush: 2,
  fullHouse: 3,
  fourOfKind: 4,
  straightFlush: 5,
  royalFlush: 6,
};

const selectHand = (user, room) => {
  // Return hand that is valid
  const previousHand = rooms[room].pot.slice(-1, 1);
  return previousHand;
};

const getValue = (card) => {
  let value = parseInt(card.slice(0, card.length - 1), 10);
  value = value === 1 ? 14 : value;
  value = value === 2 ? 15 : value;
  const suit = card[card.length - 1];
  const suitValue = suitValueMap[suit];
  return {
    value,
    suitValue,
  };
};

// Returns true if card1 is larger than card2
const cardIsLarger = (card1, card2) => {
  const card1Val = getValue(card1);
  const card2Val = getValue(card2);
  return card1Val.value >= card2Val.value
        && card1Val.suitValue >= card2Val.suitValue;
};

const suitIsMatch = (card1, card2) =>
  getValue(card1).suitValue === getValue(card2).suitValue;

const valueIsMatch = (card1, card2) =>
  getValue(card1).value === getValue(card2).value;

// only worry about singles, pairs, and trips for now
// TODO: Make this function check for legal poker hands
const handPatternCheck = (hand) => {
  let result = true;
  if (hand.length === 4 || hand.length > 5) {
    return false;
  }
  for (let i = 1; i < hand.length; i += 1) {
    result = valueIsMatch(hand[i - 1], hand[i]) && result;
  }
  return result;
};

const handIsLarger = (hand, previousHand) =>
  hand.length === previousHand.length
    && hand.reduce((acc, val, idx) => {
      console.log('reduce with val: ', val);
      console.log('reduce with idx: ', idx);
      console.log('reduce with previousHand[idx]: ', previousHand[idx]);
      console.log('acc: ', acc);
      console.log('cardIsLarger(val, previousHand[idx]): ', cardIsLarger(val, previousHand[idx]));
      return cardIsLarger(val, previousHand[idx]);
    },
    false);

const validCheck = (hand, previousHand) =>
  handPatternCheck(hand)
    && handIsLarger(hand, previousHand);

const organizeComputerHand = (dealtCards) => {
  let newHand;
  const organized = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  };
  const finalGroup = dealtCards.reduce((acc, cur) => {
    const newRun = [cur];
    if (acc.length === 0) {
      return newRun;
    }
    if (valueIsMatch(acc[0], newRun[0])) {
      return acc.concat(newRun);
    }
    organized[acc.length].push(acc);
    return newRun;
  }, []);
  organized[finalGroup.length].push(finalGroup);
  // Check for four of a kind
  if (organized['4'].length > 0) {
    newHand = organized['4'].shift().concat(organized['1'].shift());
    organized['5'].push(newHand);
  }
  // Check for full house
  if (organized['3'].length > 0 && organized['2'].length > 0) {
    newHand = organized['3'].shift().concat(organized['2'].shift());
    organized['5'].push(newHand);
  }
  // Check for straights

  // Check for flushes <-- wait until it won't break apart better options

  return organized;
};

const chooseResponse = (cardsPlayed, sortedCompHand) => {
  // TODO: look up computer hand instead of passing sorted
  const options = sortedCompHand[cardsPlayed.length];
  let played;
  for (let i = 0; i < options.length; i += 1) {
    console.log('options i: ', options[i]);
    console.log('cardsPlayed: ', cardsPlayed);
    console.log('handIsLarger(options[i], cardsPlayed): ', handIsLarger(options[i], cardsPlayed));
    if (handIsLarger(options[i], cardsPlayed)) {
      played = options[i];
      sortedCompHand[cardsPlayed.length] = options.splice(i, 1);
      break;
    }
  }
  console.log(played);
  return played;
};

module.exports = {
  suitValueMap,
  handTypeMap,
  selectHand,
  getValue,
  cardIsLarger,
  suitIsMatch,
  valueIsMatch,
  handPatternCheck,
  handIsLarger,
  validCheck,
  organizeComputerHand,
  chooseResponse,
};
