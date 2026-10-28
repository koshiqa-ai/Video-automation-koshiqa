# App screens available to help videos

**Real screenshots (default for production videos):** `screen: { image: "screens/<id>/NN.png", w, h, taps }`, made by `scripts/storyboard-import.py` from an approved storyboard. Taps and annotation targets are in **image pixels** (look at the screenshot to find the button centre). Give `atWord` instead of `at` and the tap lands when that word is spoken. The renderer fits the shot to the phone width, removes the recording's status bar (red timer included) and draws a clean one.

**Coded mockups (demos only):**

The phone shows coded mockups of the Koshiqa app (`src/screens/`). Each screen is **scripted**: its first tap triggers a fixed response (e.g. `home-tabbar` always opens the contest list). The `x, y` you give only places the cursor, so use the tap targets below. Coordinates are in phone-screen space, **390 × 844**.

| `comp` | Shows | Tap targets (x, y) | What the tap does |
|---|---|---|---|
| `home` | Home: greeting, koin chip, step ring, contest card, trees card | koin chip (318, 82) · step ring (195, 290) · Diwali Dash card (195, 520) · trees card (195, 616) | nothing (use for highlights, long-press, tooltips) |
| `home-tabbar` | Home with the tab bar | Home (49, 796) · **Contests (146, 796)** · Rewards (244, 796) · Profile (341, 796) | first tap opens the contest list |
| `home-sync` | Home, steps out of date | swipe down from (195, 210), `kind: "swipe-down"` | pull to refresh, steps count up |
| `contest-list` | Contests tab: Diwali Dash 10K, Monsoon Miles | Diwali Dash card (195, 300) | opens contest detail |
| `contest-detail` | Contest detail → confirm sheet → success | use `detailTaps: [join, confirm]` (seconds; `-10` = already happened, `999` = never). Join/Confirm buttons sit at (195, 772) | join opens the confirm sheet; confirm shows "You're in!" |
| `koins-1` | Home with koin balance | koin chip (318, 82) | opens Rewards |
| `koins-2` | Rewards catalogue | first reward (104, 330) | opens the reward |
| `koins-3` | Reward detail | Redeem (195, 772) | redeems |
| `koins-redeemed` | Redeemed confirmation | — | — |

**Annotation targets** use the same coordinates plus a size, e.g. the koin chip is `{ x: 318, y: 82, w: 112, h: 46, r: 23 }`, a full-width card `{ x: 195, y: 520, w: 366, h: 86, r: 22 }`.

**Bottom-corner rule:** a peeking Torty covers about the bottom 160 px × 110 px of the screen on his side (bottom-left: Home tab; bottom-right: Profile tab). Never tap or highlight there; put him on the other side.

**Missing a screen?** Don't fake it with a wrong screen. Use P1/P2 or F1/F2 for that beat, or add a new mockup in `src/screens/` and a row here.
