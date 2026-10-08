<script module lang="ts">
  export type IconName = 'doc' | 'folder' | 'chip' | 'disk' | 'star' | 'term' | 'save' | 'power';

  // Pixel-art icons: '#' is a lit pixel. Drawn as 1×1 rects so they stay crisp at any size.
  const bitmaps: Record<IconName, string[]> = {
    doc: [
      '.#######....',
      '.#.....##...',
      '.#.....#.#..',
      '.#.....####.',
      '.#.######.#.',
      '.#........#.',
      '.#.######.#.',
      '.#........#.',
      '.#.#####..#.',
      '.#........#.',
      '.##########.',
    ],
    folder: [
      '............',
      '.####.......',
      '#....#......',
      '#.....######',
      '#..........#',
      '############',
      '#..........#',
      '#..........#',
      '#..........#',
      '#..........#',
      '############',
    ],
    chip: [
      '..#.#.#.#...',
      '.#########..',
      '##.......##.',
      '.#.#####.#..',
      '##.#...#.##.',
      '.#.#...#.#..',
      '##.#####.##.',
      '.#.......#..',
      '.#########..',
      '..#.#.#.#...',
    ],
    disk: [
      '....####....',
      '..##....##..',
      '.#........#.',
      '.#...##...#.',
      '#...#..#...#',
      '#...#..#...#',
      '.#...##...#.',
      '.#........#.',
      '..##....##..',
      '....####....',
    ],
    star: [
      '.....##.....',
      '.....##.....',
      '....####....',
      '############',
      '.##########.',
      '..########..',
      '...######...',
      '..###..###..',
      '.##......##.',
      '.#........#.',
    ],
    term: [
      '############',
      '#..........#',
      '#.#........#',
      '#..#.......#',
      '#...#......#',
      '#..#.......#',
      '#.#..####..#',
      '#..........#',
      '############',
      '....####....',
      '..########..',
    ],
    save: [
      '##########..',
      '#.#....#.##.',
      '#.#....#..##',
      '#.######...#',
      '#..........#',
      '#.########.#',
      '#.#......#.#',
      '#.#......#.#',
      '#.#......#.#',
      '############',
    ],
    power: [
      '.....##.....',
      '..#..##..#..',
      '.##..##..##.',
      '##...##...##',
      '#....##....#',
      '#..........#',
      '#..........#',
      '##........##',
      '.##......##.',
      '..########..',
    ],
  };

  function toCells(rows: string[]): Array<[number, number]> {
    const cells: Array<[number, number]> = [];
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch === '#') cells.push([x, y]);
      });
    });
    return cells;
  }
</script>

<script lang="ts">
  interface Props {
    name: IconName;
    size?: number;
  }

  let { name, size = 40 }: Props = $props();

  const rows = $derived(bitmaps[name]);
  const cells = $derived(toCells(rows));
  const width = $derived(Math.max(...rows.map((r) => r.length)));
</script>

<svg
  viewBox="-1 -1 {width + 2} {rows.length + 2}"
  width={size}
  height={size}
  shape-rendering="crispEdges"
  fill="currentColor"
  aria-hidden="true"
>
  {#each cells as [x, y] (`${x}-${y}`)}
    <rect {x} {y} width="1" height="1" />
  {/each}
</svg>

<style>
  svg {
    display: block;
    filter: drop-shadow(0 0 3px rgba(57, 255, 106, 0.55));
  }
</style>
