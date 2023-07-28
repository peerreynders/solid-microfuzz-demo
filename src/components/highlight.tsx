import { For, Show, type Component } from 'solid-js';
import type { HighlightRanges } from '@nozbe/microfuzz';

type SliceHighlight =
  | { kind: false; start: number; end: number }
  | { kind: true; start: number; end: number };

function toSlices(ranges: HighlightRanges | undefined, length: number) {
  if (!ranges) return [{ kind: false, start: 0, end: length + 1 }];

  let index = 0;
  const end = length + 1;
  const slices: SliceHighlight[] = [];
  for (const [x, y] of ranges) {
    if (x > index) slices.push({ kind: false, start: index, end: x });

    index = y + 1;
    slices.push({ kind: true, start: x, end: index });
  }

  if (end > index) slices.push({ kind: false, start: index, end });

  return slices;
}

const toSlice = (text: string, { start, end }: SliceHighlight) =>
  text.slice(start, end);

type Props = {
  text: string;
  ranges: HighlightRanges | undefined;
  classItemName?: string;
};

const Highlight: Component<Props> = (props) => {
  return (
    <>
      <For each={toSlices(props.ranges, props.text.length)}>
        {(slice) => (
          <Show when={slice.kind} fallback={toSlice(props.text, slice)}>
            <span class={props.classItemName}>
              {toSlice(props.text, slice)}
            </span>
          </Show>
        )}
      </For>
    </>
  );
};

export { Highlight as default };

