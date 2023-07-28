import { createMemo, createSignal, For, Show, type Component } from 'solid-js';
import { default as createFuzzySearch } from '@nozbe/microfuzz';

import { default as testdata } from './testdata';
import styles from './App.module.css';
import highlightStyles from './highlight.module.css';

import { default as Highlight } from './components/highlight';

const testdataKeys = Array.from(testdata.keys());
const strategies = ['off', 'smart', 'aggressive'] as const;

const toFuzzyResult = <T,>(item: T) => ({
  item,
  score: Number.POSITIVE_INFINITY,
  matches: [],
});

type SearchProps = {
  list: string[];
  strategy: (typeof strategies)[number];
  query: string;
};

const SearchResult: Component<SearchProps> = (props) => {
  const fuzzySearch = createMemo(() =>
    createFuzzySearch(props.list, { strategy: props.strategy })
  );

  const filtered = createMemo(() => {
    const before = performance.now();
    const list = props.query
      ? fuzzySearch()(props.query)
      : props.list.map(toFuzzyResult);
    const time = performance.now() - before;
    return { list, time };
  });

  return (
    <>
      <Show when={props.list.length >= 10_000}>
        <p class={styles['warning']}>
          Note: microfuzz works best with datasets below 10,000 items (this one
          has {props.list.length})
        </p>
      </Show>
      <ul class={styles['results']}>
        <For each={filtered().list.slice(0, 40)}>
          {(result) => (
            <li>
              <Highlight
                text={result.item}
                ranges={result.matches[0] ? result.matches[0] : undefined}
                classItemName={highlightStyles['match-highlight']}
              />
            </li>
          )}
        </For>
      </ul>
      <p>
        Matched {filtered().list.length} items (out of {props.list.length}) in{' '}
        {filtered().time.toFixed(1)} ms.)
      </p>
    </>
  );
};

const selectDataset = (name: string) => {
  return {
    list: testdata.get(name) ?? [],
    name,
  };
};

const App: Component = () => {
  const [strategy, setStrategy] = createSignal<(typeof strategies)[number]>(
    strategies[1]
  );
  const [query, setQuery] = createSignal('');
  const [dataset, setDataset] = createSignal(selectDataset('companies'));

  return (
    <div class={styles['app']}>
      <h1>microfuzz demo</h1>
      <p>
        Find out about microfuzz{' '}
        <a href="https://github.com/nozbe/microfuzz">on GitHub</a>.
      </p>
      <div class={styles['tabs-container']}>
        <span class={styles['tabs-title']}>Dataset:</span>
        <div class={styles['tabs']}>
          <ul>
            <For each={testdataKeys}>
              {(key) => (
                <li>
                  <button
                    onClick={() => setDataset(selectDataset(key))}
                    data-selected={dataset().name === key}
                  >
                    {key}
                  </button>
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
      <div class={styles['tabs-container']}>
        <span class={styles['tabs-title']}>Fuzzy search strategy:</span>
        <div class={styles['tabs']}>
          <ul>
            <For each={strategies}>
              {(key) => (
                <li>
                  <button
                    onClick={() => setStrategy(key)}
                    data-selected={strategy() === key}
                  >
                    {key}
                  </button>
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
      <div class={styles['search']}>
        <input
          type="search"
          value={query()}
          onInput={(e) => setQuery(e.target.value)}
          placeholder={`Start typing to search ${dataset().name}…`}
          autofocus
        />
      </div>
      <SearchResult
        list={dataset().list}
        strategy={strategy()}
        query={query()}
      />
    </div>
  );
};

export default App;

