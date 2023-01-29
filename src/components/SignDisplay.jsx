import {
  signA,
  signB,
  signC,
  signD,
  signE,
  signF,
  signG,
  signH,
  signI,
  signJ,
  signK,
  signL,
  signM,
  signN,
  signO,
  signP,
  signQ,
  signR,
  signS,
  signT,
  signU,
  signV,
  signW,
  signX,
  signY,
  signZ,
} from "../img/signs/index";

const SignDisplay = ({ text }) => {
  const lookUpMap = {
    a: signA,
    b: signB,
    c: signC,
    d: signD,
    e: signE,
    f: signF,
    g: signG,
    h: signH,
    i: signI,
    j: signJ,
    k: signK,
    l: signL,
    m: signM,
    n: signN,
    o: signO,
    p: signP,
    q: signQ,
    r: signR,
    s: signS,
    t: signT,
    u: signU,
    v: signV,
    w: signW,
    x: signX,
    y: signY,
    z: signZ,
  };

  const signArray = [];
  if (text !== null) {
    let cleanedText = text.replaceAll(" ", "").toLowerCase();
    for (const element of cleanedText) {
      signArray.push(lookUpMap[element]);
    }
  }

  return (
    <div>
      {signArray.map((element, index) => (
        <img key={index} src={element} alt={element}></img>
      ))}
    </div>
  );
};

export default SignDisplay;
