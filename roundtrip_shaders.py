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

# Helper utility for vkd3d-proton where we roundtrip
# VKD3D_SHADER_DUMP_PATH -> VKD3D_SHADER_OVERRIDE folders.

import sys
import os
import os.path
import subprocess
import multiprocessing
import argparse

def convert_spirv(in_path, out_path, args, stage):
    out_file = out_path + '.' + stage
    if args.preserve and os.path.exists(out_file):
        return

    spirv_cross_cmd = [args.spirv_cross, '--version', '460', '--vulkan-semantics', '--output', out_file, in_path, '--stage', stage]
    try:
        subprocess.check_call(spirv_cross_cmd, stderr = subprocess.DEVNULL)
    except subprocess.CalledProcessError as e:
        if e.returncode > 0:
            # Ignore this. We kinda expect it.
            return
        raise

def convert_shaders(args):
    files = os.listdir(args.input)
    files = [ f for f in files if os.path.splitext(f)[1] == '.spv' ]

    pool = multiprocessing.Pool(multiprocessing.cpu_count())
    results = []

    for f in files:
        in_path = os.path.join(args.input, f)
        out_path = os.path.join(args.output, os.path.splitext(f)[0])
        # Try to emit all stages. Kinda hacky.
        # Should maybe add --deduce-extension or something to SPIRV-Cross CLI, but w/e.
        results.append(pool.apply_async(convert_spirv, args = (in_path, out_path, args, 'vert')))
        results.append(pool.apply_async(convert_spirv, args = (in_path, out_path, args, 'frag')))
        results.append(pool.apply_async(convert_spirv, args = (in_path, out_path, args, 'tesc')))
        results.append(pool.apply_async(convert_spirv, args = (in_path, out_path, args, 'tese')))
        results.append(pool.apply_async(convert_spirv, args = (in_path, out_path, args, 'geom')))
        results.append(pool.apply_async(convert_spirv, args = (in_path, out_path, args, 'comp')))
        results.append(pool.apply_async(convert_spirv, args = (in_path, out_path, args, 'rgen')))
        results.append(pool.apply_async(convert_spirv, args = (in_path, out_path, args, 'rint')))
        results.append(pool.apply_async(convert_spirv, args = (in_path, out_path, args, 'rahit')))
        results.append(pool.apply_async(convert_spirv, args = (in_path, out_path, args, 'rchit')))
        results.append(pool.apply_async(convert_spirv, args = (in_path, out_path, args, 'rmiss')))
        results.append(pool.apply_async(convert_spirv, args = (in_path, out_path, args, 'rcall')))

    for res in results:
        res.get()
    pool.close()
    pool.join()

def main():
    parser = argparse.ArgumentParser(description = 'Script for roundtripping shaders through SPIRV-Cross.')
    parser.add_argument('--input',
            help = 'Folder containing shader files to convert.')
    parser.add_argument('--spirv-cross',
            default = 'spirv-cross',
            help = 'Explicit path to SPIRV-Cross')
    parser.add_argument('--preserve',
            action = 'store_true',
            help = 'Do not overwrite files which already exist')
    parser.add_argument('--output',
            help = 'Path where shaders are output')

    args = parser.parse_args()
    if not args.input:
        sys.stderr.write('Need input shader folder.\n')
        sys.exit(1)
    if not args.output:
        sys.stderr.write('Need output shader folder.\n')
        sys.exit(1)

    convert_shaders(args)
    print('Complete!')

if __name__ == '__main__':
    main()
