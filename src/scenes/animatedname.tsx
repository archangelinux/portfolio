import React, { useState, useRef, useEffect } from "react";
import { LayoutGroup, motion } from "framer-motion";

interface Letter {
  char: string;
  id: number;
  isNew: boolean;
}

//rotation order
const nameVariants: string[] = [
  "angelina",
  "angelinux",
  "archangel",
  "architect",
  "architect of",
  "architect of change",
  "archangelinux",
];

export default function AnimatedName() {
  const [step, setStep] = useState(0);
  const [letters, setLetters] = useState<Letter[]>(
    nameVariants[0].split("").map((c, i) => ({ char: c, id: i, isNew: false }))
  );
  const idCounter = useRef(letters.length);

  //advance every 1.5s
  useEffect(() => {
    const iv = setInterval(() => setStep((s) => (s + 1) % nameVariants.length), 1500);
    return () => clearInterval(iv);
  }, []);

  //on each step, diff-assign letters with isNew flags
  useEffect(() => {
    setLetters((prev) => diffAssign(prev, nameVariants[step], idCounter));
  }, [step]);

  const current = nameVariants[step];

  return (
    <div className="flex items-center justify-center h-4/5 mb-[50px]">
      <LayoutGroup>
        <motion.div layout className="inline-flex text-[7vw] font-bold lowercase">
          {letters.map(({ char, id, isNew }) => {
            //overridden variants
            let color: string;
            if (current === "angelina") {
              color = "#FFFFFF";
            } else if (current === "archangelinux" || isNew) {
              color = "#FFA500";
            } else {
              color = "currentColor";
            }
            return (
              <motion.span key={id} layout style={{ color }}>
                {char}
              </motion.span>
            );
          })}
        </motion.div>
      </LayoutGroup>
    </div>
  );
}

function diffAssign(prev: Letter[], nextStr: string, idCounter: React.RefObject<number>): Letter[] {

  const m = prev.length;
  const n = nextStr.length;

  //longest common subsequence dp table
  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = (prev[i - 1].char === nextStr[j - 1]) ? (dp[i - 1][j - 1] + 1) : (Math.max(dp[i - 1][j], dp[i][j - 1]));
    }
  }

  //check matches
  const matches: { prevIndex: number; newIndex: number }[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) { 
    //chars equal => part of LCS
    if (prev[i - 1].char === nextStr[j - 1]) {
      matches.unshift({ prevIndex: i - 1, newIndex: j - 1 }); //push front
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  const matchMap = new Map<number, number>();
  matches.forEach(({ prevIndex, newIndex }) => matchMap.set(newIndex, prevIndex));

  //build new letters array
  const out: Letter[] = [];
  for (let k = 0; k < n; k++) {
    if (matchMap.has(k)) {
      const prevIndex = matchMap.get(k)!; //reuse old letters
      out.push({ char: nextStr[k], id: prev[prevIndex].id, isNew: false }); //framer motion animates prev id in place
    } else {
      out.push({ char: nextStr[k], id: idCounter.current++, isNew: true }); //generate new id
    }
  }

  //force 'e' in "architect" to be new
  if (nextStr === "architect") {
    return out.map((l) => (l.char === "e" ? { ...l, isNew: true } : l));
  }
  return out;
}