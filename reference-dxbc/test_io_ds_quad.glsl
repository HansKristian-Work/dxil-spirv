GLSL:
#version 460
#extension GL_ARB_shader_viewport_layer_array : require
layout(quads) in;

layout(location = 0) in vec4 SV_POSITION[];
layout(location = 1) in float R_COLOR[];
layout(location = 1, component = 1) in float G_COLOR[];
layout(location = 1, component = 2) in float B_COLOR[];
layout(location = 2) in vec2 TEXCOORD[];
layout(location = 6) out vec3 COLOR;
layout(location = 6, component = 3) out uint PRIMID;
layout(location = 7) out vec2 TEXCOORD_1;
layout(location = 7, component = 2) out vec2 TESS_INNER;
layout(location = 8) out vec4 TESS_OUTER;
layout(location = 6) patch in uint LAYER;
layout(location = 6, component = 1) patch in uint VIEWPORT;
layout(location = 6, component = 2) patch in uint INDEX;

void main()
{
    TESS_INNER.x = gl_TessLevelInner[0u];
    TESS_INNER.y = gl_TessLevelInner[1u];
    TESS_OUTER.x = gl_TessLevelOuter[0u];
    TESS_OUTER.y = gl_TessLevelOuter[1u];
    TESS_OUTER.z = gl_TessLevelOuter[2u];
    TESS_OUTER.w = gl_TessLevelOuter[3u];
    gl_Layer = int(LAYER);
    gl_ViewportIndex = int(VIEWPORT);
    PRIMID = uint(gl_PrimitiveID);
    uint _92 = INDEX ^ 2u;
    float _103 = fma(gl_TessCoord.x, SV_POSITION[INDEX ^ 1u].x - SV_POSITION[INDEX].x, SV_POSITION[INDEX].x);
    uint _114 = INDEX ^ 2u;
    float _124 = fma(gl_TessCoord.x, SV_POSITION[INDEX ^ 1u].y - SV_POSITION[INDEX].y, SV_POSITION[INDEX].y);
    uint _135 = INDEX ^ 2u;
    float _145 = fma(gl_TessCoord.x, SV_POSITION[INDEX ^ 1u].z - SV_POSITION[INDEX].z, SV_POSITION[INDEX].z);
    uint _156 = INDEX ^ 2u;
    float _166 = fma(gl_TessCoord.x, SV_POSITION[INDEX ^ 1u].w - SV_POSITION[INDEX].w, SV_POSITION[INDEX].w);
    gl_Position.x = fma(gl_TessCoord.x, fma(gl_TessCoord.x, SV_POSITION[INDEX ^ 3u].x - SV_POSITION[_92].x, SV_POSITION[_92].x) - _103, _103);
    gl_Position.y = fma(gl_TessCoord.x, fma(gl_TessCoord.x, SV_POSITION[INDEX ^ 3u].y - SV_POSITION[_114].y, SV_POSITION[_114].y) - _124, _124);
    gl_Position.z = fma(gl_TessCoord.x, fma(gl_TessCoord.x, SV_POSITION[INDEX ^ 3u].z - SV_POSITION[_135].z, SV_POSITION[_135].z) - _145, _145);
    gl_Position.w = fma(gl_TessCoord.x, fma(gl_TessCoord.x, SV_POSITION[INDEX ^ 3u].w - SV_POSITION[_156].w, SV_POSITION[_156].w) - _166, _166);
    COLOR.x = R_COLOR[0u];
    COLOR.y = G_COLOR[1u];
    COLOR.z = B_COLOR[2u];
    TEXCOORD_1.x = TEXCOORD[INDEX].x;
    TEXCOORD_1.y = TEXCOORD[INDEX].y;
}


