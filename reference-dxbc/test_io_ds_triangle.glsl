GLSL:
#version 460
#extension GL_ARB_shader_viewport_layer_array : require
layout(triangles) in;

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
    uint _103 = INDEX ^ 1u;
    uint _121 = INDEX ^ 2u;
    gl_Position.x = fma(SV_POSITION[_121].x, gl_TessCoord.z, fma(SV_POSITION[_103].x, gl_TessCoord.y, SV_POSITION[INDEX].x * gl_TessCoord.x));
    gl_Position.y = fma(SV_POSITION[_121].y, gl_TessCoord.z, fma(SV_POSITION[_103].y, gl_TessCoord.y, SV_POSITION[INDEX].y * gl_TessCoord.x));
    gl_Position.z = fma(SV_POSITION[_121].z, gl_TessCoord.z, fma(SV_POSITION[_103].z, gl_TessCoord.y, SV_POSITION[INDEX].z * gl_TessCoord.x));
    gl_Position.w = fma(SV_POSITION[_121].w, gl_TessCoord.z, fma(SV_POSITION[_103].w, gl_TessCoord.y, SV_POSITION[INDEX].w * gl_TessCoord.x));
    COLOR.x = R_COLOR[0u];
    COLOR.y = G_COLOR[1u];
    COLOR.z = B_COLOR[2u];
    TEXCOORD_1.x = TEXCOORD[INDEX].x;
    TEXCOORD_1.y = TEXCOORD[INDEX].y;
}


