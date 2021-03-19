#!/usr/bin/env python3

#
# Copyright 2020-2021 Hans-Kristian Arntzen for Valve Corporation
#
# This library is free software; you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public
# License as published by the Free Software Foundation; either
# version 2.1 of the License, or (at your option) any later version.
#
# This library is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public
# License along with this library; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
#

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
    parser.add_argument('--dxil', required = True, help = 'Folder containing a bunch of .dxil shaders.')
    parser.add_argument('--output', required = True, help = 'Output directory.')
    parser.add_argument('--raw', help = 'Skip hashing. Files must be in format $hash.dxil', action = 'store_true')
    parser.add_argument('--noglsl', help = 'Add .noglsl. tag.', action = 'store_true')

    args = parser.parse_args()

    for root, dirs, files in os.walk(args.dxil):
        for file in files:
            if os.path.splitext(file)[1] == '.dxil':
                print('Copying DXIL reference file:', file)
                copy_reference_shader(args.output, os.path.join(args.dxil, file), args.raw, args.noglsl)

if __name__ == '__main__':
    main()

