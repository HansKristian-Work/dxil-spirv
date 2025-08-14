add_subdirectory(spirv-headers EXCLUDE_FROM_ALL)
set(SPIRV-Headers_SOURCE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/spirv-headers" CACHE STRING "SPIRV-Headers path" FORCE)

add_library(dxil-spirv-headers INTERFACE)
target_include_directories(dxil-spirv-headers INTERFACE
        ${CMAKE_CURRENT_SOURCE_DIR}/spirv-headers/include/spirv/unified1)

set(DXBC_SPV_SOURCE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../subprojects/dxbc-spirv")

add_library(dxbc-spirv STATIC
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_api.cpp
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_api.h
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_container.cpp
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_container.h
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_converter.cpp
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_converter.h
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_disasm.cpp
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_disasm.h
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_io_map.cpp
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_io_map.h
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_parser.cpp
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_parser.h
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_registers.cpp
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_registers.h
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_resources.cpp
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_resources.h
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_signature.cpp
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_signature.h
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_types.cpp
        ${DXBC_SPV_SOURCE_DIR}/dxbc/dxbc_types.h
        ${DXBC_SPV_SOURCE_DIR}/ir/ir.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/ir.h
        ${DXBC_SPV_SOURCE_DIR}/ir/ir_builder.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/ir_builder.h
        ${DXBC_SPV_SOURCE_DIR}/ir/ir_container.h
        ${DXBC_SPV_SOURCE_DIR}/ir/ir_disasm.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/ir_disasm.h
        ${DXBC_SPV_SOURCE_DIR}/ir/ir_dominance.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/ir_dominance.h
        ${DXBC_SPV_SOURCE_DIR}/ir/ir_utils.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/ir_utils.h
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_arithmetic.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_arithmetic.h
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_buffer_kind.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_buffer_kind.h
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_cfg_cleanup.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_cfg_cleanup.h
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_cfg_convert.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_cfg_convert.h
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_cse.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_cse.h
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_lower_consume.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_lower_consume.h
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_lower_min16.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_lower_min16.h
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_propagate_types.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_propagate_types.h
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_propagate_resource_types.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_propagate_resource_types.h
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_remove_unused.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_remove_unused.h
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_scalarize.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_scalarize.h
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_ssa.cpp
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_ssa.h
        ${DXBC_SPV_SOURCE_DIR}/ir/passes/ir_pass_ssa_utils.h
        ${DXBC_SPV_SOURCE_DIR}/util/util_bit.h
        ${DXBC_SPV_SOURCE_DIR}/util/util_debug.h
        ${DXBC_SPV_SOURCE_DIR}/util/util_flags.h
        ${DXBC_SPV_SOURCE_DIR}/util/util_float16.cpp
        ${DXBC_SPV_SOURCE_DIR}/util/util_float16.h
        ${DXBC_SPV_SOURCE_DIR}/util/util_hash.h
        ${DXBC_SPV_SOURCE_DIR}/util/util_log.cpp
        ${DXBC_SPV_SOURCE_DIR}/util/util_log.h
        ${DXBC_SPV_SOURCE_DIR}/util/util_md5.cpp
        ${DXBC_SPV_SOURCE_DIR}/util/util_md5.h
        ${DXBC_SPV_SOURCE_DIR}/util/util_small_vector.h
        ${DXBC_SPV_SOURCE_DIR}/util/util_vle.h)

add_library(dxbc-spirv-test STATIC
        ${DXBC_SPV_SOURCE_DIR}/tests/test_common.h
        ${DXBC_SPV_SOURCE_DIR}/tests/test_main.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api.h
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_common.h
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_dump.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_io.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_io.h
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_resources.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_resources.h
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_pass_arithmetic.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_pass_arithmetic.h
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_pass_buffer_kind.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_pass_buffer_kind.h
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_pass_scalarize.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_pass_scalarize.h
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_arithmetic.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_arithmetic.h
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_misc.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_misc.h
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_spirv.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/api/test_api_spirv.h
        ${DXBC_SPV_SOURCE_DIR}/tests/ir/test_ir.h
        ${DXBC_SPV_SOURCE_DIR}/tests/ir/test_ir_builder.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/ir/test_ir_op.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/ir/test_ir_serialize.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/ir/test_ir_type.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/util/test_util.h
        ${DXBC_SPV_SOURCE_DIR}/tests/util/test_util_small_vector.cpp
        ${DXBC_SPV_SOURCE_DIR}/tests/util/test_util_vle.cpp)

target_include_directories(dxbc-spirv
        PUBLIC ${DXBC_SPV_SOURCE_DIR}
        PRIVATE ${DXBC_SPV_SOURCE_DIR}/ir)
target_include_directories(dxbc-spirv-test PUBLIC ${DXBC_SPV_SOURCE_DIR}/tests)
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
