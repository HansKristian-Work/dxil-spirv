# dxil-spirv

This project aims to provide translation of DXIL (SM 6.x) shaders to SPIR-V which can be used in the vkd3d project,
which implements D3D12 on top of Vulkan.

## Building

### Dependencies

Check out submodules first with `git submodule update --init`.
No external dependencies apart from the submodules are required to build.

This project implements a "small" LLVM C++ API subset which acts as a drop-in replacement for the full LLVM.
It is possible to build against the true LLVM C++ API if llvm is checked out in `external/llvm` and `-DDXIL_SPIRV_NATIVE_LLVM=ON` CMake option is used.
See `checkout_llvm.sh` script.

### Build

Standard CMake build.

```
mkdir build
cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make
make install
```

## Linking against dxil-spirv

Only the C API is installed and is expected to be kept ABI/API stable when it releases.

### pkg-config

```
pkg-config dxil-spirv-c-shared --cflags --libs
```

### CMake module

Something like:

```
find_package(dxil_spirv_c_shared)
if (dxil_spirv_c_shared_FOUND)
	message("Found dxil-spirv! Enabling DXIL support.")
	target_link_libraries(vkd3d-shader PRIVATE dxil-spirv-c-shared)
	target_compile_definitions(vkd3d-shader PRIVATE HAVE_DXIL_SPV)
	target_sources(vkd3d-shader PRIVATE vkd3d/libs/vkd3d-shader/dxil.c)
else()
	message("Did not find dxil-spirv :( Disabling DXIL support.")
endif()
```

## Testing

The primary method of testing dxil-spirv and avoiding regressions is through a reference shader suite.

### Build DXC

First, build DXC. To keep output consistent, we must use a fixed version of DXC.
Currently, this only works on Linux, the Windows build of DXC does not seem to support CMake properly.

```
./checkout_dxc.sh
./build_dxc.sh
```

The test suite accepts an arbitrary path to DXC, so if you have a standalone binary somewhere, that can work as well.

### Run test suite

When adding new tests, place the HLSL test in `shaders/` somewhere and run:

```
./test_shaders.py shaders --dxc external/dxc-build/bin/dxc --dxil-spirv cmake-build-debug/dxil-spirv
```

If there is any mismatch, the test script will complain. If there are legitimate changes to be made,
add `--update` to the command. The updated files should now be committed alongside the dxil-spirv change.

## License

dxil-spirv is currently licensed as MIT. See LICENSE.MIT for more details.

```
/* Copyright (c) 2019-2022 Hans-Kristian Arntzen for Valve Corporation
 *
 * SPDX-License-Identifier: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
```

