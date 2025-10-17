#!/usr/bin/env python3

#
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
import os.path
import subprocess
import tempfile
import re
import itertools
import hashlib
import shutil
import argparse
import codecs
import json
import multiprocessing
import errno
from functools import partial

class Paths():
    def __init__(self, dxc, dxil_spirv):
        self.dxc = dxc 
        self.dxil_spirv = dxil_spirv 

def remove_file(path):
    os.remove(path)

def create_temporary(suff = ''):
    f, path = tempfile.mkstemp(suffix = suff)
    os.close(f)
    return path

def get_sm(shader, version_minor):
    minor_version = '_{}'.format(version_minor)
    lib_version = 'lib_6_{}'.format(5 if version_minor <= 5 else 6)
    mesh_version = '_{}'.format(5 if version_minor <= 5 else version_minor)
    _, ext = os.path.splitext(shader)
    if ext == '.vert':
        return 'vs_6' + minor_version
    elif ext == '.frag':
        return 'ps_6' + minor_version
    elif ext == '.comp':
        return 'lib_6_8' if '.node.' in shader else ('cs_6' + minor_version)
    elif ext == '.tesc':
        return 'hs_6' + minor_version
    elif ext == '.tese':
        return 'ds_6' + minor_version
    elif ext == '.geom':
        return 'gs_6' + minor_version
    elif ext == '.mesh':
        return 'ms_6' + mesh_version
    elif ext == '.task':
        return 'as_6' + mesh_version
    elif ext == '.rmiss':
        return lib_version
    elif ext == '.rint':
        return lib_version
    elif ext == '.rgen':
        return lib_version
    elif ext == '.rhit':
        return lib_version
    elif ext == '.rcall':
        return lib_version
    elif ext == '.rany':
        return lib_version
    elif ext == '.rclosest':
        return lib_version
    else:
        return ''

def cross_compile_dxil(shader, args, paths, is_asm):
    glsl_path = create_temporary(os.path.basename(shader))
    version_minor = 5
    if '.sm60.' in shader:
        version_minor = 0
    elif '.sm66.' in shader:
        version_minor = 6
    elif '.sm67.' in shader:
        version_minor = 7

    if not is_asm:
        dxil_path = create_temporary()
        dxil_cmd = [paths.dxc, '-Qstrip_reflect', '-Qstrip_debug', '-Vd', '-T' + get_sm(shader, version_minor), '-Fo', dxil_path, shader]
        if version_minor >= 2:
            dxil_cmd.append('-enable-16bit-types')
        if '.denorm-ftz.' in shader:
            dxil_cmd += ['-denorm', 'ftz']
        if '.denorm-preserve.' in shader:
            dxil_cmd += ['-denorm', 'preserve']
        if '.no-legacy-cbuf-layout.' in shader:
            dxil_cmd += ['-no-legacy-cbuf-layout']
        subprocess.check_call(dxil_cmd)
    else:
        dxil_path = shader

    hlsl_cmd = [paths.dxil_spirv, '--output', glsl_path, dxil_path, '--vertex-input', 'ATTR', '0']
    skip_glsl = '.noglsl.' in shader

    if not args.bench:
        hlsl_cmd += ['--asm']
        if not skip_glsl:
            hlsl_cmd += ['--glsl']

    if '.bc.' in shader:
        hlsl_cmd += ['--raw-llvm']

    hlsl_cmd += ['--allow-arithmetic-relaxed-precision', '--subgroup-size', '32', '64']

    if '.root-constant.' in shader:
        hlsl_cmd.append('--root-constant')
        hlsl_cmd.append('0')
        hlsl_cmd.append('0')
        hlsl_cmd.append('4')
        hlsl_cmd.append('12')
        hlsl_cmd.append('--root-constant')
        hlsl_cmd.append('1')
        hlsl_cmd.append('0')
        hlsl_cmd.append('0')
        hlsl_cmd.append('16')
    if '.stream-out.' in shader:
        hlsl_cmd.append('--stream-output')
        hlsl_cmd.append('SV_Position')
        hlsl_cmd.append('0')
        hlsl_cmd.append('16')
        hlsl_cmd.append('32')
        hlsl_cmd.append('1')

        hlsl_cmd.append('--stream-output')
        hlsl_cmd.append('StreamOut')
        hlsl_cmd.append('0')
        hlsl_cmd.append('0')
        hlsl_cmd.append('32')
        hlsl_cmd.append('0')

        hlsl_cmd.append('--stream-output')
        hlsl_cmd.append('StreamOut')
        hlsl_cmd.append('1')
        hlsl_cmd.append('0')
        hlsl_cmd.append('16')
        hlsl_cmd.append('1')

    if '.rt-swizzle.' in shader:
        hlsl_cmd.append('--output-rt-swizzle')
        hlsl_cmd.append('0')
        hlsl_cmd.append('wxyz')
        hlsl_cmd.append('--output-rt-swizzle')
        hlsl_cmd.append('1')
        hlsl_cmd.append('yxwz')

    if '.bindless.' in shader:
        hlsl_cmd.append('--bindless')
    if '.nobda.' in shader:
        hlsl_cmd.append('--no-bda')
    if '.local-root-signature.' in shader:
        hlsl_cmd.append('--local-root-signature')
    if '.uav-counter-texel-buffer.' in shader:
        hlsl_cmd.append('--uav-counter-force-texel-buffer')
    if '.uav-counter-ssbo.' in shader:
        hlsl_cmd.append('--uav-counter-force-ssbo')

    if '.inline-ubo.' in shader:
        hlsl_cmd.append('--root-constant-inline-ubo')
        hlsl_cmd.append('6')
        hlsl_cmd.append('1')

    if '.cbv-as-ssbo.' in shader:
        hlsl_cmd.append('--bindless-cbv-as-ssbo')

    if '.invalid.' not in shader:
        hlsl_cmd.append('--validate')

    if ('.demote-to-helper.' in shader) or is_asm:
        hlsl_cmd.append('--enable-shader-demote')
    if '.i8dot.' in shader:
        hlsl_cmd.append('--enable-shader-i8-dot')
    if '.dual-source-blending.' in shader:
        hlsl_cmd.append('--enable-dual-source-blending')
    if ('.ssbo.' in shader) or is_asm:
        hlsl_cmd.append('--ssbo-uav')
        hlsl_cmd.append('--ssbo-srv')
    if '.ssbo-rtas.' in shader:
        hlsl_cmd.append('--ssbo-rtas')
    if '.raw-va-stride-offset.' in shader:
        hlsl_cmd.append('--physical-address-descriptor-indexing')
        hlsl_cmd.append('4')
        hlsl_cmd.append('3')
    if '.ssbo-align.' in shader:
        hlsl_cmd.append('--ssbo-alignment')
        hlsl_cmd.append('64')
    if '.typed-uav-without-format.' in shader:
        hlsl_cmd.append('--typed-uav-read-without-format')
    if '.typed-buffer-offset.' in shader:
        hlsl_cmd.append('--bindless')
        hlsl_cmd.append('--bindless-typed-buffer-offsets')

    if '.root-descriptor.' in shader:
        hlsl_cmd += ['--root-descriptor', 'cbv', '0', '0']
        hlsl_cmd += ['--root-descriptor', 'srv', '0', '0']
        hlsl_cmd += ['--root-descriptor', 'uav', '0', '0']
        hlsl_cmd += ['--root-descriptor', 'uav', '0', '1']

    if '.offset-layout.' in shader:
        hlsl_cmd += ['--bindless-offset-buffer-layout', '0', '1', '2']
    if not args.bench:
        if '.lib.' in shader:
            hlsl_cmd += ['--debug-all-entry-points']
    if '.16bit-io.' in shader:
        hlsl_cmd += ['--storage-input-output-16bit']
    if '.descriptor-qa.' in shader:
        hlsl_cmd += ['--descriptor-qa', '10', '10', 'deadbeef']
    if ('.native-fp16.' in shader) or is_asm:
        hlsl_cmd += ['--min-precision-native-16bit']
    if '.invariant.' in shader:
        hlsl_cmd += ['--invariant-position']
    if '.partitioned.' in shader:
        hlsl_cmd += ['--subgroup-partitioned-nv']
    if '.noderivs.' in shader:
        hlsl_cmd += ['--no-compute-shader-derivatives']
    if '.quad-maximal-reconvergence.' in shader:
        hlsl_cmd += ['--quad-control-maximal-reconvergence']
    if '.raw-access-chains.' in shader:
        hlsl_cmd += ['--raw-access-chains-nv']
    if '.extended-robustness.' in shader:
        hlsl_cmd += ['--extended-robustness']
    if 'bda-instrumentation.' in shader:
        hlsl_cmd += ['--instruction-instrumentation', '4', '0', '2', 'abcd']
    if '.auto-group-shared-barrier.' in shader:
        hlsl_cmd += ['--shader-quirk', '8']
    if '.vkmm.' in shader:
        hlsl_cmd += ['--vkmm']
    if '.full-wmma.' in shader:
        hlsl_cmd += ['--full-wmma', '1', '1']
    if '.nv-coopmat2.' in shader:
        hlsl_cmd += ['--full-wmma', '0', '1']
    if '.nvapi.' in shader:
        hlsl_cmd += ['--nvapi', '127', '0']
    if '.heap-robustness-cbv.' in shader:
        hlsl_cmd += ['--meta-ubo-descriptor', '0', '10', '20']
    if '.heap-raw-va-cbv.' in shader:
        hlsl_cmd += ['--meta-ubo-descriptor', '1', '10', '21']
    if '.heap-robustness.' in shader:
        hlsl_cmd += ['--descriptor-heap-robustness']

    subprocess.check_call(hlsl_cmd)
    if is_asm:
        return glsl_path
    else:
        return (dxil_path, glsl_path)

def make_unix_newline(buf):
    decoded = codecs.decode(buf, 'utf-8')
    decoded = decoded.replace('\r', '')
    return codecs.encode(decoded, 'utf-8')

def md5_for_file(path):
    md5 = hashlib.md5()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: make_unix_newline(f.read(8192)), b''):
            md5.update(chunk)
    return md5.digest()

def make_reference_dir(path):
    base = os.path.dirname(path)
    if not os.path.exists(base):
        os.makedirs(base)

def reference_path(directory, relpath, opt):
    split_paths = os.path.split(directory)
    reference_dir = os.path.join(split_paths[0], 'reference/' + ('opt/' if opt else ''))
    reference_dir = os.path.join(reference_dir, split_paths[1])
    return os.path.join(reference_dir, relpath)

def regression_check(shader, glsl, args):
    reference = reference_path(shader[0], shader[1], args.opt)
    joined_path = os.path.join(shader[0], shader[1])
    print('Reference shader path:', reference)

    if os.path.exists(reference):
        if md5_for_file(glsl) != md5_for_file(reference):
            if args.update:
                print('Generated source code has changed for {}!'.format(reference))
                # If we expect changes, update the reference file.
                if os.path.exists(reference):
                    remove_file(reference)
                make_reference_dir(reference)
                shutil.move(glsl, reference)
            else:
                print('Generated source code in {} does not match reference {}!'.format(glsl, reference))
                with open(glsl, 'r') as f:
                    print('')
                    print('Generated:')
                    print('======================')
                    print(f.read())
                    print('======================')
                    print('')

                # Otherwise, fail the test. Keep the shader file around so we can inspect.
                if not args.keep:
                    remove_file(glsl)
                raise RuntimeError('Does not match reference')
        else:
            remove_file(glsl)
    else:
        print('Found new shader {}. Placing generated source code in {}'.format(joined_path, reference))
        make_reference_dir(reference)
        shutil.move(glsl, reference)

def test_shader(shader, args, paths):
    joined_path = os.path.join(shader[0], shader[1])

    print('Testing shader:', joined_path)

    if joined_path.endswith('.dxil') or joined_path.endswith('.dxbc'):
        glsl = cross_compile_dxil(joined_path, args, paths, True)
        if not args.bench:
            regression_check(shader, glsl, args)
        else:
            remove_file(glsl)
    elif not (joined_path.endswith('.inc') or joined_path.endswith('.h')):
        dxil, glsl = cross_compile_dxil(joined_path, args, paths, False)
        if not args.bench:
            regression_check(shader, glsl, args)
        else:
            remove_file(glsl)
        remove_file(dxil)

def test_shader_file(relpath, args):
    paths = Paths(args.dxc, args.dxil_spirv)
    try:
        test_shader((args.folder, relpath), args, paths)
        return None
    except Exception as e:
        return e

def test_shaders(args):
    all_files = []
    walk_path = os.path.join(args.folder, args.subfolder) if args.subfolder else args.folder
    for root, dirs, files in os.walk(walk_path):
        files = [ f for f in files if not f.startswith(".") ]   #ignore system files (esp OSX)
        for i in files:
            path = os.path.join(root, i)
            relpath = os.path.relpath(path, args.folder)
            all_files.append(relpath)

    # The child processes in parallel execution mode don't have the proper state for the global args variable, so
    # at this point we need to switch to explicit arguments
    if args.parallel:
        pool = multiprocessing.Pool(multiprocessing.cpu_count())

        results = []
        for f in all_files:
            results.append(pool.apply_async(test_shader_file,
                args = (f, args)))

        for res in results:
            error = res.get()
            if error is not None:
                pool.close()
                pool.join()
                print('Error:', error)
                sys.exit(1)
    else:
        for i in all_files:
            e = test_shader_file(i, args)
            if e is not None:
                print('Error:', e)
                sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description = 'Script for regression testing.')
    parser.add_argument('folder',
            help = 'Folder containing shader files to test.')
    parser.add_argument('--update',
            action = 'store_true',
            help = 'Updates reference files if there is a mismatch. Use when legitimate changes in output is found.')
    parser.add_argument('--keep',
            action = 'store_true',
            help = 'Leave failed GLSL shaders on disk if they fail regression. Useful for debugging.')
    parser.add_argument('--opt',
            action = 'store_true',
            help = 'Run DXC optimization passes as well.')
    parser.add_argument('--parallel',
            action = 'store_true',
            help = 'Execute tests in parallel.  Useful for doing regression quickly, but bad for debugging and stat output.')
    parser.add_argument('--dxc',
            default = './external/dxc-build/bin/dxc',
            help = 'Explicit path to DXC')
    parser.add_argument('--dxil-spirv',
            default = './dxil-spirv',
            help = 'Explicit path to dxil-spirv')
    parser.add_argument('--subfolder',
            help = 'Only test specific subfolder')
    parser.add_argument('--bench',
                        action = 'store_true',
                        help = 'Disable any non dxil-spirv work, for benchmarking')

    args = parser.parse_args()
    if not args.folder:
        sys.stderr.write('Need shader folder.\n')
        sys.exit(1)

    test_shaders(args)
    print('Tests completed!')

if __name__ == '__main__':
    main()
