RWTexture2D<uint> RWTex2D[] : register(u2);

uint main(nointerpolation uint index : INDEX, nointerpolation uint3 coord : TEXCOORD) : SV_Target
{
	uint output;
	uint res = 0;
	InterlockedAdd(RWTex2D[NonUniformResourceIndex(index)][coord.xy], 3, output);
	res += output;

	return res;
}
