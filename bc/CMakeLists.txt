add_library(llvm-bc STATIC
        cast.hpp iterator.hpp
        data_structures.hpp
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
target_link_libraries(llvm-bc PRIVATE bc-decoder dxil-debug dxil-utils)
target_include_directories(llvm-bc PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
set_target_properties(llvm-bc PROPERTIES POSITION_INDEPENDENT_CODE ON)
