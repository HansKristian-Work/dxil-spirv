add_subdirectory(spirv-headers EXCLUDE_FROM_ALL)
set(SPIRV-Headers_SOURCE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/spirv-headers" CACHE STRING "SPIRV-Headers path" FORCE)

add_library(dxil-spirv-headers INTERFACE)
target_include_directories(dxil-spirv-headers INTERFACE
        ${CMAKE_CURRENT_SOURCE_DIR}/spirv-headers/include/spirv/unified1)

add_library(dxbc-spirv STATIC
        dxbc-spirv/ir/ir.cpp
        dxbc-spirv/ir/ir.h
        dxbc-spirv/ir/ir_builder.cpp
        dxbc-spirv/ir/ir_builder.h
        dxbc-spirv/util/util_bit.h
        dxbc-spirv/util/util_debug.h
        dxbc-spirv/util/util_flags.h
        dxbc-spirv/util/util_float16.cpp
        dxbc-spirv/util/util_float16.h
        dxbc-spirv/util/util_hash.h
        dxbc-spirv/util/util_small_vector.h
        dxbc-spirv/util/util_vle.h
        dxbc-spirv/ir/passes/ir_pass_arithmetic.cpp
        dxbc-spirv/ir/passes/ir_pass_arithmetic.h
        dxbc-spirv/ir/passes/ir_pass_cfg_cleanup.cpp
        dxbc-spirv/ir/passes/ir_pass_cfg_cleanup.h
        dxbc-spirv/ir/passes/ir_pass_cfg_convert.cpp
        dxbc-spirv/ir/passes/ir_pass_cfg_convert.h
        dxbc-spirv/ir/passes/ir_pass_lower_consume.cpp
        dxbc-spirv/ir/passes/ir_pass_lower_consume.h
        dxbc-spirv/ir/passes/ir_pass_lower_min16.cpp
        dxbc-spirv/ir/passes/ir_pass_lower_min16.h
        dxbc-spirv/ir/passes/ir_pass_propagate_types.cpp
        dxbc-spirv/ir/passes/ir_pass_propagate_types.h
        dxbc-spirv/ir/passes/ir_pass_remove_unused.cpp
        dxbc-spirv/ir/passes/ir_pass_remove_unused.h
        dxbc-spirv/ir/passes/ir_pass_scalarize.cpp
        dxbc-spirv/ir/passes/ir_pass_scalarize.h
        dxbc-spirv/ir/passes/ir_pass_ssa.cpp
        dxbc-spirv/ir/passes/ir_pass_ssa.h
        dxbc-spirv/ir/passes/ir_pass_ssa_utils.h)

add_library(dxbc-spirv-test STATIC
        dxbc-spirv/tests/test_common.h
        dxbc-spirv/tests/test_main.cpp
        dxbc-spirv/tests/api/test_api.cpp
        dxbc-spirv/tests/api/test_api.h
        dxbc-spirv/tests/api/test_api_common.h
        dxbc-spirv/tests/api/test_api_dump.cpp
        dxbc-spirv/tests/api/test_api_io.cpp
        dxbc-spirv/tests/api/test_api_io.h
        dxbc-spirv/tests/api/test_api_resources.cpp
        dxbc-spirv/tests/api/test_api_resources.h
        dxbc-spirv/tests/api/test_api_pass_scalarize.cpp
        dxbc-spirv/tests/api/test_api_pass_scalarize.h
        dxbc-spirv/tests/api/test_api_arithmetic.cpp
        dxbc-spirv/tests/api/test_api_arithmetic.h
        dxbc-spirv/tests/api/test_api_misc.cpp
        dxbc-spirv/tests/api/test_api_misc.h
        dxbc-spirv/tests/api/test_api_spirv.cpp
        dxbc-spirv/tests/api/test_api_spirv.h
        dxbc-spirv/tests/ir/test_ir.h
        dxbc-spirv/tests/ir/test_ir_builder.cpp
        dxbc-spirv/tests/ir/test_ir_op.cpp
        dxbc-spirv/tests/ir/test_ir_serialize.cpp
        dxbc-spirv/tests/ir/test_ir_type.cpp
        dxbc-spirv/tests/util/test_util.h
        dxbc-spirv/tests/util/test_util_small_vector.cpp
        dxbc-spirv/tests/util/test_util_vle.cpp)

target_include_directories(dxbc-spirv
        PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/dxbc-spirv
        PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/dxbc-spirv/ir)
target_include_directories(dxbc-spirv-test PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/dxbc-spirv/tests)
target_compile_features(dxbc-spirv PUBLIC cxx_std_17)
target_compile_features(dxbc-spirv-test PUBLIC cxx_std_17)
set_target_properties(dxbc-spirv PROPERTIES POSITION_INDEPENDENT_CODE ON)
if (CMAKE_COMPILER_IS_GNUCXX OR (${CMAKE_CXX_COMPILER_ID} MATCHES "Clang"))
    target_compile_options(dxbc-spirv PRIVATE -fvisibility=hidden)
endif()
target_link_libraries(dxbc-spirv-test PRIVATE dxbc-spirv)

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
