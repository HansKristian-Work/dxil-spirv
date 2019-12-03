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
	uint output;
	int output_signed;

	InterlockedAdd(RWTex1D[coord.x], 1, output);
	res += output;

	InterlockedAnd(RWTex1DArray[coord.xy], 2, output);
	res += output;

	InterlockedExchange(RWTex2D[coord.xy], 3, output);
	res += output;

	InterlockedMax(RWTex2DArray[coord.xyz], 4, output);
	res += output;

	InterlockedMin(RWTex3D[coord.xyz], 5, output);
	res += output;

	InterlockedOr(RWBuf[coord.x], 6, output);
	res += output;

	InterlockedXor(RWBuf[coord.x], 7, output);
	res += output;

	InterlockedMin(RWTex1DSigned[coord.x], 8, output_signed);
	res += output_signed;

	InterlockedMax(RWTex2DSigned[coord.xy], 9, output_signed);
	res += output_signed;

	InterlockedAdd(RWStructured[coord.x].c, 10, output_signed);
	res += output_signed;

	Raw.InterlockedMax(coord.x * 4, 12, output_signed);
	res += output_signed;

	return res;
}
