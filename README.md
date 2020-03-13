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
	message("Did not find DXIL2SPIRV :( Disabling DXIL support.")
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
