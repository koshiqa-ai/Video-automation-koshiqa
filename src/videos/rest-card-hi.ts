// Video 1 · Hindi version of the Rest Card explainer ("Rest Card क्या है? हमने इसे क्यों बनाया?").
// Same slides, screens and timing logic as rest-card.ts (English); the script is translated into conversational
// Hindi (Hinglish): product and app words stay in English, as members say them and as the app shows them.
// The app screens and the member's chat message stay in English (they are what the member sees and wrote).
import type { HelpVideoSpec, VideoSlide } from "./types";
import { REST_CARD } from "./rest-card";

const EN = REST_CARD.slides;
/** take English slide i and replace its words; screens, peeks, targets and timing rules are kept */
const hi = (i: number, o: Partial<VideoSlide>): VideoSlide => ({ ...EN[i], ...o });
const S = (i: number) => EN[i].screen as Record<string, any>;

export const REST_CARD_HI: HelpVideoSpec = {
  id: "HV-RestCard-HI",
  type: "explainer",
  question: "Rest Card क्या है? हमने इसे क्यों बनाया?",
  lang: "hi",
  slides: [
    hi(0, { title: "Rest Card क्या है?", accent: "Rest Card" }),

    hi(1, { title: "हर दिन की मेहनत", accent: "हर दिन",
      vo: "आप हर दिन लगे रहते हैं, एक अच्छी आदत बना रहे हैं, और आगे बढ़ रहे हैं।" }),
    hi(2, { title: "हर दिन 10K नहीं", accent: "10K", anno: { ...EN[2].anno!, atWord: "हर दिन" },
      vo: "लेकिन सच कहें तो, हर दिन 10,000 steps वाला दिन नहीं होता। और ये बिल्कुल ठीक है!" }),

    hi(3, { motion: { line1: "आपके feedback से बना", line2: "आप जैसे members के साथ" },
      vo: "Koshiqa में, हम आप जैसे members के feedback से अपना product बनाते हैं।" }),
    hi(4, {
      screen: { chat: { ...S(4).chat, messages: [
        { ...S(4).chat.messages[0] },
        { ...S(4).chat.messages[1], atWord: "lifelong" },
        { ...S(4).chat.messages[2], atWord: "शरीर को" },
        { ...S(4).chat.messages[3], atWord: "इस बात ने" },
      ], typing: { atWord: "सीधा-सा", from: "koshiqa" } } },
      vo: "एक दिन, हमारी community की एक महिला ने हमें एक message भेजा, जो हमारे दिल को छू गया। उन्होंने कहा कि वो Koshiqa को अपना lifelong, sustainable partner मानती हैं। लेकिन periods के दिनों में, कभी-कभी उनका 10,000 steps तक खुद को push करने का मन नहीं करता। वो अपने शरीर को थोड़ा आराम देना चाहती हैं। और फिर उन्होंने हमसे एक सीधा-सा सवाल पूछा: \"क्या contest में कुछ rest days मिल सकते हैं?\" इस बात ने हमें सोचने पर मजबूर कर दिया।" }),

    hi(5, { title: "मिलिए Rest Card से", accent: "Rest Card",
      vo: "यही Rest Card बनाने की एक वजह बनी।" }),
    hi(6, { title: "10K तक बढ़ाया", accent: "10K", anno: { ...EN[6].anno!, atWord: "सबसे कम" },
      screen: { ...S(6), then: { ...S(6).then, atWord: "अपने-आप" } } as VideoSlide["screen"],
      vo: "ये contest में आपके सबसे कम steps वाले eligible दिन को ढूंढता है, और उसे अपने-आप 10,000 steps तक बढ़ा देता है।" }),

    hi(7, { title: "Bonus steps", number: { ...EN[7].number!, label: "4,200 से 10,000" },
      vo: "मान लीजिए, आपके सबसे कम steps वाले दिन में 4,200 steps थे। आपका Rest Card 5,800 steps जोड़ सकता है, और वो दिन 10,000 तक पहुँच जाता है।" }),
    hi(8, { title: "कम deficit", accent: "deficit",
      vo: "इसका मतलब है, आपके contest total में ज़्यादा steps, कम deficit, और हो सकता है एक बेहतर club placement भी!" }),

    hi(9, { motion: { line1: "Contest में गिना जाएगा", line2: "Streak में नहीं" },
      vo: "एक ज़रूरी बात याद रखें: Rest Card आपके दिन को contest progress के लिए 10,000 steps वाला दिन गिनता है। लेकिन ये आपकी daily streak नहीं बचाता।" }),
    hi(10, { title: "Streak की शर्त", number: { ...EN[10].number!, label: "असली steps, हर दिन" },
      vo: "अपनी streak बनाए रखने के लिए, आपको एक दिन में कम से कम 4,000 असली steps चलने होंगे।" }),
    hi(11, { title: "Streak चेक", accent: "चेक",
      compare: { left: { title: "3,500 steps", result: "Streak टूटी। Rest Card वापस नहीं ला सकता", atWord: "टूट" }, right: { title: "4,200 steps", result: "Streak बची रही। 10K तक बढ़ा", atWord: "वापस" } },
      vo: "अगर आपकी streak पहले ही टूट चुकी है, तो Rest Card उसे वापस नहीं ला सकता।" }),

    hi(12, { motion: { title: "Sustainable, stressful नहीं", accent: "stressful नहीं", line: "मेहनत। आराम। फिर से।", filled: 7, days: ["सो", "मं", "बु", "गु", "शु", "श", "र"] },
      vo: "क्योंकि हम मानते हैं कि fitness sustainable होनी चाहिए, stressful नहीं। कुछ दिन आप खुद को push करते हैं। और कुछ दिन, अपने शरीर को थोड़ा आराम देते हैं।" }),
    hi(13, { title: "हर कदम, आपके साथ", accent: "हर कदम",
      vo: "और हम Koshiqa को आपके साथ मिलकर बनाते रहेंगे, हर कदम पर।" }),
  ],
};
