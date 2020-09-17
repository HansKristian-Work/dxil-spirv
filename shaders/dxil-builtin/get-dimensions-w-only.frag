Texture1D<float4> Tex1D : register(t0);
Texture1DArray<float4> Tex1DArray : register(t1);
Texture2D<float4> Tex2D : register(t2);
Texture2DArray<float4> Tex2DArray : register(t3);
Texture2DMS<float4> Tex2DMS : register(t4);
Texture2DMSArray<float4> Tex2DMSArray : register(t5);
Texture3D<float4> Tex3D : register(t6);
TextureCube<float4> TexCube : register(t7);
TextureCubeArray<float4> TexCubeArray : register(t8);
Buffer<float4> Buf : register(t9);

RWTexture1D<float4> RWTex1D : register(u0);
RWTexture1DArray<float4> RWTex1DArray : register(u1);
RWTexture2D<float4> RWTex2D : register(u2);
RWTexture2DArray<float4> RWTex2DArray : register(u3);
RWTexture3D<float4> RWTex3D : register(u6);
RWBuffer<float4> RWBuf : register(u9);

StructuredBuffer<float4> StructBuf : register(t10);
RWStructuredBuffer<float4> RWStructBuf : register(u10);

ByteAddressBuffer RawBuf : register(t11);
RWByteAddressBuffer RWRawBuf : register(u11);

uint main(nointerpolation uint level : LEVEL) : SV_Target
{
	uint res = 0;

	uint width, height, depth, layers, levels, samples;

	Tex1D.GetDimensions(level, width, levels);
	res += levels;

	Tex1DArray.GetDimensions(level, width, layers, levels);
	res += levels;

	Tex2D.GetDimensions(level, width, height, levels);
	res += levels;

	Tex2DArray.GetDimensions(level, width, height, layers, levels);
	res += levels;

	Tex2DMS.GetDimensions(width, height, samples);
	res += samples;

	Tex2DMSArray.GetDimensions(width, height, layers, samples);
	res += samples;

	Tex3D.GetDimensions(level, width, height, depth, levels);
	res += levels;

	TexCube.GetDimensions(level, width, height, levels);
	res += levels;

	TexCubeArray.GetDimensions(level, width, height, layers, levels);
	res += levels;

	return res;
}
