# Sunrider Compensation Calculator — simple editing guide

You only need to edit three files:

1. `index.html` — words, headings, and input boxes on the page.
2. `styles.css` — colours, spacing, and the overall look.
3. `app.js` — all calculator formulas and bonus amounts.

## Most useful places to edit

### Personal Sales Commission

In `app.js`, look for `retailRate` and this formula:

```js
pv * 38 * retailRate / 100
```

`38` is the rupee value per PV. Change it only if the plan changes.

### PV commission brackets

This part decides the percentage:

```js
pv < 150 ? 0 :
pv < 400 ? 3 :
pv < 1000 ? 5 :
pv < 2000 ? 8 :
pv < 2500 ? 10 : 15
```

### Unilevel Bonus

The formula is also in `app.js`:

```js
Level PV * 38 * level percentage / 100
```

The percentage table is called `uni`. Do not change its rows unless you have confirmed the correct plan percentages.

### Development Bonus

The fixed values are in this line:

```js
Ace = 1800, Ace Prime = 3600, Ace Elite = 4800, Ace Royal = 6000
```

### Red colour

In `styles.css`, the main red colour is `#a51f2b`. Replace it everywhere with another colour code if you want a different theme.

## Opening the calculator

Double-click `index.html` to use it. It works without internet. If you edit a file, save it and refresh the browser page.

Before relying on a payout estimate, test it against a real completed monthly payout statement.
