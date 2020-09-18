RWTexture1D<uint> RWTex1D : register(u0);
RWTexture1DArray<uint> RWTex1DArray : register(u1);
RWTexture2D<uint> RWTex2D : register(u2);
RWTexture2DArray<uint> RWTex2DArray : register(u3);
RWTexture3D<uint> RWTex3D : register(u4);
RWBuffer<uint> RWBuf : register(u5);

RWTexture1D<int> RWTex1DSigned : register(u0, space1);
RWTexture2D<int> RWTex2DSigned : register(u2, space1);

struct Composite
{
	int a, b, c, d;
};

RWStructuredBuffer<Composite> RWStructured : register(u6);
RWByteAddressBuffer Raw : register(u7);

uint main(nointerpolation uint3 coord : TEXCOORD) : SV_Target
{
	uint res = 0;
	uint compare_value = 20;
	uint value = 30;
	uint output;

	InterlockedCompareExchange(RWTex1D[coord.x], compare_value, value, output);
	res += output;

	InterlockedCompareExchange(RWTex1DArray[coord.xy], compare_value, value, output);
	res += output;

	InterlockedCompareExchange(RWTex2D[coord.xy], compare_value, value, output);
	res += output;

	InterlockedCompareExchange(RWTex2DArray[coord.xyz], compare_value, value, output);
	res += output;

	InterlockedCompareExchange(RWTex3D[coord.xyz], compare_value, value, output);
	res += output;

	InterlockedCompareExchange(RWBuf[coord.x], compare_value, value, output);
	res += output;

	InterlockedCompareExchange(RWBuf[coord.x], compare_value, value, output);
	res += output;

	InterlockedCompareExchange(RWTex1DSigned[coord.x], compare_value, value, output);
	res += output;

	InterlockedCompareExchange(RWTex2DSigned[coord.xy], compare_value, value, output);
	res += output;

	InterlockedCompareExchange(RWStructured[coord.x].c, compare_value, value, output);
	res += output;

	Raw.InterlockedCompareExchange(coord.x * 4, compare_value, value, output);
	res += output;

	return res;
}
