add_granite_offline_tool(dxil-workgraph-sandbox dxil_workgraph_sandbox.cpp)
target_link_libraries(dxil-workgraph-sandbox PRIVATE dxil-spirv-c-shared)
target_compile_definitions(dxil-workgraph-sandbox PRIVATE ASSET_DIRECTORY=\"${CMAKE_CURRENT_SOURCE_DIR}/shaders\")
