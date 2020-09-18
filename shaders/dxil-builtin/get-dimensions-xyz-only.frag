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
	res += width;

	Tex1DArray.GetDimensions(level, width, layers, levels);
	res += width + layers;

	Tex2D.GetDimensions(level, width, height, levels);
	res += width + height;

	Tex2DArray.GetDimensions(level, width, height, layers, levels);
	res += width + height + layers;

	Tex2DMS.GetDimensions(width, height, samples);
	res += width + height;

	Tex2DMSArray.GetDimensions(width, height, layers, samples);
	res += width + height + layers;

	Tex3D.GetDimensions(level, width, height, depth, levels);
	res += width + height + depth;

	TexCube.GetDimensions(level, width, height, levels);
	res += width + height;

	TexCubeArray.GetDimensions(level, width, height, layers, levels);
	res += width + height + layers;

	Buf.GetDimensions(width);
	res += width * width;

	RWTex1D.GetDimensions(width);
	res += width * width;

	RWTex1DArray.GetDimensions(width, layers);
	res += width + layers;

	RWTex2D.GetDimensions(width, height);
	res += width + height;

	RWTex2DArray.GetDimensions(width, height, layers);
	res += width + height + layers;

	RWTex3D.GetDimensions(width, height, depth);
	res += width + height + depth;

	RWBuf.GetDimensions(width);
	res += width * width;

	StructBuf.GetDimensions(width, depth);
	res += width * width + depth;

	RWStructBuf.GetDimensions(width, depth);
	res += width * width + depth;

	RawBuf.GetDimensions(width);
	res += width * width;
	RWRawBuf.GetDimensions(width);
	res += width * width;

	return res;
}
