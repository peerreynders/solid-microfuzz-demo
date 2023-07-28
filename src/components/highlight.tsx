import { For, Switch, Match, type Component } from 'solid-js';
import type { HighlightRanges } from '@nozbe/microfuzz';

const SLICE_REGULAR = -1;
const SLICE_FULL = 0;
const SLICE_HIGHLIGHT = 1;

type SliceRegular = { kind: typeof SLICE_REGULAR; text: string };
type SliceFull = { kind: typeof SLICE_FULL };
type SliceHighlight = { kind: typeof SLICE_HIGHLIGHT; text: string };
type Slice = SliceRegular | SliceFull | SliceHighlight;

const slicesFull: Slice[] = [{ kind: SLICE_FULL }];

function toSlices(text: string, ranges: HighlightRanges | undefined) {
  if (!ranges || ranges.length < 1) return slicesFull;

  let index = 0;
  const end = text.length + 1;
  const slices: Slice[] = [];
  for (const [x, y] of ranges) {
    if (x > index)
      slices.push({ kind: SLICE_REGULAR, text: text.slice(index, x) });

    index = y + 1;
    slices.push({ kind: SLICE_HIGHLIGHT, text: text.slice(x, index) });
  }
  if (end > index)
    slices.push({ kind: SLICE_REGULAR, text: text.slice(index, end) });

  return slices;
}

type Props = {
  text: string;
  ranges: HighlightRanges | undefined;
  classItemName?: string;
};

const Highlight: Component<Props> = (props) => {
  return (
    <>
      <For each={toSlices(props.text, props.ranges)}>
        {(slice) => (
          <Switch>
            <Match when={slice.kind === SLICE_FULL}>{props.text}</Match>
            <Match when={slice.kind === SLICE_REGULAR}>
              {(slice as SliceRegular).text}
            </Match>
            <Match when={slice.kind === SLICE_HIGHLIGHT}>
              <span class={props.classItemName}>
                {(slice as SliceHighlight).text}
              </span>
            </Match>
          </Switch>
        )}
      </For>
    </>
  );
};

export { Highlight as default };

