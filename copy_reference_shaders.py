#!/usr/bin/env python3

# Copyright (c) 2019-2022 Hans-Kristian Arntzen for Valve Corporation
#
# SPDX-License-Identifier: MIT
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
# IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
# CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
# TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
# SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import sys
import os
import argparse
import shutil
import hashlib

def hashstr(path):
    with open(path, 'rb') as f:
        bytes = f.read()
        if len(bytes) < 4:
            print('Skipping file', path, 'due to size < 4.')
            return None

        if bytes[0:4] != b'DXBC':
            print('Skipping broken file', path)
            return None

        result = hashlib.sha1(bytes).hexdigest()
    return result

def add_tags(path, noglsl):
    if not noglsl:
        return path
    else:
        return path[:-4] + 'noglsl.dxil'

def copy_reference_shader(output_dir, input_path, raw, noglsl):
    modified_input_path = add_tags(input_path, noglsl)
    if raw:
        shutil.copy(input_path, os.path.join(output_dir, os.path.basename(modified_input_path)))
    else:
        name = hashstr(input_path)
        if name is not None:
            shutil.copy(input_path, os.path.join(output_dir, name + ('.noglsl' if noglsl else '') + '.dxil'))

def main():
    parser = argparse.ArgumentParser(description = 'Script for copying VKD3D shader dumps to regression suite.')
    parser.add_argument('--dxil', help = 'Folder containing a bunch of .dxil shaders.')
    parser.add_argument('--dxbc', help = 'Folder containing a bunch of .dxbc shaders.')
    parser.add_argument('--output', required = True, help = 'Output directory.')
    parser.add_argument('--raw', help = 'Skip hashing. Files must be in format $hash.dxil', action = 'store_true')
    parser.add_argument('--noglsl', help = 'Add .noglsl. tag.', action = 'store_true')

    args = parser.parse_args()

    if args.dxil is not None:
        for root, dirs, files in os.walk(args.dxil):
            for file in files:
                ext = os.path.splitext(file)[1]
                if ext == '.dxil':
                    print('Copying DXIL reference file:', file)
                    copy_reference_shader(args.output, os.path.join(args.dxil, file), args.raw, args.noglsl)

    if args.dxbc is not None:
        for root, dirs, files in os.walk(args.dxbc):
            for file in files:
                ext = os.path.splitext(file)[1]
                if ext == '.dxbc':
                    print('Copying DXBC reference file:', file)
                    copy_reference_shader(args.output, os.path.join(args.dxbc, file), args.raw, args.noglsl)

if __name__ == '__main__':
    main()

