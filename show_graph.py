#!/usr/bin/env python3

from graphviz import Source
import sys

def main():
    s = Source.from_file(sys.argv[1])
    s.view()

if __name__ == '__main__':
    main()
