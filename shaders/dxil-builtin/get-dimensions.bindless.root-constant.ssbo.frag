Texture2D<float4> Tex2D[] : register(t0, space0);
Buffer<float4> Buf[] : register(t0, space1);
RWTexture2D<float4> RWTex2D[] : register(u0, space2);
RWBuffer<float4> RWBuf[] : register(u0, space3);

StructuredBuffer<float4> StructBuf[] : register(t0, space4);
RWStructuredBuffer<float4> RWStructBuf[] : register(u0, space5);

ByteAddressBuffer RawBuf[] : register(t0, space6);
RWByteAddressBuffer RWRawBuf[] : register(u0, space7);

uint main(nointerpolation uint level : LEVEL, nointerpolation uint index : INDEX) : SV_Target
{
	uint res = 0;
	uint width, height, depth, layers, levels;

	Tex2D[NonUniformResourceIndex(index)].GetDimensions(level, width, height, levels);
	res += width + height + levels;

	Buf[NonUniformResourceIndex(index)].GetDimensions(width);
	res += width * width;

	RWTex2D[NonUniformResourceIndex(index)].GetDimensions(width, height);
	res += width + height;

	RWBuf[NonUniformResourceIndex(index)].GetDimensions(width);
	res += width * width;

	StructBuf[NonUniformResourceIndex(index)].GetDimensions(width, depth);
	res += width * width + depth;

	RWStructBuf[NonUniformResourceIndex(index)].GetDimensions(width, depth);
	res += width * width + depth;

	RawBuf[NonUniformResourceIndex(index)].GetDimensions(width);
	res += width * width;
	RWRawBuf[NonUniformResourceIndex(index)].GetDimensions(width);
	res += width * width;

	return res;
}
