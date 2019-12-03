RWTexture1D<int2> RWTex1D : register(u1);
globallycoherent RWTexture1DArray<int2> RWTex1DArray : register(u2);
RWTexture2D<int2> RWTex2D : register(u3);
globallycoherent RWTexture2DArray<int2> RWTex2DArray : register(u4);
RWTexture3D<int2> RWTex3D : register(u5);

void main(float3 uv : TEXCOORD)
{
	RWTex1D[int(uv.x)] = int2(1, 2);
	RWTex1DArray[int2(uv.xy)] = int2(3, 4);
	RWTex2D[int2(uv.xy)] = int2(5, 6);
	RWTex2DArray[int3(uv.xyz)] = int2(7, 8);
	RWTex3D[int3(uv.xyz)] = int2(9, -9);
}

