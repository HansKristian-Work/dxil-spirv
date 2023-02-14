add_subdirectory(spirv-headers EXCLUDE_FROM_ALL)
set(SPIRV-Headers_SOURCE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/spirv-headers" CACHE STRING "SPIRV-Headers path" FORCE)

add_library(dxil-spirv-headers INTERFACE)
target_include_directories(dxil-spirv-headers INTERFACE
        ${CMAKE_CURRENT_SOURCE_DIR}/spirv-headers/include/spirv/unified1)

if (DXIL_SPIRV_CLI)
    set(SPIRV_WERROR OFF CACHE STRING "" FORCE)
    # SPIRV-Tools refuses to configure if this is not set.
    set(CMAKE_CXX_STANDARD 17)
    add_subdirectory(SPIRV-Tools EXCLUDE_FROM_ALL)
    add_subdirectory(SPIRV-Cross EXCLUDE_FROM_ALL)
endif()

add_library(glslang-spirv-builder STATIC
        glslang-spirv/spvIR.h
        glslang-spirv/Logger.cpp
        glslang-spirv/Logger.h
        glslang-spirv/InReadableOrder.cpp
        glslang-spirv/SpvBuilder.h
        glslang-spirv/SpvBuilder.cpp)
set_target_properties(glslang-spirv-builder PROPERTIES POSITION_INDEPENDENT_CODE ON)
target_compile_definitions(glslang-spirv-builder PUBLIC AMD_EXTENSIONS)
if (CMAKE_COMPILER_IS_GNUCXX OR (${CMAKE_CXX_COMPILER_ID} MATCHES "Clang"))
    target_compile_options(glslang-spirv-builder PRIVATE -fvisibility=hidden)
endif()
target_link_libraries(glslang-spirv-builder PRIVATE dxil-utils)

target_include_directories(glslang-spirv-builder PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/glslang-spirv)
target_link_libraries(glslang-spirv-builder PUBLIC dxil-spirv-headers)

add_library(bc-decoder STATIC
        bc-decoder/llvm_bitreader.h bc-decoder/llvm_decoder.cpp
        bc-decoder/llvm_decoder.h)
target_include_directories(bc-decoder PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/bc-decoder)
set_target_properties(bc-decoder PROPERTIES POSITION_INDEPENDENT_CODE ON)
if (CMAKE_COMPILER_IS_GNUCXX OR (${CMAKE_CXX_COMPILER_ID} MATCHES "Clang"))
    target_compile_options(bc-decoder PRIVATE -fvisibility=hidden)
endif()
target_link_libraries(bc-decoder PRIVATE dxil-utils)
