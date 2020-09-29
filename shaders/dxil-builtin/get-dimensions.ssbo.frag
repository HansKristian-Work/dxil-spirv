RWStructuredBuffer<float4> RWStructBuf : register(u10);
RWByteAddressBuffer RWRawBuf : register(u11);

uint main(nointerpolation uint level : LEVEL) : SV_Target
{
	uint res = 0;

	uint width, height, depth, layers, levels, samples;

	RWStructBuf.GetDimensions(width, depth);
	res += width * width + depth;
	RWRawBuf.GetDimensions(width);
	res += width * width;

	return res;
}
