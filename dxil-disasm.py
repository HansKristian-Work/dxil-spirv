#!/usr/bin/env python3

# Copyright (c) 2019-2023 Hans-Kristian Arntzen for Valve Corporation
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
import argparse
import tempfile
import re
import multiprocessing

def disasm_shader_regex(input_file, args, regex):
    f, path = tempfile.mkstemp(suffix = 'dxil')
    f2, path2 = tempfile.mkstemp(suffix = 'dxil2')
    os.close(f)
    os.close(f2)
    result = None

    try:
        dxil_extract_cmd = [args.dxil_extract, input_file, '--output']
        p = subprocess.Popen(dxil_extract_cmd + [path, '--verbose'], stdout = subprocess.PIPE)
        subprocess.check_call(dxil_extract_cmd + [path2, '--reflection'], stdout = subprocess.DEVNULL)
        llvm_dis_cmd = [args.llvm_dis, '-o', '/dev/stdout']
        main_pipe = subprocess.Popen(llvm_dis_cmd + [path], stdout = subprocess.PIPE)
        refl_pipe = subprocess.Popen(llvm_dis_cmd + [path2], stdout = subprocess.PIPE)
        lines_main = main_pipe.communicate()[0].decode()
        lines_refl = refl_pipe.communicate()[0].decode()

        if args.isolate:
            allow = re.search(regex, lines_main + lines_refl)
        else:
            allow = True

        if allow:
            result = p.communicate()[0].decode()
            result += '  DXIL:\n'
            for line in lines_main.splitlines():
                if re.search(regex, line):
                    result += '    ' + line + '\n'
            result += '  STAT:\n'
            for line in lines_refl.splitlines():
                if re.search(regex, line):
                    result += '    ' + line + '\n'
    except:
        pass

    os.remove(path)
    os.remove(path2)
    return result

def disasm_shader_plain(input_file, args, regex):
    f, path = tempfile.mkstemp(suffix = 'dxil')
    result = ''
    try:
        dxil_extract_cmd = [args.dxil_extract, '--verbose', input_file, '--output', path]
        if args.reflect:
            dxil_extract_cmd.append('--reflection')
        p = subprocess.Popen(dxil_extract_cmd, stdout = subprocess.PIPE)
        result += p.communicate()[0].decode()
        llvm_dis_cmd = [args.llvm_dis, '-o', '/dev/stdout', path]
        p = subprocess.Popen(llvm_dis_cmd, stdout = subprocess.PIPE)
        result += p.communicate()[0].decode()
    except:
        pass

    os.remove(path)
    return result

def main():
    parser = argparse.ArgumentParser(description = 'Script for disassembling DXIL.')
    parser.add_argument('input',
            help = 'File or folder containing shader files to convert.')
    parser.add_argument('--output',
            help = 'Path where LLVM asm is output.',
            default = '/dev/stdout')
    parser.add_argument('--dxil-extract',
            help = 'Path to dxil-extract',
            default = 'dxil-extract')
    parser.add_argument('--llvm-dis',
            help = 'Path to llvm-dis',
            default = 'llvm-dis')
    parser.add_argument('--reflect', action = 'store_true',
            help = 'Use reflection section')
    parser.add_argument('--isolate', action = 'store_true',
            help = 'Isolate regex output to hits only')
    parser.add_argument('--symbol-regex', type = str,
            help = 'Grep disassemblies for a symbol')

    args = parser.parse_args()
    if not args.input:
        sys.stderr.write('Need input shader.\n')
        sys.exit(1)
    if not args.dxil_extract:
        sys.stderr.write('Need dxil-extract path.\n')
        sys.exit(1)

    if args.symbol_regex:
        regex = re.compile(args.symbol_regex)
    else:
        regex = None

    if os.path.isfile(args.input):
        files = [args.input]
    else:
        files = []
        for file in os.scandir(args.input):
            files.append(os.path.join(args.input, file.name))

    pool = multiprocessing.Pool(multiprocessing.cpu_count())
    results = []
    counter = 0

    with open(args.output, 'w') as f:
        for input_file in files:
            results.append(pool.apply_async(disasm_shader_regex if regex else disasm_shader_plain,
                                            args = (input_file, args, regex)))

        for res in results:
            lines = res.get()
            counter += 1
            print('Progress {} / {}'.format(counter, len(files)))
            if lines is not None:
                f.writelines(lines)
                f.writelines('\n\n')

if __name__ == '__main__':
    main()

