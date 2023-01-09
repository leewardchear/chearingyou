export const Colours = {
  happy: { name: "Happy", val: "happy", code: "#61a875", intVal: 2 },
  angry: { name: "Angry", val: "angry", code: "#f1837d", intVal: -3 },
  afraid: { name: "Afraid", val: "afraid", code: "#e8a273", intVal: -2 },
  surprised: {
    name: "Surprised",
    val: "surprised",
    code: "#f0cb70",
    intVal: 1,
  },
  anxious: { name: "Anxious", val: "anxious", code: "#75508b", intVal: -1 },
  sad: { name: "Sad", val: "sad", code: "#7cc9ec", intVal: -4 },
  // default: { name: "Neutral", val: "default", code: "#f1f1f1", intVal: 0 },
  default: { name: "Neutral", val: "default", code: "#c1c1c1", intVal: 0 },
};

export const MoodColors = [Colours.happy.code, Colours.angry.code, Colours.afraid.code
  , Colours.surprised.code, Colours.anxious.code, Colours.sad.code];