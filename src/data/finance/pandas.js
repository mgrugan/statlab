/* StatLab — pandas tutorial module
 * Follows the course notebook (Bourke / CMS 2026 student version), with a
 * final lesson bridging pandas to the Statistical Finance workflows.
 */

export const PANDAS_MODULES = [

/* ===================================================================== */
{
  id: "p1",
  part: "pandas",
  title: "Series and DataFrames",
  minutes: 10,
  summary: "The two data structures everything else is built on, and how to create them from scratch.",
  blocks: [
    { kind: "plain", title: "Start here: what is pandas for?",
      body: "A spreadsheet has rows, columns, and headers. **pandas is that, for Python** \u2014 with the ability to run code over it.\n\nWhy you need it in this course: `yfinance` hands you price data *as a pandas object*, and `statsmodels` and `arch` expect one back. pandas is the connective tissue between \"download prices\" and \"fit a GARCH model.\" Every lecture example passes through it.\n\nThere are exactly two objects to learn. A **Series** is one column. A **DataFrame** is a whole table. That's the entire mental model." },

    { kind: "idea", title: "Why pandas",
      body: "pandas is the open-source library for **analysing and manipulating data** in Python. In this course it is the layer between raw price data and every statistical routine you call — `yfinance` hands you a pandas object, and `statsmodels`/`arch` expect one back.\n\nThere are two core datatypes:\n\n• **Series** — a **1-dimensional** labelled array (one column of data).\n• **DataFrame** — a **2-dimensional** labelled table (rows × columns). A DataFrame is essentially a dict of Series sharing an index." },

    { kind: "code", title: "Creating a Series",
      lang: "python", file: "series.py",
      code: `import pandas as pd

# Creating a series of car types
cars = pd.Series(["BMW", "Toyota", "Honda"])

# Creating a series of colours
colours = pd.Series(["Red", "Blue", "White"])`,
      after: "Each Series gets an automatic integer index 0, 1, 2 — shown on the left when you display it. The index is *labels*, not positions, a distinction that becomes important in the next lesson." },

    { kind: "code", title: "Creating a DataFrame",
      lang: "python", file: "frame.py",
      body: "Pass a **dict**: keys become column names, values become columns.",
      code: `# Creating a DataFrame of cars and colours
car_data = pd.DataFrame({"Car type": cars,
                         "Colour": colours})`,
      after: "**Anatomy of a DataFrame:** the **index** runs down the left, **column names** across the top, each column is a **Series**, and the whole grid of values is the data. Rows are often called *samples* or *observations*; columns are *features*." },

    { kind: "key", title: "Series vs. DataFrame — keeping them straight",
      body: "A great deal of pandas confusion comes from not knowing which one you hold.\n\n• `df[\"col\"]` → a **Series** (single brackets, one column)\n• `df[[\"col\"]]` → a **DataFrame** with one column (double brackets)\n• `df[[\"a\",\"b\"]]` → a **DataFrame** with two columns\n\nThis matters in practice: many libraries (sklearn, `arch`) expect a 2-D frame for features and a 1-D Series for the target. Check with `type(x)` or `x.shape` when something misbehaves." },
  ],
},

/* ===================================================================== */
{
  id: "p2",
  part: "pandas",
  title: "Importing and Exporting Data",
  minutes: 8,
  summary: "Getting data in from CSV files and URLs, and writing results back out.",
  blocks: [
    { kind: "code", title: "Importing data",
      lang: "python", file: "io.py",
      code: `# Option 1: read from a CSV file stored locally
car_sales = pd.read_csv("car-sales.csv")

# Option 2: read directly from a URL (use the "raw" link on GitHub)
car_sales = pd.read_csv(
    "https://raw.githubusercontent.com/mrdbourke/zero-to-mastery-ml/master/data/car-sales.csv"
)`,
      after: "`pd.read_csv()` is the workhorse. Useful arguments: `sep=` for other delimiters, `index_col=` to make a column the index, `parse_dates=` to convert date strings to real datetimes on load." },

    { kind: "code", title: "Exporting data",
      lang: "python", file: "export.py",
      code: `# Export the car sales DataFrame to csv
car_sales.to_csv("exported-car-sales.csv", index=False)`,
      after: "Pass `index=False` unless the index carries meaning — otherwise you get an extra unnamed column of row numbers every time you round-trip a file. (For a price series indexed by date, you *do* want the index.)" },

    { kind: "trap", title: "On Colab, mount the drive first",
      body: "If you're working in Google Colab and reading files from your own Drive:\n\n```python\nfrom google.colab import drive\ndrive.mount('/content/drive')\n```\n\nThen read with a path under `/content/drive/MyDrive/...`. Files written to the Colab working directory vanish when the runtime recycles." },
  ],
},

/* ===================================================================== */
{
  id: "p3",
  part: "pandas",
  title: "Describing Data",
  minutes: 10,
  summary: "The first five things to run on any new dataset, and the numeric_only trap.",
  blocks: [
    { kind: "code", title: "The standard first look",
      lang: "python", file: "describe.py",
      code: `car_sales.dtypes       # data type of each column
car_sales.describe()   # count, mean, std, quartiles — NUMERIC columns only
car_sales.info()       # dtypes + non-null counts + memory usage
car_sales.columns      # the column names (an Index object)
car_sales.index        # the row index
len(car_sales)         # number of rows`,
      after: "`.dtypes` first, always. An `object` dtype on a column you expected to be numeric means values arrived as strings — a `$4,000.00` price column, for example — and every arithmetic operation downstream will silently misbehave." },

    { kind: "code", title: "Aggregations and the numeric_only argument",
      lang: "python", file: "agg.py",
      code: `# On a DataFrame: restrict to numeric columns
car_sales.mean(numeric_only=True)
car_sales.sum(numeric_only=True)

# On a single Series: no ambiguity
car_prices = pd.Series([3000, 1500, 111250])
car_prices.mean()
car_prices.sum()`,
      after: "`numeric_only=True` gets the mean/sum of **numeric columns only**. With `numeric_only=False` (the default for `.sum()`), pandas will happily *concatenate* string columns — summing a column of names gives you one long glued-together string, which is rarely what you want.\n\n`.describe()` already restricts itself to numeric columns; pass `include=\"all\"` to see the categorical ones too (count, unique, top, freq)." },

    { kind: "check",
      q: "`df.dtypes` reports that a `Price` column has dtype `object`. What is the most likely explanation?",
      choices: [
        "The column contains strings — e.g. currency symbols or commas — so it was not parsed as numeric",
        "The column contains missing values, which forces the object dtype",
        "`object` is the normal dtype for floating point columns in pandas",
        "The column has too many unique values to store as numbers",
      ],
      answer: 0,
      explain: "`object` is pandas' catch-all for Python objects, in practice usually **strings**. Missing values alone don't cause it — a numeric column with `NaN` becomes `float64`. Fix it by stripping the non-numeric characters and calling `.astype(float)`." },
  ],
},

/* ===================================================================== */
{
  id: "p4",
  part: "pandas",
  title: "Viewing and Selecting Data",
  minutes: 14,
  summary: ".loc vs .iloc, column selection, and boolean masks — the single most important pandas lesson.",
  blocks: [
    { kind: "code", title: "Peeking at rows",
      lang: "python", file: "peek.py",
      code: `car_sales.head()      # first 5 rows
car_sales.head(7)     # first 7 rows
car_sales.tail()      # last 5 rows`,
      after: "Same names and behaviour as R's `head()`/`tail()`." },

    { kind: "key", title: ".loc vs .iloc — label versus position",
      body: "This is the distinction that trips up everyone, so be precise:\n\n• **`.loc[]` selects by LABEL** — the value printed in the index.\n• **`.iloc[]` selects by integer POSITION** — 0-based, like a Python list.\n\nWhen the index is the default `0,1,2,...` they *coincide*, which is why the difference feels academic until it bites. Build a Series with a non-default index — say `animals = pd.Series([...], index=[3,3,9,...])` — and `animals.loc[3]` returns **every row labelled 3**, while `animals.iloc[3]` returns the **fourth row**.\n\nOne more asymmetry worth memorizing: **`.loc` slices are inclusive of the endpoint; `.iloc` slices are not.**\n\n```python\ncar_sales.loc[:3]    # rows up to AND INCLUDING label 3  -> 4 rows\ncar_sales.iloc[:3]   # rows up to position 3, exclusive  -> 3 rows\n```" },

    { kind: "code", title: "Selecting rows, columns, and cells",
      lang: "python", file: "select.py",
      code: `car_sales.loc[3]                 # row with index label 3
car_sales.iloc[3]                # row in position 3

car_sales.loc[:, "Colour"]       # all rows, the Colour column  (":" = all)
car_sales.iloc[1, 1]             # single cell by position

car_sales["Make"]                # a column, as a Series
car_sales["Colour"]`,
      after: "The pattern is `df.loc[rows, cols]` / `df.iloc[rows, cols]`; a bare `:` means \"all\" along that axis." },

    { kind: "code", title: "Boolean masking — filtering rows by condition",
      lang: "python", file: "mask.py",
      code: `# Cars with over 100,000 km on the odometer
car_sales[car_sales["Odometer (KM)"] > 100000]

# Cars made by Toyota
car_sales[car_sales["Make"] == "Toyota"]

# Combine conditions: & for and, | for or  (parentheses required!)
car_sales[(car_sales["Make"] == "Toyota") & (car_sales["Doors"] == 4)]`,
      after: "The inner expression produces a Series of `True`/`False`; putting it inside `df[...]` keeps the `True` rows. This is exactly R's logical-vector indexing.\n\n**Two traps:** use `&` and `|`, not `and`/`or` (which fail on arrays), and **wrap each condition in parentheses** — Python's operator precedence binds `&` tighter than `==`." },

    { kind: "check",
      q: "A DataFrame `df` has index labels `[0, 1, 2, 3, 4]`. How many rows do `df.loc[:3]` and `df.iloc[:3]` return, respectively?",
      choices: ["3 and 3", "4 and 3", "3 and 4", "4 and 4"],
      answer: 1,
      explain: "`.loc` slicing is **inclusive** of the endpoint label, so `df.loc[:3]` returns labels 0,1,2,3 = **4 rows**. `.iloc` follows standard Python slicing, excluding the endpoint, so `df.iloc[:3]` returns positions 0,1,2 = **3 rows**." },
  ],
},

/* ===================================================================== */
{
  id: "p5",
  part: "pandas",
  title: "Manipulating Data",
  minutes: 14,
  summary: "Missing values, creating and dropping columns, string methods, apply, and resetting the index.",
  blocks: [
    { kind: "code", title: "String methods via the .str accessor",
      lang: "python", file: "strings.py",
      code: `car_sales["Make"].str.lower()               # returns a new Series
car_sales["Make"] = car_sales["Make"].str.lower()   # reassign to keep it`,
      after: "**Most pandas operations return a copy and do not modify in place.** Calling `.str.lower()` alone changes nothing — `car_sales.head()` still shows the original. You must reassign (or pass `inplace=True` where supported)." },

    { kind: "code", title: "Handling missing values",
      lang: "python", file: "missing.py",
      code: `# Fill the Odometer column's missing values with the column mean
car_sales["Odometer"] = car_sales["Odometer"].fillna(car_sales["Odometer"].mean())

# Or with inplace (older style)
car_sales["Odometer"].fillna(car_sales["Odometer"].mean(), inplace=True)

# Remove rows containing missing data
car_sales_dropped = car_sales.dropna()

# Count missing values per column — the standard audit
car_sales.isna().sum()`,
      after: "Two strategies: **fill** (`fillna`) or **remove** (`dropna`). Filling with the mean keeps your sample size but shrinks variance; dropping keeps the data honest but costs rows. Which is right depends on why the values are missing." },

    { kind: "code", title: "Creating and dropping columns",
      lang: "python", file: "columns.py",
      code: `# From a pandas Series
seats_column = pd.Series([5, 5, 5, 5, 5])
car_sales["Seats"] = seats_column

# From a Python list (length must match the DataFrame)
car_sales["Fuel per 100KM"] = [7.5, 9.2, 5.0, 9.6, 8.7]

# From other columns — vectorized arithmetic
car_sales["Price per KM"] = car_sales["Price"] / car_sales["Odometer (KM)"]

# A constant value broadcasts
car_sales["Number of wheels"] = 4

# Drop a column (axis=1 means "column")
car_sales = car_sales.drop("Price per KM", axis=1)`,
      after: "Column arithmetic is **vectorized** — no loop needed, and far faster than one. The `axis=1` in `drop` is the perennial stumbling block: **axis=0 is rows, axis=1 is columns.**" },

    { kind: "code", title: "Sampling, resetting the index, and apply",
      lang: "python", file: "apply.py",
      code: `# Shuffle / take a random fraction
car_sales_sampled = car_sales.sample(frac=1)     # frac=1 -> all rows, shuffled

# The index is now scrambled; reset it
car_sales_sampled = car_sales_sampled.reset_index(drop=True)

# Apply a function elementwise (lambda or named)
car_sales["Odometer (Miles)"] = car_sales["Odometer (KM)"].apply(lambda x: x / 1.6)`,
      after: "`reset_index(drop=True)` throws away the old index; without `drop=True` it is kept as a new column. `.apply()` is flexible but slow — prefer vectorized arithmetic (`col / 1.6`) when you can express the operation that way." },

    { kind: "check",
      q: "You run `car_sales[\"Make\"].str.lower()` and then `car_sales.head()` still shows capitalized makes. Why?",
      choices: [
        "`.str.lower()` only works on the index",
        "The operation returned a new Series; nothing was assigned back to the DataFrame",
        "`.head()` displays the pre-modification cache",
        "String columns are immutable in pandas",
      ],
      answer: 1,
      explain: "Most pandas methods are **non-mutating** — they return a modified copy. You must write `car_sales[\"Make\"] = car_sales[\"Make\"].str.lower()` (or use `inplace=True` where offered) for the change to stick." },
  ],
},

/* ===================================================================== */
{
  id: "p6",
  part: "pandas",
  title: "Grouping, Crosstabs, and Plotting",
  minutes: 10,
  summary: "Split-apply-combine, contingency tables, and quick plots straight off a DataFrame.",
  blocks: [
    { kind: "code", title: "groupby — split, apply, combine",
      lang: "python", file: "group.py",
      code: `# Group by Make and average the other columns
car_sales.groupby(["Make"]).mean(numeric_only=True)

# Group and aggregate one column
car_sales.groupby("Make")["Price"].mean()

# Several statistics at once
car_sales.groupby("Make")["Price"].agg(["mean", "std", "count"])`,
      after: "`car_sales.groupby([\"Make\"])` on its own prints a `DataFrameGroupBy` object — it is **lazy**, and nothing is computed until you call an aggregation on it." },

    { kind: "code", title: "Crosstabs",
      lang: "python", file: "crosstab.py",
      code: `# Compare car Make with number of Doors
pd.crosstab(car_sales["Make"], car_sales["Doors"])`,
      after: "A contingency table of counts — the pandas equivalent of R's `table(x, y)`. Feed it straight into `scipy.stats.chi2_contingency` for a test of independence." },

    { kind: "code", title: "Plotting straight off the DataFrame",
      lang: "python", file: "plot.py",
      code: `import matplotlib.pyplot as plt

car_sales["Odometer (KM)"].plot()          # line plot of a Series
car_sales["Odometer (KM)"].hist()          # histogram
car_sales.plot(x="Make", y="Odometer (KM)")   # plot one column against another`,
      after: "pandas wraps matplotlib, so `.plot()` is the fastest path to a figure during exploration. In Jupyter, ending the line with `;` suppresses the printed matplotlib object." },
  ],
},

/* ===================================================================== */
{
  id: "p7",
  part: "pandas",
  title: "pandas for the Finance Course",
  minutes: 12,
  summary: "The specific pandas idioms this course actually uses: datetime indexes, diff, rolling windows, resampling, shift.",
  blocks: [
    { kind: "key", title: "The one line you'll write most often",
      body: "Almost every figure in Lectures 1-7 starts here:\n\n```python\nEQdat = yf.Ticker(\"AMGN\").history(start=\"2015-01-01\", end=\"2026-08-01\")\nldrEQ = np.log(EQdat['Close']).diff().dropna()\n```\n\nEvery piece is pandas:\n• `history()` returns a **DataFrame indexed by date** (a `DatetimeIndex`).\n• `EQdat['Close']` selects one column → a **Series**.\n• `.diff()` subtracts each element from the one before → $\\log P_t-\\log P_{t-1}$.\n• `.dropna()` removes the leading `NaN` that differencing necessarily creates." },

    { kind: "code", title: "diff, pct_change, and shift",
      lang: "python", file: "changes.py",
      code: `prices = EQdat['Close']

log_ret    = np.log(prices).diff().dropna()   # LOG returns  (this course)
simple_ret = prices.pct_change().dropna()     # SIMPLE returns

yesterday  = prices.shift(1)                  # lag the series by one period
manual_ret = np.log(prices / prices.shift(1)).dropna()   # same as log_ret`,
      after: "`.shift(k)` moves data *forward* by $k$ periods, which is how you line up $P_t$ with $P_{t-1}$ — essential when building lagged predictors, as in an AR(1) or ARCH fit.\n\nRemember `pct_change()` gives **simple** returns $R_t$, not log returns $r_t$. They are numerically close for daily data but only $r_t$ adds across periods." },

    { kind: "code", title: "Rolling windows",
      lang: "python", file: "rolling.py",
      code: `windowsize = 50

# Annualized rolling realized volatility
RVrollwind = ldrEQ.rolling(windowsize).std().dropna() * np.sqrt(252)

# Other rolling statistics
ldrEQ.rolling(20).mean()        # 20-day moving average
ldrEQ.rolling(20).var()         # rolling variance`,
      after: "`.rolling(w)` creates overlapping windows of length `w`; the first `w-1` entries are `NaN` because a full window isn't available yet — hence the `.dropna()`. This is exactly the calculation behind the volatility-clustering plot in Part 4." },

    { kind: "code", title: "Resampling to other frequencies",
      lang: "python", file: "resample.py",
      body: "With a `DatetimeIndex`, pandas can change frequency directly — this is how you get from daily to monthly returns for the CLT comparison in Part 2.",
      code: `monthly_close = prices.resample("ME").last()          # month-end closing price
log_monthly   = np.log(monthly_close).diff().dropna() # log monthly returns

# equivalently: monthly log return = sum of that month's daily log returns
log_monthly_alt = ldrEQ.resample("ME").sum()`,
      after: "The two are equal, which is the $k$-period log return identity $r_t(k)=\\sum r_{t-i}$ in code. Run `scipy.stats.jarque_bera` on each and you should find the monthly series is **closer to normal** — the central limit theorem at work." },

    { kind: "trap", title: "pandas objects into statsmodels and arch",
      body: "The statistical libraries generally accept pandas Series directly:\n\n```python\nadfuller(ldrEQ)                 # Series is fine\nplot_acf(ldrEQ**2)              # squaring a Series is elementwise\narch_model(ldrEQ, vol='GARCH', p=1, q=1, rescale=True, mean=\"Zero\")\n```\n\nTwo things to watch:\n\n• **Always `.dropna()` first.** A single `NaN` will propagate or error out, and `.diff()` guarantees one.\n• **`rescale=True` in `arch_model`** exists because log returns are small numbers (~0.01); without it the optimizer struggles and warns." },

    { kind: "check",
      q: "Why does `np.log(prices).diff()` need `.dropna()` afterwards?",
      choices: [
        "Because the price series contains missing trading days",
        "Because `.diff()` has no previous value for the first observation, producing a leading NaN",
        "Because `np.log` returns NaN for any zero prices",
        "Because `.dropna()` is required before any pandas arithmetic",
      ],
      answer: 1,
      explain: "`.diff()` computes $x_t - x_{t-1}$; the first element has no predecessor, so it is `NaN` by construction. That single value would then propagate into ADF tests, ACF plots, and GARCH fits — hence the habitual `.dropna()`." },
  ],
},

];
