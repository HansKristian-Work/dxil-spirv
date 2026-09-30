#!/usr/bin/env python3
# Greedy reducer for structurize-test CFG files.
#
# Usage: reduce-cfg.py in.st out.st test-command [args...]
#
# test-command is run with a candidate .st file as its last argument and
# must exit 0 if the candidate still shows the bug. For example, a CFG that
# fails without a fix and validates with it:
#
#   #!/bin/sh
#   nofix/structurize-test "$1" 2>&1 | grep -q 'already a merge block' &&
#   fixed/structurize-test "$1" 2>&1 | grep -q 'Validated successfully'
#
# out.st is rewritten after every successful step.

# Authored by Timothy Redaelli (PR 311).

import os, subprocess, sys, tempfile
from concurrent.futures import ThreadPoolExecutor

src, dst, cmd = sys.argv[1], sys.argv[2], sys.argv[3:]


def interesting(lines):
    with tempfile.NamedTemporaryFile('w', suffix='.st') as f:
        f.write('\n'.join(lines) + '\n')
        f.flush()
        try:
            return subprocess.run(cmd + [f.name], capture_output=True, timeout=20).returncode != 0
        except subprocess.TimeoutExpired:
            return False


# Yields (line index, simplified CFG) pairs.
def candidates(lines, first):
    for i in range(first, len(lines)):
        t = lines[i].split()
        before, after = lines[:i], lines[i + 1:]
        if t[0] == 'sideeffect':
            yield i, before + after
        elif t[0] == 'c':
            for target in t[2:]:
                yield i, before + ['b %s %s' % (t[1], target)] + after
        elif t[0] == 'switch':
            if len(t) > 4:
                for k in range(2, len(t)):
                    yield i, before + [' '.join(t[:k] + t[k + 1:])] + after
            for target in t[2:]:
                yield i, before + ['b %s %s' % (t[1], target)] + after
        elif t[0] == 'b' and t[1] != 'entry' and t[1] != t[2]:
            # Remove block a by sending its predecessors straight to x.
            a, x = t[1], t[2]
            out = []
            for l in before + after:
                w = l.split()
                if w[:2] != ['sideeffect', a]:
                    out.append(' '.join(w[:2] + [x if b == a else b for b in w[2:]]))
            yield i, out


lines = [l.strip() for l in open(src) if l.strip()]
assert interesting(lines), 'input does not reproduce'
jobs = os.cpu_count()
pool = ThreadPoolExecutor(jobs)
pos, changed = 0, False
while True:
    cands = list(candidates(lines, pos))
    hit = None
    for start in range(0, len(cands), jobs):
        batch = cands[start:start + jobs]
        ok = list(pool.map(lambda c: interesting(c[1]), batch))
        if any(ok):
            hit = batch[ok.index(True)]
            break
    if hit:
        pos, lines, changed = hit[0], hit[1], True
        open(dst, 'w').write('\n'.join(lines) + '\n')
        print(len(lines), 'lines', flush=True)
    elif changed:
        pos, changed = 0, False
    else:
        break
print('done,', len(lines), 'lines')
