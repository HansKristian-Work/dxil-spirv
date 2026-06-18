#include "ags_shader_intrinsics_dx12.inc"

float4 main() : SV_Position
{
	return float(AmdExtD3DShaderIntrinsics_GetDrawIndex());
}
