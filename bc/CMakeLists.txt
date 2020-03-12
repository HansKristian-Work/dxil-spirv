add_library(bc STATIC
        dxil_bytecode.cpp dxil_bytecode.h
        llvm_bitreader.h llvm_decoder.cpp
        llvm_decoder.h)
target_include_directories(bc PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

add_library(llvm-bc STATIC
        module_containers.hpp
        cast.hpp
        value.hpp value.cpp
        instruction.hpp instruction.cpp
        function.hpp function.cpp
        context.hpp context.cpp
        type.hpp type.cpp
        module.hpp module.cpp
        metadata.hpp metadata.cpp
        disassembler.cpp)
target_compile_options(llvm-bc PRIVATE ${DXIL_SPV_CXX_FLAGS})
target_compile_definitions(llvm-bc PUBLIC HAVE_LLVMBC)
target_link_libraries(llvm-bc PRIVATE bc dxil-debug)
target_include_directories(llvm-bc PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
