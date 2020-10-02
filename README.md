# dxil-spirv

The aim of this project is to provide a translation of DXIL (SM 6.x) sunshades into SPIR-V, which can be used in the vkd3d project,
which implements D3D12 at the top of Vulcan.

## Construction

### Addictions

First, look at the submodules with `git submodule update --init`.
No external dependencies need to be built for submodules.

This project implements a “small” subset of the LLVM C ++ API that acts as an alternate option for the entire LLVM.
Depending on the real LLVM C ++ API, it can be built if llvm is logged out in `external/llvm` and the `-DDXIL_SPIRV_NATIVE_LLVM=ON` CMake option is used.
See the `checkout_llvm.sh` script.

### Build

Standard construction CMake.

```
mkdir build
cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make
make install
```

## Link to dxil-spirv

Only API C is installed and the ABI / API is expected to remain stable when released.

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
	message("Did not find DXIL2SPIRV :( Disabling DXIL support.")
endif()
```

## Testing

The primary method of testing dxil-spirves and avoiding regressions is through a reference set of sunshades.

### Build DXC

Build the DXC first. For the result to be the same, we need to use a fixed version of DXC.
Currently this only works in Linux, the DXC system structure for Windows does not support CMake properly.

```
./checkout_dxc.sh
./build_dxc.sh
```

The test package accepts any path to DXC, so if you have a standalone binary program somewhere, this can work as well.

### Run test suite

When adding new tests, place the HLSL test somewhere in the `umbrellas/` and run:

```
./test_shaders.py umbrellas --dxc external/dxc-build/bin/dxc --dxil-spirv cmake-build-debug/dxil-spirv
```

If a discrepancy occurs, the test script will appeal. If legal changes need to be made,
add `--update` to the command. Updated files should now be edited along with the dxil-spirv change.

## License

dxil-spirv is currently licensed as LGPLv2, to match vkd3d.

```
/*
 * Copyright 2019-2020 Hans-Kristian Arntzen for Valve Corporation
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
 */
```
