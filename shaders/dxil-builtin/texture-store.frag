RWTexture1D<float2> RWTex1D : register(u1);
globallycoherent RWTexture1DArray<float2> RWTex1DArray : register(u2);
RWTexture2D<float2> RWTex2D : register(u3);
globallycoherent RWTexture2DArray<float2> RWTex2DArray : register(u4);
RWTexture3D<float2> RWTex3D : register(u5);

void main(float3 uv : TEXCOORD)
{
	RWTex1D[int(uv.x)] = float2(1, 2);
	RWTex1DArray[int2(uv.xy)] = float2(3, 4);
	RWTex2D[int2(uv.xy)] = float2(5, 6);
	RWTex2DArray[int3(uv.xyz)] = float2(7, 8);
	RWTex3D[int3(uv.xyz)] = float2(9, -9);
}

