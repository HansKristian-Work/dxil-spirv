cmake_minimum_required(VERSION 3.5)
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_C_STANDARD 99)
project(DXIL2SPIRV LANGUAGES CXX C)

find_package(LLVM REQUIRED CONFIG)
message(STATUS "Found LLVM ${LLVM_PACKAGE_VERSION}")
message(STATUS "Using LLVMConfig.cmake in: ${LLVM_DIR}")

if (CMAKE_COMPILER_IS_GNUCXX OR (${CMAKE_CXX_COMPILER_ID} MATCHES "Clang"))
    set(DXIL2SPIRV_CXX_FLAGS -Wall -Wextra -Wno-missing-field-initializers -Wno-empty-body -ffast-math -Wno-unused-parameter)
elseif (MSVC)
    set(DXIL2SPIRV_CXX_FLAGS /D_CRT_SECURE_NO_WARNINGS /wd4267 /wd4244 /wd4309 /wd4005 /MP /DNOMINMAX)
endif()

add_library(dxil-parser STATIC
        memory_stream.hpp memory_stream.cpp
        dxil.hpp
        dxil_parser.hpp dxil_parser.cpp)
target_include_directories(dxil-parser PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

llvm_map_components_to_libnames(llvm_libs Core Support IRReader)
target_link_libraries(dxil-parser PRIVATE ${llvm_libs})

add_executable(dxil-parser-test dxil_parser_test.cpp)
target_link_libraries(dxil-parser-test PRIVATE dxil-parser)
target_compile_options(dxil-parser-test PRIVATE ${DXIL2SPIRV_CXX_FLAGS})


