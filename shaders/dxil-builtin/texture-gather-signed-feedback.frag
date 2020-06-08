Texture2D<int4> Tex2D : register(t3);
Texture2DArray<int4> Tex2DArray : register(t4);
TextureCube<int4> TexCube : register(t6);
TextureCubeArray<int4> TexCubeArray : register(t7);

SamplerState Samp : register(s1);

int4 main(float4 UV : TEXCOORD) : SV_Target
{
	int4 res = int4(0, 0, 0, 0);
	uint feedback;

	res += Tex2D.Gather(Samp, UV.xy, int2(0, 1), feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += Tex2DArray.GatherGreen(Samp, UV.xyz, int2(0, 1), feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += TexCube.GatherBlue(Samp, UV.xyz, feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += TexCubeArray.GatherAlpha(Samp, UV, feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;

	return res;
}
